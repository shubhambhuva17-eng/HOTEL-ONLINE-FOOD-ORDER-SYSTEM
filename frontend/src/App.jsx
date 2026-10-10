import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';

// Customer Pages
import CustomerHome from './pages/CustomerHome';
import MenuPage from './pages/MenuPage';
import TableQRPage from './pages/TableQRPage';
import OrderTrackingPage from './pages/OrderTrackingPage';

// Manager Pages
import ManagerLogin from './pages/manager/ManagerLogin';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import OrdersManager from './pages/manager/OrdersManager';
import MenuManager from './pages/manager/MenuManager';
import TableManager from './pages/manager/TableManager';

// Protected Route for Manager Portal
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/manager/login" replace />;
  }
  return children;
}

function MainLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Customer Side */}
          <Route path="/" element={<CustomerHome />} />
          <Route path="/table/:tableNumber" element={<TableQRPage />} />
          <Route path="/menu" element={<MenuPage onOpenCart={() => setIsCartOpen(true)} />} />
          <Route path="/order-status/:orderId" element={<OrderTrackingPage />} />

          {/* Manager Side */}
          <Route path="/manager/login" element={<ManagerLogin />} />
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/orders"
            element={
              <ProtectedRoute>
                <OrdersManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/menu"
            element={
              <ProtectedRoute>
                <MenuManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/tables"
            element={
              <ProtectedRoute>
                <TableManager />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <footer style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        padding: '2rem 1rem',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
        textAlign: 'center',
        fontSize: '0.8125rem'
      }}>
        <div className="container">
          <p style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.9375rem', marginBottom: '0.35rem' }}>
            MADHAV DINING HALL • Hotel Food Ordering System
          </p>
          <p>
            Scan Table QR • Contactless Menu • Kitchen Management System
          </p>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
