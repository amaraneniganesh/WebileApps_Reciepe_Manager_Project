import React, { useContext, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.tsx';
// npm install typescript @types/react @types/react-dom @types/react-router-dom
import Navbar from './components/Navbar.tsx';
import Login from './pages/Login.tsx';
import RecipeGallery from './pages/RecipeGallery.tsx';
import SuperAdminPanel from './pages/SuperAdminPanel.tsx';
import AddRecipe from './pages/AddRecipe.tsx';
import EditRecipe from './pages/EditRecipe.tsx';
import RecipeDetail from './pages/RecipeDetail.tsx';
import Profile from './pages/Profile.tsx';

// FIXED: Changed JSX.Element to ReactNode
const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
    const { user } = useContext(AuthContext);

    return (
        <Router>
            {user && <Navbar />}
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

                    <Route path="/" element={<PrivateRoute><RecipeGallery /></PrivateRoute>} />
                    <Route path="/recipes/:id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />
                    <Route path="/add-recipe" element={<PrivateRoute><AddRecipe /></PrivateRoute>} />
                    <Route path="/edit-recipe/:id" element={<PrivateRoute><EditRecipe /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

                    <Route path="/superadmin" element={
                        <PrivateRoute>
                            {user?.role === 'superadmin' ? <SuperAdminPanel /> : <Navigate to="/" />}
                        </PrivateRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;