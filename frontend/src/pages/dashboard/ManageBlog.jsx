import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, ImageIcon } from "lucide-react";
import { createBlog, getBlog, updateBlog } from "../../api/blog";

export default function ManageBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    titre: "",
    contenu: "",
    image: null,
  });

  /* =============================
   * Chargement blog (édition)
   * ============================= */
  useEffect(() => {
    if (isEdit) fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await getBlog(id);
      const b = res.data.data;

      setForm({
        titre: b.titre || "",
        contenu: b.contenu || "",
        image: null, // on ne charge pas les fichiers, juste pour modification
      });

      if (b.image) {
        try {
          setImages(Array.isArray(b.image) ? b.image : JSON.parse(b.image));
        } catch {
          setImages([b.image]);
        }
      }
 // tableau d'images existantes
    } catch (err) {
      console.error(err);
      setErrors("Impossible de charger le blog");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
   * Handlers
   * ============================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // uniquement des File
    setImages(files.filter((f) => f instanceof File));
  };


  /* =============================
   * Submit
   * ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (!form.titre || !form.contenu) {
      setErrors("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("titre", form.titre);
      formData.append("contenu", form.contenu);

      if (images.length > 0) {
        images.forEach((img, idx) => {
          if (img instanceof File) {
            formData.append(`image[${idx}]`, img);
          }
        });
      }

      

      if (isEdit) {
        formData.append("_method", "PUT");
        const res = await updateBlog(id, formData);
        console.log(res);
        
      } else {
        await createBlog(formData);
      }

      navigate("/dashboard/blogs");
    } catch (err) {
      console.error(err);
      setErrors("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
   * UI
   * ============================= */
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Modifier le blog" : "Nouveau blog"}
          </h1>
          <p className="text-slate-500 mt-1">
            Gestion des articles du blog
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
      </div>

      {/* Erreurs */}
      {errors && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">
          {errors}
        </div>
      )}

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 space-y-6"
      >
        {/* Titre */}
        <div>
          <label className="text-sm font-medium text-slate-600">Titre *</label>
          <input
            type="text"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
          />
        </div>

        {/* Contenu */}
        <div>
          <label className="text-sm font-medium text-slate-600">Contenu *</label>
          <textarea
            name="contenu"
            value={form.contenu}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none min-h-[120px]"
          />
        </div>

        {/* Images */}
        <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition">
          <ImageIcon className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-700">Images de l'article</p>
          <input type="file" multiple onChange={handleImagesChange} className="mt-3" />
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold transition disabled:opacity-60"
          >
            <Save size={16} />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
