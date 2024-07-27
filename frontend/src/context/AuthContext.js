// import { createContext,useState,useContext } from "react";
// import {toast} from 'react-toastify'

// export const AuthContext=createContext()
// export const useAuth=()=>{
//     return useContext(AuthContext)
// }
// export const AuthProvider=({children})=>{
//     const [user,setUser]=useState(null)
//     const handleLogin=(user)=>{
//         setUser(user)
//     }
    
//     const handleLogout=()=>{
//         setUser(null)
//         toast.success('Logged Out Successfully')
        
//     }
    
//     return(
//         <AuthContext.Provider value={{user,handleLogin,handleLogout}}>
//         {children}
//         </AuthContext.Provider>
//     )
// }


import { createContext, useState, useContext } from "react";
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profileId, setProfileId] = useState(null);

    const handleLogin = (user, profileId) => {
        setUser(user);
        setProfileId(profileId);
    }

    const handleLogout = () => {
        setUser(null);
        setProfileId(null);
        toast.success('Logged Out Successfully');
    }

    return (
        <AuthContext.Provider value={{ user, profileId, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}
