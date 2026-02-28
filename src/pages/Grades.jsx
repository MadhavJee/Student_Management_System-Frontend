import { useState, useEffect } from 'react';
import { HiPlus, HiPencilSquare, HiTrash } from 'react-icons/hi2';
import { gradeService } from '../services/gradeService';
import { courseService } from '../services/courseService';
import { studentService } from '../services/studentService';
import { useAuth } from '../hooks/useAuth';
import { EXAM_TYPES } from '../utils/constants';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import './Grades.css';

const gradeColorClass = (letter) => {
    if (!letter) return '';
    if (letter.startsWith('A')) return 'grade-A';
    if (letter.startsWith('B')) return 'grade-B';
    if (letter.startsWith('C')) return 'grade-C';
    if (letter.startsWith('D')) return 'grade-D';
    return 'grade-F';
};

export default function Grades() {
    const { isAdmin, user } = useAuth();
    const canManage = isAdmin || user?.role === 'teacher';

    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Add/edit modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        student: '', course: '', examType: 'midterm', marks: '', totalMarks: '100',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, studentRes] = await Promise.all([
                    courseService.getAll(),
                    studentService.getAll({ limit: 200 }),
                ]);
                setCourses(courseRes.data || []);
                setStudents(studentRes.data?.students || []);
            } catch {
                toast.error('Failed to load data');
            } finally {
                setInitialLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!selectedStudent) {
            setGrades([]);
            return;
        }
        const fetchGrades = async () => {
            setLoading(true);
            try {
                const res = await gradeService.getStudentGrades(selectedStudent);
                setGrades(res.data || []);
            } catch {
                toast.error('Failed to load grades');
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, [selectedStudent]);

    const openAdd = () => {
        setEditing(null);
        setFormData({
            student: selectedStudent || '',
            course: '',
            examType: 'midterm',
            marks: '',
            totalMarks: '100',
        });
        setModalOpen(true);
    };

    const openEdit = (grade) => {
        setEditing(grade);
        setFormData({
            student: grade.student?._id || grade.student || '',
            course: grade.course?._id || grade.course || '',
            examType: grade.examType || 'midterm',
            marks: grade.marks?.toString() || '',
            totalMarks: grade.totalMarks?.toString() || '100',
        });
        setModalOpen(true);
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                marks: Number(formData.marks),
                totalMarks: Number(formData.totalMarks),
            };
            if (editing) {
                await gradeService.update(editing._id, payload);
                toast.success('Grade updated!');
            } else {
                await gradeService.add(payload);
                toast.success('Grade added!');
            }
            setModalOpen(false);
            // Refresh
            if (selectedStudent) {
                const res = await gradeService.getStudentGrades(selectedStudent);
                setGrades(res.data || []);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this grade?')) return;
        try {
            await gradeService.delete(id);
            toast.success('Grade deleted');
            if (selectedStudent) {
                const res = await gradeService.getStudentGrades(selectedStudent);
                setGrades(res.data || []);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    const getCourseName = (courseRef) => {
        const id = typeof courseRef === 'string' ? courseRef : courseRef?._id;
        const course = courses.find((c) => c._id === id);
        return course ? `${course.name} (${course.code})` : id || '—';
    };

    if (initialLoading) return <Loader />;

    const selectedStudentInfo = students.find((s) => s._id === selectedStudent);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Grades</h1>
                    <p className="page-subtitle">Manage student grades and report cards</p>
                </div>
                {canManage && (
                    <button className="btn btn-primary" onClick={openAdd}>
                        <HiPlus size={16} /> Add Grade
                    </button>
                )}
            </div>

            <div className="grades-controls">
                <div className="form-group">
                    <label className="form-label">Select Student</label>
                    <select className="form-select" value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}>
                        <option value="">-- Choose a student --</option>
                        {students.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.firstName} {s.lastName} ({s.rollNumber})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {!selectedStudent ? (
                <EmptyState title="Select a student" description="Choose a student above to view their grades" />
            ) : loading ? (
                <Loader />
            ) : grades.length === 0 ? (
                <EmptyState title="No grades yet" description="Add grades for this student" />
            ) : (
                <div className="report-card">
                    <div className="report-card-header">
                        <div className="report-card-name">
                            {selectedStudentInfo ? `${selectedStudentInfo.firstName} ${selectedStudentInfo.lastName}` : 'Student'}'s Grades
                        </div>
                        <span className="badge badge-info">{grades.length} records</span>
                    </div>
                    <table className="report-card-table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Exam Type</th>
                                <th>Marks</th>
                                <th>Grade</th>
                                {canManage && <th style={{ width: '100px' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map((g) => (
                                <tr key={g._id}>
                                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                        {getCourseName(g.course)}
                                    </td>
                                    <td>
                                        <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                                            {g.examType}
                                        </span>
                                    </td>
                                    <td>{g.marks} / {g.totalMarks}</td>
                                    <td>
                                        <span className={`grade-letter ${gradeColorClass(g.grade)}`}>
                                            {g.grade || '—'}
                                        </span>
                                    </td>
                                    {canManage && (
                                        <td>
                                            <div className="data-table-actions">
                                                <button className="btn btn-ghost btn-icon" onClick={() => openEdit(g)}>
                                                    <HiPencilSquare size={16} />
                                                </button>
                                                {isAdmin && (
                                                    <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(g._id)}
                                                        style={{ color: 'var(--color-danger)' }}>
                                                        <HiTrash size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Grade Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Edit Grade' : 'Add Grade'}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Saving...' : editing ? 'Update' : 'Add'}
                        </button>
                    </>
                }
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Student *</label>
                        <select className="form-select" name="student" value={formData.student}
                            onChange={handleChange} required>
                            <option value="">-- Select --</option>
                            {students.map((s) => (
                                <option key={s._id} value={s._id}>
                                    {s.firstName} {s.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Course *</label>
                        <select className="form-select" name="course" value={formData.course}
                            onChange={handleChange} required>
                            <option value="">-- Select --</option>
                            {courses.map((c) => (
                                <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Exam Type *</label>
                        <select className="form-select" name="examType" value={formData.examType}
                            onChange={handleChange} required>
                            {EXAM_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label className="form-label">Marks *</label>
                            <input className="form-input" type="number" name="marks" value={formData.marks}
                                onChange={handleChange} required min="0" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Total Marks *</label>
                            <input className="form-input" type="number" name="totalMarks" value={formData.totalMarks}
                                onChange={handleChange} required min="1" />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
