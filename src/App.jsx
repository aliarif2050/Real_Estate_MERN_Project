import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Home } from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import { About } from './pages/About'
import Profile from './pages/Profile'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/sign-in' element={<Signin/>}/>
      <Route path='/sign-out' element={<Signup/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/profil' element={<Profile/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App