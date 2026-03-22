import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function LeadForm({ onSuccess, isLight = false }) {
  const [formData, setFormData] = useState({ name: '', phone: '', city: '', exam: '', rank: '', email: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = 'Required';
    if (!formData.phone || formData.phone.length < 10) tempErrors.phone = 'Valid 10-digit number required';
    if (!formData.city) tempErrors.city = 'Required';
    if (!formData.exam) tempErrors.exam = 'Required';
    if (!formData.rank) tempErrors.rank = 'Required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false
      });
      
      const msg = encodeURIComponent(
        `New Udaan lead:\nName: ${formData.name}\nPhone: ${formData.phone}\nExam: ${formData.exam}\nRank: ${formData.rank}\nCity: ${formData.city}`
      );
      window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${msg}`, '_blank');
      
      sessionStorage.setItem('udaan_lead_dismissed', 'true');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting lead: ", error);
      alert("Failed to submit. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue transition font-body text-sm ${
    isLight ? 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400' : 'bg-white/10 border-white/20 text-white placeholder:text-white/60'
  }`;
  
  const labelClass = `block text-sm font-medium mb-1.5 ${isLight ? 'text-gray-700' : 'text-white/90'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Name*</label>
        <input type="text" className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Phone*</label>
          <input type="tel" className={`${inputClass} ${errors.phone ? 'border-red-500' : ''}`} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Phone Number" />
        </div>
        <div>
          <label className={labelClass}>City/State*</label>
          <input type="text" className={`${inputClass} ${errors.city ? 'border-red-500' : ''}`} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="Your City" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Exam*</label>
          <select className={`${inputClass} ${errors.exam ? 'border-red-500' : ''} ${!isLight && !formData.exam ? 'text-white/60' : ''}`} value={formData.exam} onChange={(e) => setFormData({...formData, exam: e.target.value})}>
            <option value="" disabled className="text-gray-900">Select Exam</option>
            <option value="JEE" className="text-gray-900">JEE</option>
            <option value="NEET" className="text-gray-900">NEET</option>
            <option value="CUET" className="text-gray-900">CUET</option>
            <option value="AKTU" className="text-gray-900">AKTU</option>
            <option value="MHT-CET" className="text-gray-900">MHT-CET</option>
            <option value="IPU" className="text-gray-900">IPU</option>
            <option value="Other" className="text-gray-900">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Rank/Score*</label>
          <input type="text" className={`${inputClass} ${errors.rank ? 'border-red-500' : ''}`} value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})} placeholder="Expected Rank" />
        </div>
      </div>
      <div>
        <label className={labelClass}>Email (optional)</label>
        <input type="email" className={inputClass} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email Address" />
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`w-full mt-2 font-heading font-semibold rounded-full px-6 py-3.5 transition text-center shadow-md ${
          isLight ? 'bg-brand-blue hover:bg-brand-dark text-white' : 'bg-white text-brand-blue hover:bg-gray-100'
        } ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
      >
        {isSubmitting ? 'Booking...' : 'Book my free call'}
      </button>
    </form>
  );
}
