import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBesoin,
  createBesoin,
  updateBesoin,
} from "../../api/besoin";
import { Save, ArrowLeft, ImageIcon } from "lucide-react";
import { TYPES_BESOIN } from "../../constants/typesBesoin";
import { GRILLE_TARIFAIRE } from "../../constants/grilleTarifaire";

export default function ManageBesoin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    nom_entreprise: "",
    personne_contact: "",
    email: "",
    numero: "",
    type_besoin: "",
    description: "",
    grille_tarifaire: "",
  });



  useEffect(() => {
    const g = getGrilleByType();
    if (!g) setForm(prev => ({ ...prev, grille_tarifaire: "" }));
  }, [form.type_besoin]);

  /* =============================
   * Chargement besoin (édition)
   * ============================= */
  useEffect(() => {
    if (isEdit) fetchBesoin();
  }, [id]);

  const fetchBesoin = async () => {
    try {
      setLoading(true);
      const res = await getBesoin(id);

      const b = res.data.data;

      console.log(res);
      

      setForm({
        nom_entreprise: b.nom_entreprise || "",
        personne_contact: b.personne_contact || "",
        email: b.email || "",
        numero: b.numero || "",
        type_besoin: b.type_besoin || "",
        description: b.description || "",
        grille_tarifaire: b.grille_tarifaire || "",
      });
    } catch (err) {
      console.error(err);
      setErrors("Impossible de charger le besoin");
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
    setImages([...e.target.files]);
  };

  const getGrilleByType = () => {
    switch (form.type_besoin) {
      case "recrutement":
        return GRILLE_TARIFAIRE.emploi;
      case "formation_professionnel":
        return GRILLE_TARIFAIRE.formation;
      case "gestion_rh":
        return GRILLE_TARIFAIRE.gestion_rh;
      case "communication_accompagnement":
        return GRILLE_TARIFAIRE.communication_accompagnement;
      case "autre_service":
        return GRILLE_TARIFAIRE.autres_services;
      default:
        return null;
    }
  };


  /* =============================
   * Submit
   * ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setErrors(null);

    if (
      !form.nom_entreprise ||
      !form.personne_contact ||
      !form.email ||
      !form.numero ||
      !form.type_besoin ||
      !form.description ||
      !form.grille_tarifaire
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
        }
      });

      images.forEach((img, idx) => {
        formData.append(`images[${idx}]`, img);
      });

      if (isEdit) {
        formData.append("_method", "PUT");
        await updateBesoin(id, formData);
        navigate("/dashboard/besoins");
      } else {
        await createBesoin(formData);
        navigate("/dashboard/besoins");
      }

    } catch (err) {
      console.error(err);
      setErrors("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const grille = getGrilleByType();

  /* =============================
   * UI
   * ============================= */
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Modifier le besoin" : "Nouveau besoin"}
          </h1>
          <p className="text-slate-500 mt-1">
            Gestion des besoins entreprise
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
              Nom de l'entreprise *
            </label>
            <input
              name="nom_entreprise"
              value={form.nom_entreprise}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200
                        focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Personne de contact *
            </label>
            <input
              name="personne_contact"
              value={form.personne_contact}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200
                        focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200
                        focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Téléphone *
            </label>
            <input
              name="numero"
              value={form.numero}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200
                        focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>

          {/* Type de besoin */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-600">
              Type de besoin *
            </label>
            <select
              name="type_besoin"
              value={form.type_besoin}
              onChange={(e) => {
                handleChange(e);

                // reset grille tarifaire quand le type change
                setForm((prev) => ({
                  ...prev,
                  type_besoin: e.target.value,
                  grille_tarifaire: "",
                }));
              }}
              required
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200
                        focus:ring-2 focus:ring-yellow-300 outline-none"
            >
              <option value="">-- Choisir --</option>
              {Object.values(TYPES_BESOIN).map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grille tarifaire */}
          {grille && (
            <div className="border rounded-xl p-5 bg-slate-50 mt-4">
              <h3 className="font-semibold text-slate-700 mb-4">
                Grille tarifaire *
              </h3>

              <div className="space-y-3">
                {Object.entries(grille).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg
                              border border-slate-200 bg-white
                              hover:bg-yellow-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="grille_tarifaire"
                      value={key}
                      required
                      checked={form.grille_tarifaire === key}
                      onChange={handleChange}
                      className="accent-yellow-500"
                    />
                    <span className="text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-slate-600">
            Description du besoin *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200
                      focus:ring-2 focus:ring-yellow-300 outline-none min-h-[120px]"
          />
        </div>

        {/* Images */}
        <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition">
          <ImageIcon className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-700">
            Images ou logo (facultatif)
          </p>
          <input
            type="file"
            multiple
            onChange={handleImagesChange}
            className="mt-3"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl
                      bg-lime-600 hover:bg-lime-700 text-white font-semibold
                      transition disabled:opacity-60"
          >
            <Save size={16} />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>

    </div>
  );
}
