import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { COLLECTIONS } from '../config/collections';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    homeState: '',
    category: '',
    crlRank: '',
    homeStateRank: '',
    categoryRank: '',
    exam: '',
    dob: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      if (!currentUser) return;
      try {
        const docRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(prev => ({ ...prev, ...docSnap.data() }));
        } else {
          setProfileData(prev => ({ ...prev, email: currentUser.email || '' }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
      setLoading(false);
    }
    loadProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const docRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
      await setDoc(docRef, profileData, { merge: true });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage('Error updating profile. Please try again.');
    }
    setSaving(false);
  };

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];
  const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>My Profile — Udaan Vidyapeeth</title>
      </Helmet>
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-1 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-brand-blue px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">Student Profile</h1>
              <p className="text-blue-100 mt-1">Manage your personal information and preferences.</p>
            </div>
            <button 
              type="button"
              onClick={() => logout()} 
              className="bg-white/10 hover:bg-white/20 text-white font-body text-sm font-semibold px-5 py-2.5 rounded-lg border border-white/20 transition self-start sm:self-auto"
            >
              Logout
            </button>
          </div>
          
          <div className="p-8">
            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading profile data...</div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                
                {message && (
                  <div className={`p-4 rounded-lg text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="name" value={profileData.name || ''} onChange={handleChange} required 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:outline-none" />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address (Read-only)</label>
                    <input type="email" name="email" value={profileData.email || ''} readOnly 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number (WhatsApp)</label>
                    <input type="text" name="phoneNumber" value={profileData.phoneNumber || ''} onChange={handleChange} placeholder="+91 9876543210"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:outline-none" />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" name="dob" value={profileData.dob || ''} onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:outline-none" />
                  </div>

                  {/* Home State */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Home State</label>
                    <select name="homeState" value={profileData.homeState || ''} onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:outline-none appearance-none bg-white">
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select name="category" value={profileData.category || ''} onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:outline-none appearance-none bg-white">
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Target Exam */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Target Exam / Field</label>
                    <input type="text" name="exam" value={profileData.exam || ''} onChange={handleChange} placeholder="e.g. JEE Main, NEET"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:outline-none" />
                  </div>

                  {/* CRL Rank */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">CRL Rank</label>
                    <input type="text" name="crlRank" value={profileData.crlRank || ''} onChange={handleChange} placeholder="e.g. 15000"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:outline-none" />
                  </div>

                  {/* Home State Rank */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Home State Rank</label>
                    <input type="text" name="homeStateRank" value={profileData.homeStateRank || ''} onChange={handleChange} placeholder="Optional"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:outline-none" />
                  </div>

                  {/* Category Rank */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category Rank</label>
                    <input type="text" name="categoryRank" value={profileData.categoryRank || ''} onChange={handleChange} placeholder="Optional"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:outline-none" />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button type="submit" disabled={saving} className="bg-brand-blue hover:bg-brand-dark text-white px-8 py-2.5 rounded-lg font-heading font-semibold transition disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
