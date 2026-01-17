
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { getFormation, createInscription } from "../../api/formation";
import { getUser } from "../../api/user";

const COMPANY_WHATSAPP_NUMBER = "2290195173851"; // numéro WhatsApp entreprise

export default function FormationInscription() {
  const { id } = useParams();

  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingFormation, setLoadingFormation] = useState(true);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    contact: "",
    email: "",
  });
  const [user, setUser] = useState(null);

  
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
  

  /* ================= CHARGEMENT FORMATION ================= */
  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const res = await getFormation(id);
        setFormation(res.data);
      } catch (error) {
        console.error("Erreur chargement formation", error);
      } finally {
        setLoadingFormation(false);
      }
    };
    fetchFormation();
  }, [id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const buildWhatsappMessage = ({ formation, formData }) => {
    return encodeURIComponent(
      `Bonjour 👋,

      Je souhaite m’inscrire à la formation suivante :

      📘 Formation : ${formation.titre}
      💰 Coût : ${Number(formation.cout).toLocaleString()} FCFA

      👤 Nom : ${formData.nom}
      👤 Prénom : ${formData.prenom}
      📞 Téléphone : ${formData.contact}
      📧 Email : ${formData.email}

      Merci de me contacter pour la suite 🙏`
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (user) {
        // 🔹 Utilisateur connecté → store
        response = await createInscription("/users-formations",{
          formation_id: formation.id,
          nom: formData.nom,
          prenom: formData.prenom,
          contact: formData.contact,
          email: formData.email,
          montant: formation.cout,
        });
      } else {
        // 🔹 Utilisateur public → storePublic
        response = await createInscription("/users-formations/public",{
          formation_id: formation.id,
          nom: formData.nom,
          prenom: formData.prenom,
          contact: formData.contact,
          email: formData.email,
          montant: formation.cout,
        });
      }

      console.log(response);
      
      // 🔹 Affichage d’un modal ou message de confirmation
      alert("✅ Inscription enregistrée avec succès !");

      // ================================
      // 🔹 REDIRECTION WHATSAPP
      // ================================
      const message = buildWhatsappMessage({
        formation,
        formData,
      });

      const whatsappUrl = `https://wa.me/${COMPANY_WHATSAPP_NUMBER}?text=${message}`;

      // ⏱ petit délai UX (optionnel)
      setTimeout(() => {
        window.location.href = whatsappUrl;
      }, 800);

      // 🔹 Réinitialisation du formulaire
      setFormData({
        nom: "",
        prenom: "",
        contact: "",
        email: "",
      });

    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de l’inscription");
    } finally {
      setLoading(false);
    }
  };


  /* ================= LOADING ================= */
if (loadingFormation) {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header skeleton */}
      <section className="bg-green-700 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center animate-pulse">
          <div className="h-6 w-32 bg-green-500 rounded mx-auto mb-4" />
          <div className="h-10 w-3/4 bg-green-500 rounded mx-auto mb-4" />
          <div className="h-4 w-2/3 bg-green-500 rounded mx-auto" />
        </div>
      </section>

      {/* Form skeleton */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-lg p-10 space-y-10 animate-pulse">
          
          {/* Infos personnelles */}
          <div className="space-y-6">
            <div className="h-6 w-1/3 bg-gray-300 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-1/4 bg-gray-300 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Paiement */}
          <div className="space-y-6">
            <div className="h-6 w-1/3 bg-gray-300 rounded" />
            <div className="h-24 bg-gray-200 rounded-lg" />
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <div className="h-12 w-48 bg-green-300 rounded-lg" />
          </div>
        </div>
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

      {/* ================= HEADER ================= */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge variant="success">Inscription & Paiement</Badge>

          <h1 className="text-4xl font-bold mt-4">
            {formation.titre}
          </h1>

          <p className="text-green-100 mt-4">
            Remplissez le formulaire pour accéder au paiement sécurisé
          </p>
        </div>
      </section>

      {/* ================= FORM ================= */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-10 space-y-10"
        >
          {/* Infos personnelles */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="text-green-600" />
              Informations personnelles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
              <Input
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Téléphone"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+229 xx xx xx xx"
                required
              />
            </div>
          </div>

          {/* Paiement */}
          {/* <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CreditCard className="text-yellow-500" />
              Paiement
            </h2>

            <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
              <div className="flex justify-between font-medium">
                <span>Montant</span>
                <span className="text-green-700">
                  {Number(formation.cout).toLocaleString()} FCFA
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="text-green-600" />
                Paiement sécurisé via Fedapay
              </div>
            </div>
          </div> */}

          {/* CTA */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="text-lg px-8"
            >
              {loading ? "Redirection..." : "s’inscrire"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}










// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import {
//   User,
//   Mail,
//   Phone,
//   CreditCard,
//   CheckCircle,
// } from "lucide-react";
// import Button from "../../components/ui/Button";
// import Input from "../../components/ui/Input";
// import Badge from "../../components/ui/Badge";
// import { getFormation, createInscription } from "../../api/formation";

// export default function FormationInscription() {
//   const { id } = useParams();

//   const [formation, setFormation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingFormation, setLoadingFormation] = useState(true);

//   const [formData, setFormData] = useState({
//     nom: "",
//     prenom: "",
//     contact: "",
//     email: "",
//   });

//   /* ================= CHARGEMENT FORMATION ================= */
//   useEffect(() => {
//     const fetchFormation = async () => {
//       try {
//         const res = await getFormation(id);
//         setFormation(res.data);
//       } catch (error) {
//         console.error("Erreur chargement formation", error);
//       } finally {
//         setLoadingFormation(false);
//       }
//     };
//     fetchFormation();
//   }, [id]);

//   /* ================= HANDLERS ================= */
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await createInscription({
//         formation_id: formation.id,
//         nom: formData.nom,
//         prenom: formData.prenom,
//         contact: formData.contact,
//         email: formData.email,
//         montant: formation.cout,
//       });

//       alert("✅ Inscription envoyée avec succès !");
//       setFormData({
//         nom: "",
//         prenom: "",
//         contact: "",
//         email: "",
//       });
//     } catch (error) {
//       console.error(error);
//       alert("❌ Erreur lors de l’inscription");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= LOADING ================= */
//   if (loadingFormation) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-gray-500">
//         Chargement de la formation...
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

//       {/* ================= HEADER ================= */}
//       <section className="bg-green-700 text-white py-16">
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <Badge variant="success">Inscription Formation</Badge>

//           <h1 className="text-4xl font-bold mt-4">
//             {formation.titre}
//           </h1>

//           <p className="text-green-100 mt-4">
//             Remplissez le formulaire ci-dessous pour finaliser votre inscription
//           </p>
//         </div>
//       </section>

//       {/* ================= FORM ================= */}
//       <section className="max-w-4xl mx-auto px-6 py-16">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-xl shadow-lg p-10 space-y-10"
//         >
//           {/* Infos personnelles */}
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold flex items-center gap-2">
//               <User className="text-green-600" />
//               Informations personnelles
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Input
//                 label="Nom"
//                 name="nom"
//                 value={formData.nom}
//                 onChange={handleChange}
//                 required
//               />

//               <Input
//                 label="Prénom"
//                 name="prenom"
//                 value={formData.prenom}
//                 onChange={handleChange}
//                 required
//               />

//               <Input
//                 label="Email"
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />

//               <Input
//                 label="Téléphone"
//                 name="contact"
//                 value={formData.contact}
//                 onChange={handleChange}
//                 placeholder="+229 xx xx xx xx"
//                 required
//               />
//             </div>
//           </div>

//           {/* Paiement */}
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold flex items-center gap-2">
//               <CreditCard className="text-yellow-500" />
//               Paiement
//             </h2>

//             <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
//               <div className="flex justify-between font-medium">
//                 <span>Montant de la formation</span>
//                 <span className="text-green-700">
//                   {Number(formation.cout).toLocaleString()} FCFA
//                 </span>
//               </div>

//               <div className="flex items-center gap-3 text-sm text-gray-600">
//                 <CheckCircle className="text-green-600" />
//                 Paiement sécurisé via MTN, Moov, Celtis
//               </div>
//             </div>
//           </div>

//           {/* CTA */}
//           <div className="flex justify-end">
//             <Button
//               type="submit"
//               disabled={loading}
//               className="text-lg px-8"
//             >
//               {loading ? "Traitement..." : "Valider l’inscription"}
//             </Button>
//           </div>
//         </form>
//       </section>

//       {/* ================= CTA ================= */}
//       <section className="bg-green-50 py-16 text-center">
//         <h2 className="text-2xl font-bold mb-4">
//           Besoin d’aide avant de vous inscrire ?
//         </h2>
//         <p className="text-gray-600 mb-6">
//           Contactez notre équipe pour toute information complémentaire
//         </p>
//         <Button variant="secondary">
//           Contacter le support
//         </Button>
//       </section>

//     </main>
//   );
// }








// import { useState } from "react";
// import { User, Mail, Phone, CreditCard, CheckCircle } from "lucide-react";
// import Button from "../../components/ui/Button";
// import Input from "../../components/ui/Input";
// import Badge from "../../components/ui/Badge";

// export default function FormationInscription() {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // TODO : API + Paiement
//     setTimeout(() => {
//       setLoading(false);
//       alert("Inscription envoyée avec succès !");
//     }, 1500);
//   };

//   return (
//     <main className="bg-gray-50 min-h-screen">

//       {/* ================= HEADER ================= */}
//       <section className="bg-green-700 text-white py-16">
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <Badge variant="success">Inscription Formation</Badge>
//           <h1 className="text-4xl font-bold mt-4">
//             Développement Web (React & Node)
//           </h1>
//           <p className="text-green-100 mt-4">
//             Remplissez le formulaire ci-dessous pour finaliser votre inscription
//           </p>
//         </div>
//       </section>

//       {/* ================= FORM ================= */}
//       <section className="max-w-4xl mx-auto px-6 py-16">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-xl shadow-lg p-10 space-y-10"
//         >
//           {/* Infos personnelles */}
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold flex items-center gap-2">
//               <User className="text-green-600" />
//               Informations personnelles
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Input label="Nom complet" placeholder="Ex : Jean Dupont" required />
//               <Input label="Email" type="email" placeholder="exemple@email.com" required />
//               <Input label="Téléphone" placeholder="+229 xx xx xx xx" required />
//               <Input label="Ville / Pays" placeholder="Cotonou, Bénin" />
//             </div>
//           </div>

//           {/* Paiement */}
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold flex items-center gap-2">
//               <CreditCard className="text-yellow-500" />
//               Paiement
//             </h2>

//             <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
//               <div className="flex justify-between font-medium">
//                 <span>Montant de la formation</span>
//                 <span className="text-green-700">150 000 FCFA</span>
//               </div>

//               <div className="flex items-center gap-3 text-sm text-gray-600">
//                 <CheckCircle className="text-green-600" />
//                 Paiement sécurisé via MTN, Moov, Celtis
//               </div>
//             </div>
//           </div>

//           {/* CTA */}
//           <div className="flex justify-end">
//             <Button type="submit" disabled={loading} className="text-lg px-8">
//               {loading ? "Traitement..." : "Valider l’inscription"}
//             </Button>
//           </div>
//         </form>
//       </section>

//       {/* ================= CTA ================= */}
//       <section className="bg-green-50 py-16 text-center">
//         <h2 className="text-2xl font-bold mb-4">
//           Besoin d’aide avant de vous inscrire ?
//         </h2>
//         <p className="text-gray-600 mb-6">
//           Contactez notre équipe pour toute information complémentaire
//         </p>
//         <Button variant="secondary">
//           Contacter le support
//         </Button>
//       </section>

//     </main>
//   );
// }
