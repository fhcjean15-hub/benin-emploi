import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Clock,
  BadgeCheck,
  Users,
  Calendar,
  CreditCard,
  FileText,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { getFormation } from "../../api/formation";

export default function FormationDetail() {
  const { id } = useParams();
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const res = await getFormation(id);
        setFormation(res.data);
      } catch (error) {
        console.error("Erreur chargement formation :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFormation();
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        {/* HERO skeleton */}
        <section className="bg-green-700 py-20 animate-pulse">
          <div className="max-w-7xl mx-auto px-6 space-y-4">
            <div className="h-6 w-32 bg-green-500 rounded"></div>
            <div className="h-10 w-2/3 bg-green-500 rounded"></div>
            <div className="h-4 w-3/4 bg-green-500 rounded"></div>
          </div>
        </section>

        {/* CONTENT skeleton */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-60 bg-gray-200 rounded-xl"></div>
            <div className="bg-white p-6 rounded-xl shadow space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Right */}
          <aside className="bg-white p-8 rounded-xl shadow space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-10 bg-green-200 rounded"></div>
          </aside>
        </section>
      </main>
    );
  }

  if (!formation) {
    return (
      <p className="text-center text-gray-500 py-20">
        Formation introuvable
      </p>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          {formation.badge && (
            <Badge variant="success">{formation.badge}</Badge>
          )}

          <h1 className="text-4xl font-bold mt-4 mb-6">
            {formation.titre}
          </h1>

          <p className="max-w-3xl text-green-100 text-lg">
            {formation.description}
          </p>
        </div>
      </section>

      {/* ================= CONTENU ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ========= GAUCHE ========= */}
        <div className="lg:col-span-2 space-y-10">

          {/* Images carousel */}
          {formation.images?.length > 0 && (
            <div className="h-60 overflow-hidden rounded-xl">
              <div className="flex">
                {formation.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${BASE_URL_FILE}${img}`}
                    alt={formation.titre}
                    className="w-full h-60 object-cover flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Infos clés */}
          <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <Clock className="text-green-600" />
              Durée : {formation.duree}
            </div>

            {formation.niveau && (
              <div className="flex items-center gap-3">
                <BadgeCheck className="text-yellow-500" />
                Niveau : {formation.niveau}
              </div>
            )}

            {formation.etudiants && (
              <div className="flex items-center gap-3">
                <Users className="text-red-600" />
                {formation.etudiants} apprenants
              </div>
            )}
          </div>

          {/* Programme */}
          {formation.programme?.length > 0 && (
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="text-green-600" />
                Programme de la formation
              </h2>

              <ul className="space-y-4">
                {formation.programme.map((item, index) => (
                  <li key={index} className="flex gap-3 text-gray-700">
                    <span className="w-2 h-2 mt-2 bg-green-600 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ========= DROITE ========= */}
        <aside className="bg-white rounded-xl shadow p-8 space-y-6 sticky top-24">
          <h3 className="text-2xl font-bold">S’inscrire à la formation</h3>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <Calendar className="text-green-600" />
              Début : {formation.date_debut}
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="text-yellow-500" />
              Paiement : Mobile Money
            </div>
          </div>

          <div className="text-3xl font-bold text-green-700">
            {Number(formation.cout).toLocaleString()} FCFA
          </div>

          <Link to={`/formations/${formation.id}/inscription`}>
            <Button className="w-full text-lg">
              S’inscrire maintenant
            </Button>
          </Link>

          <p className="text-xs text-gray-500 text-center">
            Paiement sécurisé via MTN, Moov ou Celtis
          </p>
        </aside>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-green-700 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Prêt à booster votre carrière ?
        </h2>
        <p className="text-green-100 mb-6">
          Rejoignez des centaines d’apprenants déjà formés
        </p>
        <Link to={`/formations/${formation.id}/inscription`}>
          <Button variant="secondary">
            Démarrer l’inscription
          </Button>
        </Link>
      </section>

    </main>
  );
}










// import { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import {
//   Clock,
//   BadgeCheck,
//   Users,
//   Calendar,
//   CreditCard,
//   FileText,
// } from "lucide-react";
// import Button from "../../components/ui/Button";
// import Badge from "../../components/ui/Badge";
// import { getFormation } from "../../api/formation"; // 🔑 API pour récupérer une formation

// export default function FormationDetail() {
//   const { id } = useParams();
//   const [formation, setFormation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const BASE_URL_FILE = "http://localhost:8000/storage/";

//   useEffect(() => {
//     const fetchFormation = async () => {
//       try {
//         const res = await getFormation(id);
//         setFormation(res.data);
//       } catch (err) {
//         console.error("Erreur chargement formation :", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFormation();
//   }, [id]);

//   if (loading) {
//     // Skeleton loading
//     return (
//       <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className="bg-gray-100 rounded-xl p-6 animate-pulse h-80 flex flex-col justify-between"
//           >
//             <div className="h-40 bg-gray-300 rounded mb-4"></div>
//             <div className="h-6 bg-gray-300 rounded w-3/4"></div>
//             <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
//             <div className="h-8 bg-green-200 rounded w-1/3 mt-4"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (!formation) {
//     return (
//       <p className="text-center text-gray-500 py-20">
//         Formation introuvable
//       </p>
//     );
//   }

//   return (
//     <main className="bg-gray-50 min-h-screen">

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
//         <div className="max-w-7xl mx-auto px-6">

//           {formation.badge && <Badge variant="success">{formation.badge}</Badge>}

//           <h1 className="text-4xl font-bold mt-4 mb-6">{formation.titre}</h1>

//           <p className="max-w-3xl text-green-100 text-lg">{formation.description}</p>
//         </div>
//       </section>

//       {/* ================= CONTENU ================= */}
//       <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

//         {/* ========= PROGRAMME ========= */}
//         <div className="lg:col-span-2 space-y-10">

//           {/* Carousel Images */}
//           {formation.images && formation.images.length > 0 && (
//             <div className="relative h-60 w-full overflow-hidden rounded-xl mb-6">
//               <div className="flex transition-transform duration-500">
//                 {formation.images.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={`${BASE_URL_FILE}${img}`}
//                     alt={formation.titre}
//                     className="w-full h-60 object-cover flex-shrink-0"
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Infos clés */}
//           <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
//             <div className="flex items-center gap-3">
//               <Clock className="text-green-600" />
//               Durée : {formation.duree}
//             </div>
//             <div className="flex items-center gap-3">
//               {formation.niveau ? <BadgeCheck className="text-yellow-500" />
//                + `Niveau : ${formation.niveau}` : ''}
//             </div>
//             <div className="flex items-center gap-3">
//               {formation.etudiants ? <Users className="text-red-600" /> + `${formation.etudiants} apprenants` : ""}
//             </div>
//           </div>

//           {/* Programme */}
//           {formation.programme && formation.programme.length > 0 && (
//             <div className="bg-white rounded-xl shadow p-8">
//               <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//                 <FileText className="text-green-600" />
//                 Programme de la formation
//               </h2>

//               <ul className="space-y-4">
//                 {formation.programme.map((item, index) => (
//                   <li key={index} className="flex items-start gap-3 text-gray-700">
//                     <span className="w-2 h-2 mt-2 rounded-full bg-green-600" />
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* ========= INSCRIPTION / PAIEMENT ========= */}
//         <aside className="bg-white rounded-xl shadow p-8 space-y-6 h-fit sticky top-24">
//           <h3 className="text-2xl font-bold text-gray-900">S’inscrire à la formation</h3>

//           <div className="space-y-3 text-sm text-gray-600">
//             <div className="flex items-center gap-3">
//               <Calendar className="text-green-600" />
//               Début : {formation.date_debut}
//             </div>
//             <div className="flex items-center gap-3">
//               <CreditCard className="text-yellow-500" />
//               Paiement : Mobile Money
//             </div>
//           </div>

//           <div className="text-3xl font-bold text-green-700">
//             {Number(formation.cout)} FCFA
//           </div>

//           <Link to={`/formations/${formation.id}/inscription`}>
//             <Button className="w-full text-lg">
//               S’inscrire maintenant
//             </Button>
//           </Link>

//           <p className="text-xs text-gray-500 text-center">
//             Paiement sécurisé via MTN, Moov ou Celtis
//           </p>
//         </aside>

//       </section>

//       {/* ================= CTA ================= */}
//       <section className="bg-green-700 text-white py-16 text-center">
//         <h2 className="text-3xl font-bold mb-4">Prêt à booster votre carrière ?</h2>
//         <p className="text-green-100 mb-6">
//           Rejoignez des centaines d’apprenants déjà formés par Bénin Emploi+
//         </p>
//         <Link to={`/formations/${formation.id}/inscription`}>
//           <Button variant="secondary">
//             Démarrer l’inscription
//           </Button>
//         </Link>
//       </section>

//     </main>
//   );
// }









// import { Link, useParams } from "react-router-dom";
// import {
//   Clock,
//   BadgeCheck,
//   Users,
//   Calendar,
//   CreditCard,
//   FileText,
// } from "lucide-react";
// import Button from "../../components/ui/Button";
// import Badge from "../../components/ui/Badge";

// export default function FormationDetail() {
//   const { id } = useParams();

//   // ⚠️ Mock (API plus tard)
//   const formation = {
//     id,
//     title: "Développement Web (React & Node)",
//     description:
//       "Une formation complète pour devenir développeur web moderne, orientée projets et marché de l’emploi.",
//     duration: "3 mois",
//     level: "Intermédiaire",
//     startDate: "05 Mai 2025",
//     price: "150 000 FCFA",
//     students: 120,
//     badge: "Certifiante",
//     program: [
//       "Bases du HTML, CSS & JavaScript",
//       "Framework React.js",
//       "Backend avec Node.js & Express",
//       "Bases de données (MongoDB)",
//       "Déploiement & bonnes pratiques",
//       "Projet professionnel final",
//     ],
//   };

//   return (
//     <main className="bg-gray-50 min-h-screen">

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
//         <div className="max-w-7xl mx-auto px-6">
//           <Badge variant="success">{formation.badge}</Badge>

//           <h1 className="text-4xl font-bold mt-4 mb-6">
//             {formation.title}
//           </h1>

//           <p className="max-w-3xl text-green-100 text-lg">
//             {formation.description}
//           </p>
//         </div>
//       </section>

//       {/* ================= CONTENU ================= */}
//       <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

//         {/* ========= PROGRAMME ========= */}
//         <div className="lg:col-span-2 space-y-10">

//           {/* Infos clés */}
//           <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
//             <div className="flex items-center gap-3">
//               <Clock className="text-green-600" />
//               Durée : {formation.duration}
//             </div>
//             <div className="flex items-center gap-3">
//               <BadgeCheck className="text-yellow-500" />
//               Niveau : {formation.level}
//             </div>
//             <div className="flex items-center gap-3">
//               <Users className="text-red-600" />
//               {formation.students} apprenants
//             </div>
//           </div>

//           {/* Programme */}
//           <div className="bg-white rounded-xl shadow p-8">
//             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//               <FileText className="text-green-600" />
//               Programme de la formation
//             </h2>

//             <ul className="space-y-4">
//               {formation.program.map((item, index) => (
//                 <li
//                   key={index}
//                   className="flex items-start gap-3 text-gray-700"
//                 >
//                   <span className="w-2 h-2 mt-2 rounded-full bg-green-600" />
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </div>

//         </div>

//         {/* ========= INSCRIPTION / PAIEMENT ========= */}
//         <aside className="bg-white rounded-xl shadow p-8 space-y-6 h-fit sticky top-24">

//           <h3 className="text-2xl font-bold text-gray-900">
//             S’inscrire à la formation
//           </h3>

//           <div className="space-y-3 text-sm text-gray-600">
//             <div className="flex items-center gap-3">
//               <Calendar className="text-green-600" />
//               Début : {formation.startDate}
//             </div>
//             <div className="flex items-center gap-3">
//               <CreditCard className="text-yellow-500" />
//               Paiement : Mobile Money
//             </div>
//           </div>

//           <div className="text-3xl font-bold text-green-700">
//             {formation.price}
//           </div>

//           <Link to={`/formations/${formation.id}/inscription`}>
//             <Button className="w-full text-lg">
//               S’inscrire maintenant
//             </Button>
//           </Link>

//           <p className="text-xs text-gray-500 text-center">
//             Paiement sécurisé via MTN, Moov ou Celtis
//           </p>
//         </aside>

//       </section>

//       {/* ================= CTA ================= */}
//       <section className="bg-green-700 text-white py-16 text-center">
//         <h2 className="text-3xl font-bold mb-4">
//           Prêt à booster votre carrière ?
//         </h2>
//         <p className="text-green-100 mb-6">
//           Rejoignez des centaines d’apprenants déjà formés par Bénin Emploi+
//         </p>
//         <Link to={`/formations/${formation.id}/inscription`}>
//           <Button variant="secondary">
//             Démarrer l’inscription
//           </Button>
//         </Link>
//       </section>

//     </main>
//   );
// }


