import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Setup axios
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Types
interface Item {
  id: string;
  name: string;
  location: string;
  description?: string;
  photos: any[];
  tags: any[];
  createdAt: string;
}

// Login Page
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '420px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', color: '#1f2937' }}>HomeVault</h1>
        {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
              style={{ width: '100%', padding: '10px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{ width: '100%', padding: '10px 40px 10px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#6b7280',
                  padding: '0',
                  lineHeight: 1
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#9ca3af' : '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '16px', transition: 'background 0.2s' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          Don't have an account? <Link to="/register" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

// Register Page
function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { email, password, fullName });
      localStorage.setItem('token', response.data.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '420px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', color: '#1f2937' }}>Create Account</h1>
        {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={loading}
              style={{ width: '100%', padding: '10px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
              style={{ width: '100%', padding: '10px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{ width: '100%', padding: '10px 40px 10px 14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#6b7280',
                  padding: '0',
                  lineHeight: 1
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#9ca3af' : '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '16px' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          Already have an account? <Link to="/login" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

// Protected Route
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Dashboard - Items List
function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [useAISearch, setUseAISearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      console.log('Search triggered:', { search, useAISearch });
      if (search.trim()) {
        if (useAISearch) {
          console.log('Calling AI search');
          handleAISearch();
        } else {
          console.log('Calling regular search');
          loadItems();
        }
      } else {
        console.log('Loading all items');
        loadItems();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [search, useAISearch]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/items${search && !useAISearch ? `?search=${search}` : ''}`);
      setItems(response.data.data);
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!search.trim()) {
      loadItems();
      return;
    }

    try {
      setSearching(true);
      const response = await api.post('/ai/search', { query: search });
      setItems(response.data.data);
    } catch (err) {
      console.error('AI search failed', err);
      // Fallback to regular search
      loadItems();
    } finally {
      setSearching(false);
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleDeleteItem = async (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Delete this item?')) return;

    setDeletingItemId(itemId);
    try {
      await api.delete(`/items/${itemId}`);
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      alert('Failed to delete item');
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>🏠 HomeVault</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/add" style={{ padding: '10px 20px', background: '#667eea', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
              + Add Item
            </Link>
            <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder={useAISearch ? "🤖 AI Search: Try 'central table' or 'kitchen'..." : "Search items by name, location, or description..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isListening}
              style={{ width: '100%', padding: '14px 56px 14px 20px', fontSize: '16px', border: `2px solid ${useAISearch ? '#7c3aed' : '#e5e7eb'}`, borderRadius: '10px', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = useAISearch ? '#7c3aed' : '#667eea'}
              onBlur={(e) => e.target.style.borderColor = useAISearch ? '#7c3aed' : '#e5e7eb'}
            />
            {searching && <div style={{ position: 'absolute', right: '56px', top: '50%', transform: 'translateY(-50%)', color: '#667eea', fontSize: '14px' }}>Searching...</div>}
            {isListening && <div style={{ position: 'absolute', right: '56px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>🎙️ Listening...</div>}
            <button
              type="button"
              onClick={handleVoiceSearch}
              disabled={isListening || searching}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '8px',
                background: isListening ? '#ef4444' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isListening || searching ? 'not-allowed' : 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                transition: 'all 0.2s'
              }}
              title={isListening ? 'Listening...' : 'Voice search'}
            >
              {isListening ? '🔴' : '🎤'}
            </button>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
              <input
                type="checkbox"
                checked={useAISearch}
                onChange={(e) => setUseAISearch(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: '500' }}>✨ AI-Powered Semantic Search</span>
            </label>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>(Finds items even with vague location descriptions)</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Items</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{items.length}</div>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Photos</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{items.reduce((sum, item) => sum + item.photos.length, 0)}</div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading items...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>No items yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Start adding items to your inventory</p>
            <Link to="/add" style={{ display: 'inline-block', padding: '12px 24px', background: '#667eea', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
              Add Your First Item
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {items.map((item) => (
              <Link key={item.id} to={`/items/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', position: 'relative' }}>
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', position: 'relative' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
                  {item.photos.length > 0 ? (
                    <div style={{ height: '200px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <img src={`${API_URL}/photos/${item.photos[0].id}/file`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        disabled={deletingItemId === item.id}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '8px',
                          background: deletingItemId === item.id ? '#9ca3af' : 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: deletingItemId === item.id ? 'not-allowed' : 'pointer',
                          fontSize: '16px',
                          fontWeight: '600',
                          backdropFilter: 'blur(4px)',
                          transition: 'all 0.2s'
                        }}
                        title="Delete item"
                      >
                        {deletingItemId === item.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ height: '200px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', position: 'relative' }}>
                      📦
                      <button
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        disabled={deletingItemId === item.id}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '8px',
                          background: deletingItemId === item.id ? '#9ca3af' : 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: deletingItemId === item.id ? 'not-allowed' : 'pointer',
                          fontSize: '16px',
                          fontWeight: '600',
                          backdropFilter: 'blur(4px)',
                          transition: 'all 0.2s'
                        }}
                        title="Delete item"
                      >
                        {deletingItemId === item.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  )}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>{item.name}</h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>📍 {item.location}</p>
                    {item.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} style={{ padding: '4px 10px', background: '#ede9fe', color: '#7c3aed', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>
                            {tag.category.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Add Item Page
function AddItem() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create item
      const itemResponse = await api.post('/items', {
        name,
        location,
        description,
        categories: tags
      });

      const itemId = itemResponse.data.data.id;

      // Upload photos if any
      if (photos.length > 0) {
        const formData = new FormData();
        photos.forEach(photo => formData.append('photos', photo));
        await api.post(`/items/${itemId}/photos`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate(`/items/${itemId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files).slice(0, 5));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const newPhotos: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const file = new File([blob], `pasted-image-${Date.now()}-${i}.png`, { type: blob.type });
          newPhotos.push(file);
        }
      }
    }

    if (newPhotos.length > 0) {
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
    }
  };

  const handleAIAnalyze = async () => {
    if (photos.length === 0) {
      setError('Please add at least one photo to analyze');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', photos[0]);

      const response = await api.post('/ai/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { name: aiName, description: aiDesc, suggestedCategories } = response.data.data;

      setName(aiName);
      setDescription(aiDesc);
      setTags(suggestedCategories);
    } catch (err: any) {
      setError(err.response?.data?.message || 'AI analysis failed. Make sure OPENAI_API_KEY is configured.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLocation(transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error !== 'no-speech') {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ color: '#667eea', textDecoration: 'none', fontSize: '24px' }}>←</Link>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>Add New Item</h1>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Item Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading}
                placeholder="e.g., Winter Jacket"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Location *</label>
              <div style={{ position: 'relative' }}>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required disabled={loading || isListening}
                  placeholder="e.g., Master bedroom wardrobe, right side, top shelf"
                  style={{ width: '100%', padding: '12px 48px 12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} />
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={loading || isListening}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '8px',
                    background: isListening ? '#ef4444' : '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isListening || loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    transition: 'all 0.2s'
                  }}
                  title={isListening ? 'Listening...' : 'Speak location'}
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              </div>
              {isListening && <div style={{ fontSize: '13px', color: '#667eea', marginTop: '6px', fontWeight: '500' }}>🎙️ Listening... Speak now</div>}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading}
                placeholder="Additional details about the item..."
                rows={4}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Tags / Categories</label>

              {/* Display existing tags */}
              {tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {tags.map((tag, idx) => (
                    <span key={idx} style={{
                      padding: '6px 12px',
                      background: '#ede9fe',
                      color: '#7c3aed',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={loading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#7c3aed',
                          cursor: 'pointer',
                          fontSize: '16px',
                          padding: '0',
                          lineHeight: '1'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Input for new tags */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  disabled={loading}
                  placeholder="Type a tag and press Enter or click +"
                  style={{ flex: 1, padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={loading || !tagInput.trim()}
                  style={{
                    padding: '12px 20px',
                    background: loading || !tagInput.trim() ? '#e5e7eb' : '#667eea',
                    color: loading || !tagInput.trim() ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading || !tagInput.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '18px'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Photos (up to 5)</label>
              <div
                onPaste={handlePaste}
                style={{
                  width: '100%',
                  padding: '24px',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <input type="file" accept="image/*" multiple onChange={handlePhotoChange} disabled={loading}
                  id="photo-upload"
                  style={{ display: 'none' }} />
                <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                    📷 Click to select files or paste screenshots here (Cmd/Ctrl+V)
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                    PNG, JPG, GIF up to 10MB each
                  </div>
                </label>
              </div>
              {photos.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>
                      {photos.length} photo(s) selected:
                    </div>
                    <button
                      type="button"
                      onClick={handleAIAnalyze}
                      disabled={analyzing || loading}
                      style={{
                        padding: '8px 16px',
                        background: analyzing ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: analyzing ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {analyzing ? '🔄 Analyzing...' : '✨ AI Identify'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {photos.map((photo, idx) => (
                      <div key={idx} style={{
                        padding: '6px 12px',
                        background: '#ede9fe',
                        color: '#6d28d9',
                        borderRadius: '6px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {photo.name}
                        <button
                          type="button"
                          onClick={() => setPhotos(prev => prev.filter((_, i) => i !== idx))}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#6d28d9',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '0',
                            lineHeight: 1
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={loading}
                style={{ flex: 1, padding: '14px', background: loading ? '#9ca3af' : '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '16px' }}>
                {loading ? 'Creating...' : 'Create Item'}
              </button>
              <Link to="/" style={{ flex: 1, padding: '14px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: '600', fontSize: '16px', display: 'block' }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// View Item Page
function ViewItem() {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      const loadedItem = response.data.data;
      setItem(loadedItem);
      setEditedName(loadedItem.name);
      setEditedLocation(loadedItem.location);
      setEditedDescription(loadedItem.description || '');
      setEditedTags(loadedItem.tags.map((tag: any) => tag.category.name));
    } catch (err) {
      console.error('Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setTagInput('');
    if (item) {
      setEditedName(item.name);
      setEditedLocation(item.location);
      setEditedDescription(item.description || '');
      setEditedTags(item.tags.map((tag: any) => tag.category.name));
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !editedTags.includes(trimmedTag)) {
      setEditedTags([...editedTags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put(`/items/${id}`, {
        name: editedName,
        location: editedLocation,
        description: editedDescription,
        categories: editedTags
      });
      setItem(response.data.data);
      setEditing(false);
      setTagInput('');
    } catch (err) {
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/items/${id}`);
      navigate('/');
    } catch (err) {
      alert('Failed to delete item');
      setDeleting(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!item) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Item not found</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/" style={{ color: '#667eea', textDecoration: 'none', fontSize: '24px' }}>←</Link>
            {editing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', border: '2px solid #667eea', borderRadius: '6px', padding: '8px 12px', outline: 'none' }}
              />
            ) : (
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{item.name}</h1>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving}
                  style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                  {saving ? 'Saving...' : '✓ Save'}
                </button>
                <button onClick={handleCancelEdit} disabled={saving}
                  style={{ padding: '10px 20px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={handleEdit}
                  style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  ✏️ Edit
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: deleting ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                  {deleting ? 'Deleting...' : '🗑️ Delete'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Photos */}
          <div>
            {item.photos.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                <img src={`${API_URL}/photos/${item.photos[0].id}/file`} alt={item.name}
                  style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px' }} />
                {item.photos.length > 1 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {item.photos.slice(1).map((photo) => (
                      <img key={photo.id} src={`${API_URL}/photos/${photo.id}/file`} alt={item.name}
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ height: '400px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px' }}>
                📦
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Location</div>
              {editing ? (
                <input
                  type="text"
                  value={editedLocation}
                  onChange={(e) => setEditedLocation(e.target.value)}
                  style={{ width: '100%', fontSize: '18px', fontWeight: '500', color: '#1f2937', border: '2px solid #667eea', borderRadius: '6px', padding: '10px 12px', outline: 'none' }}
                />
              ) : (
                <div style={{ fontSize: '18px', fontWeight: '500', color: '#1f2937' }}>📍 {item.location}</div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Description</div>
              {editing ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={4}
                  style={{ width: '100%', fontSize: '16px', color: '#374151', border: '2px solid #667eea', borderRadius: '6px', padding: '10px 12px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                />
              ) : (
                <div style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>{item.description || 'No description'}</div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Tags / Categories</div>

              {editing ? (
                <>
                  {/* Display editable tags as removable chips */}
                  {editedTags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      {editedTags.map((tag, idx) => (
                        <span key={idx} style={{
                          padding: '6px 12px',
                          background: '#ede9fe',
                          color: '#7c3aed',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#7c3aed',
                              cursor: 'pointer',
                              fontSize: '18px',
                              padding: '0',
                              lineHeight: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Input for new tags */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Type a tag and press Enter or click +"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                      style={{
                        padding: '10px 16px',
                        background: tagInput.trim() ? '#667eea' : '#e5e7eb',
                        color: tagInput.trim() ? 'white' : '#9ca3af',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: tagInput.trim() ? 'pointer' : 'not-allowed',
                        fontWeight: '600',
                        fontSize: '16px'
                      }}
                    >
                      +
                    </button>
                  </div>
                </>
              ) : (
                item.tags.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {item.tags.map((tag, idx) => (
                      <span key={idx} style={{ padding: '6px 14px', background: '#ede9fe', color: '#7c3aed', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
                        {tag.category.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '14px', color: '#9ca3af' }}>No tags</div>
                )
              )}
            </div>

            <div style={{ paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Added {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function FullApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
        <Route path="/items/:id" element={<ProtectedRoute><ViewItem /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
