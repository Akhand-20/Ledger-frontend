import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import SendMoney from "./pages/SendMoney"
import TransactionHistory from "./pages/TransactionHistory"
import Navbar from "./components/Navbar"

function Layout() {
  const location = useLocation()
  const hideNavbar = ["/login", "/register"].includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/send" element={<SendMoney />} />
        <Route path="/transactions" element={<TransactionHistory />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App