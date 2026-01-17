// src/pages/dashboard/Users.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Pencil, Plus } from "lucide-react";
import { deleteUser, getUsers, updateUserStatus } from "../../api/admin";

const BASE_URL = "https://api-benin-emploi.lamadonebenin.com/storage/";

const STATUS_STYLE = {
  actif: "bg-green-100 text-green-700",
  inactif: "bg-gray-100 text-gray-600",
  suspendu: "bg-red-100 text-red-700",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      
      setUsers(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (e) {
      console.error("Erreur chargement utilisateurs", e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      fetchUsers();
    } catch (e) {
      console.error("Erreur mise à jour status", e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (e) {
      console.error("Erreur suppression utilisateur", e);
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestion des utilisateurs
          </h1>
          <p className="text-slate-500 mt-1">
            Tous les utilisateurs enregistrés
          </p>
        </div>

        {/* <Link
          to="/dashboard/users/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold transition"
        >
          <Plus size={18} />
          Nouvel utilisateur
        </Link> */}
      </div>

      {/* Contenu */}
      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
          Aucun utilisateur enregistré
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <Link to={`/dashboard/users/${user.id}`} className="block">
                {/* IMAGE */}
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  {user.photo ? (
                    <img
                      src={`${BASE_URL}${user.photo}`}
                      alt={`${user.nom} ${user.prenom}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 font-semibold text-lg">
                      {user.nom} {user.prenom}
                    </div>
                  )}

                  {/* Badge status */}
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[user.status]}`}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>

                {/* CONTENU */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                    {user.nom} {user.prenom}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {user.email}
                  </p>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value)
                      }
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[user.status]}`}
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                      <option value="suspendu">Suspendu</option>
                    </select>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/dashboard/users/${user.id}/edit`}
                        className="flex items-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium"
                      >
                        <Pencil size={16} /> Modifier
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(user.id);
                        }}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        <Trash2 size={16} /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}






// // src/pages/dashboard/Users.jsx
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   getUsers,
//   updateUserStatus,
//   deleteUser,
// } from "../../api/admin";
// import { Trash2, Pencil, Plus } from "lucide-react";

// const BASE_URL = "http://localhost:8000/storage/";

// const STATUS_STYLE = {
//   actif: "bg-green-100 text-green-700",
//   inactif: "bg-gray-100 text-gray-600",
//   suspendu: "bg-red-100 text-red-700",
// };

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("users"); // pour compatibilité futur onglets
//   const navigate = useNavigate();

//   // fetch users
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await getUsers();
//       setUsers(Array.isArray(res.data.data.data) ? res.data.data.data : []);
//     } catch (e) {
//       console.error("Erreur chargement utilisateurs", e);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (id, status) => {
//     try {
//       await updateUserStatus(id, status);
//       fetchUsers();
//     } catch (e) {
//       console.error("Erreur mise à jour status", e);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Supprimer cet utilisateur ?")) return;
//     try {
//       await deleteUser(id);
//       fetchUsers();
//     } catch (e) {
//       console.error("Erreur suppression utilisateur", e);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-20 text-slate-500">
//         Chargement...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 pb-10">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">
//             Gestion des utilisateurs
//           </h1>
//           <p className="text-slate-500 mt-1">
//             Tous les utilisateurs enregistrés
//           </p>
//         </div>

//         <Link
//           to="/dashboard/users/new"
//           className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold transition"
//         >
//           <Plus size={18} />
//           Nouvel utilisateur
//         </Link>
//       </div>

//       {/* Contenu */}
//       {users.length === 0 ? (
//         <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
//           Aucun utilisateur enregistré
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//           {users.map((user) => (
//             <div
//               key={user.id}
//               className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative pt-16 px-5 pb-5 hover:shadow-md transition"
//             >
//               {/* AVATAR CERCLE */}
//               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
//                 <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100">
//                   <img
//                     src={user.photo ? `${BASE_URL}${user.photo}` : "/avatar.png"}
//                     alt={user.nom}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>

//               {/* CONTENU */}
//               <div className="text-center space-y-3">
//                 <h3 className="font-semibold text-slate-900">
//                   {user.nom} {user.prenom}
//                 </h3>
//                 <p className="text-sm text-slate-500">{user.email}</p>
//               </div>

//               {/* Footer actions */}
//               <div className="flex items-center justify-between pt-4">
//                 <select
//                   value={user.status}
//                   onChange={(e) => handleStatusChange(user.id, e.target.value)}
//                   className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[user.status]}`}
//                 >
//                   <option value="actif">Actif</option>
//                   <option value="inactif">Inactif</option>
//                   <option value="suspendu">Suspendu</option>
//                 </select>

//                 <div className="flex items-center gap-2">
//                   <Link
//                     to={`/dashboard/users/edit/${user.id}`}
//                     className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
//                   >
//                     <Pencil size={16} /> Modifier
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(user.id)}
//                     className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
//                   >
//                     <Trash2 size={16} /> Supprimer
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





// import { useEffect, useState } from "react";
// import {
//   getUsers,
//   updateUserStatus,
//   updateUser,
//   deleteUser,
// } from "../../api/admin";
// import { Trash2, Edit2 } from "lucide-react";

// const BASE_URL = "http://localhost:8000/storage/";

// const STATUS_STYLE = {
//   actif: "bg-green-100 text-green-700",
//   inactif: "bg-gray-100 text-gray-600",
//   suspendu: "bg-red-100 text-red-700",
// };

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     const res = await getUsers();
//     setUsers(res.data.data.data);
//     setLoading(false);
//   };

//   const handleStatusChange = async (id, status) => {
//     await updateUserStatus(id, status);
//     fetchUsers();
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Supprimer cet utilisateur ?")) return;
//     await deleteUser(id);
//     fetchUsers();
//   };

//   const handleEdit = (user) => {
//     // ici tu peux naviguer vers une page ou ouvrir un modal pour éditer
//     // ex: navigate(`/dashboard/users/edit/${user.id}`);
//     console.log("Modifier :", user);
//   };

//   if (loading) {
//     return <div className="text-center py-10">Chargement...</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
//       {users.map((user) => (
//         <div
//           key={user.id}
//           className="relative bg-white rounded-2xl border shadow-sm pt-12 px-5 pb-5"
//         >
//           {/* AVATAR CERCLE */}
//           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
//             <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100">
//               <img
//                 src={
//                   user.photo
//                     ? `${BASE_URL}${user.photo}`
//                     : "/avatar.png"
//                 }
//                 alt={user.nom}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           {/* CONTENU */}
//           <div className="text-center space-y-4">
//             <div>
//               <h3 className="font-semibold text-slate-900">
//                 {user.nom} {user.prenom}
//               </h3>
//               <p className="text-sm text-slate-500">{user.email}</p>
//             </div>

//             <div className="flex items-center justify-between">
//               <select
//                 value={user.status}
//                 onChange={(e) =>
//                   handleStatusChange(user.id, e.target.value)
//                 }
//                 className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[user.status]}`}
//               >
//                 <option value="actif">Actif</option>
//                 <option value="inactif">Inactif</option>
//                 <option value="suspendu">Suspendu</option>
//               </select>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handleEdit(user)}
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   <Edit2 size={16} />
//                 </button>

//                 <button
//                   onClick={() => handleDelete(user.id)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import {
//   getUsers,
//   updateUserStatus,
//   updateUser,
//   deleteUser,
// } from "../../api/admin";
// import { Trash2 } from "lucide-react";

// const BASE_URL = "http://localhost:8000/storage/";

// const STATUS_STYLE = {
//   actif: "bg-green-100 text-green-700",
//   inactif: "bg-gray-100 text-gray-600",
//   suspendu: "bg-red-100 text-red-700",
// };

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     const res = await getUsers();
//     setUsers(res.data.data.data);
//     setLoading(false);
//   };

//   const handleStatusChange = async (id, status) => {
//     await updateUserStatus(id, status);
//     fetchUsers();
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Supprimer cet utilisateur ?")) return;
//     await deleteUser(id);
//     fetchUsers();
//   };

//   if (loading) {
//     return <div className="text-center py-10">Chargement...</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {users.map((user) => (
//         <div
//           key={user.id}
//           className="relative bg-white rounded-2xl border shadow-sm pt-12 px-5 pb-5"
//         >
//           {/* AVATAR CERCLE */}
//           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
//             <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100">
//               <img
//                 src={
//                   user.photo
//                     ? `${BASE_URL}${user.photo}`
//                     : "/avatar.png"
//                 }
//                 alt={user.nom}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           {/* CONTENU */}
//           <div className="text-center space-y-4">
//             <div>
//               <h3 className="font-semibold text-slate-900">
//                 {user.nom} {user.prenom}
//               </h3>
//               <p className="text-sm text-slate-500">{user.email}</p>
//             </div>

//             <div className="flex items-center justify-between">
//               <select
//                 value={user.status}
//                 onChange={(e) =>
//                   handleStatusChange(user.id, e.target.value)
//                 }
//                 className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[user.status]}`}
//               >
//                 <option value="actif">Actif</option>
//                 <option value="inactif">Inactif</option>
//                 <option value="suspendu">Suspendu</option>
//               </select>

//               <button
//                 onClick={() => handleDelete(user.id)}
//                 className="text-red-600 hover:text-red-800"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }






// import { useEffect, useState } from "react";
// import {
//   getUsers,
//   updateUserStatus,
//   deleteUser,
// } from "../../api/admin";
// import { Trash2 } from "lucide-react";

// const BASE_URL = "http://localhost:8000/storage/";

// const STATUS_STYLE = {
//   actif: "bg-green-100 text-green-700",
//   inactif: "bg-gray-100 text-gray-600",
//   suspendu: "bg-red-100 text-red-700",
// };

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     const res = await getUsers();
//     setUsers(res.data.data.data);
//     setLoading(false);
//   };

//   const handleStatusChange = async (id, status) => {
//     await updateUserStatus(id, status);
//     fetchUsers();
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Supprimer cet utilisateur ?")) return;
//     await deleteUser(id);
//     fetchUsers();
//   };

//   if (loading) {
//     return <div className="text-center py-10">Chargement...</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {users.map((user) => (
//         <div
//           key={user.id}
//           className="bg-white rounded-2xl shadow-sm border overflow-hidden"
//         >
//           {/* IMAGE AVEC DIAGONALE */}
//           <div className="relative h-40 overflow-hidden">
//             <img
//               src={
//                 user.photo
//                   ? `${BASE_URL}${user.photo}`
//                   : "/avatar.png"
//               }
//               alt={user.nom}
//               className="w-full h-full object-cover"
//             />

//             {/* DIAGONALE */}
//             <div
//               className="absolute bottom-0 left-0 w-full h-16 bg-white"
//               style={{
//                 clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 100%)",
//               }}
//             />
//           </div>

//           {/* CONTENU */}
//           <div className="p-5 space-y-3">
//             <div>
//               <h3 className="font-semibold text-slate-900">
//                 {user.nom} {user.prenom}
//               </h3>
//               <p className="text-sm text-slate-500">{user.email}</p>
//             </div>

//             <div className="flex items-center justify-between">
//               <select
//                 value={user.status}
//                 onChange={(e) =>
//                   handleStatusChange(user.id, e.target.value)
//                 }
//                 className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[user.status]}`}
//               >
//                 <option value="actif">Actif</option>
//                 <option value="inactif">Inactif</option>
//                 <option value="suspendu">Suspendu</option>
//               </select>

//               <button
//                 onClick={() => handleDelete(user.id)}
//                 className="text-red-600 hover:text-red-800"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import {
//   getUsers,
//   updateUserStatus,
//   deleteUser,
// } from "../../api/admin";
// import { Trash2, RefreshCcw } from "lucide-react";

// const STATUS_COLORS = {
//   actif: "bg-green-100 text-green-700",
//   inactif: "bg-gray-100 text-gray-700",
//   suspendu: "bg-red-100 text-red-700",
// };

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await getUsers();
//       console.log(res);
      
//       setUsers(res.data.data.data); // pagination Laravel
//     } catch (err) {
//       console.error(err);
//       setError("Impossible de charger les utilisateurs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (id, status) => {
//     try {
//       await updateUserStatus(id, status);
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//       alert("Erreur lors de la mise à jour du statut");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Supprimer cet utilisateur ?")) return;

//     try {
//       await deleteUser(id);
//       setUsers(users.filter((u) => u.id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Erreur lors de la suppression");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-slate-900">
//           Utilisateurs
//         </h1>

//         <button
//           onClick={fetchUsers}
//           className="flex items-center gap-2 text-sm text-slate-600"
//         >
//           <RefreshCcw size={16} />
//           Rafraîchir
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">
//           {error}
//         </div>
//       )}

//       <div className="bg-white border rounded-xl overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-50 text-slate-600">
//             <tr>
//               <th className="text-left px-4 py-3">Nom</th>
//               <th className="text-left px-4 py-3">Email</th>
//               <th className="text-left px-4 py-3">Rôle</th>
//               <th className="text-left px-4 py-3">Statut</th>
//               <th className="text-right px-4 py-3">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="5" className="text-center py-6">
//                   Chargement...
//                 </td>
//               </tr>
//             ) : users.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="text-center py-6">
//                   Aucun utilisateur
//                 </td>
//               </tr>
//             ) : (
//               users.map((user) => (
//                 <tr
//                   key={user.id}
//                   className="border-t hover:bg-slate-50"
//                 >
//                   <td className="px-4 py-3">
//                     {user.nom} {user.prenom}
//                   </td>

//                   <td className="px-4 py-3">{user.email}</td>

//                   <td className="px-4 py-3 capitalize">
//                     {user.role}
//                   </td>

//                   <td className="px-4 py-3">
//                     <select
//                       value={user.status}
//                       onChange={(e) =>
//                         handleStatusChange(user.id, e.target.value)
//                       }
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[user.status]}`}
//                     >
//                       <option value="actif">Actif</option>
//                       <option value="inactif">Inactif</option>
//                       <option value="suspendu">Suspendu</option>
//                     </select>
//                   </td>

//                   <td className="px-4 py-3 text-right">
//                     <button
//                       onClick={() => handleDelete(user.id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
