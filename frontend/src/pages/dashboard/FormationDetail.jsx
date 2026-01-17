// src/pages/dashboard/FormationDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteInscription, getFormation, getFormationInscriptions } from "../../api/formation";
import { getUser } from "../../api/user";
import { ROLES } from "../../constants/role";
import { ArrowLeft, Trash2 } from "lucide-react";

const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

export default function FormationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formation, setFormation] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === ROLES.ADMIN;

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

  // Récupération formation + inscriptions
  useEffect(() => {
    if (user) fetchFormationDetail();
  }, [user]);

  const fetchFormationDetail = async () => {
    try {
      setLoading(true);

      const res = await getFormation(id);
      setFormation(res.data.data);

      console.log(res.data.data);
      

      if (isAdmin) {
        const res = await getFormationInscriptions(id);
        
        setInscriptions(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      console.error("Erreur chargement formation", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInscription = async (inscId) => {
    if (!confirm("Supprimer cette inscription ?")) return;
    try {
      await deleteInscription(inscId); // à créer dans api/formation
      fetchFormationDetail();
    } catch (err) {
      console.error("Erreur suppression inscription", err);
    }
  };

  if (loading || !formation) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Chargement de la formation...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{formation.titre}</h1>
          <p className="text-slate-500 mt-1">Détails de la formation</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
      </div>

      {/* Images */}
      {formation.images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formation.images.map((img, idx) => (
            <img
              key={idx}
              src={`${BASE_URL_FILE}${img}`}
              alt={`Formation ${idx + 1}`}
              className="rounded-xl object-cover h-32 w-full border"
            />
          ))}
        </div>
      )}

      {/* Informations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="text-sm text-slate-500 space-y-1">
          <div><strong>Durée :</strong> {formation.duree}</div>
          <div><strong>Début :</strong> {formation.date_debut}</div>
          {formation.cout && <div><strong>Coût :</strong> {formation.cout} FCFA</div>}
        </div>
        <div className="text-slate-700">{formation.description}</div>
      </div>

      {/* Inscriptions - admin only */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Inscriptions ({inscriptions.length})
          </h2>
          {inscriptions.length === 0 ? (
            <p className="text-slate-500 text-sm">Aucune inscription pour cette formation.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inscriptions.map((insc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border rounded-xl bg-slate-50"
                >
                  <div>
                    <div className="font-medium">{insc.nom} {insc.prenom}</div>
                    <div className="text-sm text-slate-500">{insc.email} | {insc.contact}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteInscription(insc.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
