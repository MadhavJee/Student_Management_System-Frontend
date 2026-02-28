import { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import { courseService } from '../services/courseService';
import { studentService } from '../services/studentService';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import './Attendance.css';

export default function Attendance() {
    const [courses, setCourses] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [records, setRecords] = useState([]); // { student, course, status, date }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, studentRes] = await Promise.all([
                    courseService.getAll(),
                    studentService.getAll({ limit: 200 }),
                ]);
                setCourses(courseRes.data || []);
                setAllStudents(studentRes.data?.students || []);
            } catch {
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // When course changes, initialize records for enrolled students
    useEffect(() => {
        if (!selectedCourse) {
            setRecords([]);
            return;
        }
        const course = courses.find((c) => c._id === selectedCourse);
        if (!course) return;

        const enrolledIds = (course.students || []).map((s) => (typeof s === 'string' ? s : s._id));
        const newRecords = enrolledIds.map((sid) => ({
            student: sid,
            course: selectedCourse,
            status: 'present',
            date: selectedDate,
        }));
        setRecords(newRecords);
    }, [selectedCourse, selectedDate, courses]);

    const setStatus = (studentId, status) => {
        setRecords((prev) =>
            prev.map((r) => (r.student === studentId ? { ...r, status } : r))
        );
    };

    const handleSubmit = async () => {
        if (records.length === 0) {
            toast.error('No students to mark attendance for');
            return;
        }
        setSubmitting(true);
        try {
            await attendanceService.mark(records);
            toast.success('Attendance marked successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const getStudentInfo = (id) => allStudents.find((s) => s._id === id);

    if (loading) return <Loader />;

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Attendance</h1>
                    <p className="page-subtitle">Mark attendance for students by course</p>
                </div>
            </div>

            <div className="attendance-page-controls">
                <div className="form-group">
                    <label className="form-label">Select Course</label>
                    <select className="form-select" value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}>
                        <option value="">-- Choose a course --</option>
                        {courses.map((c) => (
                            <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                        ))}
                    </select>
                </div>
                <div className="form-group" style={{ maxWidth: '200px' }}>
                    <label className="form-label">Date</label>
                    <input className="form-input" type="date" value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
            </div>

            {!selectedCourse ? (
                <EmptyState title="Select a course" description="Choose a course above to mark attendance" />
            ) : records.length === 0 ? (
                <EmptyState title="No enrolled students" description="Enroll students to this course first" />
            ) : (
                <div className="attendance-table-wrapper">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Roll No.</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r) => {
                                const student = getStudentInfo(r.student);
                                return (
                                    <tr key={r.student}>
                                        <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                            {student ? `${student.firstName} ${student.lastName}` : r.student}
                                        </td>
                                        <td>{student?.rollNumber || '—'}</td>
                                        <td>
                                            <div className="attendance-status-group">
                                                {['present', 'absent', 'late'].map((status) => (
                                                    <button
                                                        key={status}
                                                        className={`attendance-status-btn ${r.status === status ? `selected-${status}` : ''}`}
                                                        onClick={() => setStatus(r.student, status)}
                                                    >
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="attendance-submit-bar">
                        <div className="attendance-submit-info">
                            {records.filter((r) => r.status === 'present').length} present,{' '}
                            {records.filter((r) => r.status === 'absent').length} absent,{' '}
                            {records.filter((r) => r.status === 'late').length} late
                        </div>
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Attendance'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
