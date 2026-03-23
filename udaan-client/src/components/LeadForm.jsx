import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { State, City } from 'country-state-city';

export default function LeadForm({ onSuccess, isLight = false }) {
  const [formData, setFormData] = useState({ name: '', phone: '', state: '', stateCode: '', city: '', exam: '', otherExam: '', rank: '', email: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statesList = State.getStatesOfCountry('IN');
  const citiesList = formData.stateCode ? City.getCitiesOfState('IN', formData.stateCode) : [];

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = 'Required';
    if (!formData.phone || formData.phone.length < 10) tempErrors.phone = 'Valid 10-digit number required';
    if (!formData.state) tempErrors.state = 'Required';
    if (!formData.city) tempErrors.city = 'Required';
    if (!formData.exam) tempErrors.exam = 'Required';
    if (formData.exam === 'Other' && !formData.otherExam) tempErrors.otherExam = 'Required';
    if (!formData.rank) tempErrors.rank = 'Required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const finalExam = formData.exam === 'Other' ? formData.otherExam : formData.exam;
      const { stateCode, otherExam, ...submitData } = formData;
      await addDoc(collection(db, 'leads'), {
        ...submitData,
        exam: finalExam,
        createdAt: serverTimestamp(),
        read: false
      });
      
      const msg = encodeURIComponent(
        `New Udaan lead:\nName: ${formData.name}\nPhone: ${formData.phone}\nExam: ${finalExam}\nRank: ${formData.rank}\nState: ${formData.state}\nCity: ${formData.city}`
      );
      window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${msg}`, '_blank');
      
      try {
        sessionStorage.setItem('udaan_lead_dismissed', 'true');
      } catch (e) {
        console.error('sessionStorage error', e);
      }

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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name*</label>
          <input type="text" className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
        </div>
        <div>
          <label className={labelClass}>Phone*</label>
          <input type="tel" className={`${inputClass} ${errors.phone ? 'border-red-500' : ''}`} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Phone Number" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>State*</label>
          <select className={`${inputClass} ${errors.state ? 'border-red-500' : ''} ${!isLight && !formData.stateCode ? 'text-white/60' : ''}`} value={formData.stateCode} onChange={(e) => {
            const code = e.target.value;
            const sn = statesList.find(s => s.isoCode === code)?.name || '';
            setFormData({...formData, stateCode: code, state: sn, city: ''});
          }}>
            <option value="" disabled className="text-gray-900">Select State</option>
            {statesList.map(s => (
              <option key={s.isoCode} value={s.isoCode} className="text-gray-900">{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>City*</label>
          <select className={`${inputClass} ${errors.city ? 'border-red-500' : ''} ${!isLight && !formData.city ? 'text-white/60' : ''}`} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} disabled={!formData.stateCode}>
            <option value="" disabled className="text-gray-900">Select City</option>
            {citiesList.map(c => (
              <option key={c.name} value={c.name} className="text-gray-900">{c.name}</option>
            ))}
          </select>
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
            <option value="Other" className="text-gray-900">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Rank/Score*</label>
          <input type="text" className={`${inputClass} ${errors.rank ? 'border-red-500' : ''}`} value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})} placeholder="Expected Rank" />
        </div>
      </div>
      {formData.exam === 'Other' && (
        <div>
          <label className={labelClass}>Specify Exam*</label>
          <input type="text" className={`${inputClass} ${errors.otherExam ? 'border-red-500' : ''}`} value={formData.otherExam} onChange={(e) => setFormData({...formData, otherExam: e.target.value})} placeholder="Exam Name" />
        </div>
      )}
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
