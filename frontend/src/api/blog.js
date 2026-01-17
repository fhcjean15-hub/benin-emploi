// src/api/blog.js
import api from "./axios";

/**
 * Récupérer tous les blogs
 */
export const getBlogs = () => {
  const res = api.get("/blogs"); // GET /api/blogs
  return res;
};

/**
 * Récupérer un blog par son ID
 * @param {string} id
 */
export const getBlog = (id) => {
  const res = api.get(`/blogs/${id}`);
  return res;
};

/**
 * Créer un nouveau blog
 * @param {FormData} formData - doit contenir titre, contenu, image[]
 */
export const createBlog = (formData) => {
  const res = api.post("/blogs", formData);
  return res;
};

/**
 * Mettre à jour un blog
 * @param {string} id
 * @param {FormData} formData
 */
export const updateBlog = (id, formData) => {
  const res = api.post(`/blogs/${id}`, formData); // Laravel attend _method=PUT dans formData
  return res;
};

/**
 * Supprimer un blog
 * @param {string} id
 */
export const deleteBlog = (id) => {
  const res = api.delete(`/blogs/${id}`);
  return res;
};
