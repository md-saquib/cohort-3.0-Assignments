import React, { useEffect } from 'react'
import { contextData } from '../context/ContextProvider'
import { Navigate, Outlet, useNavigate } from 'react-router';

const ProtectedRoute = () => {

    const { user, setUser } = contextData();
    const navigate = useNavigate();

    useEffect(() => {
        let data = JSON.parse(localStorage.getItem('user'));
        if (data) {
            setUser(data);
            navigate('/');
        }
    }, []);

    if (!user) return <Navigate to='/login' replace />
    return <Outlet />
}

export default ProtectedRoute