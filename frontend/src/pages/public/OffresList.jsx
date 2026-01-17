import { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { getOffres } from "../../api/offre"; // 🔹 API

export default function OffresList() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [localisation, setLocalisation] = useState("");

  const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

  const villesBenin = [
    "Cotonou", "Porto-Novo", "Parakou", "Abomey", "Ouidah",
    "Natitingou", "Djougou", "Bohicon", "Lokossa", "Savè",
    "Ouéssè", "Banikoara", "Gogounou", "Kandi", "Malanville",
    "Abomey-Calavi", "Allada", "Grand-Popo", "Adja-Ouèrè", 
    "Kalalé", "Sèmè-Kpodji"
  ];

  // ================= FETCH OFFRES =================
  useEffect(() => {
    fetchOffres();
  }, [search, type, localisation]);
  

  // ================= FILTRAGE =================
  const handleFilter = () => {
    fetchOffres();
  };


  const fetchOffres = async () => {
    try {
      setLoading(true);
      const res = await getOffres({
        search,
        type,
        localisation,
      });
      setOffres(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Erreur chargement offres :", err);
      setOffres([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Offres d’emploi
          </h1>
          <p className="text-green-100 max-w-2xl mx-auto">
            Découvrez les meilleures opportunités professionnelles au Bénin
          </p>
        </div>
      </section>

      {/* ================= FILTRES ================= */}
      <section className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un poste..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Type de contrat</option>
            <option>CDI</option>
            <option>CDD</option>
            <option>Stage</option>
            <option>Freelance</option>
          </select>

          {/* Localisation */}
          <select
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Localisation</option>
            {villesBenin.map((ville, i) => (
              <option key={i} value={ville}>{ville}</option>
            ))}
          </select>


          <Button onClick={handleFilter} className="flex items-center justify-center gap-2">
            <Filter />
            Filtrer
          </Button>
        </div>
      </section>

      {/* ================= LISTING ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-6">

        {loading ? (
          // Skeleton loading
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow animate-pulse p-6 h-40"
            >
              <div className="h-5 bg-gray-300 rounded w-2/3 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))
        ) : offres.length === 0 ? (
          <p className="text-center text-gray-500">
            Aucune offre ne correspond à votre recherche.
          </p>
        ) : (
          offres.map((offre) => (
            <div
              key={offre.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 flex flex-col md:flex-row gap-6"
            >
              {/* Image */}
              <div className="w-full md:w-40 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {offre.image ? (
                  <img
                    src={`${BASE_URL_FILE}${offre.image}`}
                    alt={offre.intitule}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Pas d’image
                  </div>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {offre.intitule}
                </h3>

                <p className="text-gray-600">{offre.entreprise}</p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  {offre.localisation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {offre.localisation}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Clôture : {offre.date_cloture}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-start md:items-end gap-4">
                <div className="flex gap-2">
                  <Badge variant="success">{offre.type_contrat}</Badge>
                  {offre.type_offre && (
                    <Badge variant="warning">{offre.type_offre}</Badge>
                  )}
                </div>

                <Link to={`/offre-detail/${offre.id}`}>
                  <Button>Voir l’offre</Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Vous êtes une entreprise ?
          </h2>
          <p className="text-gray-300">
            Publiez vos offres et trouvez rapidement les meilleurs talents.
          </p>

          <Link
            to="/depot-besoin"
            className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-medium transition"
          >
            Déposer une offre
          </Link>
        </div>
      </section>

    </main>
  );
}
















// import { useState } from "react";
// import {
//   Briefcase,
//   MapPin,
//   Clock,
//   Search,
//   Filter,
// } from "lucide-react";
// import Button from "../../components/ui/Button";
// import Badge from "../../components/ui/Badge";
// import { Link } from "react-router-dom";

// const offresMock = [
//   {
//     id: 1,
//     titre: "Chargé de communication digitale",
//     entreprise: "Agence Media Bénin",
//     localisation: "Cotonou",
//     type: "CDI",
//     secteur: "Communication",
//     date: "Il y a 2 jours",
//   },
//   {
//     id: 2,
//     titre: "Développeur React",
//     entreprise: "Startup Tech",
//     localisation: "Porto-Novo",
//     type: "Freelance",
//     secteur: "Informatique",
//     date: "Il y a 5 jours",
//   },
//   {
//     id: 3,
//     titre: "Responsable RH",
//     entreprise: "Entreprise industrielle",
//     localisation: "Parakou",
//     type: "CDD",
//     secteur: "Ressources Humaines",
//     date: "Il y a 1 semaine",
//   },
// ];

// export default function OffresList() {
//   const [search, setSearch] = useState("");
//   const [type, setType] = useState("");
//   const [localisation, setLocalisation] = useState("");

//   const filteredOffres = offresMock.filter((offre) =>
//     offre.titre.toLowerCase().includes(search.toLowerCase()) &&
//     (type ? offre.type === type : true) &&
//     (localisation ? offre.localisation === localisation : true)
//   );

//   return (
//     <main className="bg-gray-50 min-h-screen">

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-24">
//         <div className="max-w-7xl mx-auto px-6 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">
//             Offres d’emploi
//           </h1>
//           <p className="text-green-100 max-w-2xl mx-auto">
//             Découvrez les meilleures opportunités professionnelles au Bénin
//           </p>
//         </div>
//       </section>

//       {/* ================= FILTRES ================= */}
//       <section className="max-w-7xl mx-auto px-6 -mt-12">
//         <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4">

//           {/* Recherche */}
//           <div className="relative">
//             <Search className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Rechercher un poste..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
//             />
//           </div>

//           {/* Type */}
//           <select
//             onChange={(e) => setType(e.target.value)}
//             className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//           >
//             <option value="">Type de contrat</option>
//             <option>CDI</option>
//             <option>CDD</option>
//             <option>Stage</option>
//             <option>Freelance</option>
//           </select>

//           {/* Localisation */}
//           <select
//             onChange={(e) => setLocalisation(e.target.value)}
//             className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//           >
//             <option value="">Localisation</option>
//             <option>Cotonou</option>
//             <option>Porto-Novo</option>
//             <option>Parakou</option>
//           </select>

//           <Button className="flex items-center justify-center gap-2">
//             <Filter />
//             Filtrer
//           </Button>
//         </div>
//       </section>

//       {/* ================= LISTING ================= */}
//       <section className="max-w-7xl mx-auto px-6 py-20 space-y-6">

//         {filteredOffres.length === 0 && (
//           <p className="text-center text-gray-500">
//             Aucune offre ne correspond à votre recherche.
//           </p>
//         )}

//         {filteredOffres.map((offre) => (
//           <div
//             key={offre.id}
//             className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
//           >
//             <div className="space-y-2">
//               <h3 className="text-xl font-semibold text-gray-900">
//                 {offre.titre}
//               </h3>
//               <p className="text-gray-600">{offre.entreprise}</p>

//               <div className="flex flex-wrap gap-3 text-sm">
//                 <span className="flex items-center gap-1 text-gray-500">
//                   <MapPin className="w-4 h-4" />
//                   {offre.localisation}
//                 </span>
//                 <span className="flex items-center gap-1 text-gray-500">
//                   <Clock className="w-4 h-4" />
//                   {offre.date}
//                 </span>
//               </div>
//             </div>

//             <div className="flex flex-col md:items-end gap-4">
//               <div className="flex gap-2">
//                 <Badge variant="success">{offre.type}</Badge>
//                 <Badge variant="warning">{offre.secteur}</Badge>
//               </div>

//               <Link to={`/offre-detail/${offre.id}`}>
//                 <Button>
//                   Postuler
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* ================= CTA ================= */}
//       <section className="bg-gray-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
//           <h2 className="text-3xl font-bold">
//             Vous êtes une entreprise ?
//           </h2>
//           <p className="text-gray-300">
//             Publiez vos offres et trouvez rapidement les meilleurs talents.
//           </p>

//           <a
//             href="/depot-besoin"
//             className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-medium transition"
//           >
//             Déposer une offre
//           </a>
//         </div>
//       </section>

//     </main>
//   );
// }
