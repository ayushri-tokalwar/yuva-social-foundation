import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout & Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VolunteerModal from './components/VolunteerModal';
import DonationModal from './components/DonationModal';
import Toast from './components/Toast';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

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

export default function App() {
  // Modal states
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [preselectedCampaign, setPreselectedCampaign] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState({
    message: '',
    type: 'success'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleOpenVolunteer = () => {
    setIsVolunteerOpen(true);
  };

  const handleCloseVolunteer = () => {
    setIsVolunteerOpen(false);
  };

  const handleOpenDonation = (campaign = null) => {
    setPreselectedCampaign(campaign);
    setIsDonationOpen(true);
  };

  const handleCloseDonation = () => {
    setIsDonationOpen(false);
    setPreselectedCampaign(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
        {/* Global Navigation */}
        <Navbar
          onOpenVolunteerModal={handleOpenVolunteer}
          onOpenDonationModal={() => handleOpenDonation(null)}
        />

        {/* Main Content Pages */}
        <main className="flex-grow">
          <Routes>
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
            <Route
              path="/gallery"
              element={<Gallery />}
            />
            <Route
              path="/contact"
              element={
                <Contact
                  onOpenVolunteerModal={handleOpenVolunteer}
                  onOpenDonationModal={handleOpenDonation}
                />
              }
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer
          onOpenVolunteerModal={handleOpenVolunteer}
          onOpenDonationModal={() => handleOpenDonation(null)}
        />

        {/* Global Modals */}
        <VolunteerModal
          isOpen={isVolunteerOpen}
          onClose={handleCloseVolunteer}
        />

        <DonationModal
          isOpen={isDonationOpen}
          onClose={handleCloseDonation}
          preselectedCampaign={preselectedCampaign}
        />

        {/* Global Floating Toast */}
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      </div>
    </Router>
  );
}
