// src/api/candidature.js
import api from "./axios";

/**
 * Récupérer toutes les candidatures d'une offre
 * @param {string} offreId
 */
export const getOffreCandidatures = async (offreId) => {
  return api.get(`/offres/${offreId}/candidatures`);
};

/**
 * Récupérer une candidature par son ID
 * @param {string} id
 */
export const getCandidature = async (id) => {
  return api.get(`/candidatures/${id}`);
};

/**
 * Créer une nouvelle candidature
 * @param {object} formData - doit contenir { nom, prenom, email, contact, cv (File), offre_id }
 */
export const createCandidature = async (formData) => {
  return api.post(`/candidatures`, formData);
};

/**
 * Supprimer une candidature
 * @param {string} id
 */
export const deleteCandidature = async (id) => {
  return api.delete(`/candidatures/${id}`);
};

/**
 * Mettre à jour une candidature (si nécessaire)
 * @param {string} id
 * @param {object} formData
 */
export const updateCandidature = async (id, formData) => {
  // méthode PUT via formData
  formData.append("_method", "PUT");
  return api.post(`/candidatures/${id}`, formData);
};

export const getMesCandidatures = () => {
  return api.get("/mescandidatures");
};

export const updateCandidatureStatus = (id, status) => {
  return api.patch(`/candidatures/${id}/status`, { status });
};