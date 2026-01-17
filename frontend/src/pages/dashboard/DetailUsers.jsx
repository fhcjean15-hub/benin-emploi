// src/pages/dashboard/DetailUser.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../../api/admin";
import { ROLES } from "../../constants/role";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";

const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

export default function DetailUsers() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const docUrls = user?.doc_url ? JSON.parse(user?.doc_url) : [];


  /* =============================
   * Récupération user
   * ============================= */
  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const res = await getUser(id);
      setUser(res.data.data);

      console.log(res);
      
    } catch (err) {
      console.error("Erreur chargement utilisateur", err);
    } finally {
      setLoading(false);
    }
  };

  

  if (loading || !user) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Chargement de l'utilisateur...
      </div>
    );
  }

  

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user.nom} {user.prenom}
          </h1>
          <p className="text-slate-500 mt-1">Détails de l'utilisateur</p>
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

      {/* Photo */}
      <div className="flex justify-center">
        <img
          src={user.photo ? `${BASE_URL_FILE}${user.photo}` : "/avatar.png"}
          alt={`${user.nom} ${user.prenom}`}
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
        />
      </div>

      {/* Informations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="text-slate-700 space-y-2">
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Role:</strong> {user.role}
          </div>
          <div>
            <strong>Status:</strong> {user.status}
          </div>
          {docUrls?.length > 0 && (
            <div>
              <strong>Documents:</strong>
              <ul className="list-disc list-inside">
                {docUrls.map((doc, idx) => (
                  <li key={idx}>
                    <a
                      href={`${BASE_URL_FILE}${doc}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Document {idx + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
