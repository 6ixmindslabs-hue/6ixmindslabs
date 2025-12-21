import { motion } from 'framer-motion';
import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Verify() {
  const [certId, setCertId] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    if (!certId) return;
    // Redirect to the dynamic route in a new tab
    window.open(`/verify/${certId.trim()}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative py-24 px-4 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-block px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-bold tracking-widest uppercase mb-6">
              Certificate Authentication
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
              Validate <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Achievement</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Verify the authenticity of 6ixminds Labs certificates using our secure verification system.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-xl mx-auto relative">
          {/* Decorative background element */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-purple-100/50 p-10 border border-gray-100">
              <form onSubmit={handleVerify} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">
                    Certificate ID
                  </label>
                  <input
                    type="text"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder="e.g. 6ML-IN-2025-00001"
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl transition-all text-xl font-mono shadow-inner outline-none"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    UID found at the bottom of your certificate
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-5 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-200 transition-all transform hover:-translate-y-1"
                >
                  Verify Now
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Help section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-8 text-gray-400 font-medium text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Official
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
