import React, { useState } from 'react';
import { useLocation, Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../api/user';

import { LogOut, LayoutDashboard, Briefcase, Users, GraduationCap, 
  FileText, Lightbulb, UserCog, DollarSign,
} from 'lucide-react';
import { ROLES } from '../constants/role';

// Sidebar Component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigation = [
    { name: 'Dashboard', path: '/dashboard/home', icon: LayoutDashboard, requireAdmin:false },
    { name: 'Offres', path: '/dashboard/offres', icon: Briefcase, requireAdmin:true },
    { name: 'Candidatures', path: '/dashboard/candidatures', icon: Users, requireAdmin:false },
    { name: 'Payements', path: '/dashboard/paiement', icon: DollarSign, requireAdmin:true },
    { name: 'Formations', path: '/dashboard/formations', icon: GraduationCap, requireAdmin:false },
    { name: 'Blogs', path: '/dashboard/blogs', icon: FileText, requireAdmin:true },
    { name: 'Besoins', path: '/dashboard/besoins', icon: Lightbulb, requireAdmin:true },
    { name: 'Utilisateurs', path: '/dashboard/users', icon: UserCog, requireAdmin:true },
  ];

  const isActive = (path) => location.pathname === path;
  //role de l'utilisateur pour conditionner l'affichage
  const user =  JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role;
  const isAdmin = userRole == ROLES.ADMIN;
  
  const logoutUser = async ()=>{
    await logout();
    navigate('/login');
    
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-black 
        transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        {/* Logo Area */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-lime-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Bénin Emploi +</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.filter(item=>
            {
              // Si le menu nécessite admin, on vérifie
              if (item.requireAdmin) {
                return isAdmin;
              }
              return true;
            }
          ).map((item) => (

              <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`
                w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-lime-600 text-white shadow-sm shadow-lime-600/30' 
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}
              `}
            >
              <item.icon className="mr-3.5 h-5 w-5 text-amber-500" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={logoutUser}
            className="w-full flex items-center px-4 py-3.5 text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-slate-800/50 rounded-xl transition-all duration-200"
          >
            <LogOut className="mr-3.5 h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;