
import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, User, LogOut, Settings, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/user';

const Header = ({ toggleSidebar, title }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user =  JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const logoutUser = async ()=>{
      await logout();
      navigate('/login');
      
    }
  
  return (
    <header className="sticky top-0 z-10 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl text-slate-600 lg:hidden hover:bg-slate-100 transition-colors"
        >
          <Menu size={24} />
        </button>
        
        {/* Page Title */}
        <div className="ml-4 lg:ml-0">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center ml-8 flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 hover:bg-slate-50 rounded-xl px-3 py-2 transition-all"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-lime-600 text-white font-bold"> 
              {user.nom[0]}{user.prenom[0]} 
            </span>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-slate-800"> {user.prenom}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
            <ChevronDown size={18} className="text-slate-400 hidden lg:block" />
          </button>

          {isProfileOpen && (
  <div className="absolute right-0 mt-3 w-56 bg-white text-slate-700 text-left rounded-2xl shadow-2xl border border-slate-200 py-2 z-50">
    
    <Link
      to="/dashboard/profile"
      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
    >
      <User size={18} className="text-slate-400" />
      <span>Mon profil</span>
    </Link>

    <Link
      to="/dashboard/settings"
      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
    >
      <Settings size={18} className="text-slate-400" />
      <span>Paramètres</span>
    </Link>

    <hr className="my-2 border-slate-100" />

    <button 
    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
    onClick = {logoutUser}
    >
      <LogOut size={18} />
      
      <span>Déconnexion</span>
    </button>
  </div>
)}

        </div>
      </div>
    </header>
  );
};

export default Header;