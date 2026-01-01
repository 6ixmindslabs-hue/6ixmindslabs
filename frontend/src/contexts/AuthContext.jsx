import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('admin_token');
        const userData = localStorage.getItem('admin_user');

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // TODO: Replace with actual API call
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();

            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_user', JSON.stringify(data.user));
            setUser(data.user);

            return { success: true };
        } catch (error) {
            // For demo purposes - remove in production
            if (username === '6ixmindslabs' && password === '6@Minds^Labs') {
                const mockUser = {
                    id: 1,
                    username: '6ixmindslabs',
                    role: 'super-admin',
                    email: 'admin@6ixmindslabs.com',
                };
                const mockToken = 'demo_token_' + Date.now();

                localStorage.setItem('admin_token', mockToken);
                localStorage.setItem('admin_user', JSON.stringify(mockUser));
                setUser(mockUser);

                return { success: true };
            }

            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setUser(null);
        navigate('/admin/login');
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/admin/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        login,
        logout,
        changePassword,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
