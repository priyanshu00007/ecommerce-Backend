import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || '';

async function api(path, opts = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opts.headers },
    ...opts,
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
}

const tabs = [
  { name: 'Overview', path: '/admin' },
  { name: 'Products', path: '/admin/products' },
  { name: 'Orders', path: '/admin/orders' },
  { name: 'Users', path: '/admin/users' },
  { name: 'Categories', path: '/admin/categories' },
];

function Overview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api('/api/admin/stats').then(setStats).catch(() => {}); }, []);
  if (!stats) return <p className="text-aura-sage text-sm">Loading...</p>;

  const cards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue || 0}`, color: 'bg-gradient-to-br from-emerald-400 to-emerald-600' },
    { label: 'Total Orders', value: stats.totalOrders || 0, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { label: 'Total Products', value: stats.totalProducts || 0, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { label: 'Total Users', value: stats.totalUsers || 0, color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
  ];

  return (
    <div>
      <h1 className="text-3xl display-font text-aura-primary mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((c, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i}
            className={`${c.color} rounded-2xl p-6 text-white`}>
            <p className="text-xs uppercase tracking-widest opacity-80">{c.label}</p>
            <p className="text-3xl font-bold mt-2">{c.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/50 border border-aura-clay rounded-2xl p-6">
          <h2 className="text-lg font-bold text-aura-primary mb-4">Recent Orders</h2>
          {stats.recentOrders?.length ? stats.recentOrders.slice(0, 5).map(o => (
            <div key={o.id} className="flex justify-between items-center py-2 border-b border-aura-clay/50 last:border-0">
              <div>
                <p className="text-sm font-medium text-aura-primary">#{o.id}</p>
                <p className="text-xs text-aura-sage">{o.user_name} — ${o.total_amount}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>{o.status}</span>
            </div>
          )) : <p className="text-sm text-aura-sage">No orders yet</p>}
        </div>

        <div className="bg-white/50 border border-aura-clay rounded-2xl p-6">
          <h2 className="text-lg font-bold text-aura-primary mb-4">Low Stock Products</h2>
          {stats.lowStock?.length ? stats.lowStock.map(p => (
            <div key={p.id} className="flex justify-between items-center py-2 border-b border-aura-clay/50 last:border-0">
              <p className="text-sm font-medium text-aura-primary">{p.name}</p>
              <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold">{p.stock} left</span>
            </div>
          )) : <p className="text-sm text-aura-sage">All products well stocked</p>}
        </div>
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => { api('/api/products').then(setProducts).catch(() => {}); }, []);
  const toggleFeatured = async (id, featured) => {
    await api(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify({ featured: featured ? 0 : 1 }) });
    setProducts(ps => ps.map(p => p.id === id ? { ...p, featured: featured ? 0 : 1 } : p));
  };
  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api(`/api/products/${id}`, { method: 'DELETE' });
    setProducts(ps => ps.filter(p => p.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl display-font text-aura-primary">Products</h1>
        <span className="text-sm text-aura-sage">{products.length} total</span>
      </div>
      <div className="bg-white/50 border border-aura-clay rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-aura-clay bg-aura-clay/20 text-aura-sage uppercase tracking-widest text-xs">
            <th className="text-left p-4">Product</th><th className="text-left p-4">Price</th><th className="text-left p-4">Stock</th><th className="text-left p-4">Featured</th><th className="text-left p-4">Actions</th>
          </tr></thead>
          <tbody>{products.map(p => (
            <tr key={p.id} className="border-b border-aura-clay/50 hover:bg-aura-clay/10">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  {p.image && <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                  <div><p className="font-medium text-aura-primary">{p.name}</p><p className="text-aura-sage text-xs">{p.category_name}</p></div>
                </div>
              </td>
              <td className="p-4 text-aura-primary font-bold">${p.price}</td>
              <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock > 10 ? 'bg-emerald-100 text-emerald-700' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{p.stock}</span></td>
              <td className="p-4">
                <button onClick={() => toggleFeatured(p.id, p.featured)} className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${p.featured ? 'bg-aura-primary text-white' : 'bg-aura-clay/30 text-aura-sage'}`}>
                  {p.featured ? 'Featured' : 'Standard'}
                </button>
              </td>
              <td className="p-4">
                <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-500 hover:text-red-700 font-bold">Delete</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  useEffect(() => {
    const q = filter ? `?status=${filter}` : '';
    api(`/api/orders/admin${q}`).then(setOrders).catch(() => {});
  }, [filter]);

  const updateStatus = async (id, status) => {
    await api(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
  };

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <h1 className="text-3xl display-font text-aura-primary mb-8">Orders</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter('')} className={`text-xs px-4 py-2 rounded-full font-bold ${!filter ? 'bg-aura-primary text-white' : 'bg-aura-clay/30 text-aura-sage'}`}>All</button>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`text-xs px-4 py-2 rounded-full font-bold capitalize ${filter === s ? 'bg-aura-primary text-white' : 'bg-aura-clay/30 text-aura-sage'}`}>{s}</button>
        ))}
      </div>
      <div className="bg-white/50 border border-aura-clay rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-aura-clay bg-aura-clay/20 text-aura-sage uppercase tracking-widest text-xs">
            <th className="text-left p-4">Order</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Total</th><th className="text-left p-4">Status</th><th className="text-left p-4">Date</th><th className="text-left p-4">Action</th>
          </tr></thead>
          <tbody>{orders.map(o => (
            <tr key={o.id} className="border-b border-aura-clay/50 hover:bg-aura-clay/10">
              <td className="p-4 font-medium text-aura-primary">#{o.id}</td>
              <td className="p-4">{o.user_name || o.user_email || 'N/A'}</td>
              <td className="p-4 font-bold text-aura-primary">${parseFloat(o.total_amount).toFixed(2)}</td>
              <td className="p-4"><span className={`text-xs px-3 py-1 rounded-full font-bold ${
                o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                o.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>{o.status}</span></td>
              <td className="p-4 text-aura-sage text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
              <td className="p-4">
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="text-xs border border-aura-clay rounded-lg px-2 py-1">
                  {statuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api('/api/admin/users').then(setUsers).catch(() => {}); }, []);

  return (
    <div>
      <h1 className="text-3xl display-font text-aura-primary mb-8">Users</h1>
      <div className="bg-white/50 border border-aura-clay rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-aura-clay bg-aura-clay/20 text-aura-sage uppercase tracking-widest text-xs">
            <th className="text-left p-4">Name</th><th className="text-left p-4">Email</th><th className="text-left p-4">Role</th><th className="text-left p-4">Joined</th>
          </tr></thead>
          <tbody>{users.map(u => (
            <tr key={u.id} className="border-b border-aura-clay/50 hover:bg-aura-clay/10">
              <td className="p-4 font-medium text-aura-primary">{u.name}</td>
              <td className="p-4 text-aura-sage">{u.email}</td>
              <td className="p-4"><span className={`text-xs px-3 py-1 rounded-full font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-aura-clay/30 text-aura-sage'}`}>{u.role}</span></td>
              <td className="p-4 text-aura-sage text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function Categories() {
  const [cats, setCats] = useState([]);
  const [newName, setNewName] = useState('');
  useEffect(() => { api('/api/categories').then(setCats).catch(() => {}); }, []);

  const addCat = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const created = await api('/api/categories', { method: 'POST', body: JSON.stringify({ name: newName.trim() }) });
    setCats(prev => [...prev, created]);
    setNewName('');
  };

  const deleteCat = async (id) => {
    if (!confirm('Delete this category?')) return;
    await api(`/api/categories/${id}`, { method: 'DELETE' });
    setCats(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl display-font text-aura-primary mb-8">Categories</h1>
      <form onSubmit={addCat} className="flex gap-3 mb-8">
        <input type="text" placeholder="Category name" value={newName} onChange={(e) => setNewName(e.target.value)} required
          className="flex-1 px-4 py-3 border border-aura-clay rounded-lg focus:outline-none focus:border-aura-primary text-sm" />
        <button type="submit" className="px-6 py-3 bg-aura-primary text-white rounded-lg text-sm uppercase tracking-widest font-bold hover:bg-aura-gold transition-colors">Add</button>
      </form>
      <div className="flex flex-wrap gap-3">
        {cats.map(c => (
          <div key={c.id} className="flex items-center gap-3 bg-white/50 border border-aura-clay rounded-full px-5 py-2">
            <span className="text-sm text-aura-primary">{c.name}</span>
            <button onClick={() => deleteCat(c.id)} className="text-red-400 hover:text-red-600 text-sm">&times;</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const location = useLocation();

  return (
    <div className="pt-32 pb-32 px-6 md:px-12 bg-aura-bg min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-2 mb-12 flex-wrap border-b border-aura-clay/50 pb-4">
          {tabs.map(t => (
            <Link key={t.path} to={t.path}
              className={`text-sm px-5 py-2 rounded-full font-bold transition-colors ${
                location.pathname === t.path || (t.path !== '/admin' && location.pathname.startsWith(t.path))
                  ? 'bg-aura-primary text-white'
                  : 'text-aura-sage hover:text-aura-primary'
              }`}>
              {t.name}
            </Link>
          ))}
        </div>

        <Routes>
          <Route index element={<Overview />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
        </Routes>
      </div>
    </div>
  );
}
