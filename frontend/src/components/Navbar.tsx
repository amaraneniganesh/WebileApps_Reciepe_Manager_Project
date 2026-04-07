import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.tsx';
import { FiBookOpen, FiLogOut } from 'react-icons/fi';

const Navbar: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2 text-blue-600">
                        <FiBookOpen size={24} />
                        <span className="font-bold text-xl tracking-tight text-gray-900">RecipeHub</span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className={`${isActive('/') ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                        >
                            Gallery
                        </Link>

                        {user?.role === 'superadmin' && (
                            <Link
                                to="/superadmin"
                                className={`${isActive('/superadmin') ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                            >
                                Admin Panel
                            </Link>
                        )}
                    </div>

                    {/* Profile & Logout */}
                    <div className="flex items-center gap-4">
                        <div
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                            onClick={() => navigate('/profile')}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold overflow-hidden">
                                { /* This ternary operator is the logic you are looking for */ }
                                {user?.image ? (
                                    // IF user.image EXISTS (is not null, undefined, or an empty string)
                                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    // ELSE: Show the first letter of the user's name
                                    user?.name.charAt(0)
                                )}
                            </div>
                            <div className="hidden md:block text-sm">
                                <p className="font-semibold text-gray-900 leading-tight">{user?.name}</p>
                                <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Logout"
                        >
                            <FiLogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;