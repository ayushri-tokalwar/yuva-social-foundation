import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';

// Admin Authentication & Context
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public Layout & Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VolunteerModal from './components/VolunteerModal';
import DonationModal from './components/DonationModal';
import Toast from './components/Toast';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages & Layout
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminDonations from './pages/admin/AdminDonations';
import AdminMessages from './pages/admin/AdminMessages';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminGallery from './pages/admin/AdminGallery';
import AdminServices from './pages/admin/AdminServices';
import AdminSettings from './pages/admin/AdminSettings';
import AdminJoinRequests from './pages/admin/AdminJoinRequests';
import AdminContent from './pages/admin/AdminContent';

// ScrollToTop on route transition
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

// Wrapper Layout for all Public Website Pages
function PublicLayout({
  onOpenVolunteer,
  onOpenDonation,
  isVolunteerOpen,
  onCloseVolunteer,
  isDonationOpen,
  onCloseDonation,
  preselectedCampaign,
  toast,
  onCloseToast
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      {/* Global Navigation */}
      <Navbar
        onOpenVolunteerModal={onOpenVolunteer}
        onOpenDonationModal={() => onOpenDonation(null)}
      />

      {/* Main Content Pages */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer
        onOpenVolunteerModal={onOpenVolunteer}
        onOpenDonationModal={() => onOpenDonation(null)}
      />

      {/* Global Modals */}
      <VolunteerModal
        isOpen={isVolunteerOpen}
        onClose={onCloseVolunteer}
      />

      <DonationModal
        isOpen={isDonationOpen}
        onClose={onCloseDonation}
        preselectedCampaign={preselectedCampaign}
      />

      {/* Global Floating Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={onCloseToast}
      />
    </div>
  );
}

export default function App() {
  // Modal states for public site
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [preselectedCampaign, setPreselectedCampaign] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState({
    message: '',
    type: 'success'
  });

  const handleOpenVolunteer = () => setIsVolunteerOpen(true);
  const handleCloseVolunteer = () => setIsVolunteerOpen(false);

  const handleOpenDonation = (campaign = null) => {
    setPreselectedCampaign(campaign);
    setIsDonationOpen(true);
  };
  const handleCloseDonation = () => {
    setIsDonationOpen(false);
    setPreselectedCampaign(null);
  };

  return (
    <AdminAuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* ======================================================= */}
          {/* ADMIN PORTAL ROUTES */}
          {/* ======================================================= */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="volunteers" element={<AdminVolunteers />} />
            <Route path="join-requests" element={<AdminJoinRequests />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* ======================================================= */}
          {/* PUBLIC WEBSITE ROUTES */}
          {/* ======================================================= */}
          <Route
            element={
              <PublicLayout
                onOpenVolunteer={handleOpenVolunteer}
                onOpenDonation={handleOpenDonation}
                isVolunteerOpen={isVolunteerOpen}
                onCloseVolunteer={handleCloseVolunteer}
                isDonationOpen={isDonationOpen}
                onCloseDonation={handleCloseDonation}
                preselectedCampaign={preselectedCampaign}
                toast={toast}
                onCloseToast={() => setToast({ message: '', type: 'success' })}
              />
            }
          >
            <Route
              path="/"
              element={
                <Home
                  onOpenVolunteerModal={handleOpenVolunteer}
                  onOpenDonationModal={handleOpenDonation}
                />
              }
            />
            <Route
              path="/about"
              element={
                <About
                  onOpenVolunteerModal={handleOpenVolunteer}
                  onOpenDonationModal={handleOpenDonation}
                />
              }
            />
            <Route
              path="/services"
              element={
                <Services
                  onOpenVolunteerModal={handleOpenVolunteer}
                  onOpenDonationModal={handleOpenDonation}
                />
              }
            />
            <Route
              path="/campaigns"
              element={
                <Campaigns
                  onOpenDonationModal={handleOpenDonation}
                />
              }
            />
            <Route
              path="/campaigns/:slug"
              element={
                <CampaignDetail
                  onOpenDonationModal={handleOpenDonation}
                  onOpenVolunteerModal={handleOpenVolunteer}
                />
              }
            />
            <Route path="/gallery" element={<Gallery />} />
            <Route
              path="/contact"
              element={
                <Contact
                  onOpenVolunteerModal={handleOpenVolunteer}
                  onOpenDonationModal={handleOpenDonation}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}
