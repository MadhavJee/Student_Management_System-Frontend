import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="layout">
            <Sidebar isOpen={sidebarOpen} />
            <div
                className={`layout-overlay ${sidebarOpen ? 'visible' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />
            <div className="layout-main">
                <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
                <main className="layout-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
