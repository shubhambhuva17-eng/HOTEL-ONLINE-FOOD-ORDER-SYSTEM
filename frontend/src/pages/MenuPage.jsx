import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Sparkles, Utensils, AlertCircle, ShoppingBag, Clock } from 'lucide-react';
import DishCard from '../components/DishCard';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function MenuPage({ onOpenCart }) {
  const { tableNumber, activeOrder, totalItemsCount } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Starters', 'Main Course', 'Breads & Rice', 'Desserts', 'Beverages'];

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await api.getMenu();
      setMenuItems(data || []);
    } catch (err) {
      console.error('Failed to load menu', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter dishes
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '5rem' }}>
      {/* Table Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        color: 'white',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b',
            fontWeight: '800',
            fontSize: '1.125rem'
          }}>
            T-{tableNumber}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
              Current Dining Table
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff' }}>
              Table #{tableNumber} Menu
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {activeOrder && (
            <Link
              to={`/order-status/${activeOrder.id || activeOrder.order_number}`}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
            >
              <Clock size={16} />
              <span>Track Live Order</span>
            </Link>
          )}
          <Link
            to="/"
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', color: 'white', borderColor: 'rgba(255,255,255,0.2)', background: 'transparent' }}
          >
            Switch Table
          </Link>
        </div>
      </div>

      {/* Search & Dietary Filters Row */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        marginBottom: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '480px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search appetizers, curries, drinks, desserts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 100% Pure Vegetarian Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#dcfce7',
          border: '1px solid #86efac',
          padding: '0.45rem 1rem',
          borderRadius: 'var(--radius-full)',
          color: '#15803d',
          fontWeight: '700',
          fontSize: '0.8125rem',
          boxShadow: '0 2px 6px rgba(22, 163, 74, 0.12)'
        }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#16a34a',
            boxShadow: '0 0 6px rgba(22, 163, 74, 0.6)'
          }} />
          <span>🌿 100% Pure Vegetarian Menu</span>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="category-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Dishes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading delectable dishes...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          marginTop: '1.5rem'
        }}>
          <AlertCircle size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>No dishes found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Try resetting your search query or changing category filters.
          </p>
        </div>
      ) : (
        <div className="food-grid">
          {filteredItems.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Floating Bottom Cart Bar (Mobile friendly & Animated) */}
      {totalItemsCount > 0 && (
        <div className="floating-cart-bar" onClick={onOpenCart}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              background: 'var(--primary)',
              color: 'var(--secondary)',
              borderRadius: '50%',
              width: '2.25rem',
              height: '2.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '0.9rem',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.6)'
            }}>
              {totalItemsCount}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Table Cart Ready</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tap to review & send to kitchen</div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-shimmer"
            style={{ padding: '0.5rem 1.15rem', fontSize: '0.875rem', borderRadius: '9999px', fontWeight: '700' }}
          >
            <span>View Cart</span>
          </button>
        </div>
      )}
    </div>
  );
}
