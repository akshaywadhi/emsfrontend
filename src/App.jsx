import Admin from "./Components/Admin"
import AdminPanel from "./Components/AdminPanel"
import Home from "./Components/Home"
import User from "./Components/User"
import UserPanel from "./Components/UserPanel"
import { Route, Routes } from "react-router-dom"


function App() {
  

  return (
    <>

<Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/admin_login" element={<Admin/>}/>
  <Route path="/user_login" element={<User/>}/>
  <Route path="/admin" element={<AdminPanel/>}/>
  <Route path="/user" element={<UserPanel/>}/>
</Routes>

    </>
  )
}

export default App
