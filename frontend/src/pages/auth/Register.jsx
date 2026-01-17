import { useState } from 'react';
import { Mail, Lock, User, Upload, Briefcase } from 'lucide-react';
import { register } from '../../api/user';
import { ROLES } from '../../constants/role';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    profile: '',
    photo: null,
    email: '',
    password: '',
    role: ROLES.CANDIDAT,
  });
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.profile.trim()) newErrors.profile = 'Le profile est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Envoi au backend
    try {
      const response = await register(formData);
      console.log(response);
      
      alert('Inscription réussie ! Bienvenue sur BENIN EMPLOI+');
      navigate('/login');
    } catch (error) {
      const res = error.response
      if(res && res.data && res.status === 422){
        console.log('Yes');
        
      }
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800">
              BENIN <span className="text-lime-600">EMPLOI+</span>
            </h1>
            <p className="text-slate-600 mt-2">Créez votre compte candidat</p>
          </div>
          {/* <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.nom 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 focus:ring-lime-500 focus:border-lime-500'
                  }`}
                  placeholder="Votre nom"
                />
              </div>
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.prenom 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 focus:ring-lime-500 focus:border-lime-500'
                  }`}
                  placeholder="Votre prénom"
                />
              </div>
              {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                profile
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="profile"
                  value={formData.profile}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.profile 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 focus:ring-lime-500 focus:border-lime-500'
                  }`}
                  placeholder="Ex: Développeur Web, Comptable..."
                />
              </div>
              {errors.profile && <p className="text-red-500 text-sm mt-1">{errors.profile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Photo de profile <span className="text-slate-400">(optionnel)</span>
              </label>
              <div className="flex items-center gap-4">
                {photoPreview && (
                  <img 
                    src={photoPreview} 
                    alt="Aperçu" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-lime-500"
                  />
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-lime-500 transition">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {formData.photo ? formData.photo.name : 'Choisir une photo'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 focus:ring-lime-500 focus:border-lime-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              Créer mon compte
            </button>
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="block text-left text-sm font-medium text-slate-700 mb-1">
                Nom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 transition ${
                    errors.nom
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-lime-500'
                  }`}
                  placeholder="Votre nom"
                />
              </div>
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
            </div>

            <div>
              <label className="block text-left text-sm font-medium text-slate-700 mb-1">
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 transition ${
                    errors.prenom
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-lime-500'
                  }`}
                  placeholder="Votre prénom"
                />
              </div>
              {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* profile */}
          <div>
            <label className="block text-left text-sm font-medium text-slate-700 mb-1">
              profile
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="text"
                name="profile"
                value={formData.profile}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 transition ${
                  errors.profile
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-lime-500'
                }`}
                placeholder="Ex : Analyste programmeur"
              />
            </div>
            {errors.profile && <p className="text-red-500 text-sm mt-1">{errors.profile}</p>}
          </div>
          <div>
              <label className="block test-left text-sm font-medium text-slate-700 mb-1">
                Photo de profile <span className="text-slate-400">(optionnel)</span>
              </label>
              <div className="flex items-center gap-4">
                {photoPreview && (
                  <img 
                    src={photoPreview} 
                    alt="Aperçu" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-lime-500"
                  />
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-lime-500 transition">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {formData.photo ? formData.photo.name : 'Choisir une photo'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
          {/* Email */}
           <div>
            <label className="block text-left text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 transition ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-lime-500'
                }`}
                placeholder="votre@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div> 
          {/* password */}
          <div>
            <label className="block text-left text-sm font-medium text-slate-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 transition ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-300 focus:ring-lime-500'
                }`}
                placeholder="Minimum 6 caractères"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="w-full md:w-auto bg-lime-600 hover:bg-lime-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              Créer mon compte
            </button>
          </div>
          

 
        </div>
        




          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Vous avez déjà un compte ?{' '}
              <a href="/login" className="text-lime-600 hover:text-lime-700 font-semibold">
                Se connecter
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

export default Register;