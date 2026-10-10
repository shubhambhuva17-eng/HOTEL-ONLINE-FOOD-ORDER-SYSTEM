import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  QrCode,
  DollarSign,
  UtensilsCrossed,
  CheckCircle2,
  Calendar,
  BarChart3,
  Award,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Check,
  Percent,
  SlidersHorizontal
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('daily'); // 'daily', 'monthly', 'yearly', 'all'
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historySearch, setHistorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalytics(period, '2026-10-09');
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const summary = analytics?.summary || {
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    activeOrders: 0,
    cancelledOrders: 0,
    avgOrderValue: 0
  };

  const chartData = analytics?.chartData || [];
  const topDishes = analytics?.topDishes || [];
  const tableSales = analytics?.tableSales || [];
  const recentOrders = analytics?.recentOrders || [];

  // Filter recent orders in table
  const filteredOrders = recentOrders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status?.toLowerCase() === statusFilter.toLowerCase();
    const query = historySearch.toLowerCase();
    const matchesSearch =
      !historySearch ||
      (o.order_number && o.order_number.toLowerCase().includes(query)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(query)) ||
      String(o.table_number).includes(query);
    return matchesStatus && matchesSearch;
  });

  // Calculate highest revenue in chart for proportional bar heights
  const maxChartRevenue = Math.max(...chartData.map((d) => d.revenue || 0), 100);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Top Banner & Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-dark)', fontSize: '0.8125rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            <BarChart3 size={16} />
            <span>Executive Business Analytics</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)', margin: 0 }}>
            Madhav Dining Hall Control Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Welcome back, {user?.name || 'Manager'} • Persistent Performance Tracking & Order History
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="live-badge-glow">
            <span className="live-dot-green"></span>
            <span>Real-time Sync &bull; Persistent Storage</span>
          </div>
          <button
            onClick={loadAnalytics}
            className="btn btn-outline"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.8125rem' }}
            title="Refresh analytics data"
          >
            <RefreshCw size={14} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Timeframe Selector Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'white',
        padding: '0.75rem 1.25rem',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="var(--primary-dark)" />
          <span style={{ fontWeight: '700', fontSize: '0.9375rem', color: 'var(--secondary)' }}>
            Analytics Timeframe:
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            ({analytics?.periodLabel || 'Current'})
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '12px' }}>
          {[
            { id: 'daily', label: '📅 Daily (Today)' },
            { id: 'monthly', label: '🗓️ Monthly (Oct 2026)' },
            { id: 'yearly', label: '📈 Yearly (2026)' },
            { id: 'all', label: '🌐 All Time' }
          ].map((tab) => {
            const isActive = period === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPeriod(tab.id)}
                style={{
                  border: 'none',
                  padding: '0.45rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'var(--secondary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-main)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* KPI 1: Total Revenue */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {period === 'daily' ? "Today's Revenue" : (period === 'monthly' ? "Monthly Revenue" : "Annual Revenue")}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)' }}>
            ₹{summary.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.35rem', fontWeight: '600' }}>
            ✔ {summary.completedOrders} orders fulfilled
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Orders Volume
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)' }}>
            {summary.totalOrders}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {summary.cancelledOrders} cancelled • {summary.activeOrders} active
          </div>
        </div>

        {/* KPI 3: Average Order Value */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Avg. Order Value (AOV)
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#b45309' }}>
            ₹{summary.avgOrderValue}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Per guest table seating
          </div>
        </div>

        {/* KPI 4: Kitchen Operations */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Kitchen Orders
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: summary.activeOrders > 0 ? '#d97706' : 'var(--secondary)' }}>
            {summary.activeOrders}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            <Link to="/manager/orders" style={{ color: 'var(--primary-dark)', textDecoration: 'none', fontWeight: '600' }}>
              Go to kitchen queue →
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Revenue Trend Bar Chart (Daily / Monthly / Yearly) */}
      {chartData.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--secondary)', margin: 0 }}>
                {period === 'daily' && "Hourly Sales Distribution (Today)"}
                {period === 'monthly' && "Day-by-Day Revenue Trend (This Month)"}
                {period === 'yearly' && "Month-by-Month Annual Revenue (2026)"}
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Track peak ordering spikes, dining hours, and sales turnover
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '12px', height: '12px', background: 'linear-gradient(180deg, #f59e0b, #d97706)', borderRadius: '3px' }} />
                <span>Revenue (₹)</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div style={{
            height: '220px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: period === 'monthly' ? '4px' : '10px',
            paddingTop: '20px',
            borderBottom: '2px solid #e2e8f0',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}>
            {chartData.map((item, idx) => {
              const heightPercent = maxChartRevenue > 0 ? Math.max((item.revenue / maxChartRevenue) * 100, 4) : 4;
              return (
                <div
                  key={idx}
                  style={{
                    flex: '1 1 0',
                    minWidth: period === 'monthly' ? '18px' : '36px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                  title={`${item.label}: ₹${item.revenue} (${item.orders} orders)`}
                >
                  {/* Bar Value Tooltip on Top */}
                  {item.revenue > 0 && (
                    <div style={{
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      color: '#b45309',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap'
                    }}>
                      ₹{item.revenue >= 1000 ? `${(item.revenue / 1000).toFixed(1)}k` : item.revenue}
                    </div>
                  )}

                  {/* Visual Bar */}
                  <div style={{
                    width: '100%',
                    maxWidth: period === 'monthly' ? '16px' : '32px',
                    height: `${heightPercent}%`,
                    background: item.revenue > 0 ? 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)' : '#e2e8f0',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.4s ease-out'
                  }} />

                  {/* Axis Label */}
                  <div style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)',
                    marginTop: '8px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%'
                  }}>
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Row: Top Selling Dishes & Table Utilization */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Top 5 Dishes */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Award size={22} color="#f59e0b" />
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', margin: 0 }}>
                Top-Selling Dishes ({period})
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Highest volume ordered items
              </p>
            </div>
          </div>

          {topDishes.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No items recorded in this timeframe.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {topDishes.map((dish, i) => (
                <div key={i} style={{ borderBottom: i < topDishes.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: i === 0 ? '#fef3c7' : '#f1f5f9',
                        color: i === 0 ? '#b45309' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        {i + 1}
                      </span>
                      <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{dish.name}</span>
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--primary-dark)' }}>
                      ₹{Number(dish.revenue).toFixed(0)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '1.75rem' }}>
                    <span>{dish.quantity} servings ordered</span>
                    <span>₹{dish.price} / serving</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table Seating Revenue Performance */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <QrCode size={22} color="var(--primary-dark)" />
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', margin: 0 }}>
                Table Utilization ({period})
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Dine-in turnover and revenue by table
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem'
          }}>
            {tableSales.slice(0, 12).map((t) => (
              <div
                key={t.table_number}
                style={{
                  background: t.orders > 0 ? '#fef3c7' : '#f8fafc',
                  border: `1px solid ${t.orders > 0 ? '#fde68a' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  padding: '0.625rem 0.35rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '0.8125rem', color: t.orders > 0 ? '#92400e' : '#64748b' }}>
                  T-{t.table_number}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: t.orders > 0 ? '#b45309' : '#94a3b8' }}>
                  ₹{t.revenue.toFixed(0)}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                  {t.orders} ord
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <Link to="/manager/orders" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: 'white',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.2rem' }}>
                Live Kitchen Orders Queue
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                Accept, prepare, and update live orders
              </div>
            </div>
            <ArrowRight size={20} color="#f59e0b" />
          </div>
        </Link>

        <Link to="/manager/menu" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.2rem' }}>
                Menu & Stock Management
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Add dishes, edit prices, toggle stock
              </div>
            </div>
            <ArrowRight size={20} color="var(--primary)" />
          </div>
        </Link>

        <Link to="/manager/tables" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.2rem' }}>
                Table QR Standees
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Print scannable table QR cards
              </div>
            </div>
            <ArrowRight size={20} color="var(--primary)" />
          </div>
        </Link>
      </div>

      {/* Persistent Order History Table */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--secondary)', margin: 0 }}>
              Persistent Order History & Audit Log
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Saved permanently to disk • Survives server restarts and reboots
            </p>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.2rem', paddingRight: '0.5rem', fontSize: '0.8125rem', paddingBlock: '0.4rem' }}
                placeholder="Search orders..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
              />
            </div>

            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.8125rem', paddingBlock: '0.4rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="ready">Ready</option>
              <option value="preparing">Preparing</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No orders match the selected filters.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Order #</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Date & Time</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Table</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Items Ordered</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Total</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Payment</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const dateObj = new Date(order.created_at);
                  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.875rem 0.5rem', fontWeight: '700' }}>
                        {order.order_number || `#${order.id}`}
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        <div>{formattedDate}</div>
                        <div style={{ fontSize: '0.75rem' }}>{formattedTime}</div>
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem' }}>
                        <span className="table-pill" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                          Table #{order.table_number || order.table_id}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem' }}>
                        <div style={{ fontWeight: '600' }}>{order.customer_name || 'Guest'}</div>
                        {order.customer_phone && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customer_phone}</div>
                        )}
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                        {(order.items || []).map((i) => `${i.item_name || i.name} (x${i.quantity})`).join(', ') || 'Dishes'}
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem', fontWeight: '700' }}>
                        ₹{Number(order.total_amount).toFixed(2)}
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem' }}>
                        <span style={{
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: order.payment_status === 'paid' ? '#16a34a' : '#d97706'
                        }}>
                          {order.payment_status === 'paid' ? `✔ Paid (${order.payment_method || 'UPI'})` : 'Unpaid'}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 0.5rem' }}>
                        <span className={`badge badge-${order.status || 'pending'}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
