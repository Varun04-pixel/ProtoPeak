import React, { useState } from 'react';

const INITIAL_POSTS = [
  {
    id: 1,
    teamName: 'QueryGuard',
    teamLogo: '🛡️',
    authorName: 'Varun Shinde',
    timeAgo: '2 hours ago',
    tag: 'Milestone',
    content: 'Excited to announce that we completed our static analysis engine integration! QueryGuard can now parse and flag SQL injection vectors in under 120ms during automated local testing.',
    likes: 24,
    comments: 5,
    isLiked: false,
    verified: true,
  },
  {
    id: 2,
    teamName: 'EcoTrace',
    teamLogo: '🌱',
    authorName: 'Shrusti',
    timeAgo: '5 hours ago',
    tag: 'Hiring',
    content: 'We are looking for a 3rd-year CS/EC student passionate about IoT firmware to help optimize telemetry data streaming from our ESP32 microcontrollers to MongoDB Atlas. DM or express interest!',
    likes: 18,
    comments: 8,
    isLiked: false,
    verified: false,
  },
  {
    id: 3,
    teamName: 'MediPulse AI',
    teamLogo: '🩺',
    authorName: 'Syed Zaki',
    timeAgo: '1 day ago',
    tag: 'Prototype Update',
    content: 'Just deployed our V1 triage model live on Vercel! Early testing shows 94% alignment with baseline symptom intake matrices. Check out the demo link on our startup profile!',
    likes: 42,
    comments: 12,
    isLiked: false,
    verified: true,
  },
];

export default function Feed() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [postTag, setPostTag] = useState('Update');

  // Handle Like Toggle
  const handleLike = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          };
        }
        return post;
      })
    );
  };

  // Handle New Post Submission
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newEntry = {
      id: Date.now(),
      teamName: 'ProtoPeak Team',
      teamLogo: '🚀',
      authorName: 'You',
      timeAgo: 'Just now',
      tag: postTag,
      content: newPostContent,
      likes: 0,
      comments: 0,
      isLiked: false,
      verified: true,
    };

    setPosts([newEntry, ...posts]);
    setNewPostContent('');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Community Feed
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Latest build updates, hiring announcements, and raw prototype milestones from startup teams.
          </p>
        </div>

        {/* Feed Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 transition hover:border-white/20"
            >
              {/* Post Author Bar */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl">
                    {post.teamLogo}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{post.teamName}</span>
                      {post.verified && (
                        <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Posted by <span className="text-slate-300">{post.authorName}</span> • {post.timeAgo}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
                  {post.tag}
                </span>
              </div>

              {/* Post Content */}
              <p className="text-sm text-slate-200 leading-relaxed">
                {post.content}
              </p>

              {/* Action Buttons (Like / Comment) */}
              <div className="flex items-center space-x-6 pt-3 border-t border-white/10">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 text-xs font-medium transition ${
                    post.isLiked ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-base">{post.isLiked ? '❤️' : '🤍'}</span>
                  <span>{post.likes} Likes</span>
                </button>

                <button className="flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-white transition">
                  <span className="text-base">💬</span>
                  <span>{post.comments} Comments</span>
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Floating Action Button (FAB) with Hover Tooltip */}
      <div className="fixed bottom-8 right-8 z-50 group flex items-center">
        {/* Tooltip on hover */}
        <span className="absolute right-16 bg-slate-900/90 text-indigo-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl whitespace-nowrap">
          Post an update
        </span>

        {/* Plus Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl shadow-indigo-900/80 border border-indigo-400/40 transition-transform hover:scale-105 active:scale-95"
          aria-label="Post an update"
        >
          +
        </button>
      </div>

      {/* Modal / Popup for Creating Post */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 relative">
            
            {/* Header & Close Icon */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-lg">
                  🚀
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Post</h3>
                  <p className="text-xs text-slate-400">Share your milestone or hiring update</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                rows="4"
                placeholder="What is your team building today?"
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
                  <option value="Update">Update</option>
                  <option value="Milestone">Milestone</option>
                  <option value="Hiring">Hiring</option>
                  <option value="Prototype Update">Prototype Update</option>
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
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-indigo-900/40 border border-indigo-400/30"
                  >
                    Post
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