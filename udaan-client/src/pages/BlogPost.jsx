import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFAB from '../components/WhatsAppFAB';

// Strip HTML tags for generating plain text excerpts
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    async function fetchPost() {
      try {
        // Try slug-based lookup first (single-field query, no composite index needed)
        let q = query(
          collection(db, 'blogs'),
          where('slug', '==', slug),
          limit(1)
        );
        let snap = await getDocs(q);

        if (!snap.empty) {
          const docData = snap.docs[0];
          const data = docData.data();
          if (data.published) {
            setPost({ id: docData.id, ...data });
          }
        } else {
          // Fallback: try ID-based lookup for old posts without slugs
          const docRef = doc(db, 'blogs', slug);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().published) {
            setPost({ id: docSnap.id, ...docSnap.data() });
          }
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  // Fetch related posts based on shared exam tags
  useEffect(() => {
    if (!post || !post.exams || post.exams.length === 0) return;

    async function fetchRelated() {
      try {
        const q = query(
          collection(db, 'blogs'),
          orderBy('date', 'desc'),
          limit(20)
        );
        const snap = await getDocs(q);
        const all = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(b => b.published && b.id !== post.id && b.exams?.some(e => post.exams.includes(e)));
        setRelatedPosts(all.slice(0, 3));
      } catch (err) {
        console.error('Error fetching related posts:', err);
      }
    }
    fetchRelated();
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <img src="/logo-light.png" alt="Udaan Vidyapeeth" className="h-10 object-contain opacity-60" />
        <div className="w-6 h-6 rounded-full border-3 border-brand-blue border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6 py-20">
            <h1 className="font-heading font-bold text-3xl text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">This blog post may have been removed or the URL might be incorrect.</p>
            <Link to="/blog" className="bg-brand-blue hover:bg-brand-dark text-white rounded-full px-8 py-3 font-heading font-semibold transition shadow-md">
              Browse All Articles
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pageTitle = `${post.title} — Udaan Vidyapeeth`;
  const plainBody = stripHtml(post.body);
  const metaDescription = post.metaDescription || plainBody.slice(0, 155) + (plainBody.length > 155 ? '...' : '');
  const canonicalUrl = `https://udaanvidyapeeth.com/blog/${post.slug || post.id}`;
  const publishDate = post.date?.toDate?.() ? post.date.toDate().toISOString() : new Date().toISOString();
  const displayDate = post.date?.toDate?.()
    ? post.date.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  // JSON-LD structured data for search engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": metaDescription,
    "image": post.thumbnail || "https://udaanvidyapeeth.com/og-image.png",
    "author": {
      "@type": "Organization",
      "name": "Udaan Vidyapeeth"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Udaan Vidyapeeth",
      "logo": {
        "@type": "ImageObject",
        "url": "https://udaanvidyapeeth.com/logo-light.png"
      }
    },
    "datePublished": publishDate,
    "dateModified": publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "wordCount": plainBody.split(/\s+/).length,
    "timeRequired": `PT${post.readTime || 5}M`
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        {post.thumbnail && <meta property="og:image" content={post.thumbnail} />}
        <meta property="og:site_name" content="Udaan Vidyapeeth" />
        <meta property="article:published_time" content={publishDate} />
        {post.exams?.map((exam, i) => (
          <meta key={i} property="article:tag" content={exam} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={metaDescription} />
        {post.thumbnail && <meta name="twitter:image" content={post.thumbnail} />}

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />

      {/* Article Header */}
      <header className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto max-w-3xl px-6 pt-12 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-8">
            <Link to="/" className="hover:text-brand-blue transition">Home</Link>
            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            <Link to="/blog" className="hover:text-brand-blue transition">Blog</Link>
            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-700 truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Exam Tags */}
          {post.exams && post.exams.length > 0 && (
            <div className="flex gap-2 mb-5 flex-wrap">
              {post.exams.map((e, i) => (
                <span key={i} className="text-[11px] font-bold tracking-wider text-brand-blue uppercase bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-sm">{e}</span>
              ))}
            </div>
          )}

          <h1 className="font-heading font-extrabold text-3xl md:text-[42px] md:leading-[1.15] text-gray-900 mb-6">{post.title}</h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <span>Udaan Vidyapeeth</span>
            </div>
            {displayDate && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <time dateTime={publishDate}>{displayDate}</time>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{post.readTime || 5} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="container mx-auto max-w-3xl px-6 -mt-1">
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm my-8">
            <img src={post.thumbnail} alt={post.title} className="w-full h-auto max-h-[450px] object-cover" />
          </div>
        </div>
      )}

      {/* Article Body */}
      <article className="container mx-auto max-w-3xl px-6 py-8">
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>

      {/* Divider */}
      <div className="container mx-auto max-w-3xl px-6">
        <hr className="border-gray-100 my-6" />
      </div>

      {/* CTA Section */}
      <section className="container mx-auto max-w-3xl px-6 py-8">
        <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl p-8 text-center">
          <h2 className="font-heading font-bold text-2xl text-gray-900 mb-3">Need expert guidance?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">Book a free 20-minute counselling call with our experts. We'll help you pick the right college based on your rank.</p>
          <Link to="/contact" className="inline-block bg-brand-blue hover:bg-brand-dark text-white rounded-full px-8 py-3.5 font-heading font-semibold transition shadow-md hover:shadow-lg">
            Book Free Call
          </Link>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16 px-6 border-t border-gray-100 mt-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(b => (
                <Link key={b.id} to={`/blog/${b.slug || b.id}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col group">
                  {b.thumbnail ? (
                    <img src={b.thumbnail} alt={b.title} className="w-full h-44 object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-44 bg-brand-light flex items-center justify-center text-brand-blue font-heading font-bold opacity-70 group-hover:scale-105 transition duration-500">
                      Udaan Vidyapeeth
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex gap-1.5 mb-2 flex-wrap">
                      {b.exams?.map((e, idx) => (
                        <span key={idx} className="text-[10px] font-bold tracking-wider text-brand-blue uppercase bg-brand-light px-2 py-0.5 rounded-sm">{e}</span>
                      ))}
                    </div>
                    <h3 className="font-heading font-semibold text-base text-gray-900 group-hover:text-brand-blue transition line-clamp-2">{b.title}</h3>
                    <div className="mt-auto pt-3 text-xs text-gray-500 font-medium">
                      {b.readTime || 5} min read
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
