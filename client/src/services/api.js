import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const getEmails = () => axios.get(`${API_URL}/emails`);
export const getPrompts = () => axios.get(`${API_URL}/prompts`);
export const updatePrompts = (prompts) => axios.post(`${API_URL}/prompts`, prompts);
export const updateApiKey = (newApiKey) => axios.post(`${API_URL}/config`, { newApiKey });
export const processEmail = (emailId) => axios.post(`${API_URL}/process`, { emailId });
export const chatAgent = (message, contextEmailId) => axios.post(`${API_URL}/chat`, { message, contextEmailId });
export const generateDraft = (emailId, instructions) => axios.post(`${API_URL}/draft`, { emailId, instructions });
export const saveDraft = (emailId, draft) => axios.post(`${API_URL}/emails/${emailId}/draft`, { draft });
export const createDraft = (draft) => axios.post(`${API_URL}/emails/draft`, { draft });
