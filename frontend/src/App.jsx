import Signup from "./pages/signup";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Welcome from "./pages/Welcome";

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Signup />}/>
      <Route path='/verify-email' element={<VerifyEmail />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/welcome' element={<Welcome />}/>
      <Route path='/forgot-password' element={<ForgotPassword />}/>
      <Route path='/reset-password/:token' element={<ResetPassword />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
