// src/pages/dashboard/ManageFormation.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFormation,
  createFormation,
  updateFormation,
  deleteFormationImage,
} from "../../api/formation";
import {
  Upload,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

export default function ManageFormation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const [form, setForm] = useState({
    titre: "",
    description: "",
    duree: "",
    date_debut: "",
    cout: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const MAX_IMAGE_SIZE_MB = 5; // 5 Mo

  /* =============================
   * Chargement formation (edit)
   * ============================= */
  useEffect(() => {
    if (isEdit) fetchFormation();
  }, [id]);

  const fetchFormation = async () => {
    try {
      setLoading(true);
      const { data } = await getFormation(id);

      setForm({
        titre: data.titre || "",
        description: data.description || "",
        duree: data.duree || "",
        date_debut: data.date_debut || "",
        cout: data.cout || "",
      });

      setExistingImages(Array.isArray(data.images) ? data.images : []);
    } catch (err) {
      console.error(err);
      setErrors("Impossible de charger la formation");
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
    const files = [...e.target.files];
    const tooLarge = files.find(file => file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024);

    if (tooLarge) {
      setErrors(`L'image "${tooLarge.name}" dépasse la taille maximale de ${MAX_IMAGE_SIZE_MB} Mo.`);
      e.target.value = null; // reset input
      return;
    }

    setErrors(null);
    setImages(files);
  };


  /* =============================
   * Submit
   * ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (!form.titre || !form.description || !form.duree || !form.date_debut) {
      setErrors("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );

    images.forEach((img) => formData.append("images[]", img));

    if (isEdit) formData.append("_method", "PUT");

    try {
      setLoading(true);
      isEdit
        ? await updateFormation(id, formData)
        : await createFormation(formData);

      navigate("/dashboard/formations");
    } catch (err) {
      console.error(err);
      setErrors("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (index) => {
    if (!confirm("Supprimer cette image ?")) return;

    try {
      const res = await deleteFormationImage(id, index);
      setExistingImages(Array.isArray(res?.images) ? res?.images : []);
    } catch (err) {
      console.error(err);
      setErrors("Erreur lors de la suppression de l'image");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Modifier la formation" : "Nouvelle formation"}
          </h1>
          <p className="text-slate-500 mt-1">
            Gestion des informations de la formation
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
              Titre *
            </label>
            <input
              type="text"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Durée *
            </label>
            <input
              type="text"
              name="duree"
              placeholder="Ex: 3 mois"
              value={form.duree}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Date de début *
            </label>
            <input
              type="date"
              name="date_debut"
              value={form.date_debut}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Coût (optionnel)
            </label>
            <input
              type="number"
              name="cout"
              value={form.cout}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
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
            className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none min-h-[120px]"
          />
        </div>

        {/* Upload images */}
        <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition">
          <ImageIcon className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-700">
            Images de la formation
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Plusieurs images autorisées
          </p>
          <input
            type="file"
            multiple
            onChange={handleImagesChange}
            className="mt-3"
          />
        </div>

        {/* Images existantes */}
        {/* {existingImages.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">
              Images actuelles
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((img, idx) => (
                <img
                  key={idx}
                  src={`${BASE_URL_FILE}${img}`}
                  alt="Formation"
                  className="rounded-xl object-cover h-24 w-full border"
                />
              ))}
            </div>
          </div>
        )} */}

        {existingImages.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-600 mb-3">
              Images actuelles
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border"
                >
                  <img
                    src={`${BASE_URL_FILE}${img}`}
                    alt="Formation"
                    className="object-cover h-24 w-full"
                  />

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(idx)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="text-white" size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          )}

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





// // src/pages/dashboard/ManageFormation.jsx
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getFormation,
//   createFormation,
//   updateFormation,
// } from "../../api/formation";
// import { Upload, Image, Save, ArrowLeft } from "lucide-react";

// const BASE_URL_FILE = 'http://localhost:8000/storage/';

// export default function ManageFormation() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEdit = Boolean(id);

//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState(null);

//   const [form, setForm] = useState({
//     titre: "",
//     description: "",
//     duree: "",
//     date_debut: "",
//     cout: "",
//   });

//   const [images, setImages] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);

//   /**
//    * Chargement formation (edit)
//    */
//   useEffect(() => {
//     if (isEdit) fetchFormation();
//   }, [id]);

//   const fetchFormation = async () => {
//     try {
//       setLoading(true);
//       const res = await getFormation(id);
//       const data = res.data;

//       setForm({
//         titre: data.titre,
//         description: data.description,
//         duree: data.duree,
//         date_debut: data.date_debut,
//         cout: data.cout || "",
//       });

//       setExistingImages(data.images || []);
//     } catch (err) {
//       console.error(err);
//       setErrors("Impossible de charger la formation");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Gestion formulaire
//    */
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleImagesChange = (e) => {
//     setImages([...e.target.files]);
//   };

//   /**
//    * Submit
//    */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors(null);

//     if (!form.titre || !form.description || !form.duree || !form.date_debut) {
//       setErrors("Veuillez remplir tous les champs obligatoires");
//       return;
//     }

//     const formData = new FormData();
//     Object.entries(form).forEach(([key, value]) =>
//       formData.append(key, value)
//     );

//     images.forEach((img) => formData.append("images[]", img));

//     if (isEdit) {
//       formData.append("_method", "PUT");
//     }

//     try {
//       setLoading(true);
//       isEdit
//         ? await updateFormation(id, formData)
//         : await createFormation(formData);

//       navigate("/dashboard/formations");
//     } catch (err) {
//       console.error(err);
//       setErrors("Erreur lors de l'enregistrement");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold text-slate-800">
//           {isEdit ? "Modifier la formation" : "Nouvelle formation"}
//         </h1>
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
//         >
//           <ArrowLeft size={16} /> Retour
//         </button>
//       </div>

//       {/* Erreur */}
//       {errors && (
//         <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
//           {errors}
//         </div>
//       )}

//       {/* Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white rounded-2xl p-6 shadow-sm space-y-6"
//       >
//         {/* Infos */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <input
//             type="text"
//             name="titre"
//             placeholder="Titre"
//             value={form.titre}
//             onChange={handleChange}
//             className="input"
//           />
//           <input
//             type="text"
//             name="duree"
//             placeholder="Durée (ex: 3 mois)"
//             value={form.duree}
//             onChange={handleChange}
//             className="input"
//           />
//           <input
//             type="date"
//             name="date_debut"
//             value={form.date_debut}
//             onChange={handleChange}
//             className="input"
//           />
//           <input
//             type="number"
//             name="cout"
//             placeholder="Coût"
//             value={form.cout}
//             onChange={handleChange}
//             className="input"
//           />
//         </div>

//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           className="input min-h-[120px]"
//         />

//         {/* Images */}
//         <div className="border border-dashed border-slate-300 rounded-xl p-5 text-center">
//           <Upload className="mx-auto text-slate-400 mb-2" />
//           <p className="text-sm font-medium">Images de la formation</p>
//           <input
//             type="file"
//             multiple
//             onChange={handleImagesChange}
//             className="mt-2"
//           />
//         </div>

//         {/* Images existantes */}
//         {existingImages.length > 0 && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {existingImages.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={`${BASE_URL_FILE}${img}`}
//                 className="rounded-lg object-cover h-24 w-full"
//               />
//             ))}
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex justify-end">
//           <button
//             disabled={loading}
//             className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition"
//           >
//             <Save size={16} />
//             {loading ? "Enregistrement..." : "Enregistrer"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
