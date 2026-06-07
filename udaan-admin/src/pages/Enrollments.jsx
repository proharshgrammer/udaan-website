import React, { useState, useEffect } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { db } from '../firebase';
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];

const generateRandomId = (prefix = "") => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix}_${autoId}` : autoId;
};

const INITIAL_FORM = {
  uid: '',
  name: '',
  email: '',
  phoneNumber: '',
  state: '',
  field: 'General',
  rank: '',
  categoryRank: '',
  homeStateRank: '',
  courseId: '',
  pricePaid: '',
  paymentId: '',
  orderId: '',
  method: 'Manual',
  couponApplied: '',
};

export default function Enrollments() {
  const { data: courses, loading: loadingCourses } = useCollection('courses');
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [submitting, setSubmitting] = useState(false);

  // Generate initial IDs on mount
  useEffect(() => {
    resetIds();
  }, []);

  const resetIds = () => {
    setForm(prev => ({
      ...prev,
      uid: generateRandomId(),
      paymentId: generateRandomId('pay'),
      orderId: generateRandomId('order'),
    }));
  };

  // Auto-fill price when course changes
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const selectedCourse = courses.find(c => c.id === courseId);
    const defaultPrice = selectedCourse 
      ? (selectedCourse.discountedPrice || selectedCourse.price || 0)
      : '';
    
    setForm(prev => ({
      ...prev,
      courseId,
      pricePaid: defaultPrice.toString()
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleManualReset = () => {
    if (window.confirm('Reset the entire form?')) {
      setForm({
        ...INITIAL_FORM,
        uid: generateRandomId(),
        paymentId: generateRandomId('pay'),
        orderId: generateRandomId('order'),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!form.courseId) return toast.error('Please select a course');
    if (!form.uid.trim()) return toast.error('Student UID is required');
    if (!form.name.trim()) return toast.error('Student Name is required');
    if (!form.email.trim()) return toast.error('Email is required');
    if (!form.phoneNumber.trim()) return toast.error('Phone number is required');
    if (!form.state) return toast.error('Please select a state');
    if (!form.rank.trim()) return toast.error('CRL Rank is required');
    if (!form.pricePaid.trim() || isNaN(form.pricePaid)) return toast.error('Valid Price Paid is required');
    if (!form.orderId.trim()) return toast.error('Order ID is required');
    if (!form.paymentId.trim()) return toast.error('Payment ID is required');

    setSubmitting(true);
    try {
      const batch = writeBatch(db);
      const uid = form.uid.trim();
      const courseId = form.courseId;
      const orderId = form.orderId.trim();

      // 1. Write/Merge user profile
      const userRef = doc(db, 'users', uid);
      batch.set(userRef, {
        name: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        state: form.state,
        field: form.field,
        rank: form.rank.trim(),
        homeStateRank: form.homeStateRank.trim() || "",
        categoryRank: form.categoryRank.trim() || "",
        dob: "",
        exam: "",
        interest: "",
        profileImageUrl: "",
      }, { merge: true });

      // 2. Ensure purchases root doc exists
      const purchaseRootRef = doc(db, 'purchases', uid);
      batch.set(purchaseRootRef, {
        uid: uid,
        createdAt: serverTimestamp()
      }, { merge: true });

      // 3. Write user purchase record
      const purchaseRef = doc(db, 'purchases', uid, 'user_purchases', orderId);
      batch.set(purchaseRef, {
        courseId: courseId,
        pricePaid: Number(form.pricePaid),
        purchaseDate: serverTimestamp(),
        paymentId: form.paymentId.trim(),
        method: form.method
      });

      // 4. Write course student enrollment record
      const enrollmentRef = doc(db, 'courses', courseId, 'students', uid);
      batch.set(enrollmentRef, {
        studentId: uid,
        studentName: form.name.trim(),
        enrolledDate: serverTimestamp(),
        name: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        state: form.state,
        field: form.field,
        rank: form.rank.trim(),
        homeStateRank: form.homeStateRank.trim() || "",
        categoryRank: form.categoryRank.trim() || "",
        paymentId: form.paymentId.trim(),
        orderId: orderId,
        pricePaid: Number(form.pricePaid),
        couponApplied: form.couponApplied.trim() || null
      }, { merge: true });

      // Commit batch
      await batch.commit();

      toast.success('Student enrolled successfully!');
      
      // Keep course selection but reset student details & IDs
      setForm(prev => ({
        ...INITIAL_FORM,
        courseId: prev.courseId,
        pricePaid: prev.pricePaid,
        uid: generateRandomId(),
        paymentId: generateRandomId('pay'),
        orderId: generateRandomId('order'),
      }));

    } catch (error) {
      console.error("Error creating enrollment:", error);
      toast.error('Failed to create manual enrollment: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Manual Enrollments</h1>
          <p className="text-gray-500 text-sm mt-1">Manually register students into courses and create database entries</p>
        </div>
        <button 
          onClick={handleManualReset}
          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
        >
          Reset Form
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Course Selection Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold font-heading text-gray-950 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-brand-light text-brand-dark rounded-full text-xs">1</span>
            Select Course
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Name *</label>
            <select
              value={form.courseId}
              onChange={handleCourseChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition text-gray-900 bg-white"
            >
              <option value="">-- Choose a course --</option>
              {loadingCourses ? (
                <option disabled>Loading courses...</option>
              ) : (
                courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} (₹{course.discountedPrice || course.price || 0})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Student Account Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold font-heading text-gray-950 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-brand-light text-brand-dark rounded-full text-xs">2</span>
            Student Account Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Student UID / User ID *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="uid"
                  value={form.uid}
                  onChange={handleChange}
                  required
                  placeholder="Paste existing Firebase UID or click generate"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, uid: generateRandomId() }))}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-semibold rounded-lg text-sm transition"
                >
                  Generate New
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                If the student already registered via the app or web but hasn't purchased yet, copy and paste their exact Firebase UID. Otherwise, generate a new one.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email ID *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="e.g. student@gmail.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                placeholder="10-digit number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Counselling Details Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold font-heading text-gray-950 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-brand-light text-brand-dark rounded-full text-xs">3</span>
            Academic / Counselling Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition text-gray-900 bg-white"
              >
                <option value="">-- Select State --</option>
                {INDIAN_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              <select
                name="field"
                value={form.field}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition text-gray-900 bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">CRL Rank *</label>
              <input
                type="text"
                name="rank"
                value={form.rank}
                onChange={handleChange}
                required
                placeholder="e.g. 15420"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Rank (Optional)</label>
              <input
                type="text"
                name="categoryRank"
                value={form.categoryRank}
                onChange={handleChange}
                placeholder="e.g. 3200"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Home State Rank (Optional)</label>
              <input
                type="text"
                name="homeStateRank"
                value={form.homeStateRank}
                onChange={handleChange}
                placeholder="e.g. 2400"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Payment & Order Reference Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold font-heading text-gray-950 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-brand-light text-brand-dark rounded-full text-xs">4</span>
            Payment & Order Reference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Paid (₹) *</label>
              <input
                type="number"
                name="pricePaid"
                value={form.pricePaid}
                onChange={handleChange}
                required
                placeholder="e.g. 4999"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Method *</label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition text-gray-900 bg-white"
              >
                <option value="Manual">Manual Reference</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                <option value="Razorpay">Razorpay</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Applied (Optional)</label>
              <input
                type="text"
                name="couponApplied"
                value={form.couponApplied}
                onChange={handleChange}
                placeholder="e.g. EARLY50"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Order ID *</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  name="orderId"
                  value={form.orderId}
                  onChange={handleChange}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, orderId: generateRandomId('order') }))}
                  className="px-2.5 py-2 bg-gray-50 border border-gray-300 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-700 shrink-0"
                >
                  Regen
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment ID *</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  name="paymentId"
                  value={form.paymentId}
                  onChange={handleChange}
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue outline-none transition font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, paymentId: generateRandomId('pay') }))}
                  className="px-2.5 py-2 bg-gray-50 border border-gray-300 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-700 shrink-0"
                >
                  Regen
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleManualReset}
            className="px-5 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-dark transition shadow-sm disabled:bg-brand-blue/50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              'Create Enrollment'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
