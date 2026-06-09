import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/ui/Loading';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    authAPI.profile().then(({ data }) => setProfile(data)).catch(() => {});
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!profile) return <Loading />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-40 pb-32 px-6 md:px-12 bg-aura-bg min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="display-font text-6xl md:text-7xl text-aura-primary mb-12">Profile</h1>
        <div className="bg-white/50 border border-aura-clay rounded-2xl p-10 space-y-6">
          <div className="w-20 h-20 bg-aura-primary rounded-full flex items-center justify-center text-white text-2xl display-font">
            {profile.name?.[0] || 'A'}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-aura-sage font-bold">Name</p>
            <p className="text-xl text-aura-primary">{profile.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-aura-sage font-bold">Email</p>
            <p className="text-xl text-aura-primary">{profile.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-aura-sage font-bold">Role</p>
            <p className="text-xl text-aura-primary capitalize">{profile.role}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-aura-sage font-bold">Member Since</p>
            <p className="text-xl text-aura-primary">{new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full mt-8 py-4 border border-red-300 text-red-600 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-red-50 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </motion.div>
  );
}
