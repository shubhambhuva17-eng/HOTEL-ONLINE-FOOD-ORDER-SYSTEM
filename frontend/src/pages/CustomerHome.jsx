import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, UtensilsCrossed, ArrowRight, Sparkles, ChefHat, Clock, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CustomerHome() {
  const navigate = useNavigate();
  const { tableNumber, setTableNumber } = useCart();
  const [selected, setSelected] = useState(tableNumber || '1');
  const [customTable, setCustomTable] = useState('');

  const quickTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const handleSelectTable = (num) => {
    setSelected(String(num));
    setTableNumber(String(num));
  };

  const handleProceed = (e) => {
    e.preventDefault();
    const finalTable = customTable.trim() ? customTable.trim() : selected;
    setTableNumber(finalTable);
    navigate('/menu');
  };

  return (
    <div style={{ flex: 1, paddingBottom: '3.5rem' }}>
      {/* Hero Section with Modern Animated Glow */}
      <section style={{
        background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 70%, #020617 100%)',
        color: 'white',
        padding: '3.5rem 1rem 4.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Ambient Decorative Glow Orbs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          {/* Live Kitchen Badge */}
          <div className="live-badge-glow" style={{ marginBottom: '1.25rem', animation: 'floatBadge 4s ease-in-out infinite' }}>
            <span className="live-dot-green"></span>
            <span>Live Kitchen Active &bull; 100% Pure Vegetarian &bull; Instant Table QR</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '1rem',
            color: '#ffffff',
            letterSpacing: '-0.025em'
          }}>
            Royal Dining Experience, <span style={{ color: '#f59e0b', textShadow: '0 0 25px rgba(245, 158, 11, 0.35)' }}>Right at Your Table</span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#94a3b8',
            maxWidth: '620px',
            margin: '0 auto 2.25rem',
            lineHeight: '1.6'
          }}>
            Welcome to <strong>Madhav Dining Hall</strong>. Select your dining table below to explore our chef-crafted menu, customize your order, and receive real-time preparation updates.
          </p>

          {/* Table Picker Card with Glass Panel */}
          <div className="glass-panel hover-lift" style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2.25rem',
            color: '#0f172a',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(245, 158, 11, 0.2)',
            maxWidth: '580px',
            margin: '0 auto',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{
                background: '#fef3c7',
                padding: '0.6rem',
                borderRadius: '14px',
                color: '#d97706',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <QrCode size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--secondary)' }}>Select Your Table Number</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Matches the QR standee on your dining table
                </p>
              </div>
            </div>

            {/* Quick table buttons with animated pop */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.625rem',
              marginBottom: '1.5rem'
            }}>
              {quickTables.map((num) => {
                const isCurrent = String(num) === String(selected);
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectTable(num)}
                    style={{
                      padding: '0.85rem 0.5rem',
                      borderRadius: '12px',
                      border: `2px solid ${isCurrent ? '#f59e0b' : '#e2e8f0'}`,
                      backgroundColor: isCurrent ? '#fef3c7' : '#ffffff',
                      color: isCurrent ? '#b45309' : '#1e293b',
                      fontWeight: isCurrent ? '800' : '600',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: isCurrent ? '0 6px 16px rgba(245, 158, 11, 0.25)' : 'none',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    T-{num}
                  </button>
                );
              })}
            </div>

            {/* Custom table input */}
            <form onSubmit={handleProceed}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.825rem' }}>
                  Or enter custom table / cabin #
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="E.g., 15 or VIP-1"
                  value={customTable}
                  onChange={(e) => setCustomTable(e.target.value)}
                  style={{ borderRadius: '12px', padding: '0.75rem 1rem' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full btn-shimmer"
                style={{
                  padding: '0.95rem',
                  fontSize: '1.02rem',
                  fontWeight: '800',
                  borderRadius: '14px',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <span>View Menu for Table #{customTable.trim() || selected}</span>
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container" style={{ marginTop: '3rem', maxWidth: '1000px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <ChefHat size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>Freshly Prepared</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Direct kitchen connectivity ensures your orders are prepared immediately with custom taste preferences.
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Clock size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>Live Order Status</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Track real-time cooking progress from your phone without needing to wave down waiters.
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>Contactless & Safe</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              100% digital table ordering with item notes, request waiter service, and instant billing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
