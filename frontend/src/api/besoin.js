// src/api/besoin.js
import api from "./axios";

/**
 * Récupérer tous les besoins
 */
export const getBesoins = () => {
  const res = api.get("/besoins"); // GET /api/besoins
  return res;
};

/**
 * Récupérer un besoin par son ID
 * @param {string} id
 */
export const getBesoin = (id) => {
  const res = api.get(`/besoins/${id}`);
  return res;
};

/**
 * Créer un nouveau besoin
 * @param {FormData} formData - doit contenir nom_entreprise, personne_contact, email, numero, type_besoin, description, grille_tarifaire, images[]
 */
export const createBesoin = (formData) => {
  const res = api.post("/besoins", formData);
  return res;
};

/**
 * Mettre à jour un besoin
 * @param {string} id
 * @param {FormData} formData
 */
export const updateBesoin = (id, formData) => {
  const res = api.post(`/besoins/${id}`, formData);
  return res;
};

/**
 * Supprimer un besoin
 * @param {string} id
 */
export const deleteBesoin = (id) => {
  const res = api.delete(`/besoins/${id}`);
  return res;
};
