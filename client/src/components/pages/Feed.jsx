import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { INITIAL_STARTUPS } from '../../data/startupsData';
import { apiRequest } from '../../api/client';

const TEAM_LOGOS = {
  QueryGuard: '🛡️',
  EcoTrace: '🌱',
  'MediPulse AI': '🩺',
  quad: '⚡',
};

const FILTER_TAGS = ['All', 'Milestone', 'Hiring', 'Prototype Update', 'Update'];

const INITIAL_POSTS = [
  {
    id: 1,
    teamName: 'QueryGuard',
    teamLogo: '🛡️',
    authorName: 'QueryGuard',
    authorRole: 'Startup Account',
    timeAgo: '2 hours ago',
    tag: 'Milestone',
    content:
      'Excited to announce that we completed our static analysis engine integration! QueryGuard can now parse and flag SQL injection vectors in under 120ms during automated local testing.',
    likes: 24,
    comments: 0,
    commentsList: [
      {
        _id: 'c1',
        authorName: 'EcoTrace',
        authorRole: 'Startup Account',
        text: 'Sub-120ms AST parsing is super clean—are you supporting MySQL prepared statement rewrites too?',
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
    ],
    isLiked: false,
    verified: true,
  },
  {
    id: 2,
    teamName: 'EcoTrace',
    teamLogo: '🌱',
    authorName: 'EcoTrace',
    authorRole: 'Startup Account',
    timeAgo: '5 hours ago',
    tag: 'Hiring',
    content:
      'Looking for a teammate experienced with MQTT brokers and time-series dashboards to help scale our campus sensor fleet.',
    likes: 18,
    comments: 0,
    commentsList: [],
    isLiked: false,
    verified: false,
  },
  {
    id: 3,
    teamName: 'MediPulse AI',
    teamLogo: '🩺',
    authorName: 'MediPulse AI',
    authorRole: 'Startup Account',
    timeAgo: '1 day ago',
    tag: 'Prototype Update',
    content:
      'Refined our offline bilingual intake flow for rural clinic workers. Check out our profile on Discover to see our current pilot goals.',
    likes: 42,
    comments: 0,
    commentsList: [],
    isLiked: false,
    verified: true,
  },
];

function formatTimeAgo(dateString) {
  if (!dateString) return 'Just now';
  const diffSec = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function normalizePost(post) {
  const list = Array.isArray(post.commentsList) ? post.commentsList : [];
  return {
    ...post,
    id: post._id || post.id,
    timeAgo: post.timeAgo || formatTimeAgo(post.createdAt),
    commentsList: list,
    comments: list.length,
    isLiked: Boolean(post.isLiked),
  };
}

export default function FeedPage({ startups = INITIAL_STARTUPS, currentUser = null }) {
  const navigate = useNavigate();
  const safeStartups = Array.isArray(startups) ? startups : INITIAL_STARTUPS;

  const [resolvedUser, setResolvedUser] = useState(() => {
    if (currentUser) return currentUser;
    try {
      const raw = localStorage.getItem('protopeak_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      setResolvedUser(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('protopeak_token');
    if (!token) return;

    async function hydrateCurrentUser() {
      try {
        const data = await apiRequest('/auth/me');
        if (active && data?.user) {
          setResolvedUser((prev) => {
            const merged = { ...(prev || {}), ...data.user };
            try {
              localStorage.setItem('protopeak_user', JSON.stringify(merged));
            } catch {
              // ignore storage errors
            }
            return merged;
          });
        }
      } catch {
        // ignore if /auth/me isn't mounted yet
      }
    }

    hydrateCurrentUser();
    return () => {
      active = false;
    };
  }, []);

  const activeUser = currentUser || resolvedUser;
  const userStartupLower = (activeUser?.startupName || '').trim().toLowerCase();

  const matchedOwnedStartup = safeStartups.find((s) => {
    if (!s || !activeUser) return false;
    const ownerId = s.createdBy?._id || s.createdBy;
    const userId = activeUser.id || activeUser._id;
    const matchesOwner = ownerId && userId && String(ownerId) === String(userId);
    const startupTitle = String(s.name || s.startupName || '').trim().toLowerCase();
    const matchesName = Boolean(userStartupLower && startupTitle === userStartupLower);
    return matchesOwner || matchesName;
  });

  const activeStartupName = (
    activeUser?.startupName ||
    matchedOwnedStartup?.name ||
    matchedOwnedStartup?.startupName ||
    activeUser?.name ||
    ''
  ).trim();

  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [selectedTag, setSelectedTag] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [postTag, setPostTag] = useState('Milestone');
  const [submitting, setSubmitting] = useState(false);
  const [postError, setPostError] = useState('');

  // Inline comment drawer state
  const [openCommentsMap, setOpenCommentsMap] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentErrorMap, setCommentErrorMap] = useState({});
  const [commentSubmittingId, setCommentSubmittingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      try {
        const data = await apiRequest('/posts');
        if (active && Array.isArray(data) && data.length > 0) {
          setPosts(data.map(normalizePost));
        }
      } catch (err) {
        console.warn('Using local fallback posts:', err.message);
      }
    }

    loadPosts();
    return () => {
      active = false;
    };
  }, []);

  const visiblePosts =
    selectedTag === 'All'
      ? posts
      : posts.filter((post) => post.tag === selectedTag);

  const handleOpenPostModal = () => {
    if (!activeUser) {
      navigate('/login');
      return;
    }
    setPostError('');
    setIsModalOpen(true);
  };

  const handleLike = async (targetPost) => {
    if (!activeUser) {
      navigate('/login');
      return;
    }

    const nextLiked = !targetPost.isLiked;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === targetPost.id
          ? {
              ...post,
              likes: Math.max(0, post.likes + (nextLiked ? 1 : -1)),
              isLiked: nextLiked,
            }
          : post
      )
    );

    if (typeof targetPost.id === 'string' && targetPost.id.length >= 12) {
      try {
        await apiRequest(`/posts/${targetPost.id}/like`, {
          method: 'PATCH',
          body: JSON.stringify({ liked: nextLiked }),
        });
      } catch (err) {
        console.warn('Like sync failed:', err.message);
      }
    }
  };

  const toggleCommentsDrawer = (postId) => {
    setOpenCommentsMap((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = async (e, targetPost) => {
    e.preventDefault();
    if (!activeUser) {
      navigate('/login');
      return;
    }

    const draft = (commentDrafts[targetPost.id] || '').trim();
    if (!draft || commentSubmittingId === targetPost.id) return;

    const replyAuthor = activeStartupName || 'Startup Account';
    const payload = {
      authorName: replyAuthor,
      authorRole: 'Startup Account',
      text: draft,
    };

    setCommentErrorMap((prev) => ({ ...prev, [targetPost.id]: '' }));
    setCommentSubmittingId(targetPost.id);

    try {
      if (typeof targetPost.id === 'string' && targetPost.id.length >= 12) {
        const updated = await apiRequest(`/posts/${targetPost.id}/comments`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setPosts((prev) =>
          prev.map((p) =>
            p.id === targetPost.id
              ? normalizePost({ ...updated, isLiked: p.isLiked })
              : p
          )
        );
        setCommentDrafts((prev) => ({ ...prev, [targetPost.id]: '' }));
      } else {
        const localReply = {
          _id: `local_${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
        };
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== targetPost.id) return p;
            const nextList = [...(p.commentsList || []), localReply];
            return {
              ...p,
              commentsList: nextList,
              comments: nextList.length,
            };
          })
        );
        setCommentDrafts((prev) => ({ ...prev, [targetPost.id]: '' }));
      }
    } catch (err) {
      setCommentErrorMap((prev) => ({
        ...prev,
        [targetPost.id]: err.message || 'Could not post reply.',
      }));
    } finally {
      setCommentSubmittingId(null);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!activeUser) {
      navigate('/login');
      return;
    }

    if (!newPostContent.trim()) {
      setPostError('Please write an update before posting.');
      return;
    }

    if (submitting) return;

    setPostError('');
    setSubmitting(true);

    const startupLabel = activeStartupName || 'Startup Account';
    const payload = {
      startup:
        matchedOwnedStartup &&
        typeof matchedOwnedStartup.id === 'string' &&
        matchedOwnedStartup.id.length >= 12
          ? matchedOwnedStartup.id
          : null,
      teamName: startupLabel,
      teamLogo:
        TEAM_LOGOS[startupLabel] ||
        TEAM_LOGOS[startupLabel.toLowerCase()] ||
        '🚀',
      authorName: startupLabel,
      authorRole: 'Startup Account',
      tag: postTag,
      content: newPostContent.trim(),
      verified: Boolean(matchedOwnedStartup?.verified),
    };

    try {
      const saved = await apiRequest('/posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setPosts((prev) => [normalizePost({ ...saved, isLiked: false }), ...prev]);
      setSelectedTag('All');
      setNewPostContent('');
      setIsModalOpen(false);
    } catch (err) {
      setPostError(err.message || 'Could not publish post.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayStartupName = activeStartupName || 'Startup Account';
  const displayLogo =
    TEAM_LOGOS[displayStartupName] ||
    TEAM_LOGOS[displayStartupName.toLowerCase()] ||
    '🚀';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Community Feed
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Milestones, hiring calls, and raw prototype updates shared by startup accounts.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTER_TAGS.map((tag) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-lg shadow-indigo-950/60'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {visiblePosts.map((post) => {
            const isDrawerOpen = Boolean(openCommentsMap[post.id]);
            const replies = post.commentsList || [];
            const commentErr = commentErrorMap[post.id];

            return (
              <article
                key={post.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 transition hover:border-white/20"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl shrink-0">
                      {post.teamLogo}
                    </div>
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-bold text-sm text-white">{post.teamName}</span>
                        {post.verified && (
                          <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{post.timeAgo}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full shrink-0">
                    {post.tag}
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed">{post.content}</p>

                <div className="flex items-center space-x-6 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleLike(post)}
                    className={`flex items-center space-x-2 text-xs font-medium transition ${
                      post.isLiked ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{post.isLiked ? '❤️' : '🤍'}</span>
                    <span>{post.likes} Likes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCommentsDrawer(post.id)}
                    className={`flex items-center space-x-2 text-xs font-medium transition ${
                      isDrawerOpen ? 'text-indigo-300 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">💬</span>
                    <span>{post.comments} Comments</span>
                  </button>
                </div>

                {/* Expandable Comments Drawer */}
                {isDrawerOpen && (
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    {replies.length > 0 ? (
                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {replies.map((reply, idx) => (
                          <div
                            key={reply._id || idx}
                            className="bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-white">
                                {reply.authorName || 'Startup Account'}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {formatTimeAgo(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        No replies yet. Start the discussion below.
                      </p>
                    )}

                    {commentErr && (
                      <p className="text-xs text-rose-300 bg-rose-500/15 border border-rose-500/30 rounded-xl px-3 py-2">
                        {commentErr}
                      </p>
                    )}

                    {activeUser ? (
                      <form
                        onSubmit={(e) => handleAddComment(e, post)}
                        className="flex flex-col sm:flex-row gap-2"
                      >
                        <span className="sm:w-44 bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-indigo-200 font-semibold flex items-center truncate">
                          {displayStartupName}
                        </span>
                        <input
                          type="text"
                          placeholder="Write a reply or question..."
                          value={commentDrafts[post.id] || ''}
                          onChange={(e) =>
                            setCommentDrafts((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          className="flex-1 bg-slate-950/70 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          disabled={commentSubmittingId === post.id}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl text-xs transition border border-indigo-400/30"
                        >
                          {commentSubmittingId === post.id ? 'Sending...' : 'Reply'}
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-3 bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs">
                        <span className="text-slate-400">
                          Only logged-in startup accounts can post replies.
                        </span>
                        <Link
                          to="/login"
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition border border-indigo-400/30 shrink-0"
                        >
                          Log In
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}

          {visiblePosts.length === 0 && (
            <div className="text-center py-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl space-y-3">
              <p className="text-slate-400 text-sm">
                No posts under <span className="text-indigo-300 font-semibold">{selectedTag}</span> yet.
              </p>
              <button
                type="button"
                onClick={() => setSelectedTag('All')}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-xs font-semibold rounded-xl border border-white/10 transition"
              >
                Show all posts
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50 group flex items-center">
        <span className="absolute right-16 bg-slate-900/90 text-indigo-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl whitespace-nowrap">
          {activeUser ? 'Post an update' : 'Log in to post'}
        </span>

        <button
          type="button"
          onClick={handleOpenPostModal}
          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl shadow-indigo-900/80 border border-indigo-400/40 transition-transform hover:scale-105 active:scale-95"
          aria-label="Post an update"
        >
          +
        </button>
      </div>

      {/* Create Post Modal (Locked to Logged-In Startup Name) */}
      {isModalOpen && activeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-lg">
                  {displayLogo}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Post</h3>
                  <p className="text-xs text-slate-400">
                    Posting as{' '}
                    <span className="text-indigo-300 font-semibold">{displayStartupName}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {postError && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium px-4 py-2.5 rounded-xl">
                {postError}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Startup Name (Fixed)
                </label>
                <div className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-indigo-200">
                  {displayStartupName}
                </div>
              </div>

              <textarea
                rows="4"
                placeholder="Share a milestone, hiring need, or prototype update..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
              />

              <div className="flex justify-between items-center pt-2">
                <select
                  value={postTag}
                  onChange={(e) => setPostTag(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Milestone">Milestone</option>
                  <option value="Hiring">Hiring</option>
                  <option value="Prototype Update">Prototype Update</option>
                  <option value="Update">Update</option>
                </select>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-xs transition border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-indigo-900/40 border border-indigo-400/30"
                  >
                    {submitting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}