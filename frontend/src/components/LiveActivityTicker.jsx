import React from 'react';
import { Sparkles, ChefHat, Clock, Flame, BellRing } from 'lucide-react';

export default function LiveActivityTicker() {
  const highlights = [
    { icon: <ChefHat size={14} className="text-amber-500" />, text: "Live Kitchen Active: All 12 tables connected in real-time" },
    { icon: <Flame size={14} className="text-orange-500" />, text: "Today's Special: Authentic Gujarati Unlimited Thali with Chilled Chaas" },
    { icon: <Clock size={14} className="text-emerald-500" />, text: "Fast Table Service: Freshly prepared dishes in 10-15 minutes" },
    { icon: <Sparkles size={14} className="text-amber-500" />, text: "Madhav Dining Hall: 100% Pure Vegetarian (Shuddh Shakahari) & Authentic Taste" },
    { icon: <BellRing size={14} className="text-blue-500" />, text: "Contactless QR Ordering: Customize notes & track cooking status" }
  ];

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#cbd5e1',
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.35rem 1rem',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
      position: 'relative',
      zIndex: 30
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2.5rem',
        animation: 'tickerScroll 35s linear infinite',
        width: 'max-content'
      }}>
        {[...highlights, ...highlights].map((item, idx) => (
          <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
            <span>{item.text}</span>
            <span style={{ color: '#f59e0b', margin: '0 0.5rem', opacity: 0.6 }}>&bull;</span>
          </div>
        ))}
      </div>
    </div>
  );
}
