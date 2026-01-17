// src/pages/dashboard/ManageUser.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { getUser } from "../../api/user";
import { updateUser } from "../../api/admin";

export default function ManageUsers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "candidat",
    status: "actif",
    password: "",
  });

  /* =============================
   * Chargement utilisateur
   * ============================= */
  useEffect(() => {
    if (isEdit) fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUser(id);
      
      
      setForm({
        nom: data.nom || "",
        prenom: data.prenom || "",
        email: data.email || "",
        role: data.role || "candidat",
        status: data.status || "actif",
        password: "",
      });
    } catch (err) {
      console.error(err);
      setErrors("Impossible de charger l'utilisateur");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (!form.nom || !form.prenom || !form.email || !form.role || !form.status) {
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

      if (isEdit) {
        formData.append("_method", "PUT");
        await updateUser(id, formData);
      } else {
        // await createUsers(formData);
      }

      navigate("/dashboard/users");
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
            {isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </h1>
          <p className="text-slate-500 mt-1">
            Gestion des informations de l'utilisateur
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-slate-600">
              Nom *
            </label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Prénom *
            </label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
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
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Role *
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            >
              <option value="admin">Admin</option>
              <option value="candidat">Candidat</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Status *
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Mot de passe {isEdit ? "(laisser vide pour ne pas changer)" : "*"}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </div>
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
