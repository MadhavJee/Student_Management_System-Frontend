import { NavLink } from 'react-router-dom';
import {
    HiOutlineSquares2X2,
    HiOutlineUserGroup,
    HiOutlineBookOpen,
    HiOutlineClipboardDocumentCheck,
    HiOutlineAcademicCap,
} from 'react-icons/hi2';
import { useAuth } from '../hooks/useAuth';
import './Sidebar.css';

const navItems = [
    {
        section: 'Main',
        items: [
            { to: '/', label: 'Dashboard', icon: HiOutlineSquares2X2 },
            { to: '/students', label: 'Students', icon: HiOutlineUserGroup },
            { to: '/courses', label: 'Courses', icon: HiOutlineBookOpen },
        ],
    },
    {
        section: 'Academics',
        items: [
            { to: '/attendance', label: 'Attendance', icon: HiOutlineClipboardDocumentCheck },
            { to: '/grades', label: 'Grades', icon: HiOutlineAcademicCap },
        ],
    },
];

export default function Sidebar({ isOpen }) {
    const { user } = useAuth();

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">S</div>
                <div className="sidebar-brand-text">
                    SMS
                    <span>Management System</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((section) => (
                    <div key={section.section} className="sidebar-nav-section">
                        <div className="sidebar-nav-section-title">{section.section}</div>
                        {section.items.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                className={({ isActive }) =>
                                    `sidebar-nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <span className="sidebar-nav-link-icon">
                                    <item.icon size={20} />
                                </span>
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-user-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{user?.name || 'User'}</div>
                        <div className="sidebar-user-role">{user?.role || 'user'}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
