// src/pages/dashboard/Besoin.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Pencil, Plus } from "lucide-react";
import { getBesoins, deleteBesoin } from "../../api/besoin";
import { TYPES_BESOIN } from "../../constants/typesBesoin";
import { GRILLE_TARIFAIRE } from "../../constants/grilleTarifaire";

export default function Besoin() {
  const [besoins, setBesoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

  useEffect(() => {
    fetchBesoins();
  }, []);

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


  const fetchBesoins = async () => {
    try {
      setLoading(true);
      const res = await getBesoins();
      
      setBesoins(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Erreur chargement besoins", err);
      setBesoins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBesoin = async (id) => {
    if (!confirm("Supprimer ce besoin ?")) return;
    try {
      await deleteBesoin(id);
      fetchBesoins();
    } catch (err) {
      console.error("Erreur suppression besoin", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header + bouton Nouveau */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestion des besoins
          </h1>
          <p className="text-slate-500 mt-1">
            Tous les besoins déposés par les entreprises
          </p>
        </div>

        <Link
          to="/dashboard/besoins/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold transition"
        >
          <Plus size={18} />
          Nouveau besoin
        </Link>
      </div>

      {/* Contenu */}
      {besoins.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
          Aucun besoin enregistré
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {besoins.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <Link to={`/dashboard/besoins/${b.id}`} className="block relative">
                <div className="relative">
                  {/* Images si disponibles */}
                  {b.images && b.images.length > 0 ? (
                    <img
                      src={`${BASE_URL_FILE}${b.images[0]}`}
                      alt={b.type_besoin}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40 text-slate-400 font-semibold text-lg bg-slate-100">
                      {TYPES_BESOIN[b.type_besoin]?.label || "Besoin"}
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                    {b.nom_entreprise}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {b.description}
                  </p>

                  <div className="text-sm text-slate-500 space-y-1">
                    <div>Type : {TYPES_BESOIN[b.type_besoin]?.label}</div>
                    <div>Personne contact : {b.personne_contact}</div>
                    <div>Email : {b.email}</div>
                    <div>Téléphone : {b.numero}</div>
                    {b.grille_tarifaire && (
                      <div>Grille : {getGrilleLabel(b.grille_tarifaire)}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <Link
                      to={`/dashboard/besoins/${b.id}/edit`}
                      className="flex items-center gap-1 text-slate-700 hover:text-slate-900 text-sm font-medium"
                    >
                      <Pencil size={16} />
                      Modifier
                    </Link>
                    <button
                      onClick={(e) => {
                              e.preventDefault(); // empêche la navigation
                              e.stopPropagation(); // empêche la propagation au Link parent
                              handleDeleteBesoin(b.id)
                      }}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
