import { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiPencilSquare, HiTrash, HiOutlineUserGroup } from 'react-icons/hi2';
import { studentService } from '../services/studentService';
import { useAuth } from '../hooks/useAuth';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const initialForm = {
    firstName: '', lastName: '', email: '', rollNumber: '',
    dateOfBirth: '', gender: 'male', phone: '', address: '',
    class: '', section: '', guardianName: '', guardianPhone: '',
};

export default function Students() {
    const { isAdmin } = useAuth();
    const [students, setStudents] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await studentService.getAll({ page, limit: 10, search });
            setStudents(res.data.students);
            setPagination(res.data.pagination);
        } catch {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Debounce search
    useEffect(() => {
        setPage(1);
    }, [search]);

    const openCreate = () => {
        setEditing(null);
        setFormData(initialForm);
        setModalOpen(true);
    };

    const openEdit = (student) => {
        setEditing(student);
        setFormData({
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            email: student.email || '',
            rollNumber: student.rollNumber || '',
            dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
            gender: student.gender || 'male',
            phone: student.phone || '',
            address: student.address || '',
            class: student.class || '',
            section: student.section || '',
            guardianName: student.guardianName || '',
            guardianPhone: student.guardianPhone || '',
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
                await studentService.update(editing._id, formData);
                toast.success('Student updated!');
            } else {
                await studentService.create(formData);
                toast.success('Student created!');
            }
            setModalOpen(false);
            fetchStudents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await studentService.delete(id);
            toast.success('Student deleted');
            fetchStudents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (row) => (
                <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {row.firstName} {row.lastName}
                </span>
            ),
        },
        { key: 'rollNumber', label: 'Roll No.' },
        { key: 'email', label: 'Email' },
        { key: 'class', label: 'Class' },
        { key: 'section', label: 'Section' },
        {
            key: 'isActive',
            label: 'Status',
            render: (row) => (
                <span className={`badge ${row.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                    {row.isActive !== false ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        ...(isAdmin
            ? [{
                key: 'actions',
                label: 'Actions',
                width: '120px',
                render: (row) => (
                    <div className="data-table-actions">
                        <button className="btn btn-ghost btn-icon" onClick={() => openEdit(row)} title="Edit">
                            <HiPencilSquare size={16} />
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(row._id)} title="Delete"
                            style={{ color: 'var(--color-danger)' }}>
                            <HiTrash size={16} />
                        </button>
                    </div>
                ),
            }]
            : []),
    ];

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Students</h1>
                    <p className="page-subtitle">Manage student records and profiles</p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={students}
                loading={loading}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search students by name, email, or roll number..."
                pagination={pagination}
                onPageChange={setPage}
                emptyTitle="No students yet"
                emptyDescription="Add your first student to get started"
                toolbar={
                    isAdmin && (
                        <button className="btn btn-primary btn-sm" onClick={openCreate}>
                            <HiPlus size={16} /> Add Student
                        </button>
                    )
                }
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Edit Student' : 'Add New Student'}
                size="lg"
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
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label className="form-label">First Name *</label>
                            <input className="form-input" name="firstName" value={formData.firstName}
                                onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name *</label>
                            <input className="form-input" name="lastName" value={formData.lastName}
                                onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input className="form-input" type="email" name="email" value={formData.email}
                                onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Roll Number *</label>
                            <input className="form-input" name="rollNumber" value={formData.rollNumber}
                                onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label className="form-label">Class *</label>
                            <input className="form-input" name="class" value={formData.class}
                                onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Section</label>
                            <input className="form-input" name="section" value={formData.section}
                                onChange={handleChange} />
                        </div>
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label className="form-label">Date of Birth</label>
                            <input className="form-input" type="date" name="dateOfBirth" value={formData.dateOfBirth}
                                onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Gender</label>
                            <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input className="form-input" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input className="form-input" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="modal-form-row">
                        <div className="form-group">
                            <label className="form-label">Guardian Name</label>
                            <input className="form-input" name="guardianName" value={formData.guardianName}
                                onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Guardian Phone</label>
                            <input className="form-input" name="guardianPhone" value={formData.guardianPhone}
                                onChange={handleChange} />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
