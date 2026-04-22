import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { COLLECTIONS } from '../config/collections';
import Navbar from '../components/Navbar';

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

export default function Checkout() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Student details form
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    homeState: '',
    category: '',
    crlRank: '',
    homeStateRank: '',
    categoryRank: '',
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Load course and pre-fill profile
  useEffect(() => {
    async function loadData() {
      if (!currentUser) { navigate('/login'); return; }
      try {
        // Fetch course
        const courseSnap = await getDoc(doc(db, COLLECTIONS.COURSES, courseId));
        if (!courseSnap.exists()) { navigate('/courses'); return; }
        setCourse({ id: courseSnap.id, ...courseSnap.data() });

        // Pre-fill from profile
        const profileSnap = await getDoc(doc(db, COLLECTIONS.USERS, currentUser.uid));
        if (profileSnap.exists()) {
          const p = profileSnap.data();
          setForm(prev => ({
            ...prev,
            name: p.name || currentUser.displayName || '',
            email: p.email || currentUser.email || '',
            phoneNumber: p.phoneNumber || '',
            homeState: p.homeState || p.state || '',
            category: p.category || '',
            crlRank: p.crlRank || p.rank || '',
            homeStateRank: p.homeStateRank || '',
            categoryRank: p.categoryRank || '',
          }));
        } else {
          setForm(prev => ({
            ...prev,
            email: currentUser.email || '',
            name: currentUser.displayName || ''
          }));
        }
      } catch (err) {
        console.error('Checkout load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Coupon validation — checks against course.discountCodes array
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponLoading(true);

    const codes = course?.discountCodes || [];
    const match = codes.find(c => c.code?.toLowerCase() === couponCode.trim().toLowerCase());

    if (!match) {
      setCouponError('Invalid coupon code.');
      setAppliedCoupon(null);
      setCouponLoading(false);
      return;
    }

    // Check expiry
    const expiry = match.expiryDate?.toDate ? match.expiryDate.toDate() : new Date(match.expiryDate?.seconds ? match.expiryDate.seconds * 1000 : match.expiryDate);
    if (expiry < new Date()) {
      setCouponError('This coupon has expired.');
      setAppliedCoupon(null);
      setCouponLoading(false);
      return;
    }

    setAppliedCoupon(match);
    setCouponError('');
    setCouponLoading(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Synchronize exact backend math to prevent Razorpay UI discrepancies
  const coursePrice = course?.discountedPrice || course?.price || 0;
  let finalPrice = coursePrice;
  
  if (appliedCoupon) {
    const discountAmount = (finalPrice * Number(appliedCoupon.discountPercentage)) / 100;
    finalPrice = finalPrice - discountAmount;
  }

  // Backend does: Math.floor(finalPrice * 100)
  const amountInPaise = Math.max(100, Math.floor(finalPrice * 100)); // enforce min 1 INR (100 paise)
  const totalPrice = amountInPaise / 100;

  // Validate required fields
  const isFormValid = form.name.trim() && form.email.trim() && form.phoneNumber.trim() && form.homeState && form.crlRank.trim();

  const handlePay = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setProcessing(true);
    try {
      // 1. Save/update the user profile with checkout fields
      await setDoc(doc(db, COLLECTIONS.USERS, currentUser.uid), {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        homeState: form.homeState,
        category: form.category,
        crlRank: form.crlRank,
        homeStateRank: form.homeStateRank,
        categoryRank: form.categoryRank,
      }, { merge: true });

      // 2. Create Razorpay order via Cloud Function
      const { functions } = await import('../firebase');
      const { httpsCallable } = await import('firebase/functions');
      
      const createOrder = httpsCallable(functions, 'createOrder');
      const result = await createOrder({
        courseId: course.id,
        promoCode: appliedCoupon?.code || null,
      });

      const data = result.data;
      const orderId = data.orderId || data.id;
      const orderAmount = data.amount; // Exact paise amount from backend order
      
      if (!orderId) throw new Error('Order creation failed. Please try again.');

      // 3. Open Razorpay Checkout
      // amount and currency ARE required for Web SDK (unlike mobile SDK)
      // Use the exact amount from the backend order to guarantee a match
      if (!window.Razorpay) throw new Error('Payment SDK not loaded. Please reload.');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: 'INR',
        order_id: orderId,
        name: 'Udaan Vidyapeeth',
        description: `Purchase: ${course.name}`,
        handler: async function (response) {
          try {
            // Write enrollment directly to Firestore to guarantee immediate access
            const { serverTimestamp } = await import('firebase/firestore');
            await setDoc(doc(db, COLLECTIONS.COURSES, course.id, 'students', currentUser.uid), {
              studentId: currentUser.uid,
              studentName: form.name,
              name: form.name,
              email: form.email,
              phoneNumber: form.phoneNumber,
              enrolledAt: serverTimestamp(),
              paymentId: response.razorpay_payment_id || 'manual',
              orderId: response.razorpay_order_id || 'manual',
              pricePaid: totalPrice,
              couponApplied: appliedCoupon?.code || null
            }, { merge: true });
            
            // Send data to Google Sheets (Non-blocking background task)
            fetch('https://script.google.com/macros/s/AKfycbx9_PHUkUSyceAOgOgmz5JtgBoHjPuUniGREGuH3bSxfUkagWd1aMnUoqWqPDWtyzgC/exec', {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Content-Type': 'text/plain',
              },
              body: JSON.stringify({
                courseName: course.name,
                name: form.name,
                email: form.email,
                phoneNumber: form.phoneNumber,
                homeState: form.homeState,
                category: form.category,
                crlRank: form.crlRank,
                homeStateRank: form.homeStateRank,
                categoryRank: form.categoryRank,
                pricePaid: totalPrice,
                paymentId: response.razorpay_payment_id || 'manual',
                orderId: response.razorpay_order_id || 'manual'
              })
            }).catch(e => console.error("Google Sheets sync error: ", e));

            navigate('/my-courses');
          } catch (err) {
            console.error("Enrollment error: ", err);
            alert("Payment successful, but error updating dashboard. Support will sync this shortly.");
            navigate('/my-courses');
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phoneNumber,
        },
        theme: { color: '#0C447C' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (res) {
        const err = res.error || {};
        alert(
          `Payment Failed\n` +
          `Reason: ${err.reason || 'Unknown'}\n` +
          `Description: ${err.description || 'No details'}\n` +
          `Code: ${err.code || 'N/A'}\n` +
          `Source: ${err.source || 'N/A'}\n` +
          `Step: ${err.step || 'N/A'}\n` +
          `Order ID: ${err.metadata?.order_id || orderId}\n` +
          `Payment ID: ${err.metadata?.payment_id || 'N/A'}`
        );
      });
      rzp.on('payment.error', function(res) {
        console.error('Razorpay payment error:', res);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Error initiating payment: ' + (err.message || 'Please try again.'));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="bg-gray-50 min-h-screen font-body flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 lg:py-12 mt-20">
        {/* Page Title */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-brand-blue font-medium text-sm flex items-center gap-1 mb-4 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <h1 className="font-heading font-bold text-3xl text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left — Form */}
          <div className="lg:col-span-3 space-y-6">

            {/* Course Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={course.name} className="w-20 h-16 rounded-xl object-cover shrink-0 border border-gray-100" />
              ) : (
                <div className="w-20 h-16 rounded-xl bg-gradient-to-br from-brand-light to-brand-blue shrink-0"></div>
              )}
              <div className="min-w-0">
                <h2 className="font-heading font-bold text-lg text-gray-900 truncate">{course.name}</h2>
                <p className="text-green-600 font-bold text-lg">₹{coursePrice.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Student Details */}
            <form onSubmit={handlePay} id="checkout-form">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <h2 className="font-heading font-bold text-xl text-gray-900 mb-6">Student Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </span>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue focus:outline-none transition font-medium" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail ID <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </span>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue focus:outline-none transition font-medium" />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile No (WhatsApp) <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </span>
                      <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required placeholder="+91 98765 43210"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue focus:outline-none transition font-medium" />
                    </div>
                  </div>

                  {/* Home State */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Home State <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </span>
                      <select name="homeState" value={form.homeState} onChange={handleChange} required
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue focus:outline-none transition font-medium appearance-none bg-white">
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category <span className="text-red-400">*</span></label>
                    <select name="category" value={form.category} onChange={handleChange} required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue focus:outline-none transition font-medium appearance-none bg-white">
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* CRL Rank */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">CRL Rank <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      </span>
                      <input type="text" name="crlRank" value={form.crlRank} onChange={handleChange} required placeholder="e.g. 15000"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue focus:outline-none transition font-medium" />
                    </div>
                  </div>

                  {/* Home State Rank */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Home State Rank</label>
                    <input type="text" name="homeStateRank" value={form.homeStateRank} onChange={handleChange} placeholder="Optional"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue focus:outline-none transition font-medium" />
                  </div>

                  {/* Category Rank */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Rank</label>
                    <input type="text" name="categoryRank" value={form.categoryRank} onChange={handleChange} placeholder="Optional"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue focus:outline-none transition font-medium" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right — Summary Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Promo Code */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">Apply Promo Code</h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-bold text-green-700 text-sm">{appliedCoupon.code}</p>
                      <p className="text-green-600 text-xs font-medium">{appliedCoupon.discountPercentage}% OFF applied</p>
                    </div>
                    <button onClick={removeCoupon} className="text-red-400 hover:text-red-600 text-xs font-bold transition">Remove</button>
                  </div>
                ) : (
                  <div className="relative flex items-center group">
                    <div className="absolute left-3.5 text-gray-400 group-focus-within:text-brand-blue transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    </div>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                      placeholder="Enter promo code"
                      className="w-full pl-11 pr-[88px] py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue focus:outline-none transition font-medium text-sm bg-gray-50 uppercase placeholder:normal-case"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="absolute right-1.5 top-1.5 bottom-1.5 bg-brand-blue hover:bg-brand-dark text-white font-bold px-4 rounded-lg text-sm transition-all disabled:opacity-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm active:scale-95 disabled:active:scale-100"
                    >
                      {couponLoading ? (
                        <span className="flex items-center gap-1">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        </span>
                      ) : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-red-500 text-xs font-medium mt-2">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">Order Summary</h3>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-gray-600">Course Price</span>
                  <span className="font-semibold px-1">₹{coursePrice.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-sm mb-3 text-green-600">
                    <span>Discount ({appliedCoupon.discountPercentage}%)</span>
                    <span className="font-semibold">- ₹{Math.floor(coursePrice * (appliedCoupon.discountPercentage / 100)).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <hr className="my-3 border-gray-100" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total to Pay</span>
                  <span className="text-brand-blue">₹{totalPrice.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 2})}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={processing || !isFormValid}
                className="w-full bg-brand-blue hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-heading font-bold text-xl py-4 rounded-2xl shadow-lg shadow-brand-blue/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] tracking-wide"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${totalPrice.toLocaleString('en-IN')}`
                )}
              </button>

              <p className="text-center text-xs text-gray-400 font-medium">
                Secured by Razorpay. Your payment information is encrypted.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
