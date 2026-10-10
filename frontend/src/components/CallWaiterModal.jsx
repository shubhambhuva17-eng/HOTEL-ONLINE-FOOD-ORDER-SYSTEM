import React, { useState } from 'react';
import { Bell, CheckCircle2, Droplets, Receipt, Sparkles, X } from 'lucide-react';

export default function CallWaiterModal({ tableNumber, onClose }) {
  const [selectedType, setSelectedType] = useState('Call Waiter');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);

  const requestOptions = [
    { id: 'Call Waiter', label: 'Call Table Waiter', icon: Bell },
    { id: 'Water', label: 'Request Drinking Water', icon: Droplets },
    { id: 'Bill', label: 'Request the Final Bill', icon: Receipt },
    { id: 'Clean', label: 'Clean / Clear Table', icon: Sparkles }
  ];

  const handleSend = (e) => {
    e.preventDefault();
    setSent(true);
    // Simulates instant notification dispatched to manager/waiter staff
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="drawer-backdrop" style={{ justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        maxWidth: '460px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        <button
          onClick={onClose}
          className="close-btn"
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
          <X size={20} />
        </button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Staff Notified!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              A server is on their way to <strong>Table #{tableNumber}</strong> for <em>"{selectedType}"</em>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: '#fef3c7',
                padding: '0.5rem',
                borderRadius: '10px',
                color: '#d97706'
              }}>
                <Bell size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Request Table Service</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Assistance for Table #{tableNumber}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {requestOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = selectedType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedType(opt.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 0.5rem',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'white',
                      color: isSelected ? 'var(--primary-dark)' : 'var(--text-main)',
                      cursor: 'pointer',
                      fontWeight: isSelected ? '600' : '500',
                      fontSize: '0.8125rem',
                      transition: 'all 0.15s'
                    }}
                  >
                    <IconComponent size={20} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="form-group">
              <label className="form-label">Special Request / Note (Optional)</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="E.g., Extra cutlery, warm water, high chair..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Call Waiter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
