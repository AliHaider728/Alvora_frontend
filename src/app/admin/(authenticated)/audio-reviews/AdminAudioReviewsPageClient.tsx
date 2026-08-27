"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Play, Pause, Save, X } from "lucide-react";
import { api } from "../../../../services/api";
import { AudioReview } from "../../../../types";

export default function AdminAudioReviewsPageClient() {
  const [reviews, setReviews] = useState<AudioReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  
  // Form states
  const [customerName, setCustomerName] = useState("");
  const [duration, setDuration] = useState("0:20");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Audio playback state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("${API_BASE_URL}/audio-reviews/admin", { headers: { Authorization: `Bearer ${localStorage.getItem("alvora_admin_token")}` } });
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch audio reviews");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setDuration("0:20");
    setDisplayOrder("0");
    setIsActive(true);
    setFile(null);
    setEditingId(null);
    setError("");
  };

  const handleOpenNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEdit = (r: AudioReview) => {
    resetForm();
    setEditingId(r.id);
    setCustomerName(r.customerName);
    setDuration(r.duration);
    setDisplayOrder(r.displayOrder.toString());
    setIsActive(r.isActive);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await fetch(`${API_BASE_URL}/audio-reviews/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("alvora_admin_token")}` }, body: JSON.stringify({
          customerName,
          duration,
          displayOrder: parseInt(displayOrder, 10),
          isActive
        }) });
      } else {
        if (!file) {
          setError("Audio file is required for new reviews");
          return;
        }
        
        const formData = new FormData();
        formData.append("customerName", customerName);
        formData.append("duration", duration);
        formData.append("displayOrder", displayOrder);
        formData.append("isActive", isActive.toString());
        formData.append("audio", file);

        // Fetch wrapper to handle FormData (axios handles it fine if we just pass formData, but api.post might need custom headers or config, let's use standard fetch just in case or api.post)
        const token = localStorage.getItem('alvora_admin_token');
        const res = await fetch('${API_BASE_URL}/audio-reviews', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }
      }
      
      setIsFormOpen(false);
      fetchReviews();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this audio review?")) return;
    try {
      await fetch(`${API_BASE_URL}/audio-reviews/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("alvora_admin_token")}` } });
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert("Failed to delete review");
    }
  };

  const togglePlay = (url: string, id: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlayingId(id);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Audio Reviews</h1>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 h-10 py-2 px-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Audio Review
        </button>
      </div>

      <audio ref={audioRef} onEnded={() => setPlayingId(null)} className="hidden" />

      {error && !isFormOpen && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">{editingId ? 'Edit Review' : 'New Audio Review'}</h2>
            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#C48B80] focus:ring-[#C48B80] sm:text-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration Text (e.g. 0:20)</label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#C48B80] focus:ring-[#C48B80] sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  required
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#C48B80] focus:ring-[#C48B80] sm:text-sm p-2 border"
                />
              </div>
              
              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-gray-300 text-[#C48B80] focus:ring-[#C48B80]"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (visible on storefront)</span>
                </label>
              </div>
            </div>

            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audio File (MP3/WAV) *</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F1C9BD] file:text-[#A86249] hover:file:bg-[#EFCDBE]"
                />
                <p className="mt-1 text-xs text-gray-500">File will be uploaded to Cloudflare R2.</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A1A1A] hover:bg-gray-800 focus:outline-none"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? 'Save Changes' : 'Upload Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No audio reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => togglePlay(r.audioUrl, r.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F1C9BD] text-[#A86249] hover:bg-[#EFCDBE]"
                      >
                        {playingId === r.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {r.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {r.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {r.displayOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {r.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(r)} className="text-[#C48B80] hover:text-[#A86249] mr-4">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
