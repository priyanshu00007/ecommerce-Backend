import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] px-6">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl">
        <Link to="/" className="display-font text-3xl text-aura-primary block text-center mb-2">AURA</Link>
        <p className="text-center text-sm text-aura-sage mb-8">Create your account</p>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} required
            className="w-full px-4 py-3 border border-aura-clay rounded-lg focus:outline-none focus:border-aura-primary text-sm" />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} required
            className="w-full px-4 py-3 border border-aura-clay rounded-lg focus:outline-none focus:border-aura-primary text-sm" />
          <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => setForm(f => ({...f, password: e.target.value}))} required minLength={6}
            className="w-full px-4 py-3 border border-aura-clay rounded-lg focus:outline-none focus:border-aura-primary text-sm" />
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-aura-primary text-white rounded-lg text-sm uppercase tracking-widest font-bold hover:bg-aura-gold transition-colors disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-xs text-aura-sage mt-6">
          Already have an account? <Link to="/login" className="text-aura-primary font-bold hover:text-aura-terra">Sign In</Link>
        </p>
      </div>
    </motion.div>
  );
}
