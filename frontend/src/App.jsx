import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify';
import PlaceOrder from './pages/PlaceOrder'
import Verify from './pages/Verify'
import HomeAdmin from './pages/admin/HomeAdmin'
import Profile from './pages/Profile.jsx'
import HomeSeller from './pages/seller/HomeSeller.jsx'



const App = () => {

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/homeadmin/*" element={<HomeAdmin />} />
        <Route path="/homeseller/*" element={<HomeSeller />} />
        
        {/* <Route path="/add" element={<Add  />} />  */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;