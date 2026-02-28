export const API_BASE_URL = 'http://localhost:5000/api';

export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
};

export const EXAM_TYPES = [
  { value: 'midterm', label: 'Midterm' },
  { value: 'final', label: 'Final' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'quiz', label: 'Quiz' },
];

export const ATTENDANCE_STATUS = [
  { value: 'present', label: 'Present', color: 'var(--color-success)' },
  { value: 'absent', label: 'Absent', color: 'var(--color-danger)' },
  { value: 'late', label: 'Late', color: 'var(--color-warning)' },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];
