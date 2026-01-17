import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { getBlogs } from "../../api/blog";

const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch des articles depuis l'API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await getBlogs();
        // On récupère le tableau d'articles
        setArticles(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Erreur chargement des articles", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        {/* Header Skeleton */}
        <section className="text-center mb-12 space-y-4 animate-pulse">
          <div className="h-12 w-64 bg-green-300 mx-auto rounded"></div>
          <div className="h-6 w-2/3 bg-green-300 mx-auto rounded"></div>
        </section>

        {/* Skeleton des cartes */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col animate-pulse">
              {/* Image */}
              <div className="h-48 w-full bg-green-200"></div>
              {/* Contenu */}
              <div className="p-6 space-y-4 flex-1">
                <div className="h-4 w-1/4 bg-green-200 rounded"></div>
                <div className="h-6 w-3/4 bg-green-300 rounded"></div>
                <div className="h-4 w-full bg-green-100 rounded"></div>
                <div className="h-8 w-1/2 bg-green-300 rounded mt-auto"></div>
              </div>
            </div>
          ))}
        </section>
      </main>
    );
  }


  return (
    <main className="max-w-7xl mx-auto px-6 py-20 space-y-16">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Blog & Actualités
        </h1>
        <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
          Articles et conseils RH, marché du travail, formations et opportunités d’emploi au Bénin.
        </p>
      </section>

      {/* Listing des articles */}
      {articles.length === 0 ? (
        <div className="text-center text-gray-500 py-20 bg-white rounded-xl shadow-sm">
          Aucun article disponible pour le moment.
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article) => {
            let images = [];
            if (article.image) {
              try {
                images = JSON.parse(article.image);
                if (!Array.isArray(images)) images = [images];
              } catch {
                images = [article.image];
              }
            }

            return (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col"
              >
                {/* Image */}
                {images.length > 0 ? (
                  <img
                    src={`${BASE_URL_FILE}${images[0]}`}
                    alt={article.titre}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400 font-semibold">
                    Pas d'image
                  </div>
                )}

                {/* Contenu */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span>{article.categorie || "Autre"}</span>
                    <span>•</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-2 flex-1">
                    {article.titre}
                  </h2>
                  <p className="text-gray-600 mb-4 flex-1">
                    {article.excerpt || (article.contenu?.slice(0, 100) + "...")}
                  </p>

                  <Link
                    to={`/blog-detail/${article.id}`}
                    className="mt-auto inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm text-center"
                  >
                    Lire la suite
                  </Link>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}



// import { useState, useEffect } from "react";
// import { Calendar, User, FileText } from "lucide-react";
// import { Link } from "react-router-dom";
// import CvSuper from "../../assets/images/cv_efficace.png";
// import Tendance from "../../assets/images/tendance.png";
// import StartMeet from "../../assets/images/preparer_entretien.png";
// // Exemple de données statiques (à remplacer par API)
// const articlesData = [
//   {
//     id: 1,
//     title: "Comment rédiger un CV efficace",
//     excerpt: "Découvrez nos astuces pour créer un CV qui attire l’attention des recruteurs.",
//     author: "Alice K.",
//     date: "2025-01-10",
//     category: "RH",
//     image: CvSuper,
//   },
//   {
//     id: 2,
//     title: "Tendances du marché de l’emploi 2025",
//     excerpt: "Analyse des secteurs porteurs et compétences recherchées au Bénin.",
//     author: "Marc D.",
//     date: "2025-01-12",
//     category: "Marché du travail",
//     image: Tendance,
//   },
//   {
//     id: 3,
//     title: "Préparer un entretien d’embauche",
//     excerpt: "Techniques et conseils pour réussir vos entretiens et décrocher l’emploi de vos rêves.",
//     author: "Sophie L.",
//     date: "2025-01-15",
//     category: "RH",
//     image: StartMeet,
//   },
// ];

// export default function Blog() {
//   const [articles, setArticles] = useState([]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setArticles(articlesData);
//     }, 0);
//     return () => clearTimeout(timer);
//   }, []);


//   return (
//     <main className="bg-gray-50 min-h-screen">
      
//       {/* HEADER */}
//       <section className="bg-green-700 text-white py-20">
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold">Blog Bénin Emploi+</h1>
//           <p className="text-green-100 mt-4 text-lg">
//             Articles RH et marché du travail pour booster votre carrière et rester informé.
//           </p>
//         </div>
//       </section>

//       {/* LISTE ARTICLES */}
//       <section className="max-w-7xl mx-auto px-6 py-20">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//           {articles.map((article) => (
//             <Link
//               to={`/blog/${article.id}`}
//               key={article.id}
//               className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
//             >
//               <img
//                 src={article.image}
//                 alt={article.title}
//                 className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
//               />
//               <div className="p-6 space-y-3">
//                 <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
//                 <p className="text-gray-600 text-sm">{article.excerpt}</p>
//                 <div className="flex items-center justify-between text-gray-500 text-xs mt-4">
//                   <span className="flex items-center gap-1">
//                     <User className="w-3 h-3" /> {article.author}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Calendar className="w-3 h-3" /> {article.date}
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }
