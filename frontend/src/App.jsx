// src/pages/public/Home.jsx


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, BookOpen, Building2, MapPin } from "lucide-react";
import heroImage from "./assets/images/emploi.png";
import { getFormations } from "./api/formation";
import { getOffres } from "./api/offre";

export default function Home() {
  const [formations, setFormations] = useState([]);
  const [loadingFormations, setLoadingFormations] = useState(true);
  const [offres, setOffres] = useState([]);
  const [loadingOffres, setLoadingOffres] = useState(true);
  const BASE_URL_FILE = "http://localhost:8000/storage/";




    useEffect(() => {
    const fetchOffres = async () => {
      try {
        setLoadingOffres(true);
        const res = await getOffres();
        setOffres(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Erreur récupération offres", err);
        setOffres([]);
      } finally {
        setLoadingOffres(false);
      }
    };

    fetchOffres();
  }, []);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoadingFormations(true);
        const res = await getFormations();
        setFormations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erreur récupération formations", err);
        setFormations([]);
      } finally {
        setLoadingFormations(false);
      }
    };

    fetchFormations();
  }, []);

  return (
    <main className="relative">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-white">
              Bienvenue sur Bénin Emploi+
            </h1>
            <p className="text-lg lg:text-xl text-white/90">
              La plateforme digitale pour entreprises, candidats et centres de formation.  
              Trouvez les meilleures offres, postulez, déposez vos besoins et développez vos compétences.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/register"
                className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Créer un compte
              </Link>
              <Link
                to="/depot-besoin"
                className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-red-600 transition-colors"
              >
                Déposer un besoin
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2">
            <img src={heroImage} alt="Bannière Benin Emploi" className="rounded-xl shadow-2xl w-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[ 
              { icon: Briefcase, title: "Offres d'emploi", desc: "Consultez et postulez aux meilleures opportunités au Bénin.", color: "green" },
              { icon: BookOpen, title: "Formations", desc: "Développez vos compétences grâce à nos formations certifiantes.", color: "yellow" },
              { icon: Building2, title: "Espace Entreprises", desc: "Déposez vos besoins, obtenez des devis et gérez vos offres facilement.", color: "red" },
            ].map((service, i) => {
              const Icon = service.icon;
              return (
                <div key={i} className={`p-6 rounded-xl border border-gray-200 shadow hover:shadow-2xl transition-all hover:scale-105`}>
                  <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-${service.color}-100 mb-4`}>
                    <Icon className={`w-7 h-7 text-${service.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Offres */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Offres d'emploi récentes
          </h2>

          {loadingOffres ? (
            /* Skeleton */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl shadow bg-gray-100 animate-pulse h-64 flex flex-col justify-between"
                >
                  <div className="h-32 bg-gray-300 rounded"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mt-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : offres.length === 0 ? (
            <p className="text-gray-500">
              Aucune offre disponible pour le moment
            </p>
          ) : (
            <>
              {/* Liste offres */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {offres.map((offre) => (
                  <div
                    key={offre.id}
                    className="rounded-xl shadow hover:shadow-2xl transition-all bg-white hover:scale-105 overflow-hidden text-left border-t-4 border-yellow-500"
                  >
                    {/* Image */}
                    <div className="h-40 w-full overflow-hidden">
                      {offre.image ? (
                        <img
                          src={`${BASE_URL_FILE}${offre.image}`}
                          alt={offre.intitule}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                          {offre.intitule}
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="p-6">
                      <h3 className="font-semibold text-xl mb-2">
                        {offre.intitule}
                      </h3>

                      <p className="text-gray-600 text-sm mb-1">
                        Type : {offre.type_contrat}
                      </p>

                      {offre.localisation && (
                        <p className="flex items-center gap-1 text-gray-600 text-sm">
                          <MapPin className="w-4 h-4" />
                          {offre.localisation}
                        </p>
                      )}

                      <p className="text-gray-400 text-sm">
                        Clôture : {offre.date_cloture}
                      </p>

                      <Link
                        to={`/offre-detail/${offre.id}`}
                        className="mt-3 inline-block text-yellow-600 font-semibold hover:underline"
                      >
                        Voir l'offre
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                to="/offres-list"
                className="text-yellow-600 font-semibold hover:underline text-lg"
              >
                Voir toutes les offres d'emploi
              </Link>
            </>
          )}
        </div>
      </section>

    
      {/* Formations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Titre centré */}
          <h2 className="text-3xl font-bold mb-12">
            Formations mises en avant
          </h2>

          {loadingFormations ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl shadow bg-gray-100 animate-pulse h-64 flex flex-col"
                >
                  <div className="h-40 bg-gray-300"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : formations.length === 0 ? (
            <p className="text-gray-500">
              Aucune formation disponible
            </p>
          ) : (
            <>
              {/* Liste des formations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {formations.map((formation) => {
                  const image =
                    formation.images?.length > 0
                      ? formation.images[0]
                      : formation.image || null;

                  return (
                    <div
                      key={formation.id}
                      className="rounded-xl shadow hover:shadow-2xl transition-all bg-gray-50 hover:scale-105 overflow-hidden text-left border-t-4 border-green-600"
                    >
                      {/* Image */}
                      <div className="h-40 w-full overflow-hidden">
                        {image ? (
                          <img
                            src={`${BASE_URL_FILE}${image}`}
                            alt={formation.titre}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                            {formation.titre}
                          </div>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="p-6">
                        <h3 className="font-semibold text-xl mb-2 line-clamp-2">
                          {formation.titre}
                        </h3>

                        <p className="text-gray-600 text-sm mb-2">
                          Début : {formation.date_debut}
                        </p>

                        <Link
                          to={`/formations/${formation.id}/inscription`}
                          className="inline-block text-green-600 font-semibold hover:underline"
                        >
                          S'inscrire
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lien voir tout */}
              <Link
                to="/formation-list"
                className="text-green-600 font-semibold hover:underline text-lg"
              >
                Voir toutes les formations
              </Link>
            </>
          )}
        </div>
      </section>


      {/* CTA Final */}
      <section className="py-20 bg-yellow-500 text-white text-center rounded-xl mx-6 lg:mx-20 my-20 shadow-2xl">
        <h2 className="text-3xl font-bold mb-6">Rejoignez Bénin Emploi+</h2>
        <p className="mb-6">Inscrivez-vous maintenant et accédez à toutes les offres et formations.</p>
        <Link
          to="/register"
          className="bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Créer un compte
        </Link>
      </section>

    </main>
  );
}







// import { Link } from "react-router-dom";
// import { Briefcase, BookOpen, Building2 } from "lucide-react";
// import heroImage from "./assets/images/emploi.png";

// export default function App() {
//   const offres = [
//     { id: 1, title: "Développeur Frontend React", entreprise: "GSB Tech", location: "Cotonou", color: "green" },
//     { id: 2, title: "Assistant RH", entreprise: "Bénin RH", location: "Porto-Novo", color: "yellow" },
//     { id: 3, title: "Formateur Digital", entreprise: "GSB Academy", location: "Cotonou", color: "red" },
//   ];

//   const formations = [
//     { id: 1, title: "React Avancé", date: "20 Janvier 2026", color: "green" },
//     { id: 2, title: "Gestion de Projet", date: "15 Février 2026", color: "yellow" },
//     { id: 3, title: "Communication RH", date: "01 Mars 2026", color: "red" },
//   ];

//   return (
//     <main className="relative">

//       {/* HERO */}
//       <section className="relative bg-gradient-to-r from-green-600 via-yellow-400 to-red-500 text-white overflow-hidden">
//         <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row items-center gap-12">
//           <div className="lg:w-1/2 space-y-6">
//             <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-yellow-300 to-red-300">
//               Bienvenue sur Bénin Emploi+
//             </h1>
//             <p className="text-lg lg:text-xl text-white/90">
//               La plateforme digitale pour entreprises, candidats et centres de formation.  
//               Trouvez les meilleures offres, postulez, déposez vos besoins et développez vos compétences.
//             </p>
//             <div className="flex gap-4 flex-wrap">
//               <Link
//                 to="/register"
//                 className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
//               >
//                 Créer un compte
//               </Link>
//               <Link
//                 to="/depot-besoin"
//                 className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-red-600 transition-colors"
//               >
//                 Déposer un besoin
//               </Link>
//             </div>
//           </div>

//           <div className="lg:w-1/2">
//             <img src={heroImage} alt="Bannière Benin Emploi" className="rounded-xl shadow-2xl w-full object-cover hover:scale-105 transition-transform duration-500" />
//           </div>
//         </div>
//       </section>

//       {/* Services */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold mb-12 text-gray-900">Nos Services</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               { icon: Briefcase, title: "Offres d'emploi", desc: "Consultez et postulez aux meilleures opportunités au Bénin.", color: "green" },
//               { icon: BookOpen, title: "Formations", desc: "Développez vos compétences grâce à nos formations certifiantes.", color: "yellow" },
//               { icon: Building2, title: "Espace Entreprises", desc: "Déposez vos besoins, obtenez des devis et gérez vos offres facilement.", color: "red" },
//             ].map((service, i) => {
//               const Icon = service.icon;
//               return (
//                 <div key={i} className={`p-6 rounded-xl border border-gray-200 shadow hover:shadow-2xl transition-all hover:scale-105`}>
//                   <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-${service.color}-100 mb-4`}>
//                     <Icon className={`w-7 h-7 text-${service.color}-600`} />
//                   </div>
//                   <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
//                   <p className="text-gray-600 text-sm">{service.desc}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Offres */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-3xl font-bold mb-12 text-center">Offres d'emploi récentes</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {offres.map((offre) => (
//               <div key={offre.id} className={`p-6 rounded-xl shadow hover:shadow-2xl transition-all border-l-4 border-${offre.color}-600 bg-white hover:scale-105`}>
//                 <h3 className="font-semibold text-xl mb-2">{offre.title}</h3>
//                 <p className="text-gray-600 text-sm mb-1">{offre.entreprise}</p>
//                 <p className="text-gray-400 text-sm">{offre.location}</p>
//                 <Link to={`/offre-detail/${offre.id}`} className={`mt-3 inline-block text-${offre.color}-600 font-semibold hover:underline`}>
//                   Voir l'offre
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Formations */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-3xl font-bold mb-12 text-center">Formations mises en avant</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {formations.map((formation) => (
//               <div key={formation.id} className={`p-6 rounded-xl shadow hover:shadow-2xl transition-all border-t-4 border-${formation.color}-600 bg-gray-50 hover:scale-105`}>
//                 <h3 className="font-semibold text-xl mb-2">{formation.title}</h3>
//                 <p className="text-gray-600 text-sm mb-1">Date : {formation.date}</p>
//                 <Link to={`/formations/${formation.id}/inscription`} className={`mt-3 inline-block text-${formation.color}-600 font-semibold hover:underline`}>
//                   S'inscrire
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Final */}
//       <section className="py-20 bg-gradient-to-r from-green-600 via-yellow-400 to-red-500 text-white text-center rounded-xl mx-6 lg:mx-20 my-20 shadow-2xl">
//         <h2 className="text-3xl font-bold mb-6">Rejoignez Bénin Emploi+</h2>
//         <p className="mb-6">Inscrivez-vous maintenant et accédez à toutes les offres et formations.</p>
//         <Link
//           to="/register"
//           className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
//         >
//           Créer un compte
//         </Link>
//       </section>

//     </main>
//   );
// }


