import { motion } from 'framer-motion';
import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
// import certificates from '../data/certificates.json'; // REMOVED

export default function Verify() {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certId) return;

    setLoading(true);
    setSearched(false);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/certificates/verify/${certId}`);
      const data = await response.json();

      if (data.success && data.valid) {
        setResult(data.data);
      } else {
        setResult(null);
      }
    } catch (error) {
      console.error('Verify error:', error);
      setResult(null);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text-shimmer">Verify Certificate</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enter certificate ID to verify authenticity
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8">
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Certificate ID</label>
                  <input
                    type="text"
                    value={certId}
                    onChange={(e) => {
                      setCertId(e.target.value);
                      setSearched(false);
                      setResult(null);
                    }}
                    placeholder="6ML-IN-2025-00001"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl gradient-input transition-all text-lg font-mono"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Find the certificate ID on your certificate document
                  </p>
                </div>

                <Button type="submit" variant="primary" className="w-full">
                  {loading ? 'Verifying...' : 'Verify Certificate'}
                </Button>
              </form>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 flex justify-center"
                >
                  <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
                </motion.div>
              )}

              {!loading && searched && !result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg text-center"
                >
                  <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <h3 className="text-xl font-bold text-red-800 mb-2">Certificate Not Found</h3>
                  <p className="text-red-600">
                    The certificate ID you entered could not be verified. Please check the ID and try again.
                  </p>
                </motion.div>
              )}

              {!loading && result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <div className="p-8 bg-green-50 border-2 border-green-200 rounded-2xl">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-green-800 text-center mb-6">
                      Certificate Verified!
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Student Name</p>
                          <p className="font-semibold text-lg">{result.student_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Certificate ID</p>
                          <p className="font-semibold text-lg font-mono">{result.certificate_id}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Course / Internship</p>
                        {/* Fallback for title if different in DB */}
                        <p className="font-semibold text-lg">{result.course}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Issue Date</p>
                        <p className="font-semibold">{new Date(result.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>

                      {result.download_url && (
                        <div className="mt-2">
                          <a href={result.download_url} target="_blank" className="text-brand-purple hover:underline text-sm font-semibold">Download Certificate</a>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-green-200">
                      <p className="text-xs text-gray-600 text-center">
                        This certificate is authentic and issued by 6ixminds Labs (UDYAM-TN-07-0132729)
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="p-8 hero-gradient">
              <h3 className="text-xl font-semibold mb-4">How to Verify</h3>
              <ol className="space-y-3 list-decimal list-inside text-gray-600">
                <li>Locate the certificate ID on your certificate (format: 6ML-IN-YYYY-XXXXX)</li>
                <li>Enter the complete certificate ID in the field above</li>
                <li>Click Verify Certificate to check authenticity</li>
                <li>View complete certificate details if verified</li>
              </ol>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
