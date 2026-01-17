import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Mapping des titres en fonction de la route
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    const titles = {
      'home': 'Tableau de bord',
      'offres': 'Gestion des Offres',
      'candidatures': 'Candidatures',
      'formations': 'Catalogue Formations',
      'blogs': 'Articles & Blogs',
      'besoins': 'Besoins Clients',
      'utilisateurs': 'Administration Utilisateurs',
      'profile': 'Mon Profil',
      'settings': 'Paramètres',
    };
    return titles[path] || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          title={getPageTitle()}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-6 mx-auto">
            {/* Contenu dynamique via React Router */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;