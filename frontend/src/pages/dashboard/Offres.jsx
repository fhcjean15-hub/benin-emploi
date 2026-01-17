// src/pages/dashboard/Offres.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getOffres,
  deleteOffre,
} from "../../api/offre";
import {
  getCategories,
  deleteCategorie,
} from "../../api/categorie";
import { Trash2, Pencil, Plus } from "lucide-react";
import { getUser } from "../../api/user";
import { ROLES } from "../../constants/role";

export default function Offres() {
  const [user, setUser] = useState(null);
  const [offres, setOffres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("offres"); // 'offres' ou 'categories'

  const navigate = useNavigate();

  const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";
  // Récupération du user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);

      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [navigate]);

  // fetch des offres et catégories
  useEffect(() => {
    if (user && user.role === ROLES.ADMIN) {
      if (activeTab === "offres") fetchOffres();
      if (activeTab === "categories") fetchCategories();
    }
  }, [user, activeTab]);

  const fetchOffres = async () => {
    try {
      setLoading(true);
      const res = await getOffres();
      console.log(res);
      
      setOffres(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (e) {
      console.error("Erreur chargement offres", e);
      setOffres([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Erreur chargement catégories", e);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffre = async (id) => {
    if (!confirm("Supprimer cette offre ?")) return;
    try {
      await deleteOffre(id);
      fetchOffres();
    } catch (e) {
      console.error("Erreur suppression offre", e);
    }
  };

  const handleDeleteCategorie = async (id) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      await deleteCategorie(id);
      fetchCategories();
    } catch (e) {
      console.error("Erreur suppression catégorie", e);
    }
  };

  const getStatus = (date) => {
    const today = new Date().toISOString().split("T")[0];
    if (date > today) return { label: "Ouverte", color: "bg-blue-100 text-blue-700" };
    if (date === today) return { label: "Clôture aujourd'hui", color: "bg-green-100 text-green-700" };
    return { label: "Clôturée", color: "bg-slate-200 text-slate-700" };
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header + Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestion {activeTab === "offres" ? "des offres d'emploi" : "des catégories"}
          </h1>
          <p className="text-slate-500 mt-1">
            {activeTab === "offres"
              ? "Toutes les offres disponibles"
              : "Toutes les catégories d'offres"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          {/* <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="offres">Offres</option>
            <option value="categories">Catégories</option>
          </select> */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("offres")}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                activeTab === "offres"
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Offres
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                activeTab === "categories"
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Catégories
            </button>
          </div>



          {/* Bouton "Nouveau" */}
          <Link
            to={
              activeTab === "offres"
                ? "/dashboard/offres/new"
                : "/dashboard/categories/new"
            }
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold transition"
          >
            <Plus size={18} />
            {activeTab === "offres" ? "Nouvelle offre" : "Nouvelle catégorie"}
          </Link>
        </div>
      </div>

      {/* Contenu */}
      {activeTab === "offres" ? (
        // Offres
        offres.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
            Aucune offre enregistrée
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offres.map((o) => {
              const status = getStatus(o.date_cloture);
              return (
                <div
                  key={o.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <Link to={`/dashboard/offre/${o.id}`} className="block">
                    <div className="relative h-40 bg-slate-100 overflow-hidden">
                      {o.image ? (
                        <img
                          src={`${BASE_URL_FILE}${o.image}`}
                          alt={o.intitule}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 font-semibold text-lg">
                          {o.intitule}
                        </div>
                      )}

                      {/* Badge statut */}
                      <span
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>


                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                        {o.intitule}
                      </h3>
                      <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                        {o.localisation}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {o.description}
                      </p>
                      {/* <div className="text-sm text-slate-500 space-y-1">
                        <div>
                          Catégorie :{" "}
                          {categories.find((c) => c.id === o.category_id)?.titre || "Non définie"}
                        </div>
                        <div>Type contrat : {o.type_contrat}</div>
                        <div>Type offre : {o.type_offre}</div>
                        {o.duree && <div>Durée : {o.duree}</div>}
                        {o.salaire && <div>Salaire : {o.salaire} FCFA</div>}
                        <div>Date clôture : {o.date_cloture}</div>
                      </div> */}

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <Link
                          to={`/dashboard/offres/${o.id}`}
                          className="flex items-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium"
                        >
                          <Pencil size={16} />
                          Modifier
                        </Link>
                        <button
                            onClick={(e) => {
                              e.preventDefault(); // empêche la navigation
                              e.stopPropagation(); // empêche la propagation au Link parent
                              handleDeleteOffre(o.id);
                            }}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                          <Trash2 size={16} />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )
      ) : (
        // Catégories
        categories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
            Aucune catégorie enregistrée
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                    {c.titre}
                  </h3>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <Link
                      to={`/dashboard/categories/${c.id}`}
                      className="flex items-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium"
                    >
                      <Pencil size={16} />
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDeleteCategorie(c.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}









// // src/pages/dashboard/Offres.jsx
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { getOffres, deleteOffre } from "../../api/offre";
// import { getCategories } from "../../api/categorie"; // nouvelle fonction API
// import { Trash2, Pencil, Plus } from "lucide-react";
// import { getUser } from "../../api/user";
// import { ROLES } from "../../constants/role";

// export default function Offres() {
//   const [user, setUser] = useState(null);
//   const [offres, setOffres] = useState([]);
//   const [categories, setCategories] = useState([]); // pour les catégories
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   // récupération du user
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const data = await getUser();
//         setUser(data);

//         if (data.role !== ROLES.ADMIN) {
//           navigate("/dashboard"); // redirige les non-admins
//         }
//       } catch (err) {
//         console.error(err);
//         navigate("/login");
//       }
//     };
//     fetchUser();
//   }, [navigate]);

//   // fetch des offres et des catégories
//   useEffect(() => {
//     if (user && user.role === ROLES.ADMIN) {
//       fetchCategories();
//       fetchOffres();
//     }
//   }, [user]);

//   const fetchOffres = async () => {
//     try {
//       setLoading(true);
//       const res = await getOffres();
//       setOffres(Array.isArray(res.data) ? res.data : []);
//     } catch (e) {
//       console.error("Erreur chargement offres", e);
//       setOffres([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await getCategories();
//       setCategories(Array.isArray(res.data) ? res.data : []);
//     } catch (e) {
//       console.error("Erreur chargement catégories", e);
//       setCategories([]);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Supprimer cette offre ?")) return;
//     try {
//       await deleteOffre(id);
//       fetchOffres();
//     } catch (e) {
//       console.error("Erreur suppression", e);
//     }
//   };

//   const getStatus = (date) => {
//     const today = new Date().toISOString().split("T")[0];
//     if (date > today)
//       return { label: "Ouverte", color: "bg-blue-100 text-blue-700" };
//     if (date === today)
//       return { label: "Clôture aujourd'hui", color: "bg-green-100 text-green-700" };
//     return { label: "Clôturée", color: "bg-slate-200 text-slate-700" };
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-20 text-slate-500">
//         Chargement des offres...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 pb-10">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Offres d'emploi</h1>
//           <p className="text-slate-500 mt-1">Gestion des offres disponibles</p>
//         </div>

//         {/* ADMIN ONLY */}
//         <Link
//           to="/dashboard/offres/new"
//           className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold transition"
//         >
//           <Plus size={18} />
//           Nouvelle offre
//         </Link>
//       </div>

//       {/* Empty state */}
//       {offres.length === 0 ? (
//         <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
//           Aucune offre enregistrée
//         </div>
//       ) : (
//         /* Grid */
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {offres.map((o) => {
//             const status = getStatus(o.date_cloture);

//             return (
//               <div
//                 key={o.id}
//                 className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
//               >
//                 <Link to={`/dashboard/offres/${o.id}`} className="block">
//                   {/* Image Placeholder */}
//                   <div className="relative h-40 bg-slate-100 flex items-center justify-center text-slate-400 font-semibold text-lg">
//                     {o.intitule}
//                   </div>

//                   {/* Content */}
//                   <div className="p-5 space-y-3">
//                     <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
//                       {o.intitule}
//                     </h3>

//                     <p className="text-sm text-slate-600 line-clamp-2">
//                       {o.description}
//                     </p>

//                     <div className="text-sm text-slate-500 space-y-1">
//                       <div>
//                         Catégorie :{" "}
//                         {categories.find((c) => c.id === o.category_id)?.titre || "Non définie"}
//                       </div>
//                       <div>Type contrat : {o.type_contrat}</div>
//                       <div>Type offre : {o.type_offre}</div>
//                       {o.duree && <div>Durée : {o.duree}</div>}
//                       {o.salaire && <div>Salaire : {o.salaire} FCFA</div>}
//                       <div>Date clôture : {o.date_cloture}</div>
//                     </div>

//                     {/* Actions (ADMIN uniquement) */}
//                     <div className="flex items-center justify-between pt-3 border-t border-slate-100">
//                       <Link
//                         to={`/dashboard/offres/${o.id}`}
//                         className="flex items-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium"
//                       >
//                         <Pencil size={16} />
//                         Modifier
//                       </Link>

//                       <button
//                         onClick={() => handleDelete(o.id)}
//                         className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
//                       >
//                         <Trash2 size={16} />
//                         Supprimer
//                       </button>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// // src/pages/dashboard/Offres.jsx
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { getOffres, deleteOffre } from "../../api/offre";
// import { Trash2, Pencil, Plus } from "lucide-react";
// import { getUser } from "../../api/user";
// import { ROLES } from "../../constants/role";

// export default function Offres() {
//   const [user, setUser] = useState(null);
//   const [offres, setOffres] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const data = await getUser();
//         setUser(data);

//         // 🔒 Redirection si le user n'est pas admin
//         if (data.role !== ROLES.ADMIN) {
//           navigate("/dashboard"); // ou page d'accueil dashboard
//         }
//       } catch (err) {
//         console.error(err);
//         navigate("/login"); // si pas connecté
//       }
//     };
//     fetchUser();
//   }, [navigate]);

//   useEffect(() => {
//     if (user && user.role === ROLES.ADMIN) {
//       fetchOffres();
//     }
//   }, [user]);

//   const fetchOffres = async () => {
//     try {
//       setLoading(true);
//       const res = await getOffres();
//       setOffres(Array.isArray(res.data) ? res.data : []);
//     } catch (e) {
//       console.error("Erreur chargement offres", e);
//       setOffres([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Supprimer cette offre ?")) return;
//     try {
//       await deleteOffre(id);
//       fetchOffres();
//     } catch (e) {
//       console.error("Erreur suppression", e);
//     }
//   };

//   const getStatus = (date) => {
//     const today = new Date().toISOString().split("T")[0];
//     if (date > today)
//       return { label: "Ouverte", color: "bg-blue-100 text-blue-700" };
//     if (date === today)
//       return { label: "Clôture aujourd'hui", color: "bg-green-100 text-green-700" };
//     return { label: "Clôturée", color: "bg-slate-200 text-slate-700" };
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-20 text-slate-500">
//         Chargement des offres...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 pb-10">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Offres d'emploi</h1>
//           <p className="text-slate-500 mt-1">
//             Gestion des offres disponibles
//           </p>
//         </div>

//         {/* ADMIN ONLY */}
//         <Link
//           to="/dashboard/offres/new"
//           className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold transition"
//         >
//           <Plus size={18} />
//           Nouvelle offre
//         </Link>
//       </div>

//       {/* Empty state */}
//       {offres.length === 0 ? (
//         <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
//           Aucune offre enregistrée
//         </div>
//       ) : (
//         /* Grid */
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {offres.map((o) => {
//             const status = getStatus(o.date_cloture);

//             return (
//               <div
//                 key={o.id}
//                 className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
//               >
//                 <Link to={`/dashboard/offres/${o.id}`} className="block">
//                   {/* Image Placeholder */}
//                   <div className="relative h-40 bg-slate-100 flex items-center justify-center text-slate-400 font-semibold text-lg">
//                     {o.intitule}
//                   </div>

//                   {/* Content */}
//                   <div className="p-5 space-y-3">
//                     <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
//                       {o.intitule}
//                     </h3>

//                     <p className="text-sm text-slate-600 line-clamp-2">
//                       {o.description}
//                     </p>

//                     <div className="text-sm text-slate-500 space-y-1">
//                       <div>Catégorie : {o.category?.name}</div>
//                       <div>Type contrat : {o.type_contrat}</div>
//                       <div>Type offre : {o.type_offre}</div>
//                       {o.duree && <div>Durée : {o.duree}</div>}
//                       {o.salaire && <div>Salaire : {o.salaire} FCFA</div>}
//                       <div>Date clôture : {o.date_cloture}</div>
//                     </div>

//                     {/* Actions (ADMIN uniquement) */}
//                     <div className="flex items-center justify-between pt-3 border-t border-slate-100">
//                       <Link
//                         to={`/dashboard/offres/${o.id}`}
//                         className="flex items-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium"
//                       >
//                         <Pencil size={16} />
//                         Modifier
//                       </Link>

//                       <button
//                         onClick={() => handleDelete(o.id)}
//                         className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
//                       >
//                         <Trash2 size={16} />
//                         Supprimer
//                       </button>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
