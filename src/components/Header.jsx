import { useLocation } from 'react-router-dom';
import { HiBars3, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

const pageTitles = {
    '/': 'Dashboard',
    '/students': 'Students',
    '/courses': 'Courses',
    '/attendance': 'Attendance',
    '/grades': 'Grades',
};

export default function Header({ onMenuToggle }) {
    const { logout } = useAuth();
    const location = useLocation();

    const title = pageTitles[location.pathname] || 'Student Management System';

    return (
        <header className="header">
            <div className="header-left">
                <button className="header-menu-btn" onClick={onMenuToggle}>
                    <HiBars3 size={22} />
                </button>
                <h1 className="header-title">{title}</h1>
            </div>
            <div className="header-right">
                <button className="header-logout-btn" onClick={logout}>
                    <HiArrowRightOnRectangle size={18} />
                    Logout
                </button>
            </div>
        </header>
    );
}
