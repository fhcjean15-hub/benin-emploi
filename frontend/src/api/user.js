import axios from "axios";
import api from "./axios";
import { useNavigate } from "react-router-dom";


const navigate = useNavigate;

const API_URL = import.meta.env.VITE_API_URL || "https://api-benin-emploi.lamadonebenin.com/api";

export const getCsrf = async () => await axios.get("https://api-benin-emploi.lamadonebenin.com/sanctum/csrf-cookie"); // Laravel renvoie l'utilisateur connecté
    
export const getUser = async () => {
  const response = await api.get('/user');
  return response.data.data;
};


/**
 * Met à jour le profil utilisateur avec FormData.
 * @param {FormData} formData - Données du profil, fichiers inclus.
 */
export const updateProfile = async (formData) => {
  try {
    const response = await api.post(`/user/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Erreur updateProfile:", err);
    throw err;
  }
};

/**
 * Supprime un document du profil utilisateur.
 * @param {string} type - Type de document à supprimer (ex: "cv", "document")
 */
export const deleteDocument = async (path) => {
  try {
    const response = await api.post(`/user/document/deletion/${path}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Erreur deleteDocument:", err);
    throw err;
  }
};



export const register = async (data) => {
  const response = await api.post("/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};


export const login = async (credentials) => {
  const response = await api.post("/login", credentials);
  //console.log(response);
  const token = response.data?.data?.token;
  const user = response.data?.data?.user;
  //console.log(user);
    localStorage.setItem(
      "token",
      token
    );
    localStorage.setItem('user', JSON.stringify(user));
    //console.log(JSON.parse(localStorage.getItem('user')));

  return response.data;
};

/**
 * Déconnexion utilisateur
 */
export const logout = async () => {

    await api.post("/logout");
    localStorage.removeItem("token");
    localStorage.removeItem('user');
  
};

/**
 * Récupérer l'utilisateur connecté
 */
export const getAuthUser = async () => {
  const response = await api.get("/user");
  return response.data;
};
