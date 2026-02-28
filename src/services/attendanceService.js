import api from './api';

export const attendanceService = {
    getAll: async (params = {}) => {
        const response = await api.get('/attendance', { params });
        return response.data;
    },

    mark: async (records) => {
        const response = await api.post('/attendance', { records });
        return response.data;
    },

    getStudentReport: async (studentId) => {
        const response = await api.get(`/attendance/report/${studentId}`);
        return response.data;
    },
};
