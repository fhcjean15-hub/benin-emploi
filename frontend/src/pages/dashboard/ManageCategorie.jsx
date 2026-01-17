import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCategorie,
  createCategorie,
  updateCategorie,
} from "../../api/categorie";
import { Save, ArrowLeft } from "lucide-react";

export default function ManageCategorie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const [form, setForm] = useState({
    titre: "",
  });

  /* =============================
   * Chargement catégorie (edit)
   * ============================= */
  useEffect(() => {
    if (isEdit) fetchCategorie();
  }, [id]);

  const fetchCategorie = async () => {
    try {
      setLoading(true);
      const { data } = await getCategorie(id);

      setForm({
        titre: data.titre || "",
      });
    } catch (err) {
      console.error(err);
      setErrors("Impossible de charger la catégorie");
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

  /* =============================
   * Submit
   * ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (!form.titre) {
      setErrors("Le titre de la catégorie est obligatoire");
      return;
    }

    try {
      setLoading(true);
      isEdit
        ? await updateCategorie(id, form)
        : await createCategorie(form);

      navigate("/dashboard/offres"); // retour à la gestion offres/catégories
    } catch (err) {
      console.error(err);
      setErrors("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h1>
          <p className="text-slate-500 mt-1">
            Gestion des catégories d'offres d'emploi
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
        <div>
          <label className="text-sm font-medium text-slate-600">
            Titre de la catégorie *
          </label>
          <input
            type="text"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            placeholder="Ex: Informatique, Marketing, Finance..."
            className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-white font-semibold hover:bg-lime-600 transition disabled:opacity-60"
          >
            <Save size={16} />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
