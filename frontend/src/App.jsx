import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Internships from './pages/Internships';
import Contact from './pages/Contact';
import Verify from './pages/Verify';

// Admin imports
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInternships from './pages/admin/AdminInternships';
import AdminProjects from './pages/admin/AdminProjects';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminTeam from './pages/admin/AdminTeam';
import AdminPages from './pages/admin/AdminPages';
import AdminSettings from './pages/admin/AdminSettings';
import AdminMessages from './pages/admin/AdminMessages';
import AdminComingSoon from './components/admin/AdminComingSoon';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Home /></main>
              <Footer />
            </div>
          } />
          <Route path="/about" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><About /></main>
              <Footer />
            </div>
          } />
          <Route path="/services" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Services /></main>
              <Footer />
            </div>
          } />
          <Route path="/projects" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Projects /></main>
              <Footer />
            </div>
          } />
          <Route path="/projects/:slug" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Projects /></main>
              <Footer />
            </div>
          } />
          <Route path="/internships" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Internships /></main>
              <Footer />
            </div>
          } />
          <Route path="/internships/:slug" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Internships /></main>
              <Footer />
            </div>
          } />
          <Route path="/contact" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Contact /></main>
              <Footer />
            </div>
          } />
          <Route path="/verify" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow"><Verify /></main>
              <Footer />
            </div>
          } />

          {/* Admin Login (public) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="internships" element={<AdminInternships />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="logs" element={<AdminComingSoon title="Audit Logs" icon="📋" description="View admin activity and system logs" />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
