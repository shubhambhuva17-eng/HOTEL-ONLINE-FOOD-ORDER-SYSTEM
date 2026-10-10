import React, { useState, useEffect } from 'react';
import {
  Clock,
  ChefHat,
  Bell,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Filter,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { api } from '../../services/api';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // 'active', 'all', 'pending', 'preparing', 'ready', 'completed'
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      // Update local state immediately
      setOrders((prev) =>
        prev.map((o) => (String(o.id) === String(orderId) ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const status = order.status?.toLowerCase() || 'pending';
    if (filter === 'all') return true;
    if (filter === 'active') return ['pending', 'preparing', 'ready'].includes(status);
    return status === filter;
  });

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    return <span className={`badge badge-${s}`}>{s}</span>;
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--secondary)', margin: 0 }}>
            Live Kitchen & Floor Orders
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Real-time Order Queue • 1-Click Status Progression
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="btn btn-outline"
          style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
        >
          <RefreshCw size={14} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        {[
          { key: 'active', label: 'Active Orders' },
          { key: 'pending', label: 'New / Pending' },
          { key: 'preparing', label: 'Cooking' },
          { key: 'ready', label: 'Ready to Serve' },
          { key: 'completed', label: 'Completed' },
          { key: 'all', label: 'All Orders' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`category-tab ${filter === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          Loading active orders queue...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid var(--border)'
        }}>
          <AlertCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>
            No orders in this view
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Orders placed from the customer web app will appear here in real time.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredOrders.map((order) => {
            const status = order.status?.toLowerCase() || 'pending';
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  border: `2px solid ${
                    status === 'pending'
                      ? '#f59e0b'
                      : status === 'preparing'
                      ? '#0284c7'
                      : status === 'ready'
                      ? '#16a34a'
                      : 'var(--border)'
                  }`,
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                {/* Order Card Header */}
                <div style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--bg-main)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        background: '#0f172a',
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '0.8125rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px'
                      }}>
                        Table #{order.table_number || order.table_id}
                      </span>
                      <span style={{ fontWeight: '700', fontSize: '0.9375rem' }}>
                        {order.order_number || `#${order.id}`}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Guest: {order.customer_name || 'Diner'} {order.customer_phone ? `(${order.customer_phone})` : ''}
                    </div>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Items List */}
                <div style={{ padding: '1.25rem', flexGrow: 1 }}>
                  {order.notes && (
                    <div style={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      marginBottom: '0.75rem',
                      fontWeight: '600'
                    }}>
                      Table Note: {order.notes}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {(order.items || []).map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          fontSize: '0.875rem',
                          paddingBottom: '0.35rem',
                          borderBottom: idx < order.items.length - 1 ? '1px dashed #f1f5f9' : 'none'
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: '700', color: 'var(--secondary)' }}>
                            {item.quantity}x
                          </span>{' '}
                          <span>{item.item_name || item.name}</span>
                          {item.special_instructions && (
                            <div style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: '500' }}>
                              → {item.special_instructions}
                            </div>
                          )}
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total Amount */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border)',
                    fontWeight: '700',
                    fontSize: '1rem'
                  }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--primary-dark)' }}>
                      ₹{Number(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div style={{
                  padding: '0.875rem 1.25rem',
                  backgroundColor: '#f8fafc',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  {status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'preparing')}
                      disabled={isUpdating}
                      className="btn btn-primary btn-full"
                    >
                      <ChefHat size={16} />
                      <span>Accept & Start Cooking</span>
                    </button>
                  )}

                  {status === 'preparing' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'ready')}
                      disabled={isUpdating}
                      className="btn btn-full"
                      style={{ backgroundColor: '#0284c7', color: 'white' }}
                    >
                      <Bell size={16} />
                      <span>Mark Ready to Serve</span>
                    </button>
                  )}

                  {status === 'ready' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'served')}
                      disabled={isUpdating}
                      className="btn btn-full"
                      style={{ backgroundColor: '#16a34a', color: 'white' }}
                    >
                      <CheckCircle2 size={16} />
                      <span>Mark Delivered to Table</span>
                    </button>
                  )}

                  {status === 'served' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                      disabled={isUpdating}
                      className="btn btn-dark btn-full"
                    >
                      <DollarSign size={16} />
                      <span>Complete & Bill Paid</span>
                    </button>
                  )}

                  {['pending', 'preparing'].includes(status) && (
                    <button
                      onClick={() => {
                        if (confirm('Cancel this order?')) {
                          handleUpdateStatus(order.id, 'cancelled');
                        }
                      }}
                      disabled={isUpdating}
                      className="btn btn-danger"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', marginLeft: 'auto' }}
                    >
                      <XCircle size={14} />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
