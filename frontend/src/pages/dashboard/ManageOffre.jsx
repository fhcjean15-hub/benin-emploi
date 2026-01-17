import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOffre,
  createOffre,
  updateOffre,
} from "../../api/offre";
import { getCategories } from "../../api/categorie";
import { Save, ArrowLeft, ImageIcon } from "lucide-react";

export default function ManageOffre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    intitule: "",
    localisation: "",
    category_id: "",
    type_contrat: "",
    type_offre: "",
    duree: "",
    salaire: "",
    description: "",
    date_cloture: "",
    image: null,
  });

  /* =============================
   * Chargement catégories + offre
   * ============================= */
  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchOffre();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOffre = async () => {
    try {
      setLoading(true);
      const res = await getOffre(id);

      setForm({
        intitule: res.data.data.intitule || "",
        localisation: res.data.data.localisation || "",
        category_id: res.data.data.category_id || "",
        type_contrat: res.data.data.type_contrat || "",
        type_offre: res.data.data.type_offre || "",
        duree: res.data.data.duree || "",
        salaire: res.data.data.salaire || "",
        description: res.data.data.description || "",
        date_cloture: res.data.data.date_cloture || "",
      });
    } catch (err) {
      console.error(err);
      setErrors("Impossible de charger l'offre");
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

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (
      !form.intitule ||
      !form.localisation ||
      !form.category_id ||
      !form.type_contrat ||
      !form.type_offre ||
      !form.description ||
      !form.date_cloture
    ) {
      setErrors("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
          console.log(form[key]);
          
        }
      });

      // IMPORTANT : pour update Laravel
      if (isEdit) {
        formData.append("_method", "PUT");
        await updateOffre(id, formData);
      } else {
        await createOffre(formData);
      }

      navigate("/dashboard/offres");
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
            {isEdit ? "Modifier l'offre" : "Nouvelle offre"}
          </h1>
          <p className="text-slate-500 mt-1">
            Gestion des informations de l'offre d'emploi
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
        {/* Infos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-slate-600">
              Intitulé *
            </label>
            <input
              type="text"
              name="intitule"
              value={form.intitule}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Localisation *
            </label>
            <input
              type="text"
              name="localisation"
              value={form.localisation}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Catégorie *
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            >
              <option value="">-- Choisir --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Type de contrat *
            </label>
            <select
              name="type_contrat"
              value={form.type_contrat}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            >
              <option value="">-- Choisir --</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Alternance">Alternance</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Type d'offre *
            </label>
            <select
              name="type_offre"
              value={form.type_offre}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            >
              <option value="">-- Choisir --</option>
              <option value="emploi">Emploi</option>
              <option value="stage">Stage</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Durée
            </label>
            <input
              type="text"
              name="duree"
              value={form.duree}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Salaire (FCFA)
            </label>
            <input
              type="number"
              name="salaire"
              value={form.salaire}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Date de clôture *
            </label>
            <input
              type="date"
              name="date_cloture"
              value={form.date_cloture}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-slate-600">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none min-h-[120px]"
          />
        </div>


        <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition">
          <ImageIcon className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-700">
            Images de l'offre
          </p>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="mt-3"
          />
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
