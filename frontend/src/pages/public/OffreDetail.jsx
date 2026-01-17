import { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Clock,
  FileText,
  Send,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { getOffre } from "../../api/offre"; // 🔹 ajout API postuler
import { getUser } from "../../api/user";
import { createCandidature } from "../../api/candidature";

export default function OffreDetail() { // user provient du contexte ou props
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState()
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [cv, setCv] = useState(null);
  const [lettre, setLettre] = useState("");
  const [lettrePdf, setLettrePdf] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";


  
    // Récupération user
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
    }, []);
  

  /* ================= FETCH OFFRE ================= */
  useEffect(() => {
    const fetchOffre = async () => {
      try {
        setLoading(true);
        const res = await getOffre(id);
        setOffre(res.data.data);
      } catch (error) {
        console.error("Erreur chargement offre :", error);
        setOffre(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOffre();
  }, [id]);


  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Vérifier si l'utilisateur est connecté
    if (!user) {
      alert("Vous devez créer un compte avant de postuler !");
      navigate("/register");
      return;
    }

    // 🔹 CV obligatoire
    if (!cv) {
      alert("Veuillez téléverser votre CV avant de postuler.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("offre_id", offre.id);
      formData.append("cv", cv);

      // Lettre de motivation : texte ou PDF
      if (lettrePdf) formData.append("lettre_motivation_fichier", lettrePdf);
      else if (lettre) formData.append("lettre_motivation", lettre);

      await createCandidature(formData);
      alert("Candidature envoyée avec succès !");
      setCv(null);
      setLettre("");
      setLettrePdf(null);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi de la candidature.");
    } finally {
      setSubmitting(false);
    }
  };


  /* ================= LOADING ================= */
  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <section className="bg-green-700 py-20 animate-pulse">
          <div className="max-w-7xl mx-auto px-6 space-y-4">
            <div className="h-6 w-32 bg-green-500 rounded"></div>
            <div className="h-10 w-2/3 bg-green-500 rounded"></div>
            <div className="h-4 w-1/2 bg-green-500 rounded"></div>
          </div>
        </section>
      </main>
    );
  }

  if (!offre) {
    return (
      <p className="text-center text-gray-500 py-20">
        Offre introuvable
      </p>
    );
  }


  return (
    <main className="bg-gray-50 min-h-screen">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-4">

          <h1 className="text-4xl font-bold">{offre.intitule}</h1>

          {offre.localisation && (
            <p className="text-green-100">{offre.localisation}</p>
          )}

          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="success">{offre.type_contrat}</Badge>
            <Badge variant="warning">{offre.type_offre}</Badge>
          </div>
        </div>
      </section>

      {/* ================= CONTENU ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ================= GAUCHE ================= */}
        <div className="lg:col-span-2 space-y-10">

          {/* Image */}
          {offre.image && (
            <div className="h-64 overflow-hidden rounded-xl shadow">
              <img
                src={`${BASE_URL_FILE}${offre.image}`}
                alt={offre.intitule}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-xl shadow p-8 space-y-4">
            <h2 className="text-2xl font-semibold">Description du poste</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {offre.description}
            </div>
          </div>

          {/* Détails */}
          <div className="bg-white rounded-xl shadow p-8 space-y-6">
            <h2 className="text-2xl font-semibold">Détails de l’offre</h2>

            <ul className="space-y-3 text-gray-700">
              {offre.localisation && (
                <li className="flex gap-2"><MapPin /> Lieu : {offre.localisation}</li>
              )}
              <li className="flex gap-2"><Briefcase /> Type de contrat : {offre.type_contrat}</li>
              <li className="flex gap-2"><Clock /> Date limite : {offre.date_cloture}</li>
              {offre.salaire && (
                <li className="flex gap-2">💰 Salaire : {Number(offre.salaire).toLocaleString()} FCFA</li>
              )}
            </ul>
          </div>
        </div>

        {/* ================= DROITE ================= */}
        <aside className="space-y-6">

          <div className="bg-white rounded-xl border border-gray-200 shadow p-8 space-y-6 sticky top-24">
            <h2 className="text-2xl font-semibold text-center">Postuler à cette offre</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* CV obligatoire */}
              <label className="block border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-green-600 transition">
                <FileText className="mx-auto mb-2 text-green-600" />
                <span className="text-sm text-gray-600">
                  {cv ? cv.name : "Téléverser votre CV (obligatoire)"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setCv(e.target.files[0])}
                  required
                />
              </label>

              <label className="block border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-green-600 transition">
                <FileText className="mx-auto mb-2 text-green-600" />
                <span className="text-sm text-gray-600">
                  {lettrePdf ? lettrePdf.name : "Téléverser lettre de motivation (PDF) optionnel"}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setLettrePdf(e.target.files[0])}
                  disabled={!!lettre}
                />
              </label>

              {/* Lettre de motivation (optionnel) */}
              <textarea
                placeholder="Lettre de motivation (optionnel)"
                rows="4"
                value={lettre}
                disabled={!!lettrePdf}
                onChange={(e) => setLettre(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              />

              <Button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2"
              >
                <Send /> {submitting ? "Envoi..." : "Envoyer ma candidature"}
              </Button>
            </form>
          </div>

        </aside>
      </section>
    </main>
  );
}





// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import {
//   MapPin,
//   Briefcase,
//   Clock,
//   FileText,
//   Send,
// } from "lucide-react";
// import Button from "../../components/ui/Button";
// import Badge from "../../components/ui/Badge";
// import { getOffre } from "../../api/offre";

// export default function OffreDetail() {
//   const { id } = useParams();
//   const [offre, setOffre] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [cv, setCv] = useState(null);

//   const BASE_URL_FILE = "http://localhost:8000/storage/";

//   /* ================= FETCH OFFRE ================= */
//   useEffect(() => {
//     const fetchOffre = async () => {
//       try {
//         setLoading(true);
//         const res = await getOffre(id);
//         setOffre(res.data.data);
//       } catch (error) {
//         console.error("Erreur chargement offre :", error);
//         setOffre(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOffre();
//   }, [id]);


//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <main className="bg-gray-50 min-h-screen">
//         {/* Hero skeleton */}
//         <section className="bg-green-700 py-20 animate-pulse">
//           <div className="max-w-7xl mx-auto px-6 space-y-4">
//             <div className="h-6 w-32 bg-green-500 rounded"></div>
//             <div className="h-10 w-2/3 bg-green-500 rounded"></div>
//             <div className="h-4 w-1/2 bg-green-500 rounded"></div>
//           </div>
//         </section>

//         {/* Contenu skeleton */}
//         <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
//           <div className="lg:col-span-2 space-y-6">
//             <div className="h-64 bg-gray-200 rounded-xl"></div>
//             <div className="h-40 bg-gray-200 rounded-xl"></div>
//             <div className="h-40 bg-gray-200 rounded-xl"></div>
//           </div>

//           <div className="h-96 bg-gray-200 rounded-xl"></div>
//         </section>
//       </main>
//     );
//   }


//   if (!offre) {
//     return (
//       <p className="text-center text-gray-500 py-20">
//         Offre introuvable
//       </p>
//     );
//   }

//   return (
//     <main className="bg-gray-50 min-h-screen">

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
//         <div className="max-w-7xl mx-auto px-6 space-y-4">

//           <h1 className="text-4xl font-bold">
//             {offre.intitule}
//           </h1>

//           {offre.localisation && (
//             <p className="text-green-100">
//               {offre.localisation}
//             </p>
//           )}

//           <div className="flex flex-wrap gap-3 mt-4">
//             <Badge variant="success">{offre.type_contrat}</Badge>
//             <Badge variant="warning">{offre.type_offre}</Badge>
//           </div>
//         </div>
//       </section>

//       {/* ================= CONTENU ================= */}
//       <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

//         {/* ================= GAUCHE ================= */}
//         <div className="lg:col-span-2 space-y-10">

//           {/* Image */}
//           {offre.image && (
//             <div className="h-64 overflow-hidden rounded-xl shadow">
//               <img
//                 src={`${BASE_URL_FILE}${offre.image}`}
//                 alt={offre.intitule}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}

//           {/* Description */}
//           <div className="bg-white rounded-xl shadow p-8 space-y-4">
//             <h2 className="text-2xl font-semibold">
//               Description du poste
//             </h2>

//             {/* Texte formaté intact */}
//             <div
//               className="text-gray-700 leading-relaxed whitespace-pre-line"
//             >
//               {offre.description}
//             </div>
//           </div>

//           {/* Détails */}
//           <div className="bg-white rounded-xl shadow p-8 space-y-6">
//             <h2 className="text-2xl font-semibold">
//               Détails de l’offre
//             </h2>

//             <ul className="space-y-3 text-gray-700">
//               {offre.localisation && (
//                 <li className="flex gap-2">
//                   <MapPin />
//                   Lieu : {offre.localisation}
//                 </li>
//               )}

//               <li className="flex gap-2">
//                 <Briefcase />
//                 Type de contrat : {offre.type_contrat}
//               </li>

//               <li className="flex gap-2">
//                 <Clock />
//                 Date limite : {offre.date_cloture}
//               </li>

//               {offre.salaire && (
//                 <li className="flex gap-2">
//                   💰 Salaire : {Number(offre.salaire).toLocaleString()} FCFA
//                 </li>
//               )}
//             </ul>
//           </div>
//         </div>

//         {/* ================= DROITE ================= */}
//         <aside className="space-y-6">

//           <div className="bg-white rounded-xl shadow p-8 space-y-6 sticky top-24">
//             <h2 className="text-2xl font-semibold text-center">
//               Postuler à cette offre
//             </h2>

//             <form className="space-y-4">

//               <input
//                 type="text"
//                 placeholder="Nom complet"
//                 className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//               />

//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//               />

//               <input
//                 type="tel"
//                 placeholder="Téléphone"
//                 className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//               />

//               {/* Upload CV */}
//               <label className="block border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-green-600 transition">
//                 <FileText className="mx-auto mb-2 text-green-600" />
//                 <span className="text-sm text-gray-600">
//                   {cv ? cv.name : "Téléverser votre CV (PDF)"}
//                 </span>
//                 <input
//                   type="file"
//                   accept=".pdf"
//                   className="hidden"
//                   onChange={(e) => setCv(e.target.files[0])}
//                 />
//               </label>

//               <textarea
//                 placeholder="Message de motivation (optionnel)"
//                 rows="4"
//                 className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//               />

//               <Button className="w-full flex items-center justify-center gap-2">
//                 <Send />
//                 Envoyer ma candidature
//               </Button>
//             </form>
//           </div>

//         </aside>
//       </section>
//     </main>
//   );
// }







// import { useState } from "react";
// import {
//   MapPin,
//   Briefcase,
//   Clock,
//   FileText,
//   Send,
// } from "lucide-react";
// import Button from "../../components/ui/Button";
// import Badge from "../../components/ui/Badge";

// export default function OffreDetail() {
//   const [cv, setCv] = useState(null);

//   return (
//     <main className="bg-gray-50 min-h-screen">

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
//         <div className="max-w-7xl mx-auto px-6 space-y-4">
//           <h1 className="text-4xl font-bold">
//             Développeur React
//           </h1>
//           <p className="text-green-100">
//             Startup Tech Bénin
//           </p>

//           <div className="flex flex-wrap gap-3 mt-4">
//             <Badge variant="success">CDI</Badge>
//             <Badge variant="warning">Informatique</Badge>
//             <Badge variant="danger">Urgent</Badge>
//           </div>
//         </div>
//       </section>

//       {/* ================= CONTENU ================= */}
//       <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

//         {/* ================= INFOS OFFRE ================= */}
//         <div className="lg:col-span-2 space-y-10">

//           {/* Résumé */}
//           <div className="bg-white rounded-xl shadow p-8 space-y-4">
//             <h2 className="text-2xl font-semibold">Résumé du poste</h2>
//             <p className="text-gray-700 leading-relaxed">
//               Nous recherchons un développeur React motivé pour rejoindre
//               notre équipe technique. Vous participerez au développement
//               d’applications web modernes à fort impact.
//             </p>
//           </div>

//           {/* Détails */}
//           <div className="bg-white rounded-xl shadow p-8 space-y-6">
//             <h2 className="text-2xl font-semibold">Détails de l’offre</h2>

//             <ul className="space-y-3 text-gray-700">
//               <li className="flex gap-2">
//                 <MapPin /> Lieu : Cotonou
//               </li>
//               <li className="flex gap-2">
//                 <Briefcase /> Type de contrat : CDI
//               </li>
//               <li className="flex gap-2">
//                 <Clock /> Date limite : 30 août 2025
//               </li>
//             </ul>
//           </div>

//           {/* Missions */}
//           <div className="bg-white rounded-xl shadow p-8 space-y-4">
//             <h2 className="text-2xl font-semibold">Missions</h2>
//             <ul className="list-disc list-inside text-gray-700 space-y-2">
//               <li>Développer des interfaces React performantes</li>
//               <li>Collaborer avec l’équipe backend</li>
//               <li>Assurer la maintenance et l’évolution des applications</li>
//             </ul>
//           </div>

//           {/* Profil recherché */}
//           <div className="bg-white rounded-xl shadow p-8 space-y-4">
//             <h2 className="text-2xl font-semibold">Profil recherché</h2>
//             <ul className="list-disc list-inside text-gray-700 space-y-2">
//               <li>Bac +3 minimum en informatique</li>
//               <li>Bonne maîtrise de React</li>
//               <li>Esprit d’équipe et autonomie</li>
//             </ul>
//           </div>
//         </div>

//         {/* ================= POSTULER ================= */}
//         <aside className="space-y-6">

//           <div className="bg-white rounded-xl shadow p-8 space-y-6 sticky top-24">
//             <h2 className="text-2xl font-semibold text-center">
//               Postuler à cette offre
//             </h2>

//             <form className="space-y-4">

//               <input
//                 type="text"
//                 placeholder="Nom complet"
//                 className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//               />

//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//               />

//               <input
//                 type="tel"
//                 placeholder="Téléphone"
//                 className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//               />

//               {/* Upload CV */}
//               <label className="block border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-green-600 transition">
//                 <FileText className="mx-auto mb-2 text-green-600" />
//                 <span className="text-sm text-gray-600">
//                   {cv ? cv.name : "Téléverser votre CV (PDF)"}
//                 </span>
//                 <input
//                   type="file"
//                   accept=".pdf"
//                   className="hidden"
//                   onChange={(e) => setCv(e.target.files[0])}
//                 />
//               </label>

//               <textarea
//                 placeholder="Message de motivation (optionnel)"
//                 rows="4"
//                 className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
//               />

//               <Button className="w-full flex items-center justify-center gap-2">
//                 <Send />
//                 Envoyer ma candidature
//               </Button>
//             </form>
//           </div>

//         </aside>
//       </section>

//     </main>
//   );
// }
