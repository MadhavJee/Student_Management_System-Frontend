import { useState, useEffect } from 'react';
import {
    HiOutlineUserGroup,
    HiOutlineBookOpen,
    HiOutlineClipboardDocumentCheck,
    HiOutlineAcademicCap,
} from 'react-icons/hi2';
import { dashboardService } from '../services/dashboardService';
import StatsCard from '../components/StatsCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import './Dashboard.css';

const gradeColors = {
    'A+': '#00b894', A: '#00cec9', 'A-': '#55efc4',
    'B+': '#6c5ce7', B: '#a29bfe', 'B-': '#74b9ff',
    'C+': '#fdcb6e', C: '#ffeaa7', 'C-': '#fab1a0',
    D: '#e17055', F: '#d63031',
};

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await dashboardService.getStats();
                setStats(res.data);
            } catch {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader />;

    const maxGrade = stats?.gradeDistribution?.reduce((max, g) => Math.max(max, g.count), 0) || 1;

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Overview of your student management system</p>
                </div>
            </div>

            <div className="dashboard-stats">
                <StatsCard
                    icon={HiOutlineUserGroup}
                    value={stats?.students?.total || 0}
                    label="Total Students"
                    subtext={`${stats?.students?.active || 0} active`}
                    color="purple"
                />
                <StatsCard
                    icon={HiOutlineBookOpen}
                    value={stats?.courses?.total || 0}
                    label="Total Courses"
                    subtext={`${stats?.courses?.active || 0} active`}
                    color="teal"
                />
                <StatsCard
                    icon={HiOutlineClipboardDocumentCheck}
                    value={
                        (stats?.todayAttendance?.present || 0) +
                        (stats?.todayAttendance?.absent || 0) +
                        (stats?.todayAttendance?.late || 0)
                    }
                    label="Today's Attendance"
                    subtext="Total records today"
                    color="green"
                />
                <StatsCard
                    icon={HiOutlineAcademicCap}
                    value={stats?.gradeDistribution?.reduce((sum, g) => sum + g.count, 0) || 0}
                    label="Total Grades"
                    subtext="All exam records"
                    color="pink"
                />
            </div>

            <div className="dashboard-grid">
                {/* Today's Attendance Summary */}
                <div className="dashboard-section">
                    <div className="dashboard-section-header">
                        <h3 className="dashboard-section-title">Today's Attendance</h3>
                    </div>
                    <div className="dashboard-section-body">
                        <div className="attendance-summary">
                            <div className="attendance-stat">
                                <div className="attendance-stat-value present">
                                    {stats?.todayAttendance?.present || 0}
                                </div>
                                <div className="attendance-stat-label">Present</div>
                            </div>
                            <div className="attendance-stat">
                                <div className="attendance-stat-value absent">
                                    {stats?.todayAttendance?.absent || 0}
                                </div>
                                <div className="attendance-stat-label">Absent</div>
                            </div>
                            <div className="attendance-stat">
                                <div className="attendance-stat-value late">
                                    {stats?.todayAttendance?.late || 0}
                                </div>
                                <div className="attendance-stat-label">Late</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grade Distribution */}
                <div className="dashboard-section">
                    <div className="dashboard-section-header">
                        <h3 className="dashboard-section-title">Grade Distribution</h3>
                    </div>
                    <div className="dashboard-section-body">
                        {stats?.gradeDistribution?.length > 0 ? (
                            <div className="grade-bars">
                                {stats.gradeDistribution.map((g) => (
                                    <div className="grade-bar-row" key={g._id}>
                                        <div className="grade-bar-label">{g._id}</div>
                                        <div className="grade-bar-track">
                                            <div
                                                className="grade-bar-fill"
                                                style={{
                                                    width: `${(g.count / maxGrade) * 100}%`,
                                                    background: gradeColors[g._id] || 'var(--color-primary)',
                                                }}
                                            />
                                        </div>
                                        <div className="grade-bar-count">{g.count}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: 'var(--spacing-xl)' }}>
                                No grades recorded yet
                            </p>
                        )}
                    </div>
                </div>

                {/* Recent Students */}
                <div className="dashboard-section" style={{ gridColumn: '1 / -1' }}>
                    <div className="dashboard-section-header">
                        <h3 className="dashboard-section-title">Recent Students</h3>
                    </div>
                    <div className="dashboard-section-body">
                        {stats?.recentStudents?.length > 0 ? (
                            <table className="dashboard-mini-table">
                                <tbody>
                                    {stats.recentStudents.map((s) => (
                                        <tr key={s._id}>
                                            <td>
                                                <div className="dashboard-student-name">
                                                    {s.firstName} {s.lastName}
                                                </div>
                                                <div className="dashboard-student-meta">{s.rollNumber}</div>
                                            </td>
                                            <td>{s.class}</td>
                                            <td>{s.section}</td>
                                            <td style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-xs)' }}>
                                                {new Date(s.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: 'var(--spacing-xl)' }}>
                                No students added yet
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
