import api from './api';

export const courseService = {
    getAll: async (params = {}) => {
        const response = await api.get('/courses', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/courses', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/courses/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    },

    enroll: async (courseId, studentId) => {
        const response = await api.post(`/courses/${courseId}/enroll`, { studentId });
        return response.data;
    },

    unenroll: async (courseId, studentId) => {
        const response = await api.post(`/courses/${courseId}/unenroll`, { studentId });
        return response.data;
    },
};
