import api from "./axios";


/**
 * Récupérer toutes les formations
 */
export const getFormations = async (params = {}) => {
  const res = await api.get("/formations", { params });
  
  return res.data;
};

/**
 * Récupérer une formation par ID
 */
export const getFormation = async (id) => {
  const res = await api.get(`/formations/${id}`);

  return res.data;
};

/**
 * Créer une formation
 */
export const createFormation = async (formData) => {
  const res = await api.post("/formations", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data
};

/**
 * Mettre à jour une formation
 */
export const updateFormation = async (id, formData) => {
  const res = await api.post(`/formations/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const deleteFormationImage = (formationId, index) => {
    const res = api.post(`/formations/${formationId}/images/${index}`);
    
    return res.data;
};

/**
 * Supprimer une formation
 */
export const deleteFormation = async (id) => {
  return await api.delete(`/formations/${id}`);
};


/* =========================
 * INSCRIPTIONS (candidat)
 * ========================= */

/**
 * Récupère uniquement les formations
 * auxquelles l'utilisateur connecté est inscrit
 */
export const getMyInscriptions = () => {
  const res = api.get("/mesinscriptions");
  
  return res;
};



// 🔹 Récupérer les inscriptions d’une formation (ADMIN)
// export const getFormationInscriptions = (formationId) =>
//   api.get(`/formations/${formationId}/inscriptions`);

export const getFormationInscriptions = (formationId) => {
  const res = api.get(`/formations/${formationId}/inscriptions`);
  
  return res;
};

// 🔹 Supprimer une inscription (ADMIN)
export const deleteInscription = (inscriptionId) =>
  api.delete(`/inscriptions/${inscriptionId}`);


export const createInscription = (endpoint,data) => {
  return api.post(endpoint, data);
};