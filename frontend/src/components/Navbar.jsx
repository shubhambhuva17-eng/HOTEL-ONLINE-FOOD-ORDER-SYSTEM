import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, BellRing, UserCheck, QrCode } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CallWaiterModal from './CallWaiterModal';
import LiveActivityTicker from './LiveActivityTicker';

export default function Navbar({ onOpenCart }) {
  const { tableNumber, totalItemsCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const location = useLocation();

  const isManagerRoute = location.pathname.startsWith('/manager');

  return (
    <>
      <header className="navbar" style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <div className="container">
          <div className="navbar-content">
            {/* Brand Logo & Name */}
            <Link to={isManagerRoute ? "/manager/dashboard" : "/"} className="brand-link">
              <div className="brand-logo" style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                transition: 'transform 0.2s ease'
              }}>
                <UtensilsCrossed size={22} />
              </div>
              <div>
                <div className="brand-name" style={{ letterSpacing: '-0.02em', fontWeight: '800' }}>MADHAV DINING HALL</div>
                <div className="brand-tag">Royal Dining & Contactless Ordering</div>
              </div>
            </Link>

            {/* Action Bar */}
            <div className="nav-actions">
              {!isManagerRoute ? (
                <>
                  {/* Table Pill with Live Pulse Dot */}
                  <Link to="/" className="table-pill" title="Click to change dining table" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="live-dot-green" style={{ width: '7px', height: '7px' }}></span>
                    <QrCode size={15} />
                    <span>Table #{tableNumber}</span>
                  </Link>

                  {/* Call Waiter / Service */}
                  <button
                    onClick={() => setShowWaiterModal(true)}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8125rem' }}
                    title="Call waiter or request assistance"
                  >
                    <BellRing size={16} style={{ color: '#d97706' }} />
                    <span style={{ display: 'none', smDisplay: 'inline' }}>Call Staff</span>
                  </button>

                  {/* Cart Button */}
                  <button
                    onClick={onOpenCart}
                    className="cart-btn"
                    aria-label="View Cart"
                  >
                    <ShoppingBag size={18} />
                    <span>Cart</span>
                    {totalItemsCount > 0 && (
                      <span className="cart-badge">{totalItemsCount}</span>
                    )}
                  </button>

                  {/* Manager portal link */}
                  <Link
                    to={isAuthenticated ? "/manager/dashboard" : "/manager/login"}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.8125rem' }}
                    title="Staff & Manager Portal"
                  >
                    <UserCheck size={16} />
                    <span style={{ display: 'none', mdDisplay: 'inline' }}>
                      {isAuthenticated ? "Manager" : "Staff"}
                    </span>
                  </Link>
                </>
              ) : (
                /* Manager Navigation Links */
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Link to="/manager/dashboard" className="btn btn-outline" style={{ fontSize: '0.8125rem' }}>
                    Dashboard
                  </Link>
                  <Link to="/manager/orders" className="btn btn-outline" style={{ fontSize: '0.8125rem' }}>
                    Orders
                  </Link>
                  <Link to="/manager/menu" className="btn btn-outline" style={{ fontSize: '0.8125rem' }}>
                    Menu
                  </Link>
                  <Link to="/manager/tables" className="btn btn-outline" style={{ fontSize: '0.8125rem' }}>
                    Tables & QR
                  </Link>
                  <Link to="/" className="btn btn-primary" style={{ fontSize: '0.8125rem' }}>
                    Customer View
                  </Link>
                  {isAuthenticated && (
                    <button onClick={logout} className="btn btn-danger" style={{ fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}>
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Live Activity Ticker for Customers */}
      {!isManagerRoute && <LiveActivityTicker />}

      {/* Call Waiter Modal */}
      {showWaiterModal && (
        <CallWaiterModal
          tableNumber={tableNumber}
          onClose={() => setShowWaiterModal(false)}
        />
      )}
    </>
  );
}
