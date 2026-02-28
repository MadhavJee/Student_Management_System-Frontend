import { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiPencilSquare, HiTrash, HiUserPlus, HiUserMinus } from 'react-icons/hi2';
import { courseService } from '../services/courseService';
import { studentService } from '../services/studentService';
import { useAuth } from '../hooks/useAuth';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const initialForm = { name: '', code: '', description: '', credits: '' };

export default function Courses() {
    const { isAdmin, user } = useAuth();
    const canManage = isAdmin || user?.role === 'teacher';
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Create/edit modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);

    // Enroll modal
    const [enrollModalOpen, setEnrollModalOpen] = useState(false);
    const [enrollCourse, setEnrollCourse] = useState(null);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [enrolling, setEnrolling] = useState(false);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await courseService.getAll();
            setCourses(res.data || []);
        } catch {
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    const openCreate = () => {
        setEditing(null);
        setFormData(initialForm);
        setModalOpen(true);
    };

    const openEdit = (course) => {
        setEditing(course);
        setFormData({
            name: course.name || '',
            code: course.code || '',
            description: course.description || '',
            credits: course.credits || '',
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
            if (editing) {
                await courseService.update(editing._id, formData);
                toast.success('Course updated!');
            } else {
                await courseService.create(formData);
                toast.success('Course created!');
            }
            setModalOpen(false);
            fetchCourses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this course?')) return;
        try {
            await courseService.delete(id);
            toast.success('Course deleted');
            fetchCourses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    const openEnroll = async (course) => {
        setEnrollCourse(course);
        setSelectedStudentId('');
        try {
            const res = await studentService.getAll({ limit: 200 });
            setAllStudents(res.data.students || []);
        } catch {
            toast.error('Failed to load students');
        }
        setEnrollModalOpen(true);
    };

    const handleEnroll = async () => {
        if (!selectedStudentId) return;
        setEnrolling(true);
        try {
            await courseService.enroll(enrollCourse._id, selectedStudentId);
            toast.success('Student enrolled!');
            setEnrollModalOpen(false);
            fetchCourses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    const handleUnenroll = async (courseId, studentId) => {
        if (!window.confirm('Remove this student from the course?')) return;
        try {
            await courseService.unenroll(courseId, studentId);
            toast.success('Student unenrolled');
            fetchCourses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Unenrollment failed');
        }
    };

    const filteredCourses = search
        ? courses.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.code.toLowerCase().includes(search.toLowerCase())
        )
        : courses;

    const columns = [
        {
            key: 'code', label: 'Code', render: (row) => (
                <span className="badge badge-primary">{row.code}</span>
            )
        },
        {
            key: 'name', label: 'Course Name', render: (row) => (
                <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.name}</span>
            )
        },
        { key: 'credits', label: 'Credits' },
        {
            key: 'students',
            label: 'Enrolled',
            render: (row) => (
                <span className="badge badge-info">{row.students?.length || 0} students</span>
            ),
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (row) => (
                <span className={`badge ${row.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                    {row.isActive !== false ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        ...(canManage ? [{
            key: 'actions',
            label: 'Actions',
            width: '160px',
            render: (row) => (
                <div className="data-table-actions">
                    <button className="btn btn-ghost btn-icon" onClick={() => openEnroll(row)} title="Enroll Student">
                        <HiUserPlus size={16} />
                    </button>
                    {isAdmin && (
                        <>
                            <button className="btn btn-ghost btn-icon" onClick={() => openEdit(row)} title="Edit">
                                <HiPencilSquare size={16} />
                            </button>
                            <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(row._id)} title="Delete"
                                style={{ color: 'var(--color-danger)' }}>
                                <HiTrash size={16} />
                            </button>
                        </>
                    )}
                </div>
            ),
        }] : []),
    ];

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Courses</h1>
                    <p className="page-subtitle">Manage courses and enrollments</p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredCourses}
                loading={loading}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search courses by name or code..."
                emptyTitle="No courses yet"
                emptyDescription="Create your first course"
                toolbar={
                    isAdmin && (
                        <button className="btn btn-primary btn-sm" onClick={openCreate}>
                            <HiPlus size={16} /> Add Course
                        </button>
                    )
                }
            />

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Edit Course' : 'Add New Course'}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
                        </button>
                    </>
                }
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Course Name *</label>
                        <input className="form-input" name="name" value={formData.name}
                            onChange={handleChange} required />
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label className="form-label">Course Code *</label>
                            <input className="form-input" name="code" value={formData.code}
                                onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Credits</label>
                            <input className="form-input" type="number" name="credits" value={formData.credits}
                                onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <input className="form-input" name="description" value={formData.description}
                            onChange={handleChange} />
                    </div>
                </form>
            </Modal>

            {/* Enroll Modal */}
            <Modal
                isOpen={enrollModalOpen}
                onClose={() => setEnrollModalOpen(false)}
                title={`Enroll Student → ${enrollCourse?.name || ''}`}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setEnrollModalOpen(false)}>Cancel</button>
                        <button className="btn btn-success" onClick={handleEnroll} disabled={enrolling || !selectedStudentId}>
                            {enrolling ? 'Enrolling...' : 'Enroll'}
                        </button>
                    </>
                }
            >
                <div className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Select Student</label>
                        <select className="form-select" value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}>
                            <option value="">-- Select a student --</option>
                            {allStudents.map((s) => (
                                <option key={s._id} value={s._id}>
                                    {s.firstName} {s.lastName} ({s.rollNumber})
                                </option>
                            ))}
                        </select>
                    </div>

                    {enrollCourse?.students?.length > 0 && (
                        <div className="form-group">
                            <label className="form-label">Currently Enrolled ({enrollCourse.students.length})</label>
                            <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: 'var(--font-size-sm)' }}>
                                {enrollCourse.students.map((s) => {
                                    const sid = typeof s === 'string' ? s : s._id;
                                    const student = allStudents.find((st) => st._id === sid);
                                    return (
                                        <div key={sid} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '0.375rem 0', borderBottom: '1px solid var(--color-border)',
                                        }}>
                                            <span style={{ color: 'var(--color-text-secondary)' }}>
                                                {student ? `${student.firstName} ${student.lastName}` : sid}
                                            </span>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleUnenroll(enrollCourse._id, sid)}
                                                style={{ color: 'var(--color-danger)', padding: '2px 6px' }}>
                                                <HiUserMinus size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
