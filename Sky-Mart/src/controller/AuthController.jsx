import { Navigate } from "react-router";
import { contextData } from "../context/ContextProvider";
import { toast } from "react-toastify";



export const registerUser = (userData) => {
    try {
        let existingUser = JSON.parse(localStorage.getItem('registerUser')) ?? [];

        if (existingUser.some(el => el.email == userData.email)) {
            toast.error("Email or password already register")
            return false
        }

        localStorage.setItem('registerUser', JSON.stringify([...existingUser, userData]));
        toast.success("User Register successfully..");
        return true;

    } catch (error) {
        console.log("This error from register ->", error)
    }



}

export const loginUser = (userData) => {
    try {

        let existingUser = JSON.parse(localStorage.getItem('registerUser')) ?? [];

        let currUser = existingUser.find(el => el.email.trim().toLowerCase() === userData.email.trim().toLowerCase())

        if (!currUser) {
            toast.warning('Email or Password not match Register first.');
            return false;
        }

        if (currUser.password.trim() !== userData.password.trim()) {
            toast.warning('Please Enter correct password');
            return false;
        }

        localStorage.setItem('user', JSON.stringify(currUser));

        toast.success("Login successfully..");
        return {
            data: currUser,
            status: true
        }
    } catch (error) {
        console.log(error)
    }
}

export const logout = () => {
    localStorage.removeItem('user');
}

