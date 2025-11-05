import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import PropertyManagement from '../../pages/admin/PropertyManagement';
import ResidentialPropertiesAdmin from '../../pages/admin/ResidentialPropertiesAdmin';
import ServicesManagement from '../../pages/admin/ServicesManagement';
import CertificationsManagement from '../../pages/admin/CertificationsManagement';
import NeighborhoodsManagement from '../../pages/admin/NeighborhoodsManagement';
import PropertyTypesManagement from '../../pages/admin/PropertyTypesManagement';
import PortfolioManagement from '../../pages/admin/PortfolioManagement';
import FeaturedProjectsManagement from '../../pages/admin/FeaturedProjectsManagement';
import ProfileManagement from '../../pages/admin/ProfileManagement';
import SettingsManagement from '../../pages/admin/SettingsManagement';
import CarouselManagement from '../../pages/admin/CarouselManagement';
import FeaturedProjectsManagementLocal from '../../pages/admin/FeaturedProjectsManagementLocal';
import NeighborhoodsManagementLocal from '../../pages/admin/NeighborhoodsManagementLocal';

interface AdminRoutesProps {
  onLogout?: () => void;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ onLogout }) => {
  console.log('AdminRoutes component is rendering');
  
  return (
    <AdminLayout onLogout={onLogout}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/properties" element={<PropertyManagement />} />
        <Route path="/residential-properties" element={<ResidentialPropertiesAdmin />} />
        <Route path="/services" element={<ServicesManagement />} />
        <Route path="/certifications" element={<CertificationsManagement />} />
        <Route path="/neighborhoods" element={<NeighborhoodsManagement />} />
        <Route path="/neighborhoods-local" element={<NeighborhoodsManagementLocal />} />
        <Route path="/property-types" element={<PropertyTypesManagement />} />
        <Route path="/portfolio" element={<PortfolioManagement />} />
        <Route path="/featured-projects" element={<FeaturedProjectsManagement />} />
        <Route path="/featured-projects-local" element={<FeaturedProjectsManagementLocal />} />
        <Route path="/carousel-properties" element={<CarouselManagement />} />
        <Route path="/profile" element={<ProfileManagement />} />
        <Route path="/settings" element={<SettingsManagement />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
