import React, { useState, useEffect } from 'react';
import { QrCode, Printer, ExternalLink, Plus, Users, CheckCircle, Clock } from 'lucide-react';
import QRCode from 'qrcode';
import { api } from '../../services/api';

export default function TableManager() {
  const [tables, setTables] = useState([]);
  const [qrDataUrls, setQrDataUrls] = useState({});
  const [selectedPrintTable, setSelectedPrintTable] = useState(null);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const data = await api.getTables();
      setTables(data || []);
      // Generate QR codes for each table
      const urls = {};
      const origin = window.location.origin;
      for (const t of data) {
        const tableUrl = `${origin}/table/${t.table_number}`;
        const dataUrl = await QRCode.toDataURL(tableUrl, {
          width: 250,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });
        urls[t.table_number] = dataUrl;
      }
      setQrDataUrls(urls);
    } catch (err) {
      console.error('Failed to generate table QR codes', err);
    }
  };

  const handlePrint = (table) => {
    setSelectedPrintTable(table);
    setTimeout(() => {
      window.print();
    }, 300);
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
            Dining Tables & QR Standees
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Generate, download, and print scannable QR codes for every restaurant table
          </p>
        </div>
      </div>

      {/* Tables Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {tables.map((table) => {
          const qrUrl = qrDataUrls[table.table_number];
          const fullTableUrl = `${window.location.origin}/table/${table.table_number}`;

          return (
            <div
              key={table.id || table.table_number}
              style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                padding: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Table Number Pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{
                  fontSize: '1.125rem',
                  fontWeight: '800',
                  color: 'var(--secondary)'
                }}>
                  Table #{table.table_number}
                </span>

                <span style={{
                  background: table.status === 'occupied' ? '#fee2e2' : '#dcfce7',
                  color: table.status === 'occupied' ? '#dc2626' : '#15803d',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {table.status || 'Available'}
                </span>
              </div>

              {/* QR Image */}
              <div style={{
                background: '#fafaf9',
                padding: '0.875rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                marginBottom: '1rem'
              }}>
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt={`QR Code for Table ${table.table_number}`}
                    style={{ width: '160px', height: '160px', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={40} color="var(--text-muted)" />
                  </div>
                )}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem', wordBreak: 'break-all' }}>
                Links to: <a href={fullTableUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-dark)', textDecoration: 'none' }}>
                  /table/{table.table_number}
                </a>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <button
                  type="button"
                  onClick={() => handlePrint(table)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.8125rem' }}
                >
                  <Printer size={15} />
                  <span>Print Standee</span>
                </button>

                <a
                  href={fullTableUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                  title="Simulate scanning this table QR code"
                >
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable QR Standee Modal (Hidden on screen unless printing) */}
      {selectedPrintTable && (
        <div style={{ display: 'none' }} className="print-only">
          <div style={{
            maxWidth: '380px',
            margin: '2rem auto',
            border: '3px solid #0f172a',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff'
          }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              MADHAV DINING HALL
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Authentic Hotel & Dining Experience
            </p>

            <div style={{
              display: 'inline-block',
              padding: '0.35rem 1.25rem',
              backgroundColor: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '9999px',
              fontSize: '20px',
              fontWeight: '800',
              color: '#92400e',
              marginBottom: '1.5rem'
            }}>
              TABLE #{selectedPrintTable.table_number}
            </div>

            <div style={{ margin: '0 auto 1.5rem', display: 'inline-block', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '16px' }}>
              <img
                src={qrDataUrls[selectedPrintTable.table_number]}
                alt="Table QR Code"
                style={{ width: '220px', height: '220px', display: 'block' }}
              />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '0.25rem' }}>
              Scan to View Menu & Order
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Open your phone camera • No app download required
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
