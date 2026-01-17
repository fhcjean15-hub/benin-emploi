import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { getCsrf, login } from '../../api/user';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }
    
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Envoie au backend
    try {
      console.log('Données de connexion:', formData);
      await getCsrf()
      const response = await login(formData);
      console.log(response);
      
      alert('Connexion réussie ! Bienvenue sur BENIN EMPLOI+');
      // Redirection vers le dashboard
      navigate('/dashboard/home');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setErrors({ general: 'Identifiants incorrects' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}
          <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            BENIN <span className="text-lime-600">EMPLOI+</span>
          </h1>
          <p className="text-slate-600 mt-2">Connectez-vous à votre compte</p>
        </div>

          <div className="space-y-5">
            <div>
              <label className="block text-left text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 focus:ring-lime-500 focus:border-lime-500'
                  }`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  Mot de passe
                </label>
                <a href="/forgot-password" className="text-sm text-lime-600 hover:text-lime-700">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 focus:ring-lime-500 focus:border-lime-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Vous n'avez pas de compte ?{' '}
              <a href="/register" className="text-lime-600 hover:text-lime-700 font-semibold">
                Créer un compte
              </a>
            </p>
          </div>

          
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          © 2025 BENIN EMPLOI+ - Tous droits réservés
        </p>
      </div>
    </div>
  );
};

export default Login;