// src/pages/public/Presentation.jsx
import { Briefcase, BookOpen, Users, Target } from "lucide-react";
import { useEffect, useRef } from "react";

import team1 from "../../assets/images/team1.jpg";
import team2 from "../../assets/images/team2.jpg";

import partner1 from "../../assets/images/partner1.png";
import partner2 from "../../assets/images/partner2.png";
import partner3 from "../../assets/images/partner3.png";
import partner4 from "../../assets/images/partner4.png";

export default function Presentation() {
  const sliderRef = useRef(null);

  /* ===== Slider partenaires auto-scroll ===== */
  useEffect(() => {
    const slider = sliderRef.current;
    let interval;

    const start = () => {
      interval = setInterval(() => {
        slider.scrollLeft += 1;
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }, 20);
    };

    start();
    slider.addEventListener("mouseenter", () => clearInterval(interval));
    slider.addEventListener("mouseleave", start);

    return () => clearInterval(interval);
  }, []);

  /* ===== Services ===== */
  const services = [
    {
      icon: Briefcase,
      title: "Recrutement & Emploi",
      desc: "Publication d’offres, candidatures, alertes et gestion des profils.",
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      icon: BookOpen,
      title: "Formations",
      desc: "Catalogue de formations professionnelles avec inscription simplifiée.",
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      icon: Users,
      title: "Espace Entreprises",
      desc: "Dépôt de besoins, devis personnalisés et suivi via tableau de bord.",
      bg: "bg-red-100",
      text: "text-red-600",
    },
  ];

  const partners = [
    partner1,
    partner2,
    partner3,
    partner4,
    partner1,
    partner2,
    partner3,
    partner4,
  ];

  return (
    <main className="bg-white">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-28">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Bénin <span className="text-yellow-300">Emploi+</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-green-100">
            La plateforme digitale qui connecte entreprises, candidats et centres
            de formation pour un marché de l’emploi plus performant au Bénin.
          </p>
        </div>
      </section>

      {/* ================= VISION ================= */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center space-y-6">
        <Target className="w-12 h-12 mx-auto text-green-600" />
        <h2 className="text-3xl font-bold text-gray-900">Notre Vision</h2>
        <p className="max-w-3xl mx-auto text-gray-600 text-lg">
          Devenir la référence nationale en matière d’emploi, de formation et
          d’accompagnement professionnel grâce à une plateforme moderne,
          inclusive et accessible à tous.
        </p>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Nos Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm hover:shadow-xl transition-all"
                >
                  <div
                    className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-6 ${service.bg}`}
                  >
                    <Icon className={`w-7 h-7 ${service.text}`} />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ÉQUIPE ================= */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-16">
          Notre Équipe
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { img: team1, name: "Alice K.", role: "CEO & Fondatrice" },
            { img: team2, name: "Marc D.", role: "Responsable RH" },
            { img: team1, name: "Sophie L.", role: "Formations & Coaching" },
            { img: team2, name: "Jean P.", role: "Développement & IT" },
          ].map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={m.img}
                alt={m.name}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{m.name}</h3>
                <p className="text-gray-500 text-sm">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PARTENAIRES ================= */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-gray-600 mb-14">
            Entreprises, institutions et partenaires stratégiques
          </p>

          <div
            ref={sliderRef}
            className="flex gap-12 overflow-x-hidden whitespace-nowrap"
          >
            {[...partners, ...partners].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 h-20 flex items-center justify-center bg-white rounded-xl shadow-sm hover:shadow-md transition"
              >
                <img
                  src={logo}
                  alt="Partenaire"
                  className="max-h-12 object-contain grayscale hover:grayscale-0 transition"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}


// // src/pages/public/Presentation.jsx
// import { Briefcase, BookOpen, Users, Award } from "lucide-react";
// import team1 from "../../assets/images/team1.jpg";
// import team2 from "../../assets/images/team2.jpg";
// import partner1 from "../../assets/images/partner1.png";
// import partner2 from "../../assets/images/partner2.png";

// export default function Presentation() {
//   return (
//     <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">

//       {/* Présentation générale */}
//       <section className="text-center space-y-6">
//         <h1 className="text-4xl font-bold text-gray-900">
//           Présentation de <span className="text-green-600">Bénin Emploi+</span>
//         </h1>
//         <p className="text-gray-700 text-lg max-w-3xl mx-auto">
//           Bénin Emploi+ est une plateforme digitale dédiée aux entreprises, candidats et centres de formation. 
//           Notre objectif est de faciliter le recrutement, la gestion du personnel et la communication des formations au Bénin.
//         </p>
//       </section>

//       {/* Vision */}
//       <section className="bg-green-50 rounded-xl p-12 text-center space-y-4">
//         <h2 className="text-3xl font-bold text-green-700">Notre Vision</h2>
//         <p className="text-gray-700 text-lg max-w-3xl mx-auto">
//           Devenir la référence au Bénin pour la mise en relation efficace entre entreprises, candidats et centres de formation.
//           Nous aspirons à un marché du travail plus transparent, dynamique et accessible à tous.
//         </p>
//       </section>

//       {/* Services */}
//       <section className="space-y-12">
//         <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nos Services</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition-all text-center">
//             <Briefcase className="w-10 h-10 text-green-600 mx-auto mb-4" />
//             <h3 className="font-semibold text-lg mb-2">Offres d'emploi</h3>
//             <p className="text-gray-600 text-sm">
//               Publiez et consultez les offres d'emploi, postulez facilement aux meilleures opportunités.
//             </p>
//           </div>
//           <div className="p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition-all text-center">
//             <BookOpen className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
//             <h3 className="font-semibold text-lg mb-2">Formations</h3>
//             <p className="text-gray-600 text-sm">
//               Découvrez et participez aux formations certifiantes pour améliorer vos compétences.
//             </p>
//           </div>
//           <div className="p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition-all text-center">
//             <Users className="w-10 h-10 text-red-600 mx-auto mb-4" />
//             <h3 className="font-semibold text-lg mb-2">Espace Entreprises</h3>
//             <p className="text-gray-600 text-sm">
//               Déposez vos besoins, obtenez des devis et gérez vos offres en toute simplicité.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Équipe */}
//       <section className="space-y-12 text-center">
//         <h2 className="text-3xl font-bold text-gray-900">Notre Équipe</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//           <div className="space-y-3">
//             <img src={team1} alt="Membre équipe" className="w-full h-48 object-cover rounded-xl shadow-lg" />
//             <h3 className="font-semibold">Alice K.</h3>
//             <p className="text-gray-500 text-sm">CEO & Fondatrice</p>
//           </div>
//           <div className="space-y-3">
//             <img src={team2} alt="Membre équipe" className="w-full h-48 object-cover rounded-xl shadow-lg" />
//             <h3 className="font-semibold">Marc D.</h3>
//             <p className="text-gray-500 text-sm">Responsable RH</p>
//           </div>
//           <div className="space-y-3">
//             <img src={team1} alt="Membre équipe" className="w-full h-48 object-cover rounded-xl shadow-lg" />
//             <h3 className="font-semibold">Sophie L.</h3>
//             <p className="text-gray-500 text-sm">Formations & Coaching</p>
//           </div>
//           <div className="space-y-3">
//             <img src={team2} alt="Membre équipe" className="w-full h-48 object-cover rounded-xl shadow-lg" />
//             <h3 className="font-semibold">Jean P.</h3>
//             <p className="text-gray-500 text-sm">Développement & IT</p>
//           </div>
//         </div>
//       </section>

//       {/* Partenaires */}
//       <section className="space-y-12 text-center">
//         <h2 className="text-3xl font-bold text-gray-900">Nos Partenaires</h2>
//         <div className="flex flex-wrap justify-center items-center gap-12">
//           <img src={partner1} alt="Partenaire 1" className="h-16 object-contain" />
//           <img src={partner2} alt="Partenaire 2" className="h-16 object-contain" />
//           <img src={partner1} alt="Partenaire 3" className="h-16 object-contain" />
//           <img src={partner2} alt="Partenaire 4" className="h-16 object-contain" />
//         </div>
//       </section>

//     </main>
//   );
// }
