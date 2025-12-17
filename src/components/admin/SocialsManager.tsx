"use client";

import { useState, useEffect } from 'react';
import { SocialPost, SocialConfig } from '@/lib/admin-store';

export function SocialsManager() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [config, setConfig] = useState<SocialConfig>({
    instagram: { connected: false, username: '' },
    tiktok: { connected: false, username: '' },
  });
  const [newPostUrl, setNewPostUrl] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [showInstaSetup, setShowInstaSetup] = useState(false);
  const [showTikTokSetup, setShowTikTokSetup] = useState(false);
  const [instaToken, setInstaToken] = useState('');
  const [tiktokToken, setTiktokToken] = useState('');

  useEffect(() => {
    fetch("/api/admin/socials")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const mapped = (data.posts || []).map((p: any) => ({
            id: p.id,
            platform: p.platform,
            postUrl: p.post_url,
            caption: p.caption || "",
            thumbnail: p.thumbnail || "",
            displayOrder: p.display_order,
            visible: p.visible !== false,
            dateAdded: p.date_added,
          })) as SocialPost[];
          setPosts(mapped.sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999)));
        }
      })
      .catch(() => {});
    setConfig({
      instagram: { connected: false, username: "" },
      tiktok: { connected: false, username: "" },
    });
  }, []);

  const saveConfig = (newConfig: SocialConfig) => {
    setConfig(newConfig);
  };

  const connectInstagram = () => {
    if (!config.instagram.username || !instaToken) {
      alert('Please enter both username and access token');
      return;
    }
    saveConfig({
      ...config,
      instagram: { 
        connected: true, 
        username: config.instagram.username,
        accessToken: instaToken 
      }
    });
    setShowInstaSetup(false);
    setInstaToken('');
    alert('Instagram connected! Your posts can now be fetched automatically.');
  };

  const disconnectInstagram = () => {
    if (confirm('Disconnect Instagram?')) {
      saveConfig({
        ...config,
        instagram: { connected: false, username: '', accessToken: undefined }
      });
    }
  };

  const connectTikTok = () => {
    if (!config.tiktok.username || !tiktokToken) {
      alert('Please enter both username and access token');
      return;
    }
    saveConfig({
      ...config,
      tiktok: { 
        connected: true, 
        username: config.tiktok.username,
        accessToken: tiktokToken 
      }
    });
    setShowTikTokSetup(false);
    setTiktokToken('');
    alert('TikTok connected!');
  };

  const disconnectTikTok = () => {
    if (confirm('Disconnect TikTok?')) {
      saveConfig({
        ...config,
        tiktok: { connected: false, username: '', accessToken: undefined }
      });
    }
  };

  const addPost = () => {
    if (!newPostUrl) return;

    const platform = newPostUrl.includes('instagram') ? 'instagram' : 
                     newPostUrl.includes('tiktok') ? 'tiktok' : 'instagram';

    const payload = {
      platform,
      postUrl: newPostUrl,
      caption: newPostCaption,
      displayOrder: posts.length + 1,
      visible: true,
      dateAdded: new Date().toISOString(),
    };

    fetch("/api/admin/socials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const newPost: SocialPost = {
            id: data.post.id,
            platform: data.post.platform,
            postUrl: data.post.post_url,
            caption: data.post.caption || "",
            thumbnail: data.post.thumbnail || "",
            displayOrder: data.post.display_order,
            visible: data.post.visible !== false,
            dateAdded: data.post.date_added,
          };
          setPosts((prev) => [...prev, newPost].sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999)));
          setNewPostUrl('');
          setNewPostCaption('');
        } else {
          alert(data.error || "Failed to add post");
        }
      })
      .catch(() => alert("Failed to add post"));
  };

  const updatePost = (post: SocialPost) => {
    fetch(`/api/admin/socials/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: post.platform,
        postUrl: post.postUrl,
        caption: post.caption,
        thumbnail: post.thumbnail,
        displayOrder: post.displayOrder,
        visible: post.visible,
        dateAdded: post.dateAdded,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const updated = posts.map((p) => (p.id === post.id ? post : p)).sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999));
          setPosts(updated);
          setEditingPost(null);
        } else {
          alert(data.error || "Failed to update post");
        }
      })
      .catch(() => alert("Failed to update post"));
  };

  const deletePost = (id: string) => {
    fetch(`/api/admin/socials/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const updated = posts.filter((p) => p.id !== id);
          setPosts(updated);
        } else {
          alert(data.error || "Failed to delete post");
        }
      })
      .catch(() => alert("Failed to delete post"));
  };

  const toggleVisibility = (id: string) => {
    const target = posts.find((p) => p.id === id);
    if (!target) return;
    const nextVisible = !target.visible;
    updatePost({ ...target, visible: nextVisible });
  };

  const movePost = (id: string, direction: 'up' | 'down') => {
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === posts.length - 1) return;

    const newPosts = [...posts];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newPosts[index], newPosts[swapIndex]] = [newPosts[swapIndex], newPosts[index]];
    newPosts.forEach((p, i) => p.displayOrder = i + 1);

    // persist both swapped posts
    const updates = [newPosts[index], newPosts[swapIndex]];
    updates.forEach((post) => {
      fetch(`/api/admin/socials/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: post.platform,
          postUrl: post.postUrl,
          caption: post.caption,
          thumbnail: post.thumbnail,
          displayOrder: post.displayOrder,
          visible: post.visible,
          dateAdded: post.dateAdded,
        }),
      }).catch(() => {});
    });

    setPosts(newPosts);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Social Media</h2>
      <p className="text-white/40 text-sm mb-6">Connect your socials or manually add posts to display on the site.</p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Instagram */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Instagram</h3>
                <p className="text-xs text-white/40">Display your IG posts</p>
              </div>
            </div>
            {config.instagram.connected && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                Connected
              </span>
            )}
          </div>
          
          {config.instagram.connected ? (
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-white/50 text-xs mb-1">Connected as</div>
                <div className="text-white font-medium">{config.instagram.username}</div>
              </div>
              <button
                onClick={disconnectInstagram}
                className="w-full py-2 bg-red-500/20 text-red-400 font-medium text-sm rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : showInstaSetup ? (
            <div className="space-y-3">
              <div>
                <label className="block text-white/50 text-xs mb-1">Instagram Username</label>
                <input
                  type="text"
                  value={config.instagram.username}
                  onChange={(e) => saveConfig({
                    ...config,
                    instagram: { ...config.instagram, username: e.target.value }
                  })}
                  placeholder="@spades_performance"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-pink-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-1">Access Token</label>
                <input
                  type="password"
                  value={instaToken}
                  onChange={(e) => setInstaToken(e.target.value)}
                  placeholder="Paste your access token"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-pink-500/50 focus:outline-none"
                />
              </div>
              <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
                <p className="text-pink-300 text-xs font-medium mb-2">📋 How to get your token:</p>
                <ol className="text-white/50 text-xs space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://developers.facebook.com" target="_blank" className="text-pink-400 hover:underline">developers.facebook.com</a></li>
                  <li>Create an app → Instagram Basic Display</li>
                  <li>Add your Instagram account as a tester</li>
                  <li>Generate a token in the app dashboard</li>
                </ol>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={connectInstagram}
                  className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
                >
                  Connect
                </button>
                <button
                  onClick={() => setShowInstaSetup(false)}
                  className="px-4 py-2 bg-white/10 text-white font-medium text-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={config.instagram.username}
                onChange={(e) => saveConfig({
                  ...config,
                  instagram: { ...config.instagram, username: e.target.value }
                })}
                placeholder="@spades_performance"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-pink-500/50 focus:outline-none"
              />
              <button
                onClick={() => setShowInstaSetup(true)}
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
              >
                Connect Instagram
              </button>
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 text-xs">
                  💡 <strong>Easy mode:</strong> Skip connecting and just paste post URLs below!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* TikTok */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">TikTok</h3>
                <p className="text-xs text-white/40">Display your TikTok videos</p>
              </div>
            </div>
            {config.tiktok.connected && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                Connected
              </span>
            )}
          </div>
          
          {config.tiktok.connected ? (
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-white/50 text-xs mb-1">Connected as</div>
                <div className="text-white font-medium">{config.tiktok.username}</div>
              </div>
              <button
                onClick={disconnectTikTok}
                className="w-full py-2 bg-red-500/20 text-red-400 font-medium text-sm rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : showTikTokSetup ? (
            <div className="space-y-3">
              <div>
                <label className="block text-white/50 text-xs mb-1">TikTok Username</label>
                <input
                  type="text"
                  value={config.tiktok.username}
                  onChange={(e) => saveConfig({
                    ...config,
                    tiktok: { ...config.tiktok, username: e.target.value }
                  })}
                  placeholder="@spadesperformance"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-1">Access Token</label>
                <input
                  type="password"
                  value={tiktokToken}
                  onChange={(e) => setTiktokToken(e.target.value)}
                  placeholder="Paste your access token"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
              <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 text-xs font-medium mb-2">📋 How to get your token:</p>
                <ol className="text-white/50 text-xs space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://developers.tiktok.com" target="_blank" className="text-cyan-400 hover:underline">developers.tiktok.com</a></li>
                  <li>Create an app with Login Kit + Video Kit</li>
                  <li>Submit for review (takes 1-2 days)</li>
                  <li>Generate access token after approval</li>
                </ol>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={connectTikTok}
                  className="flex-1 py-2 bg-black text-white font-bold text-sm rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
                >
                  Connect
                </button>
                <button
                  onClick={() => setShowTikTokSetup(false)}
                  className="px-4 py-2 bg-white/10 text-white font-medium text-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={config.tiktok.username}
                onChange={(e) => saveConfig({
                  ...config,
                  tiktok: { ...config.tiktok, username: e.target.value }
                })}
                placeholder="@spadesperformance"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-white/30 focus:outline-none"
              />
              <button
                onClick={() => setShowTikTokSetup(true)}
                className="w-full py-2 bg-black text-white font-bold text-sm rounded-lg border border-white/20 hover:bg-white/5 transition-colors"
              >
                Connect TikTok
              </button>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-white/50 text-xs">
                  💡 <strong>Easy mode:</strong> Skip connecting and just paste video URLs below!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add New Post */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
        <h3 className="text-lg font-bold text-white mb-2">Add Post Manually</h3>
        <p className="text-white/40 text-sm mb-4">
          Don't want to connect APIs? Just paste any Instagram or TikTok post URL.
        </p>
        <div className="space-y-3">
          <input
            type="text"
            value={newPostUrl}
            onChange={(e) => setNewPostUrl(e.target.value)}
            placeholder="https://www.instagram.com/p/ABC123... or https://www.tiktok.com/@user/video/123..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-spades-gold/50 focus:outline-none"
          />
          <input
            type="text"
            value={newPostCaption}
            onChange={(e) => setNewPostCaption(e.target.value)}
            placeholder="Custom caption (optional)"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-spades-gold/50 focus:outline-none"
          />
          <button
            onClick={addPost}
            disabled={!newPostUrl}
            className="px-6 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Post
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Your Posts ({posts.length})</h3>
          <span className="text-xs text-white/40">Reorder • Show/Hide • Edit</span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📱</div>
            <h4 className="text-white font-medium mb-2">No posts yet</h4>
            <p className="text-white/40 text-sm">Add your first Instagram or TikTok post above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.sort((a, b) => a.displayOrder - b.displayOrder).map((post, index) => (
              <div 
                key={post.id} 
                className={`flex items-center gap-4 p-4 bg-white/5 rounded-lg border transition-colors ${
                  post.visible ? 'border-white/10' : 'border-white/5 opacity-50'
                }`}
              >
                {/* Order controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => movePost(post.id, 'up')}
                    disabled={index === 0}
                    className="text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => movePost(post.id, 'down')}
                    disabled={index === posts.length - 1}
                    className="text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    ▼
                  </button>
                </div>

                {/* Platform icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  post.platform === 'instagram' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                    : 'bg-black border border-white/20'
                }`}>
                  {post.platform === 'instagram' ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  )}
                </div>

                {/* Post info */}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm truncate">{post.postUrl}</div>
                  {post.caption && (
                    <div className="text-white/40 text-xs truncate mt-1">"{post.caption}"</div>
                  )}
                  <div className="text-white/20 text-xs mt-1">
                    Added {new Date(post.dateAdded).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisibility(post.id)}
                    className={`p-2 rounded transition-colors ${
                      post.visible 
                        ? 'text-green-400 hover:bg-green-400/10' 
                        : 'text-white/30 hover:bg-white/5'
                    }`}
                    title={post.visible ? 'Hide from site' : 'Show on site'}
                  >
                    {post.visible ? '👁' : '👁‍🗨'}
                  </button>
                  <button
                    onClick={() => setEditingPost(post)}
                    className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Remove this post?')) deletePost(post.id);
                    }}
                    className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-spades-dark rounded-xl p-6 border border-white/10 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Edit Post</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-sm mb-1">Post URL</label>
                <input
                  type="text"
                  value={editingPost.postUrl}
                  onChange={(e) => setEditingPost({ ...editingPost, postUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/50 text-sm mb-1">Custom Caption</label>
                <textarea
                  value={editingPost.caption || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, caption: e.target.value })}
                  placeholder="Leave empty to use original caption"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none h-20"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => updatePost(editingPost)}
                className="flex-1 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingPost(null)}
                className="flex-1 py-2 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="mt-8 bg-spades-gold/10 rounded-xl p-4 border border-spades-gold/20">
        <h4 className="text-spades-gold font-bold mb-2">💡 Two Ways to Add Content</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white/70 font-medium mb-1">🔗 Easy Way (Recommended)</p>
            <p className="text-white/50">Just paste post URLs above. Works instantly, no setup needed!</p>
          </div>
          <div>
            <p className="text-white/70 font-medium mb-1">🔌 API Connection</p>
            <p className="text-white/50">Connect your accounts to auto-fetch posts. Requires developer setup.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
