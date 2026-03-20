import React from 'react';
import { motion } from 'framer-motion';
import { Shield, LayoutDashboard, CreditCard, UserCheck } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-4 bg-[#050811]/80 backdrop-blur-xl border-b border-white/10"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Shield className="text-indigo-500" size={28} />
        <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          GigShield <span className="text-indigo-500">AI</span>
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <a href="#analyzer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Analyzer</a>
        <a href="#pricing" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Plans</a>
        <a href="#fraud" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Security</a>
        <div style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>
          LIVE IN INDIA
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
