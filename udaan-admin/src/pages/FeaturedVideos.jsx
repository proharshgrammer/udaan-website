import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function FeaturedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const fetchVideos = async () => {
    try {
      const q = query(collection(db, 'featured_videos'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    if (!newUrl.trim()) { setError('YouTube URL is required'); return; }
    
    const videoId = getYouTubeId(newUrl);
    if (!videoId) { setError('Invalid YouTube URL. Please paste a valid link.'); return; }

    setAdding(true);
    try {
      await addDoc(collection(db, 'featured_videos'), {
        url: newUrl.trim(),
        title: newTitle.trim() || '',
        videoId,
        order: videos.length,
        createdAt: new Date()
      });
      setNewUrl('');
      setNewTitle('');
      await fetchVideos();
    } catch (err) {
      console.error('Error adding video:', err);
      setError('Failed to add video. Try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this video?')) return;
    try {
      await deleteDoc(doc(db, 'featured_videos', id));
      await fetchVideos();
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  const moveVideo = async (index, direction) => {
    const newVideos = [...videos];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newVideos.length) return;
    
    [newVideos[index], newVideos[swapIndex]] = [newVideos[swapIndex], newVideos[index]];
    
    try {
      for (let i = 0; i < newVideos.length; i++) {
        await updateDoc(doc(db, 'featured_videos', newVideos[i].id), { order: i });
      }
      setVideos(newVideos.map((v, i) => ({ ...v, order: i })));
    } catch (err) {
      console.error('Error reordering:', err);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Featured Videos</h1>
        <p className="text-gray-500 mt-1">Manage YouTube videos shown on the Blog page. Paste a YouTube link and it will auto-embed.</p>
      </div>

      {/* Add New Video Form */}
      <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
        <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">Add New Video</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL *</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Video title for display"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Preview */}
        {getYouTubeId(newUrl) && (
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 max-w-sm">
            <img 
              src={`https://img.youtube.com/vi/${getYouTubeId(newUrl)}/hqdefault.jpg`} 
              alt="Video preview" 
              className="w-full aspect-video object-cover"
            />
            <div className="bg-gray-50 px-3 py-2 text-xs text-gray-500 font-medium">Preview thumbnail</div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={adding}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition disabled:opacity-50"
        >
          {adding ? 'Adding...' : 'Add Video'}
        </button>
      </form>

      {/* Video List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading videos...</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          <p className="font-medium text-lg">No featured videos yet</p>
          <p className="text-sm mt-1">Add a YouTube URL above to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video, index) => (
            <div key={video.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition">
              {/* Thumbnail */}
              <div className="shrink-0 w-32 aspect-video rounded-lg overflow-hidden bg-gray-100">
                {video.videoId && (
                  <img 
                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} 
                    alt={video.title || 'Video'} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-semibold text-gray-900 truncate">{video.title || 'Untitled Video'}</h4>
                <p className="text-xs text-gray-400 truncate mt-1">{video.url}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => moveVideo(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition"
                  title="Move up"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                </button>
                <button
                  onClick={() => moveVideo(index, 1)}
                  disabled={index === videos.length - 1}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition"
                  title="Move down"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition ml-2"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
