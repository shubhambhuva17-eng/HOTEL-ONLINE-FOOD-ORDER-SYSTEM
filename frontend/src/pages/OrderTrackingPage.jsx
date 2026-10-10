import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, ChefHat, Bell, Utensils, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const { tableNumber } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrder = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const data = await api.getOrderById(orderId);
      if (data) {
        setOrder(data);
      }
    } catch (err) {
      console.error('Failed to load order', err);
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Auto polling every 4 seconds
    const interval = setInterval(() => {
      fetchOrder();
    }, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  const stages = [
    { key: 'pending', label: 'Order Placed', desc: 'Sent to restaurant kitchen', icon: Clock },
    { key: 'preparing', label: 'In Kitchen', desc: 'Chef is cooking your meal', icon: ChefHat },
    { key: 'ready', label: 'Ready to Serve', desc: 'Plated & being brought to table', icon: Bell },
    { key: 'served', label: 'Delivered', desc: 'Enjoy your delicious food!', icon: CheckCircle2 }
  ];

  const getStageIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'served':
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentStageIndex = getStageIndex(order?.status);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Retrieving your order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 1rem' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Order Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          We could not locate order details for reference #{orderId}.
        </p>
        <Link to="/menu" className="btn btn-primary">
          Return to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '720px', paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Back button & Refresh button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <Link to="/menu" className="btn btn-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8125rem' }}>
          <ArrowLeft size={16} />
          <span>Menu</span>
        </Link>
        <button
          onClick={() => fetchOrder(true)}
          className="btn btn-outline"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8125rem' }}
          disabled={isRefreshing}
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Checking...' : 'Refresh Status'}</span>
        </button>
      </div>

      {/* Main Status Hero Card */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
        padding: '2rem',
        marginBottom: '1.5rem'
      }}>
        {/* Header with Table and Order # */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary-dark)', letterSpacing: '0.05em' }}>
              Table #{order.table_number || tableNumber}
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.25rem 0 0', color: 'var(--secondary)' }}>
              Order #{order.order_number || order.id}
            </h1>
          </div>
          <span className={`badge badge-${order.status || 'pending'}`} style={{ fontSize: '0.875rem', padding: '0.4rem 0.85rem' }}>
            {order.status || 'pending'}
          </span>
        </div>

        {/* Live Stepper with Pulsing Active Step */}
        <div style={{ margin: '2rem 0', position: 'relative' }}>
          {/* Background Track Line */}
          <div style={{
            position: 'absolute',
            top: '22px',
            left: '12%',
            right: '12%',
            height: '4px',
            background: '#e2e8f0',
            zIndex: 0
          }}>
            <div style={{
              width: `${(currentStageIndex / 3) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 100%)',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isPassed = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.key} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    margin: '0 auto 0.75rem',
                    backgroundColor: isPassed ? (isCurrent ? '#f59e0b' : '#10b981') : '#f8fafc',
                    color: isPassed ? 'white' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `3px solid ${isPassed ? (isCurrent ? '#d97706' : '#059669') : '#e2e8f0'}`,
                    boxShadow: isCurrent ? '0 0 0 8px rgba(245, 158, 11, 0.25), 0 8px 16px rgba(245, 158, 11, 0.3)' : (isPassed ? '0 4px 10px rgba(16, 185, 129, 0.25)' : 'none'),
                    animation: isCurrent ? 'pulseLiveAmber 2s infinite' : 'none',
                    transition: 'all 0.35s'
                  }}>
                    <Icon size={22} />
                  </div>
                  <div style={{
                    fontWeight: isPassed ? '800' : '500',
                    fontSize: '0.8125rem',
                    color: isPassed ? 'var(--text-main)' : 'var(--text-muted)'
                  }}>
                    {stage.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                    {stage.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Callout Box */}
        <div style={{
          backgroundColor: currentStageIndex === 3 ? '#dcfce7' : '#fef3c7',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginTop: '1.5rem'
        }}>
          <Clock size={20} color={currentStageIndex === 3 ? '#16a34a' : '#d97706'} />
          <div style={{ fontSize: '0.875rem', color: currentStageIndex === 3 ? '#166534' : '#92400e' }}>
            {currentStageIndex === 0 && 'We have received your order. The chef is reviewing your request.'}
            {currentStageIndex === 1 && 'Your dishes are sizzling in the kitchen! Estimated delivery in ~12-15 mins.'}
            {currentStageIndex === 2 && 'Your dishes are freshly prepared and plated. Server is heading to your table.'}
            {currentStageIndex === 3 && 'Order served! We hope you have a fantastic meal at Madhav Dining Hall.'}
          </div>
        </div>
      </div>

      {/* Order Items List */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        padding: '1.75rem',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem' }}>
          Dishes in this Order
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {(order.items || []).map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.625rem 0',
                borderBottom: index < order.items.length - 1 ? '1px solid var(--border)' : 'none'
              }}
            >
              <div>
                <span style={{ fontWeight: '600', fontSize: '0.9375rem' }}>
                  {item.item_name || item.name}
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  x{item.quantity}
                </span>
                {item.special_instructions && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-dark)' }}>
                    Note: {item.special_instructions}
                  </div>
                )}
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.9375rem' }}>
                ₹{Number(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Total breakdown */}
        <div style={{
          borderTop: '2px dashed var(--border)',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1.125rem' }}>Total Bill</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Status: <strong>{order.payment_status || 'Unpaid'}</strong>
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
            ₹{Number(order.total_amount).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Link to="/menu" className="btn btn-primary" style={{ flex: 1, padding: '0.875rem' }}>
          <Utensils size={18} />
          <span>Order More Dishes</span>
        </Link>
      </div>
    </div>
  );
}
