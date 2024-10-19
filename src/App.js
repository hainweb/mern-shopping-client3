import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout/layout';
import ProductList from './Components/View-Products/View-products';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Logout from './Components/Login/Logout';
import Cart from './Components/Cart/Cart';
import OrderList from './Components/Orders/Orders';
import PlaceOrder from './Components/Orders/PlaceOrders';
import OrderSuccess from './Components/Orders/Order-Success';
import OrderPage from './Components/Orders/Ordered-products';
import Wishlist from './Components/Wishlist/Wishlist';

import axios from 'axios';
import {BASE_URL} from './Components/Urls/Urls';

function App() {
  const [user, setUser] = useState(null); // Store user data
  const [isAdmin, setIsAdmin] = useState(false); // Admin state
  const [cartCount, setCartCount] = useState(0); // Example cart count
  const [success,setSuccess]=useState(false)
  
  // Fetch user data and cart count when App loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products`, { withCredentials: true });
        setCartCount(response.data.cartCount); // Update cart count
        const userData = response.data.user;
        console.log('userData', userData);

        setUser(userData);
        setIsAdmin(userData && userData.role === 'admin'); // Check if the user is an admin

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);


  

  return (
    <div className="App">
      <Router>
        {/* Pass user, isAdmin, and cartCount to Layout */}
        <Layout isAdmin={isAdmin} user={user} cartCount={cartCount} />

        <Routes>
          <Route path="/" element={<ProductList setCartCount={setCartCount}/>} />
          <Route path="/login" element={<Login setCartCount={setCartCount} setUser={setUser} />} />
          <Route path='/signup' element={<Signup setUser={setUser}/>}/>
          <Route path="/logout" element={<Logout setUser={setUser} setCartCount={setCartCount} />} />
          <Route path='/cart'   element={ user? <Cart setCartCount={setCartCount}/> : <Login setCartCount={setCartCount} setUser={setUser}/>} />
          <Route path='/orders'   element={ user? <OrderList /> : <Login setCartCount={setCartCount} setUser={setUser}/>} />
          <Route path='/place-order'   element={ user?  <PlaceOrder user={user} success={setSuccess}/> : <Login setCartCount={setCartCount} setUser={setUser}/>} />
          <Route path='/order-success'   element={ user?  success? <OrderSuccess/> : <ProductList setCartCount={setCartCount} setUser={setUser}/> :<Login  setCartCount={setCartCount} setUser={setUser} /> } />
          <Route path='/view-orders-products/:Id'   element={ user?  <OrderPage user={user} /> : <Login setCartCount={setCartCount} setUser={setUser}/>} />
        <Route path='/wishlist' element={ user? <Wishlist setCartCount={setCartCount} />: <Login  setCartCount={setCartCount} setUser={setUser}/> }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
