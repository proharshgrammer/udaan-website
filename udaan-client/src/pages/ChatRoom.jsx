import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, query, orderBy, onSnapshot, addDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function ChatRoom() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
       navigate('/login');
       return;
    }

    const sessionPath = `course_chats/${courseId}/sessions/${currentUser.uid}`;
    
    // Clear unread count on mount
    updateDoc(doc(db, `course_chats/${courseId}/sessions`, currentUser.uid), {
       unreadCountUser: 0
    }).catch(() => {});

    // Listen to messages
    const q = query(
      collection(db, `${sessionPath}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [courseId, currentUser, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    const sessionPath = `course_chats/${courseId}/sessions/${currentUser.uid}`;
    
    try {
       // Add message
       await addDoc(collection(db, `${sessionPath}/messages`), {
         text,
         type: 'text',
         senderId: currentUser.uid,
         isRead: false,
         timestamp: serverTimestamp()
       });

       // Update session stub for admin
       await setDoc(doc(db, `course_chats/${courseId}/sessions`, currentUser.uid), {
         userName: currentUser.displayName || 'Student',
         lastMessage: text,
         lastMessageTime: serverTimestamp(),
         unreadCountAdmin: increment(1)
       }, { merge: true });

       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
       console.error("Failed to send message", err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin"></div></div>;

  return (
    <div className="bg-gray-100 h-screen font-body flex flex-col pt-[72px]">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center gap-4 shrink-0 shadow-sm z-10">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-brand-blue p-2 -ml-2 rounded-full hover:bg-gray-50 transition">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="bg-brand-blue/10 p-2.5 rounded-full text-brand-blue">
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" fillRule="evenodd" /></svg>
        </div>
        <div>
           <h1 className="font-heading font-bold text-lg text-gray-900 leading-tight">Course Mentor</h1>
           <p className="text-xs font-medium text-green-600">Online Support</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
         {messages.length === 0 && (
            <div className="text-center py-10">
               <div className="bg-white/80 backdrop-blur inline-block px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-sm font-medium text-gray-500">
                  Say hi to your mentor! Messages are private.
               </div>
            </div>
         )}
         {messages.map(msg => {
            const isMe = msg.senderId === currentUser.uid;
            return (
               <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-5 py-3 ${
                    isMe 
                      ? 'bg-brand-blue text-white rounded-br-none shadow-md shadow-brand-blue/20' 
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                  }`}>
                     {msg.type === 'text' && (
                        <p className="whitespace-pre-wrap font-medium leading-relaxed text-[15px]">{msg.text}</p>
                     )}
                     {msg.type === 'image' && msg.attachmentUrl && (
                        <img src={msg.attachmentUrl} alt="attachment" className="rounded-xl max-h-60 object-cover my-1" />
                     )}
                     <span className={`text-[10px] block mt-1.5 font-semibold text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                        {msg.timestamp ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                     </span>
                  </div>
               </div>
            );
         })}
         <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-white p-4 border-t border-gray-200 shrink-0 mb-6">
         <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
             <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-full px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue font-medium placeholder:text-gray-400 transition"
                />
             </div>
             <button 
                type="submit"
                disabled={!inputText.trim()}
                className="bg-brand-blue hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3.5 rounded-full transition transform hover:scale-105 active:scale-95 shadow shadow-brand-blue/30"
             >
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
             </button>
         </form>
      </div>

    </div>
  );
}
