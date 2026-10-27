import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const adminClient = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach Token dynamically on each outgoing request
adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ysf_admin_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle 401s gracefully
adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we got a 401 on an authenticated admin request, clean storage
      if (!window.location.pathname.includes('/admin/login')) {
        localStorage.removeItem('ysf_admin_token');
        localStorage.removeItem('ysf_admin_user');
      }
    }
    return Promise.reject(error);
  }
);

export const adminAuthApi = {
  login: async (username, password) => {
    const res = await adminClient.post('/auth/login/', { username, password });
    return res.data;
  },
  logout: async () => {
    try {
      await adminClient.post('/auth/logout/');
    } catch (e) {
      console.warn('Logout warning:', e.message);
    } finally {
      localStorage.removeItem('ysf_admin_token');
      localStorage.removeItem('ysf_admin_user');
    }
  },
  getMe: async () => {
    const res = await adminClient.get('/auth/me/');
    return res.data;
  },
};

export const adminDashboardApi = {
  getStats: async () => {
    const res = await adminClient.get('/dashboard/stats/');
    return res.data;
  },
};

export const adminVolunteersApi = {
  list: async (params = {}) => {
    const res = await adminClient.get('/volunteers/', { params });
    return res.data;
  },
  get: async (id) => {
    const res = await adminClient.get(`/volunteers/${id}/`);
    return res.data;
  },
  update: async (id, data) => {
    const res = await adminClient.patch(`/volunteers/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await adminClient.delete(`/volunteers/${id}/`);
    return res.data;
  },
  getExportUrl: () => {
    const token = localStorage.getItem('ysf_admin_token');
    return `${API_BASE_URL}/admin/volunteers/export/?token=${token || ''}`;
  },
  downloadCsv: async () => {
    const res = await adminClient.get('/volunteers/export/', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ysf_volunteers.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export const adminDonationsApi = {
  list: async (params = {}) => {
    const res = await adminClient.get('/donations/', { params });
    return res.data;
  },
  get: async (id) => {
    const res = await adminClient.get(`/donations/${id}/`);
    return res.data;
  },
  update: async (id, data) => {
    const res = await adminClient.patch(`/donations/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await adminClient.delete(`/donations/${id}/`);
    return res.data;
  },
  downloadCsv: async () => {
    const res = await adminClient.get('/donations/export/', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ysf_donations.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export const adminMessagesApi = {
  list: async (params = {}) => {
    const res = await adminClient.get('/messages/', { params });
    return res.data;
  },
  get: async (id) => {
    const res = await adminClient.get(`/messages/${id}/`);
    return res.data;
  },
  update: async (id, data) => {
    const res = await adminClient.patch(`/messages/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await adminClient.delete(`/messages/${id}/`);
    return res.data;
  },
};

export const adminCampaignsApi = {
  list: async (params = {}) => {
    const res = await adminClient.get('/campaigns/', { params });
    return res.data;
  },
  get: async (id) => {
    const res = await adminClient.get(`/campaigns/${id}/`);
    return res.data;
  },
  create: async (data) => {
    const res = await adminClient.post('/campaigns/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await adminClient.patch(`/campaigns/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await adminClient.delete(`/campaigns/${id}/`);
    return res.data;
  },
  getCategories: async () => {
    const res = await adminClient.get('/campaigns/categories/');
    return res.data;
  },
  createCategory: async (data) => {
    const res = await adminClient.post('/campaigns/categories/', data);
    return res.data;
  },
  addUpdate: async (campaignId, data) => {
    const res = await adminClient.post(`/campaigns/${campaignId}/updates/`, data);
    return res.data;
  },
  deleteUpdate: async (updateId) => {
    const res = await adminClient.delete(`/campaigns/updates/${updateId}/`);
    return res.data;
  },
};

export const adminGalleryApi = {
  list: async (params = {}) => {
    const res = await adminClient.get('/gallery/', { params });
    return res.data;
  },
  get: async (id) => {
    const res = await adminClient.get(`/gallery/${id}/`);
    return res.data;
  },
  create: async (data) => {
    const res = await adminClient.post('/gallery/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await adminClient.patch(`/gallery/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await adminClient.delete(`/gallery/${id}/`);
    return res.data;
  },
  getCategories: async () => {
    const res = await adminClient.get('/gallery/categories/');
    return res.data;
  },
  createCategory: async (data) => {
    const res = await adminClient.post('/gallery/categories/', data);
    return res.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await adminClient.post('/upload-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

export const adminServicesApi = {
  list: async (params = {}) => {
    const res = await adminClient.get('/services/', { params });
    return res.data;
  },
  get: async (id) => {
    const res = await adminClient.get(`/services/${id}/`);
    return res.data;
  },
  create: async (data) => {
    const res = await adminClient.post('/services/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await adminClient.patch(`/services/${id}/`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await adminClient.delete(`/services/${id}/`);
    return res.data;
  },
};

export const adminFoundationApi = {
  getProfile: async () => {
    const res = await adminClient.get('/foundation/profile/');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await adminClient.put('/foundation/profile/', data);
    return res.data;
  },
  getTeam: async () => {
    const res = await adminClient.get('/foundation/team/');
    return res.data;
  },
  createTeamMember: async (data) => {
    const res = await adminClient.post('/foundation/team/', data);
    return res.data;
  },
  updateTeamMember: async (id, data) => {
    const res = await adminClient.patch(`/foundation/team/${id}/`, data);
    return res.data;
  },
  deleteTeamMember: async (id) => {
    const res = await adminClient.delete(`/foundation/team/${id}/`);
    return res.data;
  },
  getMetrics: async () => {
    const res = await adminClient.get('/foundation/metrics/');
    return res.data;
  },
  createMetric: async (data) => {
    const res = await adminClient.post('/foundation/metrics/', data);
    return res.data;
  },
  updateMetric: async (id, data) => {
    const res = await adminClient.patch(`/foundation/metrics/${id}/`, data);
    return res.data;
  },
  deleteMetric: async (id) => {
    const res = await adminClient.delete(`/foundation/metrics/${id}/`);
    return res.data;
  },
  getAchievements: async () => {
    const res = await adminClient.get('/foundation/achievements/');
    return res.data;
  },
  createAchievement: async (data) => {
    const res = await adminClient.post('/foundation/achievements/', data);
    return res.data;
  },
  updateAchievement: async (id, data) => {
    const res = await adminClient.patch(`/foundation/achievements/${id}/`, data);
    return res.data;
  },
  deleteAchievement: async (id) => {
    const res = await adminClient.delete(`/foundation/achievements/${id}/`);
    return res.data;
  },
};

export const adminSettingsApi = adminFoundationApi;
