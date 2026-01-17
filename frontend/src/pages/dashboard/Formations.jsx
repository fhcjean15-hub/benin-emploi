// // // src/pages/dashboard/Formations.jsx
// src/pages/dashboard/Formations.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getFormations,
  deleteFormation,
  getMyInscriptions,
} from "../../api/formation";
import { Trash2, Pencil, Plus } from "lucide-react";
import { getUser } from "../../api/user";
import { ROLES } from "../../constants/role";

export default function Formations() {
  const [user, setUser] = useState(null);
  const userRole = user?.role;
  const isAdmin = userRole === ROLES.ADMIN;
  const isCandidate = userRole === ROLES.CANDIDAT;

  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
        
      } catch (err) {
        console.error(err);
      } finally {
        //
      }
    };
    fetchUser();
  }, []);
  
  useEffect(() => {
    if (user) {
      fetchFormations();
    }
  }, [user]);



  const fetchFormations = async () => {
    try {
      setLoading(true);

      // 🔐 ADMIN → toutes les formations
      
      if (isAdmin) {
        const res = await getFormations();

        setFormations(Array.isArray(res.data) ? res.data : []);
      }

      // 👤 CANDIDAT → uniquement ses formations
      if (isCandidate) {
        const res = await getMyInscriptions();

        const myFormations = Array.isArray(res.data.data)
          ? res.data.data
              .map((item) => item.formation)
              .filter(Boolean)
          : [];

        setFormations(myFormations);
      }
    } catch (e) {
      console.error("Erreur chargement formations", e);
      setFormations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette formation ?")) return;
    try {
      await deleteFormation(id);
      fetchFormations();
    } catch (e) {
      console.error("Erreur suppression", e);
    }
  };

  const getStatus = (date) => {
    const today = new Date().toISOString().split("T")[0];
    if (date > today)
      return { label: "À venir", color: "bg-blue-100 text-blue-700" };
    if (date === today)
      return { label: "En cours", color: "bg-green-100 text-green-700" };
    return { label: "Terminée", color: "bg-slate-200 text-slate-700" };
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Chargement des formations...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Formations</h1>
          <p className="text-slate-500 mt-1">
            {isAdmin
              ? "Gestion des formations disponibles"
              : "Mes formations"}
          </p>
        </div>

        {/* ADMIN ONLY */}
        {isAdmin && (
          <Link
            to="/dashboard/formations/new"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold transition"
          >
            <Plus size={18} />
            Nouvelle formation
          </Link>
        )}
      </div>

      {/* Empty state */}
      {formations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
          {isAdmin
            ? "Aucune formation enregistrée"
            : "Vous n'êtes inscrit à aucune formation"}
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((f) => {
            const status = getStatus(f.date_debut);

            return (
              <div
                key={f.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <Link to={`/dashboard/formation/${f.id}`} className="block">
                  {/* Image */}
                  <div className="relative h-40 bg-slate-100">
                    <img
                      src={
                        f.images?.length
                          ? `${BASE_URL_FILE}${f.images[0]}`
                          : "https://via.placeholder.com/400x200?text=Formation"
                      }
                      alt={f.titre}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-lg ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                      {f.titre}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2">
                      {f.description}
                    </p>

                    <div className="text-sm text-slate-500 space-y-1">
                      <div>Durée : {f.duree}</div>
                      <div>Début : {f.date_debut}</div>
                      {f.cout && <div>Coût : {f.cout} FCFA</div>}
                    </div>

                    {/* Actions */}
                    {isAdmin ? (
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <Link
                          to={`/dashboard/formations/${f.id}`}
                          className="flex items-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium"
                        >
                          <Pencil size={16} />
                          Modifier
                        </Link>

                        <button
                          onClick={() => handleDelete(f.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          <Trash2 size={16} />
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                        Vous êtes inscrit à cette formation
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}









// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getFormations, deleteFormation } from "../../api/formation";
// import { Trash2, Pencil, Plus } from "lucide-react";

// export default function Formations() {
//   const [formations, setFormations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const BASE_URL_FILE = "http://localhost:8000/storage/";

//   useEffect(() => {
//     fetchFormations();
//   }, []);

//   const fetchFormations = async () => {
//     try {
//       const res = await getFormations();
//       console.log(res.data);
      
//       setFormations(Array.isArray(res.data) ? res.data : []);
//     } catch (e) {
//       console.error("Erreur chargement formations", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Supprimer cette formation ?")) return;
//     try {
//       await deleteFormation(id);
//       fetchFormations();
//     } catch (e) {
//       console.error("Erreur suppression", e);
//     }
//   };

//   const getStatus = (date) => {
//     const today = new Date().toISOString().split("T")[0];
//     if (date > today) return { label: "À venir", color: "bg-blue-100 text-blue-700" };
//     if (date === today) return { label: "En cours", color: "bg-green-100 text-green-700" };
//     return { label: "Terminée", color: "bg-slate-200 text-slate-700" };
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-20 text-slate-500">
//         Chargement des formations...
//       </div>
//     );
//   }

//   console.log(formations);
  

//   return (
//     <div className="space-y-6 pb-10">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Formations</h1>
//           <p className="text-slate-500 mt-1">
//             Gestion des formations disponibles
//           </p>
//         </div>

//         <Link
//           to="/dashboard/formations/new"
//           className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold transition"
//         >
//           <Plus size={18} />
//           Nouvelle formation
//         </Link>
//       </div>

//       {/* Empty state */}
//       {formations.length === 0 ? (
//         <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
//           Aucune formation enregistrée
//         </div>
//       ) : (
//         /* Grid */
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {formations.map((f) => {
//             const status = getStatus(f.date_debut);

//             return (
//               <div
//                 key={f.id}
//                 className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
//               >
//                 {/* Image */}
//                 <div className="relative h-40 bg-slate-100">
//                   <img
//                     src={
//                       f.images?.length
//                         ? `${BASE_URL_FILE}${f.images[0]}`
//                         : "https://via.placeholder.com/400x200?text=Formation"
//                     }
//                     alt={f.titre}
//                     className="w-full h-full object-cover"
//                   />
//                   <span
//                     className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-lg ${status.color}`}
//                   >
//                     {status.label}
//                   </span>
//                 </div>

//                 {/* Content */}
//                 <div className="p-5 space-y-3">
//                   <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
//                     {f.titre}
//                   </h3>

//                   <p className="text-sm text-slate-600 line-clamp-2">
//                     {f.description}
//                   </p>

//                   <div className="text-sm text-slate-500 space-y-1">
//                     <div>Durée : {f.duree}</div>
//                     <div>Début : {f.date_debut}</div>
//                     {f.cout && <div>Coût : {f.cout} FCFA</div>}
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center justify-between pt-3 border-t border-slate-100">
//                     <Link
//                       to={`/dashboard/formations/${f.id}`}
//                       className="flex items-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium"
//                     >
//                       <Pencil size={16} />
//                       Modifier
//                     </Link>

//                     <button
//                       onClick={() => handleDelete(f.id)}
//                       className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
//                     >
//                       <Trash2 size={16} />
//                       Supprimer
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }






// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getFormations, deleteFormation } from "../../api/formation";
// // import "@/styles/pages/formations.scss";

// export default function Formations() {
//   const [formations, setFormations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchFormations();
//   }, []);

//   const fetchFormations = async () => {
//     try {
//       const res = await getFormations();

//       let formationData = [];

//       if (Array.isArray(res.data)) {
//         formationData = res.data;
//       } else if (typeof res.data === "string") {
//         try {
//           formationData = JSON.parse(res.data);
//         } catch (e) {
//           console.log(e);
          
//           formationData = [];
//         }
//       } else if (typeof res.data === "object" && res.data !== null) {
//         formationData = Object.values(res.data);
//       }

      
//       setFormations(res.data);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Supprimer cette formation ?")) return;
//     await deleteFormation(id);
//     fetchFormations();
//   };

//   const getStatus = (date) => {
//     const today = new Date().toISOString().split("T")[0];
//     if (date > today) return "avenir";
//     if (date === today) return "encours";
//     return "terminee";
//   };

//   if (loading) return <p>Chargement...</p>;

//   return (
//     <div className="formations-page">
//       <div className="page-header">
//         <h1>Formations</h1>
//         <Link to="/dashboard/formations/new" className="btn-primary">
//           + Nouvelle formation
//         </Link>
//       </div>

//       {formations.length === 0 ? (
//         <p className="empty">Aucune formation enregistrée</p>
//       ) : (
//         <div className="formations-grid">
//           {Array.isArray(formations) && formations.length > 0 && formations.map((f) => (
//             <div className="formation-card" key={f.id}>
//               <img
//                 src={f.images?.[0] ? `/storage/${f.images[0]}` : "/placeholder.png"}
//                 alt={f.titre}
//               />

//               <span className={`badge ${getStatus(f.date_debut)}`}>
//                 {getStatus(f.date_debut)}
//               </span>

//               <h3>{f.titre}</h3>
//               <p>{f.description}</p>

//               <div className="meta">
//                 <span>Durée : {f.duree}</span>
//                 <span>Début : {f.date_debut}</span>
//                 {f.cout && <span>Coût : {f.cout} FCFA</span>}
//               </div>

//               <div className="actions">
//                 <Link to={`/dashboard/formations/${f.id}`} className="btn-secondary">
//                   Modifier
//                 </Link>
//                 <button onClick={() => handleDelete(f.id)} className="btn-danger">
//                   Supprimer
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
