import { Routes, Route } from 'react-router'
import Home from '../pages/Home/Home'
import Shop from '../pages/shop/Shop'
import About from '../pages/About/About'
import ProtectedRoute from './ProtectedRoute'
import Login from '../auth/Login'
import Register from '../auth/Register'
import Profile from '../components/Profile/Profile'
import Cart from '../components/cart/Cart'


const RoutePanel = () => {


    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/shop" element={<Shop />} />
            </Route>


            <Route path='*' element={<h1>Un Autherished Route</h1>} />

        </Routes>
    )
}

export default RoutePanel