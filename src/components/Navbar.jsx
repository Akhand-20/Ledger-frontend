import { Link, useNavigate } from "react-router-dom"
import { Landmark } from "lucide-react"
import api from "../api/axios"

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await api.post("/auth/logout")
    navigate("/login")
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-lg font-bold text-blue-600">
        <Landmark size={20} />
        Ledgr
      </Link>
      <div className="flex gap-6 items-center text-sm">
        <Link to="/" className="text-gray-600 hover:text-blue-600">
          Dashboard
        </Link>
        <Link to="/send" className="text-gray-600 hover:text-blue-600">
          Send Money
        </Link>
        <Link to="/transactions" className="text-gray-600 hover:text-blue-600">
          Transactions
        </Link>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar