import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from "react-redux";
import  Home  from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import  About  from './pages/About';
import Profile from './pages/Profile';
import { Header } from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json();
        if (data.success) {
          dispatch({ type: "user/update", payload: { user: data.user } });
        } else {
          dispatch({ type: "user/update", payload: { user: null } });
        }
      } catch  {
        dispatch({ type: "user/update", payload: { user: null } });
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/about' element={<About />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
