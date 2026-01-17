// src/pages/dashboard/BlogDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlog } from "../../api/blog";
import { getUser } from "../../api/user";
import { ROLES } from "../../constants/role";
import { ArrowLeft, Trash2 } from "lucide-react";

const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

export default function DetailBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // const isAdmin = user?.role === ROLES.ADMIN;

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

  // Récupération blog
  useEffect(() => {
    if (user) fetchBlogDetail();
  }, [user]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const res = await getBlog(id);
      setBlog(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.error("Erreur chargement blog", err);
    } finally {
      setLoading(false);
    }
  };

  // const handleDeleteBlog = async () => {
  //   if (!confirm("Supprimer ce blog ?")) return;
  //   try {
  //     await deleteBlog(id);
  //     navigate("/dashboard/blogs");
  //   } catch (err) {
  //     console.error("Erreur suppression blog", err);
  //   }
  // };

  if (loading || !blog) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Chargement du blog...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{blog.titre}</h1>
          <p className="text-slate-500 mt-1">Détails du blog</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Retour
          </button>

          {/* {isAdmin && (
            <button
              onClick={handleDeleteBlog}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium"
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          )} */}
        </div>
      </div>

      {/* Images */}
      {blog.image?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {blog.image.map((img, idx) => (
            <img
              key={idx}
              src={`${BASE_URL_FILE}${img}`}
              alt={`Blog ${idx + 1}`}
              className="rounded-xl object-cover h-32 w-full border"
            />
          ))}
        </div>
      )}

      {/* Contenu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="text-slate-700 whitespace-pre-line">{blog.contenu}</div>
      </div>
    </div>
  );
}
