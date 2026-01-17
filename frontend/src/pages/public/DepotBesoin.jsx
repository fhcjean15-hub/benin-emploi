// src/pages/public/DepotBesoin.jsx
import { useState } from "react";
import { Send, Upload } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { TYPES_BESOIN } from "../../constants/typesBesoin";
import { GRILLE_TARIFAIRE } from "../../constants/grilleTarifaire";
import { createBesoin } from "../../api/besoin";

export default function DepotBesoin() {
  const [form, setForm] = useState({
    nom_entreprise: "",
    personne_contact: "",
    email: "",
    numero: "",
    type_besoin: "",
    description: "",
    grille_tarifaire: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // 🔹 nouvel état

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const getGrilleTarifaire = () => {
    switch (form.type_besoin) {
      case "recrutement":
        return GRILLE_TARIFAIRE.emploi;
      case "formation_professionnel":
        return GRILLE_TARIFAIRE.formation;
      case "gestion_rh":
        return GRILLE_TARIFAIRE.gestion_rh;
      case "communication_accompagnement":
        return GRILLE_TARIFAIRE.communication_accompagnement;
      case "autre_service":
        return GRILLE_TARIFAIRE.autres_services;
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifications basiques
    if (!form.nom_entreprise) return alert("Veuillez saisir le nom de l'entreprise");
    if (!form.personne_contact) return alert("Veuillez saisir la personne de contact");
    if (!form.email) return alert("Veuillez saisir l'email");
    if (!form.numero) return alert("Veuillez saisir le numéro de téléphone");
    if (!form.type_besoin) return alert("Veuillez sélectionner le type de besoin");
    if (!form.description) return alert("Veuillez décrire votre besoin");
    if (!form.grille_tarifaire) return alert("Veuillez sélectionner une grille tarifaire");

    setLoading(true);

    // Création du FormData pour l'envoi
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== "") {
        formData.append(key, form[key]);
      }
    });

    images.forEach((img, idx) => {
      formData.append(`images[${idx}]`, img);
    });

    try {
      const res = await createBesoin(formData);
      console.log(res);
      
      console.log("📦 Besoin envoyé avec succès :", res.data);

      // Reset formulaire
      setForm({
        nom_entreprise: "",
        personne_contact: "",
        email: "",
        numero: "",
        type_besoin: "",
        description: "",
        grille_tarifaire: "",
      });
      setImages([]);
      setSubmitted(true); // 🔹 on affiche les numéros de paiement
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const grille = getGrilleTarifaire();

  /* ================= UI ================= */

  return (
    <main className="bg-gray-50 py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <h1 className="text-3xl font-bold text-center mb-10">
            Dépôt de besoin entreprise
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Input
              label="Nom de l'entreprise"
              name="nom_entreprise"
              value={form.nom_entreprise}
              onChange={handleChange}
              required
            />

            <Input
              label="Personne de contact"
              name="personne_contact"
              value={form.personne_contact}
              onChange={handleChange}
              required
            />

            <Input
              label="Email professionnel"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Téléphone"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              required
            />

            {/* TYPE DE BESOIN */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Type de besoin
              </label>
              <select
                name="type_besoin"
                value={form.type_besoin}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
              >
                <option value="">Sélectionner</option>
                {Object.values(TYPES_BESOIN).map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* GRILLE TARIFAIRE */}
            {grille && (
              <div className="md:col-span-2 border rounded-xl p-6 bg-gray-50">
                <h3 className="font-semibold mb-4">
                  Choisir une grille tarifaire
                </h3>

                <div className="space-y-3">
                  {Object.entries(grille).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="grille_tarifaire"
                        value={key}
                        checked={form.grille_tarifaire === key}
                        onChange={handleChange}
                        required
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Description du besoin
              </label>
              <textarea
                name="description"
                rows="6"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                placeholder="Décrivez clairement votre besoin..."
              />
            </div>

            {/* UPLOAD IMAGES */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Image illustratif ou logo (facultatif)
              </label>

              <div className="mt-2 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200">
                  <Upload className="w-4 h-4" />
                  Choisir des images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImagesChange}
                  />
                </label>

                {images.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {images.length} image(s) sélectionnée(s)
                  </span>
                )}
              </div>
            </div>

            {/* SUBMIT */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                variant="danger"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
              >
                <Send />
                {loading ? "Envoi en cours..." : "Soumettre le besoin"}
              </Button>
            </div>
          </form>

          {/* ================= AFFICHAGE NUMÉROS DE PAIEMENT ================= */}
          {submitted && (
            <div className="mt-10 border-t pt-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Références pour Paiement par MoMo
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>MOOV BÉNIN : <span className="font-medium">+2290195173951</span></li>
                <li>MTN BÉNIN : <span className="font-medium">+2290196900832</span></li>
                <li>CELTIIS BÉNIN : <span className="font-medium">+2290140191991</span></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}









// // src/pages/public/DepotBesoin.jsx
// import { useState } from "react";
// import { Send, Upload } from "lucide-react";
// import Button from "../../components/ui/Button";
// import Input from "../../components/ui/Input";
// import { TYPES_BESOIN } from "../../constants/typesBesoin";
// import { GRILLE_TARIFAIRE } from "../../constants/grilleTarifaire";
// import { createBesoin } from "../../api/besoin";

// export default function DepotBesoin() {
//   const [form, setForm] = useState({
//     nom_entreprise: "",
//     personne_contact: "",
//     email: "",
//     numero: "",
//     type_besoin: "",
//     description: "",
//     grille_tarifaire: "",
//   });

//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ================= HANDLERS ================= */

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleImagesChange = (e) => {
//     setImages([...e.target.files]);
//   };

//   const getGrilleTarifaire = () => {
//     if (form.type_besoin === "recrutement") return GRILLE_TARIFAIRE.emploi;
//     if (form.type_besoin === "formation_professionnel")
//       return GRILLE_TARIFAIRE.formation;
//     return null;
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Vérifications basiques
//     if (!form.nom_entreprise) return alert("Veuillez saisir le nom de l'entreprise");
//     if (!form.personne_contact) return alert("Veuillez saisir la personne de contact");
//     if (!form.email) return alert("Veuillez saisir l'email");
//     if (!form.numero) return alert("Veuillez saisir le numéro de téléphone");
//     if (!form.type_besoin) return alert("Veuillez sélectionner le type de besoin");
//     if (!form.description) return alert("Veuillez décrire votre besoin");
//     if (!form.grille_tarifaire) return alert("Veuillez sélectionner une grille tarifaire");

//     setLoading(true);

//     // Création du FormData pour l'envoi
//     const formData = new FormData();
//     Object.keys(form).forEach((key) => {
//       if (form[key] !== null && form[key] !== "") {
//         formData.append(key, form[key]);
//       }
//     });

//     // Ajout des images
//     images.forEach((img, idx) => {
//       formData.append(`images[${idx}]`, img);
//     });

//     try {
//       const res = await createBesoin(formData); // 🔹 Appel à l'API axios
//       console.log("📦 Besoin envoyé avec succès :", res.data);

//       alert("Votre besoin a été envoyé avec succès !");

//       // Reset formulaire
//       setForm({
//         nom_entreprise: "",
//         personne_contact: "",
//         email: "",
//         numero: "",
//         type_besoin: "",
//         description: "",
//         grille_tarifaire: "",
//       });
//       setImages([]);
//     } catch (err) {
//       console.error(err);
//       alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const grille = getGrilleTarifaire();

//   /* ================= UI ================= */

//   return (
//     <main className="bg-gray-50 py-24">
//       <div className="max-w-5xl mx-auto px-6">
//         <div className="bg-white rounded-2xl shadow-lg p-10">
//           <h1 className="text-3xl font-bold text-center mb-10">
//             Dépôt de besoin entreprise
//           </h1>

//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-2 gap-6"
//           >
//             <Input
//               label="Nom de l'entreprise"
//               name="nom_entreprise"
//               value={form.nom_entreprise}
//               onChange={handleChange}
//               required
//             />

//             <Input
//               label="Personne de contact"
//               name="personne_contact"
//               value={form.personne_contact}
//               onChange={handleChange}
//               required
//             />

//             <Input
//               label="Email professionnel"
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               required
//             />

//             <Input
//               label="Téléphone"
//               name="numero"
//               value={form.numero}
//               onChange={handleChange}
//               required
//             />

//             {/* TYPE DE BESOIN */}
//             <div className="md:col-span-2">
//               <label className="text-sm font-medium text-gray-700">
//                 Type de besoin
//               </label>
//               <select
//                 name="type_besoin"
//                 value={form.type_besoin}
//                 onChange={handleChange}
//                 required
//                 className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
//               >
//                 <option value="">Sélectionner</option>
//                 {Object.values(TYPES_BESOIN).map((item) => (
//                   <option key={item.value} value={item.value}>
//                     {item.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* GRILLE TARIFAIRE */}
//             {grille && (
//               <div className="md:col-span-2 border rounded-xl p-6 bg-gray-50">
//                 <h3 className="font-semibold mb-4">
//                   Choisir une grille tarifaire
//                 </h3>

//                 <div className="space-y-3">
//                   {Object.entries(grille).map(([key, label]) => (
//                     <label
//                       key={key}
//                       className="flex items-center gap-3 cursor-pointer"
//                     >
//                       <input
//                         type="radio"
//                         name="grille_tarifaire"
//                         value={key}
//                         checked={form.grille_tarifaire === key}
//                         onChange={handleChange}
//                         required
//                       />
//                       <span>{label}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* DESCRIPTION */}
//             <div className="md:col-span-2">
//               <label className="text-sm font-medium text-gray-700">
//                 Description du besoin
//               </label>
//               <textarea
//                 name="description"
//                 rows="6"
//                 value={form.description}
//                 onChange={handleChange}
//                 required
//                 className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
//                 placeholder="Décrivez clairement votre besoin..."
//               />
//             </div>

//             {/* UPLOAD IMAGES */}
//             <div className="md:col-span-2">
//               <label className="text-sm font-medium text-gray-700">
//                 Image illustratif ou logo (facultatif)
//               </label>

//               <div className="mt-2 flex items-center gap-4">
//                 <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200">
//                   <Upload className="w-4 h-4" />
//                   Choisir des images
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleImagesChange}
//                   />
//                 </label>

//                 {images.length > 0 && (
//                   <span className="text-sm text-gray-600">
//                     {images.length} image(s) sélectionnée(s)
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* SUBMIT */}
//             <div className="md:col-span-2">
//               <Button
//                 type="submit"
//                 variant="danger"
//                 disabled={loading}
//                 className="w-full flex items-center justify-center gap-2"
//               >
//                 <Send />
//                 {loading ? "Envoi en cours..." : "Soumettre le besoin"}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </main>
//   );
// }






// // src/pages/public/DepotBesoin.jsx
// import { useState } from "react";
// import {
//   Briefcase,
//   Users,
//   FileText,
//   Send,
//   CheckCircle,
// } from "lucide-react";
// import Button from "../../components/ui/Button";
// import Input from "../../components/ui/Input";
// import { TYPES_BESOIN } from "../../constants/typesBesoin";
// import { GRILLE_TARIFAIRE } from "../../constants/grilleTarifaire";

// export default function DepotBesoin() {
//   const [form, setForm] = useState({
//     nom_entreprise: "",
//     personne_contact: "",
//     email: "",
//     numero: "",
//     type_besoin: "",
//     description: "",
//     grille_tarifaire: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Déterminer la grille à afficher
//   const grille =
//     form.type_besoin === "recrutement"
//       ? GRILLE_TARIFAIRE.emploi
//       : form.type_besoin === "formation_professionnel"
//       ? GRILLE_TARIFAIRE.formation
//       : null;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Besoin soumis :", form);
//     // 👉 ici appel API plus tard
//   };

//   return (
//     <main className="bg-white">

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-24">
//         <div className="max-w-7xl mx-auto px-6 text-center space-y-5">
//           <h1 className="text-4xl md:text-5xl font-bold">
//             Dépôt de besoin entreprise
//           </h1>
//           <p className="max-w-3xl mx-auto text-red-100 text-lg">
//             Confiez-nous vos besoins en recrutement ou en services professionnels.
//           </p>
//         </div>
//       </section>

//       {/* ================= FORMULAIRE ================= */}
//       <section className="py-24 bg-gray-50">
//         <div className="max-w-5xl mx-auto px-6">
//           <div className="bg-white rounded-2xl shadow-lg p-10">
//             <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//               Soumettre votre besoin
//             </h2>

//             <form
//               onSubmit={handleSubmit}
//               className="grid grid-cols-1 md:grid-cols-2 gap-6"
//             >
//               <Input
//                 label="Nom de l'entreprise"
//                 name="nom_entreprise"
//                 value={form.nom_entreprise}
//                 onChange={handleChange}
//               />

//               <Input
//                 label="Personne de contact"
//                 name="personne_contact"
//                 value={form.personne_contact}
//                 onChange={handleChange}
//               />

//               <Input
//                 label="Email professionnel"
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//               />

//               <Input
//                 label="Téléphone"
//                 name="numero"
//                 value={form.numero}
//                 onChange={handleChange}
//               />

//               {/* TYPE DE BESOIN */}
//               <div className="md:col-span-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Type de besoin
//                 </label>
//                 <select
//                   name="type_besoin"
//                   value={form.type_besoin}
//                   onChange={handleChange}
//                   className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
//                 >
//                   <option value="">Sélectionner un type</option>
//                   {Object.values(TYPES_BESOIN).map((t) => (
//                     <option key={t.value} value={t.value}>
//                       {t.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* GRILLE TARIFAIRE */}
//               {grille && (
//                 <div className="md:col-span-2 bg-gray-50 border rounded-xl p-6 space-y-3">
//                   <h3 className="font-semibold text-gray-900">
//                     Grille tarifaire
//                   </h3>

//                   {Object.entries(grille).map(([key, label]) => (
//                     <label
//                       key={key}
//                       className="flex items-center gap-3 cursor-pointer"
//                     >
//                       <input
//                         type="radio"
//                         name="grille_tarifaire"
//                         value={key}
//                         checked={form.grille_tarifaire === key}
//                         onChange={handleChange}
//                       />
//                       <span className="text-gray-700">{label}</span>
//                     </label>
//                   ))}

//                   <p className="text-sm text-gray-500 mt-3">
//                     💳 Paiement Mobile Money : MTN / MOOV / CELTIIS
//                   </p>
//                 </div>
//               )}

//               {/* DESCRIPTION */}
//               <div className="md:col-span-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Description du besoin
//                 </label>
//                 <textarea
//                   name="description"
//                   rows="6"
//                   value={form.description}
//                   onChange={handleChange}
//                   className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
//                   placeholder="Décrivez clairement votre besoin..."
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <Button
//                   variant="danger"
//                   type="submit"
//                   className="w-full flex items-center justify-center gap-2"
//                 >
//                   <Send />
//                   Soumettre le besoin
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }






// // src/pages/public/DepotBesoin.jsx
// import {
//   Briefcase,
//   Users,
//   FileText,
//   Building2,
//   Send,
//   CheckCircle,
// } from "lucide-react";
// import Button from "../../components/ui/Button";
// import Input from "../../components/ui/Input";

// export default function DepotBesoin() {
//   return (
//     <main className="bg-white">

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-24">
//         <div className="max-w-7xl mx-auto px-6 text-center space-y-5">
//           <h1 className="text-4xl md:text-5xl font-bold">
//             Dépôt de besoin entreprise
//           </h1>
//           <p className="max-w-3xl mx-auto text-red-100 text-lg">
//             Confiez-nous vos besoins en recrutement ou en services
//             professionnels. Notre équipe vous accompagne de A à Z.
//           </p>
//         </div>
//       </section>

//       {/* ================= INTRO ================= */}
//       <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//         <div className="space-y-6">
//           <h2 className="text-3xl font-bold text-gray-900">
//             Un accompagnement sur mesure
//           </h2>
//           <p className="text-gray-600">
//             Bénin Emploi+ met à votre disposition une équipe spécialisée pour
//             répondre efficacement à vos besoins en :
//           </p>

//           <ul className="space-y-4">
//             <li className="flex items-center gap-3">
//               <Briefcase className="text-green-600" />
//               <span>Recrutement & sélection de talents</span>
//             </li>
//             <li className="flex items-center gap-3">
//               <Users className="text-yellow-500" />
//               <span>Gestion du personnel & RH</span>
//             </li>
//             <li className="flex items-center gap-3">
//               <FileText className="text-red-600" />
//               <span>Formations, communication & accompagnement</span>
//             </li>
//           </ul>
//         </div>

//         {/* Valeur ajoutée */}
//         <div className="bg-gray-50 rounded-2xl p-8 shadow-sm space-y-4">
//           <h3 className="text-xl font-semibold text-gray-900">
//             Pourquoi passer par Bénin Emploi+ ?
//           </h3>

//           <div className="space-y-3">
//             {[
//               "Gain de temps et efficacité",
//               "Experts RH et partenaires qualifiés",
//               "Solutions adaptées à votre budget",
//               "Suivi personnalisé",
//             ].map((item, index) => (
//               <div key={index} className="flex items-center gap-3">
//                 <CheckCircle className="text-green-600 w-5 h-5" />
//                 <span className="text-gray-700">{item}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= FORMULAIRE ================= */}
//       <section className="py-24 bg-gray-50">
//         <div className="max-w-5xl mx-auto px-6">
//           <div className="bg-white rounded-2xl shadow-lg p-10">
//             <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//               Soumettre votre besoin
//             </h2>

//             <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

//               <Input label="Nom de l'entreprise" placeholder="Nom de votre entreprise" />
//               <Input label="Personne de contact" placeholder="Nom et prénom" />

//               <Input label="Email professionnel" type="email" placeholder="email@entreprise.com" />
//               <Input label="Téléphone" placeholder="+229 ..." />

//               <div className="md:col-span-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Type de besoin
//                 </label>
//                 <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
//                   <option>Recrutement (emploi, stage, mission)</option>
//                   <option>Formation professionnelle</option>
//                   <option>Gestion RH</option>
//                   <option>Communication / accompagnement</option>
//                   <option>Autre service</option>
//                 </select>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Description du besoin
//                 </label>
//                 <textarea
//                   rows="6"
//                   className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
//                   placeholder="Décrivez clairement votre besoin (profil recherché, délais, budget estimatif, etc.)"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <Button variant="danger" className="w-full flex items-center justify-center gap-2">
//                   <Send />
//                   Soumettre le besoin
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </section>

//       {/* ================= CTA ================= */}
//       <section className="bg-gray-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
//           <h2 className="text-3xl font-bold">
//             Vous préférez un échange direct ?
//           </h2>
//           <p className="text-gray-300 max-w-2xl mx-auto">
//             Notre équipe est disponible pour discuter de votre projet et vous
//             proposer une solution adaptée.
//           </p>

//           <div className="flex justify-center gap-4">
//             <a
//               href="https://wa.me/22990000000"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md font-medium transition"
//             >
//               WhatsApp
//             </a>
//             <a
//               href="/contact"
//               className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-md font-medium transition"
//             >
//               Page Contact
//             </a>
//           </div>
//         </div>
//       </section>

//     </main>
//   );
// }
