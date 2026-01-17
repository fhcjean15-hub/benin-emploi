// src/pages/dashboard/ProfileForm.jsx
import { useEffect, useState } from "react";
import {
  User,
  Upload,
  FileText,
  Save,
  Camera,
  Trash2,
  Mail,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { updateProfile, deleteDocument, getUser } from "../../api/user";
import { ROLES } from "../../constants/role";

export default function Profile() {
  const [user, setUser] = useState(null);
  const userRole = user?.role;
  const isCandidate = userRole ===  ROLES.CANDIDAT;
  const [photoLoading, setPhotoLoading] = useState(true);

  const [form, setForm] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    profile: "",
    password: "",
    password_confirmation: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [newDocuments, setNewDocuments] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const BASE_URL_FILE = 'https://api-benin-emploi.lamadonebenin.com/storage/';
  // const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
        
        // 🔥 IMPORTANT : hydrater le formulaire ici
        setForm({
          nom: data.nom || "",
          prenom: data.prenom || "",
          email: data.email || "",
          profile: data.profile || "",
          password: "",
          password_confirmation: "",
        });

        let docs = [];

        if (Array.isArray(data.doc_url)) {
          docs = data.doc_url;
        } else if (typeof data.doc_url === "string") {
          try {
            docs = JSON.parse(data.doc_url);
          } catch (e) {
            console.log(e);
            
            docs = [];
          }
        } else if (typeof data.doc_url === "object" && data.doc_url !== null) {
          docs = Object.values(data.doc_url);
        }

        setDocuments(docs);
        
      } catch (err) {
        console.error(err);
      } finally {
        // setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);
  
  console.log(documents);
  

  useEffect(() => {
    return () => {
      if (photoFile) URL.revokeObjectURL(photoFile);
    };
  }, [photoFile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleDocumentsChange = (e) => {
    setNewDocuments([...newDocuments, ...Array.from(e.target.files)]);
  };

  const handleDeleteDocument = async (index) => {
    try {
      const res = await deleteDocument(index); // on passe l'index
      alert("Document supprimé avec succès");
      setDocuments(res.doc_url); // la réponse renvoie directement le tableau
    } catch (err) {
      console.log("Erreur deleteDocument:", err);
      alert("Erreur lors de la suppression du document");
    }
  };


  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    const formData = new FormData();
    formData.append("nom", form.nom);
    formData.append("prenom", form.prenom);
    formData.append("profile", form.profile);
    formData.append("email", form.email);
    if (form.password) {
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation);
    }
    if (photoFile) formData.append("photo", photoFile);
    newDocuments.forEach((file) => formData.append("documents[]", file));

    formData.append('_method', 'PUT');

    try {
      await updateProfile(formData);
      alert("Profil mis à jour avec succès");
      setNewDocuments([]);
    } catch (err) {
      if (err?.response?.data?.errors) setErrors(err.response.data.errors);
      else alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* Header */}
      <div>
        <p className="text-slate-500 mt-1">
          Gérez vos informations personnelles et documents
        </p>
      </div>

      {/* Profil Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-28 h-28">

          {/* Loader */}
          {photoLoading && (
            <div className="absolute inset-0 rounded-2xl bg-slate-200 animate-pulse ring-2 ring-slate-100" />
          )}

          {/* Image */}
          <img
            src={
              photoFile
                ? URL.createObjectURL(photoFile)
                : user?.photo
                  ? `${BASE_URL_FILE}${user.photo}`
                  : "https://ui-avatars.com/api/?name=User"
            }
            alt="Profil"
            onLoad={() => setPhotoLoading(false)}
            onError={() => setPhotoLoading(false)}
            className={`w-28 h-28 rounded-2xl object-cover ring-2 ring-slate-100 transition-opacity duration-300 ${
              photoLoading ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Bouton caméra */}
          <label className="absolute bottom-2 right-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 cursor-pointer z-10">
            <Camera className="w-4 h-4" />
            <input
              type="file"
              hidden
              onChange={(e) => {
                setPhotoLoading(true);
                handlePhotoChange(e);
              }}
            />
          </label>

          </div>


        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold text-slate-900">
            {form.prenom} {form.nom}
          </h2>
          <p className="text-slate-500">{form.email}</p>
          <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">
            {user?.role === "admin" ? "Administrateur" : "Candidat"}
          </span>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Informations personnelles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-slate-600">Nom</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
            />
            {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
            />
            {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-600">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-600">
            Profil / Fonction
          </label>
          <input
            type="text"
            name="profile"
            value={form.profile}
            onChange={handleChange}
            placeholder="Ex: Développeur web"
            className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
          />
          {errors.profile && (
            <p className="text-red-500 text-sm mt-1">{errors.profile}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-600">Nouveau mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full pl-10 pr-12 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
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

          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              className="mt-1 w-full pl-10 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
              placeholder="Confirmer le mot de passe"
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Documents
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isCandidate && (
            <div className="border border-dashed border-slate-300 rounded-xl p-5 text-center hover:bg-slate-50 transition">
              <Upload className="w-6 h-6 mx-auto text-slate-500 mb-2" />
              <p className="text-sm font-medium text-slate-700">Télécharger votre CV</p>
              <p className="text-xs text-slate-500 mt-1">PDF recommandé</p>
              <input type="file" onChange={handleDocumentsChange} className="mt-2" />
            </div>
          )}
          <div className="border border-dashed border-slate-300 rounded-xl p-5 text-center hover:bg-slate-50 transition">
            <Upload className="w-6 h-6 mx-auto text-slate-500 mb-2" />
            <p className="text-sm font-medium text-slate-700">Document complémentaire</p>
            <p className="text-xs text-slate-500 mt-1">Contrat, attestation, etc.</p>
            <input type="file" multiple onChange={handleDocumentsChange} className="mt-2" />
          </div>
        </div>

        {Array.isArray(documents) && documents.length > 0 && (
          <div className="mt-4 space-y-2">
            {documents.map((doc, idx) => {
              const fileName = doc.split("/").pop(); // extraire nom du fichier
              return (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
                  <a
                    href={`${BASE_URL_FILE}${doc}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-slate-700"
                  >
                    {fileName}
                  </a>
                  <button
                    onClick={() => handleDeleteDocument(idx)} // passe le chemin complet pour suppression
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold transition"
        >
          <Save className="w-4 h-4" />
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>

    </div>
  );
};













// // src/pages/dashboard/Profile.jsx
// // src/pages/dashboard/Profile.jsx
// import { useState } from "react";
// import {
//   User,
//   Upload,
//   FileText,
//   Save,
//   Camera,
//   Trash2,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff
// } from "lucide-react";
// import { updateProfile, deleteDocument } from "../../api/user";

// const Profile = ({ user }) => {
//   const isCandidate = user?.role === "candidat";

//   const [form, setForm] = useState({
//     nom: user?.nom || "",
//     prenom: user?.prenom || "",
//     profile: user?.profile || "",
//     email: user?.email || "",
//     password: "",
//     password_confirmation: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [photoFile, setPhotoFile] = useState(null);
//   const [documents, setDocuments] = useState(user?.doc_url || []);
//   const [newDocuments, setNewDocuments] = useState([]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const handlePhotoChange = (e) => {
//     setPhotoFile(e.target.files[0]);
//   };

//   const handleDocumentsChange = (e) => {
//     setNewDocuments([...newDocuments, ...Array.from(e.target.files)]);
//   };

//   const handleDeleteDocument = async (index) => {
//     try {
//       const res = await deleteDocument(index);
//       setDocuments(res.doc_url);
//     } catch (err) {
//       console.log(err);
      
//       alert("Erreur lors de la suppression du document");
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setErrors({});

//     const formData = new FormData();
//     formData.append("nom", form.nom);
//     formData.append("prenom", form.prenom);
//     formData.append("profile", form.profile);
//     formData.append("email", form.email);
//     if (form.password) {
//       formData.append("password", form.password);
//       formData.append("password_confirmation", form.password_confirmation);
//     }
//     if (photoFile) formData.append("photo", photoFile);
//     newDocuments.forEach((file) => formData.append("documents[]", file));

//     try {
//       await updateProfile(formData);
//       alert("Profil mis à jour avec succès");
//       setNewDocuments([]);
//     } catch (err) {
//       if (err?.response?.data?.errors) {
//         setErrors(err.response.data.errors);
//       } else {
//         alert("Erreur lors de la mise à jour");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 pb-10">

//       {/* Carte Profil */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 flex gap-6 items-center">
//         <div className="relative">
//           <img
//             src={
//               photoFile
//                 ? URL.createObjectURL(photoFile)
//                 : user?.photo
//                   ? user.photo
//                   : `https://ui-avatars.com/api/?name=${form.prenom}+${form.nom}`
//             }
//             className="w-28 h-28 rounded-2xl object-cover"
//           />
//           <label className="absolute bottom-2 right-2 p-2 bg-slate-900 text-white rounded-lg cursor-pointer">
//             <Camera className="w-4 h-4" />
//             <input type="file" hidden onChange={handlePhotoChange} />
//           </label>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold">{form.prenom} {form.nom}</h2>
//           <p className="text-slate-500">{form.email}</p>
//         </div>
//       </div>

//       {/* Infos personnelles */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-5">
//         <h3 className="font-bold flex items-center gap-2"><User className="w-5 h-5" /> Informations personnelles</h3>
//         <div className="grid md:grid-cols-2 gap-5">
//           <input
//             name="nom"
//             value={form.nom}
//             onChange={handleChange}
//             placeholder="Nom"
//             className="input-login"
//           />
//           <input
//             name="prenom"
//             value={form.prenom}
//             onChange={handleChange}
//             placeholder="Prénom"
//             className="input-login"
//           />
//         </div>
//         <textarea
//           name="profile"
//           value={form.profile}
//           onChange={handleChange}
//           placeholder="Profil professionnel"
//           rows={4}
//           className="input-login"
//         />
//       </div>

//       {/* Email */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6">
//         <label className="text-sm font-medium text-slate-700 mb-2 block">Email</label>
//         <div className="relative">
//           <Mail className="icon-login" />
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="input-login pl-10"
//           />
//         </div>
//         {errors.email && <p className="error">{errors.email}</p>}
//       </div>

//       {/* Mot de passe */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
//         <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
//         <div className="relative">
//           <Lock className="icon-login" />
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             className="input-login pl-10 pr-12"
//             placeholder="••••••••"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="eye-btn"
//           >
//             {showPassword ? <EyeOff /> : <Eye />}
//           </button>
//         </div>
//         <div className="relative">
//           <Lock className="icon-login" />
//           <input
//             type="password"
//             name="password_confirmation"
//             value={form.password_confirmation}
//             onChange={handleChange}
//             className="input-login pl-10"
//             placeholder="Confirmer le mot de passe"
//           />
//         </div>
//         {errors.password && <p className="error">{errors.password}</p>}
//       </div>

//       {/* Documents */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
//         <h3 className="font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> Documents</h3>

//         {isCandidate && (
//           <div className="border border-dashed border-slate-300 rounded-xl p-5 text-center hover:bg-slate-50 transition">
//             <Upload className="w-6 h-6 mx-auto text-slate-500 mb-2" />
//             <p className="text-sm font-medium text-slate-700">CV et documents multiples</p>
//             <input type="file" multiple onChange={handleDocumentsChange} className="mt-2" />
//           </div>
//         )}

//         <div className="space-y-2">
//           {documents.map((doc, idx) => (
//             <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
//               <a href={`${import.meta.env.REACT_APP_API_URL}/storage/${doc}`} target="_blank" rel="noreferrer" className="truncate text-slate-700">
//                 {doc.split('/').pop()}
//               </a>
//               <button onClick={() => handleDeleteDocument(idx)} className="text-red-600 hover:text-red-800">
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end">
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-lg font-semibold"
//         >
//           {loading ? "Enregistrement..." : "Enregistrer"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;








// import { useState } from "react";
// import {
//   User,
//   Upload,
//   FileText,
//   Save,
//   Camera,
//   Trash2,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff
// } from "lucide-react";
// import { updateProfile, deleteDocument } from "../../api/user";

// const DocumentItem = ({ label, fileUrl, onDelete }) => (
//   <div className="border border-dashed border-slate-300 rounded-xl p-4 flex justify-between items-center hover:bg-slate-50 transition">
//     <div>
//       <p className="text-sm font-medium text-slate-700">{label}</p>
//       {fileUrl ? (
//         <a href={fileUrl} target="_blank" className="text-lime-600 text-xs hover:underline">
//           Voir le fichier
//         </a>
//       ) : (
//         <p className="text-xs text-slate-500 mt-1">Aucun fichier</p>
//       )}
//     </div>
//     {fileUrl && (
//       <button onClick={onDelete}>
//         <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 transition" />
//       </button>
//     )}
//   </div>
// );

// const Profile = ({ user }) => {
//   const isCandidate = user?.role === "candidat";

//   const [form, setForm] = useState({
//     nom: user?.nom || "",
//     prenom: user?.prenom || "",
//     profile: user?.profile || "",
//     email: user?.email || "",
//     password: "",
//     password_confirmation: "",
//   });

//   const [photoFile, setPhotoFile] = useState(null);
//   const [cvFile, setCvFile] = useState(null);
//   const [otherDocs, setOtherDocs] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const documents = user?.doc_url || {};

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const handleFileChange = (e, type) => {
//     if (!e.target.files[0]) return;
//     if (type === "photo") setPhotoFile(e.target.files[0]);
//     else if (type === "cv") setCvFile(e.target.files[0]);
//     else setOtherDocs([...otherDocs, e.target.files[0]]);
//   };

//   const handleDeleteDocument = async (type) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer ce document ?")) return;
//     try {
//       await deleteDocument(type);
//       alert("Document supprimé");
//       // mettre à jour l'affichage
//       if (type === "cv") setCvFile(null);
//       else delete documents[type];
//     } catch (err) {
//       console.log(err);
      
//       alert("Erreur suppression document");
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setErrors({});

//     try {
//       const formData = new FormData();

//       Object.keys(form).forEach((key) => {
//         if (form[key]) formData.append(key, form[key]);
//       });

//       if (photoFile) formData.append("photo", photoFile);
//       if (cvFile) formData.append("cv", cvFile);
//       otherDocs.forEach((file, i) => formData.append(`documents[${i}]`, file));
      
//       // Clé _method pour simuler un PUT
//       formData.append("_method", "PUT");
      
//       await updateProfile(formData);

//       alert("Profil mis à jour avec succès");
//     } catch (err) {
//       if (err?.response?.data?.errors) setErrors(err.response.data.errors);
//       else alert("Erreur lors de la mise à jour");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 pb-10">

//       {/* Carte Profil */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 flex gap-6 items-center">
//         <div className="relative">
//           <img
//             src={
//               photoFile
//                 ? URL.createObjectURL(photoFile)
//                 : user?.photo
//                 ? user.photo
//                 : `https://ui-avatars.com/api/?name=${form.prenom}+${form.nom}`
//             }
//             className="w-28 h-28 rounded-2xl object-cover"
//           />
//           <label className="absolute bottom-2 right-2 p-2 bg-slate-900 text-white rounded-lg cursor-pointer">
//             <Camera className="w-4 h-4" />
//             <input type="file" hidden onChange={(e) => handleFileChange(e, "photo")} />
//           </label>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold">{form.prenom} {form.nom}</h2>
//           <p className="text-slate-500">{form.email}</p>
//         </div>
//       </div>

//       {/* Infos personnelles */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-5">
//         <h3 className="font-bold flex items-center gap-2"><User className="w-5 h-5" /> Informations personnelles</h3>
//         <div className="grid md:grid-cols-2 gap-5">
//           <input
//             name="nom"
//             value={form.nom}
//             onChange={handleChange}
//             placeholder="Nom"
//             className="input-login"
//           />
//           <input
//             name="prenom"
//             value={form.prenom}
//             onChange={handleChange}
//             placeholder="Prénom"
//             className="input-login"
//           />
//         </div>
//         <textarea
//           name="profile"
//           value={form.profile}
//           onChange={handleChange}
//           placeholder="Profil professionnel"
//           rows={4}
//           className="input-login"
//         />
//       </div>

//       {/* Email */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6">
//         <label className="text-sm font-medium text-slate-700 mb-2 block">Email</label>
//         <div className="relative">
//           <Mail className="icon-login" />
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="input-login pl-10"
//           />
//         </div>
//         {errors.email && <p className="error">{errors.email}</p>}
//       </div>

//       {/* Mot de passe */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
//         <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
//         <div className="relative">
//           <Lock className="icon-login" />
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             className="input-login pl-10 pr-12"
//             placeholder="••••••••"
//           />
//           <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn">
//             {showPassword ? <EyeOff /> : <Eye />}
//           </button>
//         </div>
//         <div className="relative">
//           <Lock className="icon-login" />
//           <input
//             type="password"
//             name="password_confirmation"
//             value={form.password_confirmation}
//             onChange={handleChange}
//             className="input-login pl-10"
//             placeholder="Confirmer le mot de passe"
//           />
//         </div>
//         {errors.password && <p className="error">{errors.password}</p>}
//       </div>

//       {/* Documents */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
//         <h3 className="font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> Documents</h3>

//         {/* CV candidat */}
//         {isCandidate && (
//           <div>
//             <input type="file" hidden id="cv-upload" onChange={(e) => handleFileChange(e, "cv")} />
//             <label htmlFor="cv-upload" className="border border-dashed border-slate-300 rounded-xl p-5 w-full block text-center cursor-pointer hover:bg-slate-50">
//               <Upload className="mx-auto mb-2 w-6 h-6 text-slate-500" />
//               <p className="text-sm font-medium text-slate-700">Télécharger votre CV</p>
//               {documents.cv && <DocumentItem label="CV actuel" fileUrl={documents.cv} onDelete={() => handleDeleteDocument("cv")} />}
//             </label>
//           </div>
//         )}

//         {/* Document complémentaire */}
//         <div>
//           <input type="file" hidden id="doc-upload" onChange={(e) => handleFileChange(e, "document")} />
//           <label htmlFor="doc-upload" className="border border-dashed border-slate-300 rounded-xl p-5 w-full block text-center cursor-pointer hover:bg-slate-50">
//             <Upload className="mx-auto mb-2 w-6 h-6 text-slate-500" />
//             <p className="text-sm font-medium text-slate-700">Ajouter un document complémentaire</p>
//             {documents.document && <DocumentItem label="Document actuel" fileUrl={documents.document} onDelete={() => handleDeleteDocument("document")} />}
//           </label>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end">
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-lg font-semibold"
//         >
//           {loading ? "Enregistrement..." : "Enregistrer"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;







// import { useState } from "react";
// import {
//   User,
//   Upload,
//   FileText,
//   Save,
//   Camera,
//   Trash2,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff
// } from "lucide-react";
// import { updateProfile } from "../../api/user";

// const Profile = ({ user }) => {
//   const isCandidate = user?.role === "candidat";

//   const [form, setForm] = useState({
//     nom: user?.nom || "",
//     prenom: user?.prenom || "",
//     profile: user?.profile || "",
//     email: user?.email || "",
//     password: "",
//     password_confirmation: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const documents = user?.doc_url || {};

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     if (errors[e.target.name]) {
//       setErrors({ ...errors, [e.target.name]: "" });
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setErrors({});

//     try {
//       await updateProfile(form);
//       alert("Profil mis à jour avec succès");
//     } catch (err) {
//       if (err?.response?.data?.errors) {
//         setErrors(err.response.data.errors);
//       } else {
//         alert("Erreur lors de la mise à jour");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 pb-10">

//       {/* Carte Profil */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 flex gap-6 items-center">
//         <div className="relative">
//           <img
//             src={
//               user?.photo
//                 ? user.photo
//                 : `https://ui-avatars.com/api/?name=${form.prenom}+${form.nom}`
//             }
//             className="w-28 h-28 rounded-2xl object-cover"
//           />
//           <label className="absolute bottom-2 right-2 p-2 bg-slate-900 text-white rounded-lg cursor-pointer">
//             <Camera className="w-4 h-4" />
//             <input type="file" hidden />
//           </label>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold">
//             {form.prenom} {form.nom}
//           </h2>
//           <p className="text-slate-500">{form.email}</p>
//         </div>
//       </div>

//       {/* Infos personnelles */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-5">
//         <h3 className="font-bold flex items-center gap-2">
//           <User className="w-5 h-5" /> Informations personnelles
//         </h3>

//         <div className="grid md:grid-cols-2 gap-5">
//           <input
//             name="nom"
//             value={form.nom}
//             onChange={handleChange}
//             placeholder="Nom"
//             className="input-login"
//           />
//           <input
//             name="prenom"
//             value={form.prenom}
//             onChange={handleChange}
//             placeholder="Prénom"
//             className="input-login"
//           />
//         </div>

//         <textarea
//           name="profile"
//           value={form.profile}
//           onChange={handleChange}
//           placeholder="Profil professionnel"
//           rows={4}
//           className="input-login"
//         />
//       </div>

//       {/* Email */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6">
//         <label className="text-sm font-medium text-slate-700 mb-2 block">
//           Email
//         </label>
//         <div className="relative">
//           <Mail className="icon-login" />
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="input-login pl-10"
//           />
//         </div>
//         {errors.email && <p className="error">{errors.email}</p>}
//       </div>

//       {/* Mot de passe */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
//         <label className="text-sm font-medium text-slate-700">
//           Nouveau mot de passe
//         </label>

//         <div className="relative">
//           <Lock className="icon-login" />
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             className="input-login pl-10 pr-12"
//             placeholder="••••••••"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="eye-btn"
//           >
//             {showPassword ? <EyeOff /> : <Eye />}
//           </button>
//         </div>

//         <div className="relative">
//           <Lock className="icon-login" />
//           <input
//             type="password"
//             name="password_confirmation"
//             value={form.password_confirmation}
//             onChange={handleChange}
//             className="input-login pl-10"
//             placeholder="Confirmer le mot de passe"
//           />
//         </div>

//         {errors.password && <p className="error">{errors.password}</p>}
//       </div>

//       {/* Documents */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
//         <h3 className="font-bold flex items-center gap-2">
//           <FileText className="w-5 h-5" /> Documents
//         </h3>

//         {isCandidate && (
//           <DocumentItem label="CV" fileUrl={documents.cv} />
//         )}

//         <DocumentItem label="Document complémentaire" fileUrl={documents.document} />
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end">
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-3 rounded-lg font-semibold"
//         >
//           {loading ? "Enregistrement..." : "Enregistrer"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;








// import { useState } from "react";
// import {
//   User,
//   Upload,
//   FileText,
//   Save,
//   Camera,
//   Trash2
// } from "lucide-react";
// import { DocumentItem } from "../../components/ui/profile/DocumentItem";

// const Profile = ({ user }) => {
//   const isCandidate = user?.role === "candidat";

//   const [form, setForm] = useState({
//     nom: user?.nom || "",
//     prenom: user?.prenom || "",
//     profile: user?.profile || "",
//   });

//   const documents = user?.doc_url || {};

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="space-y-6 pb-10">

//       {/* Header */}
//       <p className="text-slate-500">
//         Gérez vos informations personnelles et documents
//       </p>

//       {/* Carte profil */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row items-center gap-6">
//         <div className="relative">
//           <img
//             src={
//               user?.photo
//                 ? user.photo
//                 : `https://ui-avatars.com/api/?name=${form.prenom}+${form.nom}`
//             }
//             alt="Profil"
//             className="w-28 h-28 rounded-2xl object-cover"
//           />
//           <label className="absolute bottom-2 right-2 p-2 bg-slate-900 text-white rounded-lg cursor-pointer">
//             <Camera className="w-4 h-4" />
//             <input type="file" hidden />
//           </label>
//         </div>

//         <div className="text-center md:text-left">
//           <h2 className="text-xl font-semibold">
//             {form.prenom} {form.nom}
//           </h2>
//           <p className="text-slate-500">{user?.email}</p>
//           <span className="inline-block mt-2 px-3 py-1 text-xs rounded-lg bg-slate-100">
//             {user?.role}
//           </span>
//         </div>
//       </div>

//       {/* Infos personnelles */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6">
//         <h3 className="font-bold mb-4 flex items-center gap-2">
//           <User className="w-5 h-5" /> Informations personnelles
//         </h3>

//         <div className="grid md:grid-cols-2 gap-6">
//           <input
//             name="nom"
//             value={form.nom}
//             onChange={handleChange}
//             placeholder="Nom"
//             className="input"
//           />
//           <input
//             name="prenom"
//             value={form.prenom}
//             onChange={handleChange}
//             placeholder="Prénom"
//             className="input"
//           />
//         </div>

//         <textarea
//           name="profile"
//           value={form.profile}
//           onChange={handleChange}
//           placeholder="Résumé / Profil professionnel"
//           className="input mt-4"
//           rows={4}
//         />
//       </div>

//       {/* Documents */}
//       <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
//         <h3 className="font-bold flex items-center gap-2">
//           <FileText className="w-5 h-5" /> Documents
//         </h3>

//         {/* CV */}
//         {isCandidate && (
//           <DocumentItem
//             label="CV"
//             fileUrl={documents.cv}
//           />
//         )}

//         {/* Document complémentaire */}
//         <DocumentItem
//           label="Document complémentaire"
//           fileUrl={documents.document}
//         />
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end">
//         <button className="btn-primary flex items-center gap-2">
//           <Save className="w-4 h-4" />
//           Enregistrer
//         </button>
//       </div>

//     </div>
//   );
// };

// export default Profile;












// import { useState } from "react";
// import {
//   User,
//   Upload,
//   FileText,
//   Trash2,
//   Save,
//   Camera
// } from "lucide-react";
// import DocumentItem from "../../components/ui/profile/DocumentItem";

// const Profile = ({ user }) => {
//   const isCandidate = user?.role === "candidat";

//   const [form, setForm] = useState({
//     name: user?.name,
//     email: user?.email,
//   });

//   const [files, setFiles] = useState({
//     photo: null,
//     cv: null,
//     doc: null,
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   return (
//     <div className="space-y-6 pb-10">

//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-slate-900">Mon Profil</h1>
//         <p className="text-slate-500">
//           Consultez et mettez à jour vos informations
//         </p>
//       </div>

//       {/* Profil */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col md:flex-row gap-6 items-center">
//         <div className="relative">
//           <img
//             src={user?.photo_url || "https://ui-avatars.com/api/?name=" + user?.name}
//             className="w-28 h-28 rounded-2xl object-cover"
//             alt="Profil"
//           />
//           <label className="absolute bottom-2 right-2 bg-slate-900 text-white p-2 rounded-lg cursor-pointer">
//             <Camera className="w-4 h-4" />
//             <input type="file" hidden />
//           </label>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold">{user?.name}</h2>
//           <p className="text-slate-500">{user?.email}</p>
//           <span className="inline-block mt-2 px-3 py-1 text-xs rounded-lg bg-slate-100">
//             {user?.role}
//           </span>
//         </div>
//       </div>

//       {/* Infos */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
//         <h3 className="font-bold mb-4 flex items-center gap-2">
//           <User className="w-5 h-5" /> Informations personnelles
//         </h3>

//         <div className="grid md:grid-cols-2 gap-6">
//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             className="input"
//             placeholder="Nom"
//           />
//           <input
//             value={form.email}
//             disabled
//             className="input bg-slate-50 cursor-not-allowed"
//           />
//         </div>
//       </div>

//       {/* Documents */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 space-y-6">
//         <h3 className="font-bold flex items-center gap-2">
//           <FileText className="w-5 h-5" /> Documents
//         </h3>

//         {/* CV */}
//         {isCandidate && (
//           <DocumentItem
//             label="CV"
//             url={user?.cv_url}
//             onUpload={() => {}}
//             onDelete={() => {}}
//           />
//         )}

//         {/* Document */}
//         <DocumentItem
//           label="Document complémentaire"
//           url={user?.doc_url}
//           onUpload={() => {}}
//           onDelete={() => {}}
//         />
//       </div>

//       {/* Save */}
//       <div className="flex justify-end">
//         <button className="btn-primary flex items-center gap-2">
//           <Save className="w-4 h-4" />
//           Enregistrer
//         </button>
//       </div>

//     </div>
//   );
// };

// export default Profile;







// import { useState } from "react";
// import {
//   User,
//   Upload,
//   FileText,
//   Save,
//   Camera
// } from "lucide-react";

// const Profile = ({ user }) => {
//   const [form, setForm] = useState({
//     name: user?.name || "",
//     email: user?.email || "",
//   });

//   const isCandidate = user?.role === "candidat";

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="space-y-6 pb-10">

//       {/* Header */}
//       <div>
//         {/* <h1 className="text-2xl font-bold text-slate-900">Mon Profil</h1> */}
//         <p className="text-slate-500 mt-1">
//           Gérez vos informations personnelles et documents
//         </p>
//       </div>

//       {/* Profil Card */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col md:flex-row items-center gap-6">
//         <div className="relative">
//           <img
//             src={user?.photo || "https://ui-avatars.com/api/?name=User"}
//             alt="Profil"
//             className="w-28 h-28 rounded-2xl object-cover ring-2 ring-slate-100"
//           />
//           <button className="absolute bottom-2 right-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition">
//             <Camera className="w-4 h-4" />
//           </button>
//         </div>

//         <div className="text-center md:text-left">
//           <h2 className="text-xl font-semibold text-slate-900">
//             {user?.name}
//           </h2>
//           <p className="text-slate-500">{user?.email}</p>
//           <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">
//             {user?.role === "admin" ? "Administrateur" : "Candidat"}
//           </span>
//         </div>
//       </div>

//       {/* Infos personnelles */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
//         <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
//           <User className="w-5 h-5" />
//           Informations personnelles
//         </h3>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="text-sm font-medium text-slate-600">
//               Nom complet
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-slate-600">
//               Email
//             </label>
//             <input
//               type="email"
//               value={form.email}
//               disabled
//               className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 cursor-not-allowed"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Documents */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
//         <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
//           <FileText className="w-5 h-5" />
//           Documents
//         </h3>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           {/* CV - candidat seulement */}
//           {isCandidate && (
//             <div className="border border-dashed border-slate-300 rounded-xl p-5 text-center hover:bg-slate-50 transition">
//               <Upload className="w-6 h-6 mx-auto text-slate-500 mb-2" />
//               <p className="text-sm font-medium text-slate-700">
//                 Télécharger votre CV
//               </p>
//               <p className="text-xs text-slate-500 mt-1">
//                 PDF recommandé
//               </p>
//             </div>
//           )}

//           {/* Document */}
//           <div className="border border-dashed border-slate-300 rounded-xl p-5 text-center hover:bg-slate-50 transition">
//             <Upload className="w-6 h-6 mx-auto text-slate-500 mb-2" />
//             <p className="text-sm font-medium text-slate-700">
//               Document complémentaire
//             </p>
//             <p className="text-xs text-slate-500 mt-1">
//               Contrat, attestation, etc.
//             </p>
//           </div>

//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end">
//         <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-700 transition">
//           <Save className="w-4 h-4" />
//           Enregistrer les modifications
//         </button>
//       </div>

//     </div>
//   );
// };

// export default Profile;
