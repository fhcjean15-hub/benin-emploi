// src/pages/dashboard/DetailOffre.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOffre,
} from "../../api/offre"; // à créer dans api/offre
import { getUser } from "../../api/user";
import { ROLES } from "../../constants/role";
import { ArrowLeft, Trash2 } from "lucide-react";
import { deleteCandidature, getOffreCandidatures, updateCandidatureStatus } from "../../api/candidature";

const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

export default function DetailOffre() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [offre, setOffre] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
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

  // Récupération offre + candidatures
  useEffect(() => {
    if (user) fetchOffreDetail();
  }, [user]);

  const fetchOffreDetail = async () => {
    try {
      setLoading(true);

      // Récupération de l'offre
      const res = await getOffre(id);
      setOffre(res.data.data);

      // Si admin, récupérer les candidatures
      if (isAdmin) {
        const res = await getOffreCandidatures(id);
        console.log(res);
        
        setCandidatures(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      console.error("Erreur chargement offre", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidature = async (candId) => {
    if (!confirm("Supprimer cette candidature ?")) return;
    try {
      await deleteCandidature(candId); // à créer dans api/offre
      fetchOffreDetail();
    } catch (err) {
      console.error("Erreur suppression candidature", err);
    }
  };

  const handleUpdateStatus = async (candidatureId, status) => {
    try {
      await updateCandidatureStatus(candidatureId, status);

      setCandidatures((prev) =>
        prev.map((c) =>
          c.id === candidatureId ? { ...c, status } : c
        )
      );
    } catch (error) {
      console.error("Erreur mise à jour statut", error);
      alert("Impossible de modifier le statut");
    }
  };


  if (loading || !offre) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Chargement de l'offre...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{offre.intitule}</h1>
          <p className="text-slate-500 mt-1">Détails de l'offre</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
      </div>

      {/* Image de l'offre */}
      {offre.image && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <img
            src={`${BASE_URL_FILE}${offre.image}`}
            alt={offre.intitule}
            className="rounded-xl object-cover h-48 w-full border"
          />
        </div>
      )}

      {/* Informations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="text-sm text-slate-500 space-y-1">
          <div><strong>Localisation :</strong> {offre.localisation}</div>
          {offre.duree && <div><strong>Durée :</strong> {offre.duree}</div>}
          <div><strong>Type de contrat :</strong> {offre.type_contrat}</div>
          <div><strong>Type d'offre :</strong> {offre.type_offre}</div>
          {offre.salaire && <div><strong>Salaire :</strong> {offre.salaire} FCFA</div>}
          <div><strong>Date de clôture :</strong> {offre.date_cloture}</div>
        </div>
        <div className="text-slate-700" style={{ whiteSpace: "pre-wrap" }}>{offre.description}</div>
      </div>

      {/* Candidatures - admin only */}
      {/* {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Candidatures ({candidatures.length})
          </h2>
          {candidatures.length === 0 ? (
            <p className="text-slate-500 text-sm">Aucune candidature pour cette offre.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidatures.map((cand, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border rounded-xl bg-slate-50"
                >
                  <div>
                    <div className="font-medium">{cand.nom} {cand.prenom}</div>
                    <div className="text-sm text-slate-500">{cand.email} | {cand.contact}</div>
                    {cand.cv && (
                      <a
                        href={`${BASE_URL_FILE}${cand.cv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Voir CV
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCandidature(cand.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )} */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Candidatures ({candidatures.length})
          </h2>

          {candidatures.length === 0 ? (
            <p className="text-slate-500 text-sm">Aucune candidature pour cette offre.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidatures.map((cand, idx) => {
                const user = cand.user;
                return (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-xl bg-slate-50 space-y-3 md:space-y-0 md:space-x-4"
                  >
                    {/* Photo + infos utilisateur */}
                    <div className="flex items-center gap-3">
                      {user?.photo ? (
                        <img
                          src={`${BASE_URL_FILE}${user.photo}`}
                          alt={`${user.nom} ${user.prenom}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
                          {user?.nom?.[0] || "U"}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <div className="font-medium">{user.nom} {user.prenom}</div>
                        <div className="text-sm text-slate-500">{user?.email}</div>
                        {user.profile && (
                          <div className="text-sm text-slate-500">Profil: {user.profile}</div>
                        )}
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="flex flex-col gap-2 mt-2 md:mt-0">
                      {/* CV */}
                      {cand.cv && (
                        <a
                          href={`${BASE_URL_FILE}${cand.cv}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Voir CV
                        </a>
                      )}

                      {/* Lettre de motivation */}
                      {cand.lettre_motivation && (
                        typeof cand.lettre_motivation === "string" && cand.lettre_motivation.endsWith?.(".pdf") ? (
                          <a
                            href={`${BASE_URL_FILE}${cand.lettre_motivation}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Voir Lettre (PDF)
                          </a>
                        ) : (
                          <pre className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                            {cand.lettre_motivation}
                          </pre>
                        )
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 mt-2 md:mt-0 items-end">
                      <span className="text-xs text-gray-500">
                        {new Date(cand.created_at).toLocaleString()}
                      </span>

                      {/* Statut */}
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full
                          ${cand.status === "accepte" ? "bg-green-100 text-green-700" :
                            cand.status === "refuse" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"}
                        `}
                      >
                        {cand.status.replace("_", " ")}
                      </span>

                      {/* Boutons action */}
                      {cand.status === "en_attente" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(cand.id, "accepte")}
                            className="px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700"
                          >
                            Accepter
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(cand.id, "rejete")}
                            className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                          >
                            Refuser
                          </button>
                        </div>
                      )}

                      {/* Supprimer */}
                      <button
                        onClick={() => handleDeleteCandidature(cand.id)}
                        className="text-red-600 hover:text-red-800 mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
