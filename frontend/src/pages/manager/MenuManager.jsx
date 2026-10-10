import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  UtensilsCrossed,
  ToggleLeft,
  ToggleRight,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    description: '',
    image_url: '',
    is_veg: true,
    is_available: true,
    prep_time_minutes: 15
  });

  const categories = ['All', 'Starters', 'Main Course', 'Breads & Rice', 'Desserts', 'Beverages'];

  const loadMenu = async () => {
    try {
      const data = await api.getMenu();
      setItems(data || []);
    } catch (err) {
      console.error('Failed to load menu items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Main Course',
      price: '',
      description: '',
      image_url: '/images/paneer-butter-masala.jpg',
      is_veg: true,
      is_available: true,
      prep_time_minutes: 15
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category || 'Main Course',
      price: item.price,
      description: item.description || '',
      image_url: item.image_url || '',
      is_veg: Boolean(item.is_veg),
      is_available: item.is_available !== false,
      prep_time_minutes: item.prep_time_minutes || 15
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateMenuItem(editingItem.id, {
          ...formData,
          price: Number(formData.price)
        });
      } else {
        await api.addMenuItem({
          ...formData,
          price: Number(formData.price)
        });
      }
      setIsModalOpen(false);
      loadMenu();
    } catch (err) {
      alert('Failed to save menu item');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this menu dish?')) return;
    try {
      await api.deleteMenuItem(id);
      loadMenu();
    } catch (err) {
      alert('Failed to delete menu item');
    }
  };

  const handleToggleStock = async (item) => {
    try {
      const newStatus = !item.is_available;
      await api.updateMenuItem(item.id, { is_available: newStatus });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: newStatus } : i))
      );
    } catch (err) {
      alert('Failed to toggle item availability');
    }
  };

  const filtered = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header */}
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
            Manage Hotel Menu
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Add, update, or remove dishes & adjust real-time stock
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and search */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search menu dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-bar" style={{ padding: 0 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Table / List */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.875rem 1rem' }}>Dish</th>
                <th style={{ padding: '0.875rem 1rem' }}>Category</th>
                <th style={{ padding: '0.875rem 1rem' }}>Diet</th>
                <th style={{ padding: '0.875rem 1rem' }}>Price</th>
                <th style={{ padding: '0.875rem 1rem' }}>Prep Time</th>
                <th style={{ padding: '0.875rem 1rem' }}>Stock Status</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={item.image_url || '/images/paneer-butter-masala.jpg'}
                        alt={item.name}
                        onError={(e) => { e.target.src = '/images/paneer-butter-masala.jpg'; }}
                        style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: item.is_veg ? 'var(--veg)' : 'var(--non-veg)',
                      fontWeight: '600',
                      fontSize: '0.75rem'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: item.is_veg ? '50%' : '2px',
                        backgroundColor: item.is_veg ? 'var(--veg)' : 'var(--non-veg)'
                      }} />
                      {item.is_veg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: '700' }}>
                    ₹{Number(item.price).toFixed(0)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)' }}>
                    {item.prep_time_minutes || 15} mins
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleStock(item)}
                      style={{
                        background: item.is_available !== false ? '#dcfce7' : '#fee2e2',
                        color: item.is_available !== false ? '#15803d' : '#b91c1c',
                        border: 'none',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontWeight: '600',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item.is_available !== false ? 'In Stock' : 'Sold Out'}
                    </button>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        title="Edit Dish"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        title="Delete Dish"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="drawer-backdrop" style={{ justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-xl)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {editingItem ? 'Edit Dish Details' : 'Add New Dish to Menu'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Dish Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="E.g., Paneer Tikka Masala"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Breads & Rice">Breads & Rice</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-input"
                    placeholder="280.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Dietary Type</label>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="diet"
                        checked={formData.is_veg === true}
                        onChange={() => setFormData({ ...formData, is_veg: true })}
                      />
                      <span>Vegetarian</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="diet"
                        checked={formData.is_veg === false}
                        onChange={() => setFormData({ ...formData, is_veg: false })}
                      />
                      <span>Non-Veg</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Prep Time (mins)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.prep_time_minutes}
                    onChange={(e) => setFormData({ ...formData, prep_time_minutes: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="Ingredients, preparation style, and flavors..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dish Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="/images/paneer-butter-masala.jpg or https://..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
                <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '100%', fontWeight: '500' }}>
                    Quick Select Pre-bundled Dish Images:
                  </span>
                  {[
                    { label: 'Gujarati Thali', path: '/images/Gujarati_thali.jpg' },
                    { label: 'Pav Bhaji', path: '/images/Pav_Bhaji.jpg' },
                    { label: 'Paneer Butter Masala', path: '/images/paneer-butter-masala.jpg' },
                    { label: 'Spring Rolls', path: '/images/veg-spring-rolls.jpg' },
                    { label: 'Garlic Naan', path: '/images/garlic-naan.jpg' },
                    { label: 'Fudge Brownie', path: '/images/sizzling-brownie.jpg' },
                    { label: 'Gulab Jamun', path: '/images/gulab-jamun.jpg' },
                    { label: 'Lime Mojito', path: '/images/mint-mojito.jpg' },
                    { label: 'Kulhad Chai', path: '/images/masala-chai.jpg' },
                    { label: 'Iced Cola', path: '/images/cold-drink.jpg' }
                  ].map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: preset.path })}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        border: formData.image_url === preset.path ? '1px solid var(--primary)' : '1px solid var(--border)',
                        background: formData.image_url === preset.path ? 'rgba(234, 88, 12, 0.1)' : '#f8fafc',
                        color: formData.image_url === preset.path ? 'var(--primary)' : 'inherit',
                        cursor: 'pointer',
                        fontWeight: formData.image_url === preset.path ? '600' : '400'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                {formData.image_url && (
                  <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      onError={(e) => { e.target.src = '/images/paneer-butter-masala.jpg'; }}
                      style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Live Preview &bull; <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{formData.image_url}</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update Dish' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
