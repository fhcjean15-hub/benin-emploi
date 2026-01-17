// src/pages/dashboard/DetailBesoin.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../../api/user";
import { ROLES } from "../../constants/role";
import { ArrowLeft, Trash2 } from "lucide-react";
import { GRILLE_TARIFAIRE } from "../../constants/grilleTarifaire";
import { getBesoin } from "../../api/besoin";

const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

export default function BesoinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [besoin, setBesoin] = useState(null);
  const [loading, setLoading] = useState(true);


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

  // Récupération besoin
  useEffect(() => {
    if (user) fetchBesoinDetail();
  }, [user]);

  const fetchBesoinDetail = async () => {
    try {
      setLoading(true);
      const res = await getBesoin(id);
      setBesoin(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.error("Erreur chargement besoin", err);
    } finally {
      setLoading(false);
    }
  };

  const getGrilleLabel = (key) => {
    if (!key) return null;

    // recherche dans toutes les grilles
    for (const group of Object.values(GRILLE_TARIFAIRE)) {
      if (group[key]) {
        return group[key];
      }
    }

    return key; // fallback si non trouvé
  };

  
  if (loading || !besoin) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Chargement du besoin...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{besoin.nom_entreprise}</h1>
          <p className="text-slate-500 mt-1">Détails du besoin</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>
      </div>

      {/* Images */}
      {besoin.images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {besoin.images.map((img, idx) => (
            <img
              key={idx}
              src={`${BASE_URL_FILE}${img}`}
              alt={`Besoin ${idx + 1}`}
              className="rounded-xl object-cover h-32 w-full border"
            />
          ))}
        </div>
      )}

      {/* Informations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="text-sm text-slate-500 space-y-1">
          <div><strong>Type de besoin :</strong> {besoin.type_besoin}</div>
          <div><strong>Personne contact :</strong> {besoin.personne_contact}</div>
          <div><strong>Email :</strong> {besoin.email}</div>
          <div><strong>Téléphone :</strong> {besoin.numero}</div>
          {besoin.grille_tarifaire && (
                      <div>Grille : {getGrilleLabel(besoin.grille_tarifaire)}</div>
          )}
        </div>
        <div className="text-slate-700 leading-relaxed whitespace-pre-line">{besoin.description}</div>
      </div>
    </div>
  );
}
