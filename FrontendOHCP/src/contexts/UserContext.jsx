import { createContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        const decoded = parseJwt(token);
        const role = decoded?.role || decoded?.Role || decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (!role) {
            localStorage.removeItem('token');
            setLoading(false);
            return;
        }

        const apiPath = role === 'doctor' ? '/api/auth/provider/me' : '/api/auth/member/me';

        try {
            const res = await axiosInstance.get(apiPath, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
        } catch (err) {
            console.error('Failed to fetch user:', err);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
