import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/feed' element={<Feed />} />

      {/* Default redirect */}
      <Route path='*' element={<Navigate to="/login" />} />

    </Routes>
  )
}

export default App
