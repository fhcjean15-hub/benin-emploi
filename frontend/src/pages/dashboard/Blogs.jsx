// src/pages/dashboard/Blogs.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogs, deleteBlog } from "../../api/blog";
import { Trash2, Pencil, Plus } from "lucide-react";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

  /* =============================
   * Chargement des blogs
   * ============================= */
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await getBlogs();
      
      setBlogs(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Erreur chargement blogs", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  /* =============================
   * Supprimer un blog
   * ============================= */
  const handleDeleteBlog = async (id) => {
    if (!confirm("Supprimer ce blog ?")) return;
    try {
      await deleteBlog(id);
      fetchBlogs();
    } catch (err) {
      console.error("Erreur suppression blog", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestion des blogs
          </h1>
          <p className="text-slate-500 mt-1">
            Tous les articles publiés
          </p>
        </div>

        <Link
          to="/dashboard/blogs/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold transition"
        >
          <Plus size={18} />
          Nouvel article
        </Link>
      </div>

      {/* Contenu */}
      {blogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
          Aucun blog enregistré
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <Link to={`/dashboard/blogs/${b.id}`} className="block">
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  {b.image && b.image.length > 0 ? (
                    <img
                      src={`${BASE_URL_FILE}${b.image[0]}`}
                      alt={b.titre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 font-semibold text-lg">
                      {b.titre}
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                    {b.titre}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {b.contenu}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <Link
                      to={`/dashboard/blogs/${b.id}/edit`}
                      className="flex items-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium"
                    >
                      <Pencil size={16} />
                      Modifier
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteBlog(b.id);
                      }}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
