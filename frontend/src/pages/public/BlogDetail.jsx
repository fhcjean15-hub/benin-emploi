import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FileText, Calendar, ArrowLeft } from "lucide-react";
import { getBlog } from "../../api/blog";

const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

export default function BlogDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await getBlog(id);

        if (res.data && res.data.data) {
          const data = res.data.data;

          // Gestion images JSON / chaîne simple
          let images = [];
          if (data.image) {
            try {
              images = JSON.parse(data.image);
              if (!Array.isArray(images)) images = [images];
            } catch {
              images = [data.image];
            }
          }

          setArticle({
            ...data,
            image: images.length > 0 ? images : null,
          });
        } else {
          setError("Article non trouvé");
        }
      } catch (err) {
        console.error("Erreur chargement article", err);
        setError("Erreur lors du chargement de l'article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 space-y-12 animate-pulse">
        {/* Retour */}
        <div className="h-6 w-32 bg-green-200 rounded"></div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl overflow-hidden">
          <div className="h-64 md:h-80 bg-green-200 rounded-xl"></div>
          <div className="h-64 md:h-80 bg-green-200 rounded-xl"></div>
        </div>

        {/* Contenu de l'article */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-4 w-20 bg-green-200 rounded"></div>
            <div className="h-4 w-32 bg-green-200 rounded"></div>
          </div>

          <div className="h-10 w-3/4 bg-green-300 rounded"></div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-green-100 rounded"></div>
            <div className="h-4 w-5/6 bg-green-100 rounded"></div>
            <div className="h-4 w-4/6 bg-green-100 rounded"></div>
            <div className="h-4 w-3/6 bg-green-100 rounded"></div>
          </div>

          {/* Bouton CTA */}
          <div className="h-12 w-1/3 bg-green-300 rounded mt-6"></div>
        </div>
      </main>
    );
  }


  if (error || !article) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {error || "Article non trouvé"}
        </h1>
        <Link
          to="/blog"
          className="inline-block px-4 py-2 mt-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Retour au Blog
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      {/* Retour */}
      <div>
        <Link
          to="/blog"
          className="flex items-center gap-2 text-green-600 hover:underline text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au Blog
        </Link>
      </div>

      {/* Images */}
      {article.image && article.image.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl overflow-hidden shadow-lg">
          {article.image.map((img, idx) => (
            <img
              key={idx}
              src={`${BASE_URL_FILE}${img}`}
              alt={`Article ${idx + 1}`}
              className="w-full h-64 md:h-80 object-cover rounded-xl"
            />
          ))}
        </div>
      )}

      {/* Contenu de l'article */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 text-gray-500 text-sm">
          <FileText className="w-4 h-4 text-green-600" />
          <span>{article.categorie || "Autre"}</span>
          <Calendar className="w-4 h-4" />
          <span>{new Date(article.created_at || article.date).toLocaleDateString()}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {article.titre || article.title}
        </h1>

        <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
          {article.contenu || article.content || "Pas de contenu disponible."}
        </div>

        {/* CTA / Inscription */}
        <div className="text-center mt-8">
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all text-lg"
          >
            Nous contacter pour plus d’infos
          </Link>
        </div>
      </div>
    </main>
  );
}
