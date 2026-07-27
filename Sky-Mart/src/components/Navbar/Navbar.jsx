import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { ShoppingCart, LogOut, Zap, Menu, X } from "lucide-react";
import { contextData } from "../../context/ContextProvider";
import Logout from "../logout/logout";
import Cart from "../cart/Cart";
import Profile from "../Profile/Profile";

const Navbar = () => {
    const { user } = contextData();
    const [open, setOpen] = useState(false);
    
    return (
        <nav className="bg-white shadow-md w-full">
            <div className="px-4 md:px-8 h-16 flex items-center justify-between">

                {/* Logo */}
                <NavLink to={'/'} className="flex items-center gap-2 cursor-pointer">
                    <Zap className="w-7 h-7 text-yellow-500" />
                    <h1 className="text-2xl font-bold">
                        Sky<span className="text-blue-600">Mart</span>
                    </h1>
                </NavLink>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 font-medium">
                    <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-600" : "hover:text-blue-600 transition"}  >
                        Home
                    </NavLink>

                    <NavLink to="/shop" className={({ isActive }) => isActive ? "text-blue-600" : "hover:text-blue-600 transition"}  >
                        Shop
                    </NavLink>

                    <NavLink to="/about" className={({ isActive }) => isActive ? "text-blue-600" : "hover:text-blue-600 transition"}  >
                        About
                    </NavLink>
                </div>

                {/* Desktop Right */}
                <div className=" flex items-center gap-8">

                    <Profile />

                    <Cart />

                    <Logout/>

                    <button
                        className="md:hidden"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X size={28} /> : <Menu size={28} />}
                    </button>

                </div>

                {/* Mobile Menu Button */}


            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden border-t px-4 py-4 bg-white">

                    <div className="flex flex-col gap-4">

                        <NavLink to="/" onClick={() => setOpen(false)}>
                            Home
                        </NavLink>

                        <NavLink to="/shop" onClick={() => setOpen(false)}>
                            Shop
                        </NavLink>

                        <NavLink to="/about" onClick={() => setOpen(false)}>
                            About
                        </NavLink>

                        <hr />

                        <button className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                {user?.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>

                            <span>{user?.name || "Guest"}</span>

                        </button>


                        <button className="flex items-center gap-3 text-red-600">
                            <LogOut size={20} />
                            Logout
                        </button>


                    </div>

                </div>
            )}
        </nav>
    );
};

export default Navbar;