import { LogOut } from 'lucide-react'
import React from 'react'
import { contextData } from '../../context/ContextProvider'
import { logout } from '../../controller/AuthController';
import { Navigate, useNavigate } from 'react-router';

const Logout = () => {
    const { open, setUser } = contextData();

    return (

        (<button className="hidden md:flex items-center gap-3 text-red-600 cursor-pointer"
            onClick={(e) => {
                logout()
                setUser(null)

            }}>
            <LogOut size={20} />

        </button>)
    )
}

export default Logout