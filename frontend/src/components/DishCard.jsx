import React, { useState } from 'react';
import { Plus, Minus, Clock, Edit3, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function DishCard({ item }) {
  const { cart, addToCart, updateQuantity, updateInstructions } = useCart();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  const cartItem = cart.find((ci) => ci.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleOpenNotes = () => {
    setNoteInput(cartItem?.special_instructions || '');
    setShowNoteModal(true);
  };

  const handleAdd = () => {
    addToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    if (quantity > 0) {
      updateInstructions(item.id, noteInput);
    } else {
      addToCart(item, noteInput);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
    setShowNoteModal(false);
  };

  return (
    <>
      <div className="food-card">
        {/* Dish Image */}
        <div className="card-img-container">
          <img
            src={item.image_url || '/images/paneer-butter-masala.jpg'}
            alt={item.name}
            className="card-img"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/images/paneer-butter-masala.jpg';
            }}
          />

          {/* Dietary Indicator (Veg / Non-Veg) */}
          <div className="card-diet-badge" title={item.is_veg ? 'Pure Vegetarian' : 'Non-Vegetarian'}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: item.is_veg ? '50%' : '2px',
                backgroundColor: item.is_veg ? 'var(--veg)' : 'var(--non-veg)',
                boxShadow: item.is_veg ? '0 0 6px rgba(34, 197, 94, 0.6)' : '0 0 6px rgba(220, 38, 38, 0.6)'
              }}
            />
          </div>

          {/* Quick Price Tag Pill on Image */}
          <div className="card-price-overlay">
            ₹{Number(item.price).toFixed(0)}
          </div>

          {!item.is_available && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Sold Out
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="card-body">
          <div className="card-title-row">
            <h3 className="card-title">{item.name}</h3>
            <span className="card-price">₹{Number(item.price).toFixed(0)}</span>
          </div>

          <p className="card-desc">{item.description}</p>

          {cartItem?.special_instructions && (
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--primary-dark)',
              backgroundColor: 'var(--primary-light)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <em>Note: {cartItem.special_instructions}</em>
            </div>
          )}

          {/* Footer with Prep Time & Cart Controls */}
          <div className="card-footer">
            <div className="prep-time">
              <Clock size={14} />
              <span>{item.prep_time_minutes || 15} mins</span>
            </div>

            {item.is_available === false ? (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unavailable</span>
            ) : quantity > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={handleOpenNotes}
                  className="qty-btn"
                  title="Edit customization note"
                  style={{ borderRadius: '50%', background: '#f1f5f9' }}
                >
                  <Edit3 size={13} />
                </button>
                <div className="qty-control">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    className="qty-btn"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    className="qty-btn"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={handleOpenNotes}
                  className="qty-btn"
                  title="Add with instructions"
                  style={{ borderRadius: '50%', background: '#f1f5f9' }}
                >
                  <Edit3 size={13} />
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="add-btn"
                  style={{
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    backgroundColor: justAdded ? '#16a34a' : undefined,
                    color: justAdded ? '#ffffff' : undefined,
                    transform: justAdded ? 'scale(1.06)' : undefined,
                    boxShadow: justAdded ? '0 4px 12px rgba(22, 163, 74, 0.35)' : undefined
                  }}
                >
                  {justAdded ? (
                    <>
                      <Check size={16} />
                      <span>ADDED!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>ADD</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Special Instruction Modal */}
      {showNoteModal && (
        <div className="drawer-backdrop" style={{ justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '400px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              Custom Instructions
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              For <strong>{item.name}</strong>
            </p>

            <form onSubmit={handleSaveNotes}>
              <div className="form-group">
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="E.g., Less spicy, no onions, extra crispy, sauce on the side..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  Save & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
