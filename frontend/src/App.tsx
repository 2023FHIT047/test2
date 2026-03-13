import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import FarmLocationSetup from './pages/FarmLocationSetup';
import CropAdvisoryPage from './pages/CropAdvisoryPage';
import PestDetectionPage from './pages/PestDetectionPage';
import FarmDigitalTwinPage from './pages/FarmDigitalTwinPage';
import FarmOnboardingPage from './pages/FarmOnboardingPage';
import ForecastModels from './pages/ForecastModels';
import CropAnalytics from './pages/CropAnalytics';
import RiskAnalytics from './pages/RiskAnalytics';
import CropDiseaseDetection from './pages/CropDiseaseDetection';
import LaborRegisterPage from './pages/LaborRegisterPage';
import LaborDashboard from './pages/LaborDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FindLaborPage from './pages/FindLaborPage';
import LaborProfileDetail from './pages/LaborProfileDetail';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import FarmingCalendar from './pages/FarmingCalendar';
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={isAuthenticated ? <FarmOnboardingPage /> : <Navigate to="/login" />} />
        <Route path="/setup-location" element={isAuthenticated ? <FarmLocationSetup /> : <Navigate to="/login" />} />
        <Route path="/crop-advisory" element={isAuthenticated ? <CropAdvisoryPage /> : <Navigate to="/login" />} />
        <Route path="/pest-detection" element={isAuthenticated ? <PestDetectionPage /> : <Navigate to="/login" />} />
        <Route path="/digital-twin" element={isAuthenticated ? <FarmDigitalTwinPage /> : <Navigate to="/login" />} />
        <Route path="/forecast-models" element={isAuthenticated ? <ForecastModels /> : <Navigate to="/login" />} />
        <Route path="/crop-analytics" element={isAuthenticated ? <CropAnalytics /> : <Navigate to="/login" />} />
        <Route path="/risk-analytics" element={isAuthenticated ? <RiskAnalytics /> : <Navigate to="/login" />} />
        <Route path="/disease-detection" element={isAuthenticated ? <CropDiseaseDetection /> : <Navigate to="/login" />} />
        <Route path="/labor-register" element={<LaborRegisterPage />} />
        <Route path="/labor-dashboard" element={isAuthenticated ? <LaborDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/coordinator-dashboard" element={isAuthenticated ? <CoordinatorDashboard /> : <Navigate to="/login" />} />
        <Route path="/find-labor" element={isAuthenticated ? <FindLaborPage /> : <Navigate to="/login" />} />
        <Route path="/labor/:id" element={isAuthenticated ? <LaborProfileDetail /> : <Navigate to="/login" />} />
        <Route path="/farming-calendar" element={isAuthenticated ? <FarmingCalendar /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
