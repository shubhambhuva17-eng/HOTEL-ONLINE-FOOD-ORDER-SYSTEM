import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Utensils, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const {
    tableNumber,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    totalAmount,
    customerInfo,
    setCustomerInfo,
    placeOrder
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const order = await placeOrder();
      onClose();
      navigate(`/order-status/${order.id || order.order_number}`);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Table #{tableNumber} Order</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {cart.length} item{cart.length === 1 ? '' : 's'} in your cart
            </p>
          </div>
          <button onClick={onClose} className="close-btn" aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="drawer-content">
          {error && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              fontSize: '0.8125rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'var(--text-muted)'
              }}>
                <ShoppingBag size={32} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Your cart is empty
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Browse our delicious menu and add items to your table.
              </p>
              <button onClick={onClose} className="btn btn-primary">
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: 'var(--bg-main)',
                      borderRadius: '12px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <img
                      src={item.image_url || '/images/paneer-butter-masala.jpg'}
                      alt={item.name}
                      onError={(e) => { e.target.src = '/images/paneer-butter-masala.jpg'; }}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ₹{item.price} x {item.quantity} = <strong>₹{item.price * item.quantity}</strong>
                      </div>
                      {item.special_instructions && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--primary-dark)' }}>
                          <em>{item.special_instructions}</em>
                        </div>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <div className="qty-control" style={{ transform: 'scale(0.85)' }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="qty-btn"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="close-btn"
                        title="Remove"
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Details Form */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--secondary)' }}>
                  Guest Information
                </h4>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label">Your Name (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g., Alex Johnson"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label">Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="For SMS order alerts"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Table Special Request</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g., Serve food hot together"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Calculation & Place Order CTA */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Items Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>GST & Service Taxes (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '700',
                fontSize: '1.125rem',
                color: 'var(--secondary)',
                borderTop: '1px dashed var(--border)',
                paddingTop: '0.5rem',
                marginTop: '0.25rem'
              }}>
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn btn-primary btn-full"
              style={{ padding: '0.875rem', fontSize: '1rem' }}
            >
              {loading ? (
                <span>Sending to Kitchen...</span>
              ) : (
                <>
                  <Utensils size={18} />
                  <span>Place Order for Table #{tableNumber}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
