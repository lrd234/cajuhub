import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminDashboard } from '@/components/AdminDashboard';

const Admin = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};

export default Admin;