
// src/pages/public/FormationsList.jsx
import { useEffect, useState } from "react";
import { Search, Filter, Clock, Users, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import { getFormations } from "../../api/formation"; // 🔹 appel API

export default function FormationsList() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const [showModal, setShowModal] = useState(false);
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        const res = await getFormations({
          search,
          category: category !== "all" ? category : null,
        });
        setFormations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erreur chargement formations :", err);
        setFormations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFormations();
  }, [search, category]);

  useEffect(() => {
    if (status === "success" || status === "cancelled") {
      setShowModal(true);

      const timer = setTimeout(() => {
        setShowModal(false);
      }, 4000); // 4 secondes

      return () => clearTimeout(timer);
    }
  }, [status]);


  // Filtrage et recherche
  const filteredFormations = formations.filter((f) => {
    const matchesSearch = f.titre.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || f.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="bg-gray-50 min-h-screen">

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">

            {status === "success" ? (
              <>
                <CheckCircle className="w-14 h-14 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  Inscription confirmée 🎉
                </h2>
                <p className="text-gray-600">
                  Votre paiement a été effectué avec succès.
                </p>
              </>
            ) : (
              <>
                <CreditCard className="w-14 h-14 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  Paiement annulé
                </h2>
                <p className="text-gray-600">
                  Aucun débit n’a été effectué.
                </p>
              </>
            )}

          </div>
        </div>
        )}


      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Nos Formations Professionnelles
          </h1>
          <p className="text-green-100 max-w-3xl mx-auto">
            Développez vos compétences avec des formations adaptées
            aux besoins du marché de l’emploi.
          </p>
        </div>
      </section>

      {/* ================= FILTRES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Catégorie */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="all">Toutes les catégories</option>

            {/* Technologie */}
            <option value="tech">Technologie / Informatique</option>
            <option value="web">Développement Web</option>
            <option value="mobile">Développement Mobile</option>
            <option value="data">Data / Intelligence Artificielle</option>
            <option value="reseau">Réseaux & Systèmes</option>
            <option value="cyber">Cybersécurité</option>
            <option value="cloud">Cloud & DevOps</option>

            {/* Marketing & Communication */}
            <option value="marketing">Marketing Digital</option>
            <option value="communication">Communication</option>
            <option value="design">Design Graphique / UX UI</option>
            <option value="community">Community Management</option>
            <option value="seo">SEO / SEA</option>

            {/* Business & Management */}
            <option value="business">Business / Entrepreneuriat</option>
            <option value="management">Management</option>
            <option value="rh">Ressources Humaines</option>
            <option value="finance">Finance / Comptabilité</option>
            <option value="gestion">Gestion de projet</option>

            {/* Vente & Relation client */}
            <option value="vente">Vente & Négociation</option>
            <option value="relation-client">Relation Client / Service Client</option>

            {/* Métiers & techniques */}
            <option value="bureautique">Bureautique</option>
            <option value="logistique">Logistique & Transport</option>
            <option value="industrie">Industrie & Maintenance</option>

            {/* Soft skills */}
            <option value="soft-skills">Soft Skills</option>
            <option value="leadership">Leadership</option>
            <option value="communication-pro">Communication Professionnelle</option>

            {/* Langues */}
            <option value="langues">Langues (Anglais, Français, etc.)</option>

            {/* Autres */}
            <option value="autre">Autres</option>
          </select>


          {/* Bouton Filtrer */}
          <Button className="flex items-center justify-center gap-2">
            <Filter />
            Filtrer
          </Button>
        </div>
      </section>

      {/* ================= LISTE FORMATIONS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          // Skeleton loading
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl p-6 animate-pulse h-80 flex flex-col justify-between"
              >
                <div className="h-40 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
                <div className="h-8 bg-green-200 rounded w-1/3 mt-4"></div>
              </div>
            ))}
          </div>
        ) : filteredFormations.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">
            Aucune formation trouvée.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {filteredFormations.map((formation) => (
                <div
                  key={formation.id}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition-all overflow-hidden flex flex-col border-t-4 border-green-600"
                >
                  {/* Carousel Images */}
                  {formation.images && formation.images.length > 0 && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <div className="flex transition-transform duration-500">
                        {formation.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={`${BASE_URL_FILE}${img}`} // ou `${BASE_URL_FILE}${img}` si tu utilises l'API
                            alt={formation.titre}
                            className="w-full h-48 object-cover flex-shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="p-6 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {formation.titre}
                    </h3>
                    {formation.badge && <Badge variant="success">{formation.badge}</Badge>}
                  </div>

                  {/* Infos */}
                  <div className="p-6 space-y-3 text-sm text-gray-600 flex-1">
                    {formation.duree && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        {formation.duree}
                      </div>
                    )}
                    {formation.niveau && (
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-yellow-500" />
                        Niveau : {formation.niveau}
                      </div>
                    )}
                    {formation.etudiants && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-red-600" />
                        {formation.etudiants} apprenants
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t space-y-4">
                    <div className="text-lg font-bold text-green-700">
                      {formation.cout}
                    </div>
                    <Link to={`/formation-detail/${formation.id}`}>
                      <Button className="w-full">Voir la formation</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

    </main>
  );
}








// import { useState } from "react";
// import {
//   Search,
//   Filter,
//   Clock,
//   Users,
//   BadgeCheck,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import Badge from "../../components/ui/Badge";
// import Button from "../../components/ui/Button";

// export default function FormationsList() {
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("all");

//   const formations = [
//     {
//       id: 1,
//       title: "Développement Web (React & Node)",
//       category: "tech",
//       duration: "3 mois",
//       level: "Intermédiaire",
//       price: "150 000 FCFA",
//       students: 120,
//       badge: "Populaire",
//     },
//     {
//       id: 2,
//       title: "Marketing Digital & Réseaux Sociaux",
//       category: "marketing",
//       duration: "2 mois",
//       level: "Débutant",
//       price: "80 000 FCFA",
//       students: 200,
//       badge: "Certifiante",
//     },
//     {
//       id: 3,
//       title: "Gestion RH & Recrutement",
//       category: "business",
//       duration: "1 mois",
//       level: "Avancé",
//       price: "100 000 FCFA",
//       students: 90,
//       badge: "Pro",
//     },
//   ];

//   const filteredFormations = formations.filter((f) => {
//     return (
//       f.title.toLowerCase().includes(search.toLowerCase()) &&
//       (category === "all" || f.category === category)
//     );
//   });

//   return (
//     <main className="bg-gray-50 min-h-screen">

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
//         <div className="max-w-7xl mx-auto px-6 text-center">
//           <h1 className="text-4xl font-bold mb-4">
//             Nos Formations Professionnelles
//           </h1>
//           <p className="text-green-100 max-w-3xl mx-auto">
//             Développez vos compétences avec des formations adaptées
//             aux besoins du marché de l’emploi.
//           </p>
//         </div>
//       </section>

//       {/* ================= FILTRES ================= */}
//       <section className="max-w-7xl mx-auto px-6 py-12">
//         <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-4">

//           {/* Recherche */}
//           <div className="relative">
//             <Search className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Rechercher une formation..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//             />
//           </div>

//           {/* Catégorie */}
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//           >
//             <option value="all">Toutes les catégories</option>
//             <option value="tech">Technologie</option>
//             <option value="marketing">Marketing</option>
//             <option value="business">Business / RH</option>
//           </select>

//           {/* Bouton */}
//           <Button className="flex items-center justify-center gap-2">
//             <Filter />
//             Filtrer
//           </Button>

//         </div>
//       </section>

//       {/* ================= LISTE FORMATIONS ================= */}
//       <section className="max-w-7xl mx-auto px-6 pb-20">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

//           {filteredFormations.map((formation) => (
//             <div
//               key={formation.id}
//               className="bg-white rounded-xl shadow hover:shadow-xl transition-all overflow-hidden flex flex-col"
//             >
//               {/* Header */}
//               <div className="p-6 border-b space-y-2">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   {formation.title}
//                 </h3>
//                 <Badge variant="success">{formation.badge}</Badge>
//               </div>

//               {/* Infos */}
//               <div className="p-6 space-y-3 text-sm text-gray-600 flex-1">
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4 text-green-600" />
//                   {formation.duration}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <BadgeCheck className="w-4 h-4 text-yellow-500" />
//                   Niveau : {formation.level}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Users className="w-4 h-4 text-red-600" />
//                   {formation.students} apprenants
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="p-6 border-t space-y-4">
//                 <div className="text-lg font-bold text-green-700">
//                   {formation.price}
//                 </div>

//                 <Link to={`/formation-detail/${formation.id}`}>
//                   <Button className="w-full">
//                     Voir la formation
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           ))}

//         </div>

//         {/* Aucun résultat */}
//         {filteredFormations.length === 0 && (
//           <p className="text-center text-gray-500 mt-12">
//             Aucune formation trouvée.
//           </p>
//         )}
//       </section>

//     </main>
//   );
// }
