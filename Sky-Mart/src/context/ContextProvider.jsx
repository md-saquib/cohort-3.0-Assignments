

import React, { useContext, useState } from 'react'
import { createContext } from 'react'

export const Context = createContext();

export const ContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    return (
        <Context.Provider value={{ setUser, setLoading, user, loading }}> {children}</Context.Provider>
    )
}

export const contextData = () => {
    console.log("contextData rendering ......");
    return useContext(Context);
}