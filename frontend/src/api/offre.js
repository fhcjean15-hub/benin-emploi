import api from "./axios";

// Récupérer toutes les offres d'emploi
export const getOffres = async (params = {}) => {
  try {
    const res = await api.get("/offres", { params }); // Laravel : OffreController@index
    return res; // res.data contiendra les offres
  } catch (error) {
    console.error("Erreur getOffres:", error);
    throw error;
  }
};

// Supprimer une offre par ID
export const deleteOffre = async (id) => {
  try {
    const res = await api.delete(`/offres/${id}`); // OffreController@destroy
    return res;
  } catch (error) {
    console.error("Erreur deleteOffre:", error);
    throw error;
  }
};

// Récupérer une offre par ID (optionnel pour édition / détail)
export const getOffre = async (id) => {
  try {
    const res = await api.get(`/offres/${id}`);
    return res;
  } catch (error) {
    console.error("Erreur getOffre:", error);
    throw error;
  }
};

// Créer une nouvelle offre
export const createOffre = async (data) => {
  try {
    const res = await api.post("/offres", data); // OffreController@store
    return res;
  } catch (error) {
    console.error("Erreur createOffre:", error);
    throw error;
  }
};

// Mettre à jour une offre
export const updateOffre = async (id, data) => {
  try {
    const res = await api.post(`/offres/${id}`, data); // OffreController@update
    return res;
  } catch (error) {
    console.error("Erreur updateOffre:", error);
    throw error;
  }
};
