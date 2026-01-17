import api from "./axios";

// Récupérer toutes les catégories d'offres
export const getCategories = async () => {
  try {
    const res = await api.get("/categories"); // CategoryController@index
    return res; // res.data contiendra les catégories
  } catch (error) {
    console.error("Erreur getCategories:", error);
    throw error;
  }
};

// Récupérer une catégorie par ID (optionnel)
export const getCategorie = async (id) => {
  try {
    const res = await api.get(`/categories/${id}`);
    return res;
  } catch (error) {
    console.error("Erreur getCategorie:", error);
    throw error;
  }
};

// Créer une nouvelle catégorie
export const createCategorie = async (data) => {
  try {
    const res = await api.post("/categories", data);
    return res;
  } catch (error) {
    console.error("Erreur createCategorie:", error);
    throw error;
  }
};

// Mettre à jour une catégorie
export const updateCategorie = async (id, data) => {
  try {
    const res = await api.put(`/categories/${id}`, data);
    return res;
  } catch (error) {
    console.error("Erreur updateCategorie:", error);
    throw error;
  }
};

// Supprimer une catégorie
export const deleteCategorie = async (id) => {
  try {
    const res = await api.delete(`/categories/${id}`);
    return res;
  } catch (error) {
    console.error("Erreur deleteCategorie:", error);
    throw error;
  }
};
