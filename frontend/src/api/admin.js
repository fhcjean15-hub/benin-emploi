// src/api/admin.js
import api from "./axios";

/**
 * Récupérer tous les utilisateurs
 */
export const getUsers = (params = {}) => {
    const res = api.get("/admin/users", { params });

    return res;
};

/**
 * Récupérer un utilisateur
 */
export const getUser = (id) => {
    const res = api.get(`/admin/users/${id}`);

    return res;
};

/**
 * Mettre à jour un utilisateur
 */
export const updateUser = (id, data) => {
    const res = api.put(`/admin/users/${id}/update`, data);

    return res;
};

/**
 * Changer le status d’un utilisateur
 */
export const updateUserStatus = (id, status) => {
    const res = api.patch(`/admin/users/${id}/status`, { status });

    return res;
};

/**
 * Supprimer un utilisateur
 */
export const deleteUser = (id) => {
    const res = api.delete(`/admin/users/${id}`);

    return res;
};
