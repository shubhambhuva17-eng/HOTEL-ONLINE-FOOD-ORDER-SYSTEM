import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { QrCode, CheckCircle2 } from 'lucide-react';

export default function TableQRPage() {
  const { tableNumber } = useParams();
  const navigate = useNavigate();
  const { setTableNumber } = useCart();

  useEffect(() => {
    if (tableNumber) {
      setTableNumber(tableNumber);
      const timer = setTimeout(() => {
        navigate('/menu');
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [tableNumber, navigate, setTableNumber]);

  return (
    <div className="container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: '#dcfce7',
        color: '#16a34a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <CheckCircle2 size={40} />
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--secondary)' }}>
        Table #{tableNumber} Identified
      </h1>

      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
        Opening digital menu for Table #{tableNumber}...
      </p>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', fontWeight: '600' }}>
        <QrCode size={18} />
        <span>Loading contactless dining portal</span>
      </div>
    </div>
  );
}
