import React, { useState, useEffect, useRef, useMemo } from 'react';
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

const TAG_STYLES = {
  Milestone: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
  Hiring: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  'Prototype Update': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  Update: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
};

const INITIAL_POSTS = [
  {
    id: 1,
    teamName: 'QueryGuard',
    teamLogo: '🛡️',
    authorName: 'QueryGuard',
    authorRole: 'Startup',
    timeAgo: '2 hours ago',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    tag: 'Milestone',
    content:
      'Excited to announce that we completed our static analysis engine integration! QueryGuard can now parse and flag SQL injection vectors in under 120ms during automated local testing.',
    likes: 24,
    comments: 1,
    commentsList: [
      {
        _id: 'c1',
        authorName: 'EcoTrace',
        authorRole: 'Startup',
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
    authorRole: 'Startup',
    timeAgo: '5 hours ago',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
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
    authorRole: 'Startup',
    timeAgo: '1 day ago',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
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

function getRoleBadgeLabel(role) {
  const clean = String(role || '').trim().toLowerCase();
  if (clean === 'investor') return 'Investor';
  if (clean === 'company') return 'Company';
  return 'Startup';
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
    setResolvedUser(currentUser);
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
  const userRole = String(activeUser?.role || 'startup').trim().toLowerCase();
  const isInvestorOrCompany =
    Boolean(activeUser) && (userRole === 'investor' || userRole === 'company');
  const canCreatePost = Boolean(activeUser) && !isInvestorOrCompany;

  const userStartupLower = (activeUser?.startupName || '').trim().toLowerCase();

  const matchedOwnedStartup = safeStartups.find((s) => {
    if (!s || !activeUser || isInvestorOrCompany) return false;
    const ownerId = s.createdBy?._id || s.createdBy;
    const userId = activeUser.id || activeUser._id;
    const matchesOwner = ownerId && userId && String(ownerId) === String(userId);
    const startupTitle = String(s.name || s.startupName || '').trim().toLowerCase();
    const matchesName = Boolean(userStartupLower && startupTitle === userStartupLower);
    return matchesOwner || matchesName;
  });

  const actorDisplayName =
    (userRole === 'startup'
      ? activeUser?.startupName ||
        matchedOwnedStartup?.name ||
        matchedOwnedStartup?.startupName ||
        activeUser?.name
      : activeUser?.name || activeUser?.startupName
    )?.trim() || '';

  const actorRoleLabel = getRoleBadgeLabel(userRole);

  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Search, Startup Filter, Tag Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStartupFilter, setSelectedStartupFilter] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'popular'

  // Create Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [postTag, setPostTag] = useState('Milestone');
  const [submitting, setSubmitting] = useState(false);
  const [postError, setPostError] = useState('');

  // 5-second toast popup for unauthenticated or restricted actions
  const [authToastMessage, setAuthToastMessage] = useState('');
  const toastTimerRef = useRef(null);

  // Inline comment drawer state
  const [openCommentsMap, setOpenCommentsMap] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentErrorMap, setCommentErrorMap] = useState({});
  const [commentSubmittingId, setCommentSubmittingId] = useState(null);

  const showAuthPopup = (message) => {
    setAuthToastMessage(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setAuthToastMessage('');
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

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
      } finally {
        if (active) setLoadingPosts(false);
      }
    }

    loadPosts();
    return () => {
      active = false;
    };
  }, []);

  // Unique startup names present in the feed for quick one-click filtering
  const availableStartups = useMemo(() => {
    const seen = new Map();
    posts.forEach((p) => {
      const name = (p.teamName || '').trim();
      if (name && !seen.has(name.toLowerCase())) {
        seen.set(name.toLowerCase(), {
          name,
          logo: p.teamLogo || TEAM_LOGOS[name] || '🚀',
        });
      }
    });
    return Array.from(seen.values());
  }, [posts]);

  const visiblePosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = posts.filter((post) => {
      const matchesTag = selectedTag === 'All' || post.tag === selectedTag;
      const matchesStartup =
        selectedStartupFilter === 'All' ||
        (post.teamName || '').trim().toLowerCase() ===
          selectedStartupFilter.trim().toLowerCase();

      const matchesSearch =
        !q ||
        (post.teamName || '').toLowerCase().includes(q) ||
        (post.content || '').toLowerCase().includes(q) ||
        (post.tag || '').toLowerCase().includes(q) ||
        (post.commentsList || []).some(
          (c) =>
            (c.authorName || '').toLowerCase().includes(q) ||
            (c.text || '').toLowerCase().includes(q)
        );

      return matchesTag && matchesStartup && matchesSearch;
    });

    if (sortBy === 'popular') {
      return [...filtered].sort(
        (a, b) => (b.likes || 0) + (b.comments || 0) - ((a.likes || 0) + (a.comments || 0))
      );
    }

    return filtered;
  }, [posts, searchQuery, selectedStartupFilter, selectedTag, sortBy]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedStartupFilter !== 'All' ||
    selectedTag !== 'All' ||
    sortBy !== 'latest';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStartupFilter('All');
    setSelectedTag('All');
    setSortBy('latest');
  };

  const handleOpenPostModal = (presetTag) => {
    if (!activeUser) {
      navigate('/login');
      return;
    }
    if (!canCreatePost) {
      showAuthPopup(
        'Investor and company accounts can like and comment on posts, but cannot create feed posts.'
      );
      return;
    }
    if (typeof presetTag === 'string') {
      setPostTag(presetTag);
    }
    setPostError('');
    setIsModalOpen(true);
  };

  const handleLike = async (targetPost) => {
    if (!activeUser) {
      showAuthPopup('Only authenticated accounts can like posts.');
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
      showAuthPopup('Only authenticated accounts can comment on posts.');
      return;
    }

    const draft = (commentDrafts[targetPost.id] || '').trim();
    if (!draft || commentSubmittingId === targetPost.id) return;

    const replyAuthor = actorDisplayName || activeUser.email || 'Member';
    const payload = {
      authorName: replyAuthor,
      authorRole: actorRoleLabel,
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
    if (!canCreatePost) {
      setPostError(
        'Investor and company accounts can like and comment on posts, but cannot create feed posts.'
      );
      return;
    }

    if (!newPostContent.trim()) {
      setPostError('Please write an update before posting.');
      return;
    }

    if (submitting) return;

    setPostError('');
    setSubmitting(true);

    const startupLabel = actorDisplayName || 'Startup';
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
      authorRole: 'Startup',
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
      handleResetFilters();
      setNewPostContent('');
      setIsModalOpen(false);
    } catch (err) {
      setPostError(err.message || 'Could not publish post.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayLogo =
    TEAM_LOGOS[actorDisplayName] ||
    TEAM_LOGOS[actorDisplayName.toLowerCase()] ||
    '🚀';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative">
      {/* 5-Second Auth / Permission Toast Popup */}
      {authToastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-slate-900/95 backdrop-blur-xl border border-indigo-400/40 text-white px-4 py-3 rounded-2xl shadow-2xl shadow-indigo-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-100">
            <span className="text-base shrink-0">🔒</span>
            <span>{authToastMessage}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!activeUser && (
              <Link
                to="/login"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
              >
                Log In
              </Link>
            )}
            <button
              type="button"
              onClick={() => setAuthToastMessage('')}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-1"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-400/25 px-3 py-1 rounded-full text-[11px] font-semibold text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Builder Updates</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              Community Feed
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Track startup milestones, hiring calls, and prototype logs in real time.
            </p>
          </div>

          <Link
            to="/discover"
            className="self-start sm:self-auto px-4 py-2 bg-white/5 hover:bg-white/10 text-indigo-200 border border-white/10 rounded-xl text-xs font-semibold transition shrink-0"
          >
            Browse Startups →
          </Link>
        </div>

        {/* Role-Aware Composer Bar */}
        {canCreatePost ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-indigo-400/30 rounded-2xl p-4 shadow-xl space-y-3 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/25 border border-indigo-400/30 flex items-center justify-center text-lg shrink-0">
                {displayLogo}
              </div>
              <button
                type="button"
                onClick={() => handleOpenPostModal('Milestone')}
                className="flex-1 text-left bg-slate-950/70 hover:bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-400 hover:text-slate-200 transition"
              >
                Share a milestone or prototype update as{' '}
                <span className="text-indigo-300 font-semibold">{actorDisplayName}</span>...
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
              <div className="flex flex-wrap gap-1.5">
                {['Milestone', 'Prototype Update', 'Hiring'].map((quickTag) => (
                  <button
                    key={quickTag}
                    type="button"
                    onClick={() => handleOpenPostModal(quickTag)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-[11px] font-medium text-slate-300 hover:text-indigo-200 border border-white/10 transition"
                  >
                    + {quickTag}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleOpenPostModal('Milestone')}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition border border-indigo-400/30"
              >
                Post Update
              </button>
            </div>
          </div>
        ) : isInvestorOrCompany ? (
          <div className="bg-purple-500/10 border border-purple-400/25 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-purple-200">
              <span className="text-base">💬</span>
              <span>
                Signed in as <strong className="text-white">{actorDisplayName}</strong> ({actorRoleLabel}) — like and comment on startup updates below.
              </span>
            </div>
          </div>
        ) : null}

        {/* Search, Startup Selector, Tag Filters & Sort Bar */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
          {/* Search Input + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by startup name, keyword, or update..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/75 border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter by Startup */}
          {/* {availableStartups.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Startup
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedStartupFilter('All')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                    selectedStartupFilter === 'All'
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-400/50'
                      : 'bg-slate-950/50 text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
                  }`}
                >
                  All Startups
                </button>
                {availableStartups.map((st) => {
                  const isActive =
                    selectedStartupFilter.toLowerCase() === st.name.toLowerCase();
                  return (
                    <button
                      key={st.name}
                      type="button"
                      onClick={() =>
                        setSelectedStartupFilter(isActive ? 'All' : st.name)
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-md shadow-indigo-950/60'
                          : 'bg-slate-950/50 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{st.logo}</span>
                      <span>{st.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )} */}

          {/* Filter by Category Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {FILTER_TAGS.map((tag) => {
                const active = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
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

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-indigo-300 hover:text-white transition"
              >
                Reset all
              </button>
            )}
          </div>
        </div>

        {/* Active Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{visiblePosts.length}</strong>{' '}
            {visiblePosts.length === 1 ? 'update' : 'updates'}
            {selectedStartupFilter !== 'All' && (
              <>
                {' '}
                from <strong className="text-indigo-300">{selectedStartupFilter}</strong>
              </>
            )}
          </span>
          {searchQuery.trim() && (
            <span>
              Matching &ldquo;<span className="text-indigo-300">{searchQuery.trim()}</span>&rdquo;
            </span>
          )}
        </div>

        {/* Posts List */}
        {loadingPosts && posts.length === 0 ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 w-32 bg-slate-800 rounded" />
                    <div className="h-2.5 w-20 bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="h-12 bg-slate-800/70 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {visiblePosts.map((post) => {
              const isDrawerOpen = Boolean(openCommentsMap[post.id]);
              const replies = post.commentsList || [];
              const commentErr = commentErrorMap[post.id];
              const badgeClass =
                TAG_STYLES[post.tag] ||
                'bg-indigo-500/20 text-indigo-300 border-indigo-400/30';

              return (
                <article
                  key={post.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 transition hover:border-white/20"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedStartupFilter((prev) =>
                            prev.toLowerCase() === (post.teamName || '').toLowerCase()
                              ? 'All'
                              : post.teamName
                          )
                        }
                        title={`Filter updates by ${post.teamName}`}
                        className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 flex items-center justify-center text-xl shrink-0 transition"
                      >
                        {post.teamLogo}
                      </button>
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedStartupFilter((prev) =>
                                prev.toLowerCase() === (post.teamName || '').toLowerCase()
                                  ? 'All'
                                  : post.teamName
                              )
                            }
                            className="font-bold text-sm text-white hover:text-indigo-300 transition text-left"
                          >
                            {post.teamName}
                          </button>
                          {post.verified && (
                            <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{post.timeAgo}</p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-semibold border px-3 py-1 rounded-full shrink-0 ${badgeClass}`}
                    >
                      {post.tag}
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center space-x-6">
                      <button
                        type="button"
                        onClick={() => handleLike(post)}
                        className={`flex items-center space-x-2 text-xs font-medium transition ${
                          post.isLiked
                            ? 'text-rose-400 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-base">{post.isLiked ? '❤️' : '🤍'}</span>
                        <span>{post.likes} Likes</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCommentsDrawer(post.id)}
                        className={`flex items-center space-x-2 text-xs font-medium transition ${
                          isDrawerOpen
                            ? 'text-indigo-300 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-base">💬</span>
                        <span>{post.comments} Comments</span>
                      </button>
                    </div>

                    <Link
                      to="/discover"
                      className="text-[11px] font-semibold text-slate-400 hover:text-indigo-300 transition"
                    >
                      View Startup 
                    </Link>
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
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-semibold text-white truncate">
                                    {reply.authorName || 'Member'}
                                  </span>
                                  {reply.authorRole && (
                                    <span className="text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-400/25 px-2 py-0.5 rounded-full shrink-0">
                                      {reply.authorRole}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-500 shrink-0">
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
                          <span className="sm:w-48 bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-indigo-200 font-semibold flex items-center justify-between gap-2 truncate">
                            <span className="truncate">{actorDisplayName || 'Member'}</span>
                            <span className="text-[10px] text-purple-300 shrink-0">
                              {actorRoleLabel}
                            </span>
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
                            Log in as a startup, investor, or company to post replies.
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
              <div className="text-center py-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl space-y-3 px-4">
                <p className="text-slate-300 font-semibold text-sm">
                  No updates match your search or filters.
                </p>
                <p className="text-slate-400 text-xs">
                  Try searching for another startup name or reset your active filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl border border-indigo-400/30 transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button (Visible to Guests & Startup Accounts) */}
      {!isInvestorOrCompany && (
        <div className="fixed bottom-8 right-8 z-40 group flex items-center">
          <span className="absolute right-16 bg-slate-900/90 text-indigo-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl whitespace-nowrap">
            {activeUser ? 'Post an update' : 'Log in to post'}
          </span>

          <button
            type="button"
            onClick={() => handleOpenPostModal('Milestone')}
            className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl shadow-indigo-900/80 border border-indigo-400/40 transition-transform hover:scale-105 active:scale-95"
            aria-label="Post an update"
          >
            +
          </button>
        </div>
      )}

      {/* Create Post Modal (Startup Accounts Only) */}
      {isModalOpen && canCreatePost && (
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
                    <span className="text-indigo-300 font-semibold">
                      {actorDisplayName || 'Startup'}
                    </span>
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
                  {actorDisplayName || 'Startup'}
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