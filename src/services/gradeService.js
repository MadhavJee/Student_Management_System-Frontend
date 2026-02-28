import api from './api';

export const gradeService = {
    add: async (data) => {
        const response = await api.post('/grades', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/grades/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/grades/${id}`);
        return response.data;
    },

    getStudentGrades: async (studentId) => {
        const response = await api.get(`/grades/student/${studentId}`);
        return response.data;
    },

    getCourseGrades: async (courseId) => {
        const response = await api.get(`/grades/course/${courseId}`);
        return response.data;
    },

    getReportCard: async (studentId) => {
        const response = await api.get(`/grades/report-card/${studentId}`);
        return response.data;
    },
};
