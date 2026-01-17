import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  MapPin,
} from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { getMesCandidatures } from "../../api/candidature";

export default function MesCandidatures() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL_FILE = "https://api-benin-emploi.lamadonebenin.com/storage/";

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMesCandidatures();
        console.log(res);
        
        setCandidatures(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-20 text-gray-500">
        Chargement des candidatures...
      </p>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 space-y-8">

        <h1 className="text-3xl font-bold">Mes candidatures</h1>

        {candidatures.length === 0 ? (
          <p className="text-gray-500">
            Vous n’avez encore postulé à aucune offre.
          </p>
        ) : (
          <div className="space-y-4">
            {candidatures.map((cand) => (
              <div
                key={cand.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4"
              >
                {/* Offre */}
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/offre-detail/${cand.offre.id}`}
                      className="text-lg font-semibold text-green-700 hover:underline"
                    >
                      {cand.offre.intitule}
                    </Link>

                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      {cand.offre.localisation && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {cand.offre.localisation}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {cand.created_at}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant={
                      cand.status === "accepte"
                        ? "success"
                        : cand.status === "rejete"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {cand.status.replace("_", " ")}
                  </Badge>
                </div>

                {/* Documents */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {cand.cv && (
                    <a
                      href={`${BASE_URL_FILE}${cand.cv}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <FileText size={16} /> Voir CV
                    </a>
                  )}

                  {/* Lettre */}
                  {cand.lettre_motivation_fichier ? (
                    <a
                      href={`${BASE_URL_FILE}${cand.lettre_motivation_fichier}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <FileText size={16} /> Lettre (PDF)
                    </a>
                  ) : (
                    cand.lettre_motivation && (
                      <details className="text-gray-700">
                        <summary className="cursor-pointer underline">
                          Lire la lettre
                        </summary>
                        <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-3 rounded">
                          {cand.lettre_motivation}
                        </pre>
                      </details>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
