import React from 'react';
import { useCollection } from '../hooks/useFirestore';
import { orderBy } from 'firebase/firestore';

export default function Dashboard() {
  const { data: leads } = useCollection('leads', [orderBy('createdAt', 'desc')]);
  const { data: blogs } = useCollection('blogs');
  const { data: courses } = useCollection('courses');
  const { data: notices } = useCollection('notices');

  const unreadLeads = leads.filter(l => !l.read).length;
  const publishedBlogs = blogs.filter(b => b.published).length;
  const activeCourses = courses.filter(c => c.active).length;

  const stats = [
    { label: 'Total Leads', value: leads.length, color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { label: 'Unread Leads', value: unreadLeads, color: 'bg-red-50 text-red-700 border-red-100' },
    { label: 'Published Blogs', value: publishedBlogs, color: 'bg-green-50 text-green-700 border-green-100' },
    { label: 'Active Courses', value: activeCourses, color: 'bg-purple-50 text-purple-700 border-purple-100' },
    { label: 'Total Notices', value: notices.length, color: 'bg-orange-50 text-orange-700 border-orange-100' },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your website's performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((s, i) => (
          <div key={i} className={`p-5 rounded-xl border ${s.color}`}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">{s.label}</p>
            <p className="text-3xl font-heading font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-heading font-semibold text-lg text-gray-900">Recent Leads (Last 5)</h2>
          <a href="/leads" className="text-sm font-medium text-brand-blue hover:underline">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Exam</th>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 border-r-0">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {leads.slice(0, 5).map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{lead.name}</td>
                  <td className="px-6 py-4">{lead.phone}</td>
                  <td className="px-6 py-4">
                     <span className="bg-brand-light text-brand-dark px-2.5 py-1 rounded text-[11px] uppercase tracking-wide font-bold">{lead.exam}</span>
                  </td>
                  <td className="px-6 py-4">{lead.rank}</td>
                  <td className="px-6 py-4 text-gray-500">{lead.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-6 py-4">
                    {lead.read ? (
                      <span className="text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded text-xs font-medium">Read</span>
                    ) : (
                      <span className="text-red-700 bg-red-50 border border-red-100 px-2.5 py-1 rounded text-xs font-bold">Unread</span>
                    )}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
