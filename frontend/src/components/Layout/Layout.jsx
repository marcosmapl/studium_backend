import { useState } from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../../pages/Dashboard.css';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-secondary">
            <Navbar onToggleSidebar={handleToggleSidebar} sidebarOpen={sidebarOpen} />

            <div className="flex">
                <Sidebar isOpen={sidebarOpen} />

                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
