import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Analytics from './components/Analytics';
import RiderShowcase from './components/RiderShowcase';
import Analyzer from './components/Analyzer';
import Fraud from './components/Fraud';
import LiveBackground from './components/LiveBackground';

function App() {
  return (
    <div className="App">
      <LiveBackground />
      <Navbar />
      <Hero />
      <Analytics />
      <RiderShowcase />
      <Analyzer />
      <Fraud />
      
      <footer style={{ padding: '60px 5%', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '80px' }}>
        <p style={{ color: '#475569', fontSize: '0.8rem' }}>
          &copy; 2026 GigShield AI. Built for Guidewire Hackathon. Not a real insurance product.
        </p>
      </footer>
    </div>
  );
}

export default App;
