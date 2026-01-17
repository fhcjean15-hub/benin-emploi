// src/pages/dashboard/Dashboard.jsx
import React from 'react';
import { Briefcase, Users, 
  FileText, Lightbulb,  TrendingUp, TrendingDown,
  Calendar, MapPin, Clock, DollarSign, Eye, Download
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { 
      label: 'Offres Actives', 
      value: '12', 
      change: '+12%',
      trend: 'up',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Candidatures', 
      value: '154', 
      change: '+23%',
      trend: 'up',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50'
    },
    { 
      label: 'Nouveaux Besoins', 
      value: '5', 
      change: '-8%',
      trend: 'down',
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50'
    },
    { 
      label: 'Taux de Conversion', 
      value: '68%', 
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
  ];

  const recentApplications = [
    { name: 'Marie Dubois', position: 'Développeur Full Stack', date: '2h', location: 'Paris', status: 'new' },
    { name: 'Pierre Martin', position: 'Chef de Projet', date: '5h', location: 'Lyon', status: 'review' },
    { name: 'Sophie Laurent', position: 'Designer UX/UI', date: '1j', location: 'Marseille', status: 'interview' },
    { name: 'Thomas Bernard', position: 'Data Analyst', date: '2j', location: 'Toulouse', status: 'review' },
    { name: 'Julie Petit', position: 'Marketing Manager', date: '3j', location: 'Nice', status: 'new' },
  ];

  const topOffers = [
    { title: 'Développeur React Senior', applications: 45, views: 1250, salary: '55-70K€' },
    { title: 'Product Manager', applications: 32, views: 980, salary: '60-80K€' },
    { title: 'Designer UX/UI Senior', applications: 28, views: 850, salary: '45-60K€' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page Intro */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 mt-1">Bienvenue sur votre plateforme de recrutement</p>
        </div>
        
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-6 w-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{filter: 'none', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}} />
              </div>
              <div className={`flex items-center text-sm font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Candidatures Récentes</h2>
            <p className="text-sm text-slate-500 mt-1">Dernières candidatures reçues</p>
          </div>
          <div className="divide-y divide-slate-100">
            {recentApplications.map((app, idx) => (
              <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${app.name}&background=random`}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                      alt={app.name}
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{app.name}</h3>
                      <p className="text-sm text-slate-600">{app.position}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="flex items-center text-xs text-slate-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {app.location}
                        </span>
                        <span className="flex items-center text-xs text-slate-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {app.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                    app.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    app.status === 'review' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {app.status === 'new' ? 'Nouveau' : app.status === 'review' ? 'En revue' : 'Entretien'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Offers */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Offres Populaires</h2>
            <p className="text-sm text-slate-500 mt-1">Vos meilleures offres</p>
          </div>
          <div className="p-6 space-y-5">
            {topOffers.map((offer, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl hover:shadow-md transition-all">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">{offer.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      Candidatures
                    </span>
                    <span className="font-semibold text-slate-900">{offer.applications}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center">
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Vues
                    </span>
                    <span className="font-semibold text-slate-900">{offer.views}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center">
                      <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                      Salaire
                    </span>
                    <span className="font-semibold text-slate-900">{offer.salary}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;