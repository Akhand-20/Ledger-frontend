import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Wallet, ArrowUpRight, ArrowDownLeft, Copy, Check } from "lucide-react"
import api from "../api/axios"

function Dashboard() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [noAccount, setNoAccount] = useState(false)
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const accountsRes = await api.get("/accounts")
        const accounts = accountsRes.data.accounts

        if (!accounts || accounts.length === 0) {
          setNoAccount(true)
          setLoading(false)
          return
        }

        const primaryAccount = accounts[0]
        setAccount(primaryAccount)

        const balanceRes = await api.get(`/accounts/balance/${primaryAccount._id}`)
        setBalance(balanceRes.data.balance)

        const historyRes = await api.get(
          `/transactions/${primaryAccount._id}/history?page=1&limit=5`
        )
        setTransactions(historyRes.data.transactions)

      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login")
        } else {
          setError(err.response?.data?.message || "Failed to load dashboard")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [navigate])

  const handleCreateAccount = async () => {
    setCreating(true)
    try {
      await api.post("/accounts", { currency: "INR" })
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account")
    } finally {
      setCreating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(account._id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-5">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {noAccount ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4">
              <Wallet size={24} className="text-blue-600" />
            </div>
            <p className="text-gray-800 font-semibold text-lg mb-1">No account yet</p>
            <p className="text-gray-400 text-sm mb-6">
              Create an account to start sending and receiving money.
            </p>
            <button
              onClick={handleCreateAccount}
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Account (INR)"}
            </button>
          </div>
        ) : (
          <>
            {account && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-blue-200 text-sm font-medium mb-1">Current Balance</p>
                <p className="text-4xl font-bold mb-1">
                  ₹{balance?.toLocaleString()}
                </p>
                <p className="text-blue-200 text-xs">{account.currency} Account</p>

                <div className="mt-4 pt-4 border-t border-blue-500 flex items-center justify-between">
                  <p className="text-blue-200 text-xs font-mono truncate max-w-xs">
                    {account._id}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-blue-200 hover:text-white transition-colors ml-2 shrink-0"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy ID"}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/send"
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="bg-blue-50 p-2 rounded-lg">
                  <ArrowUpRight size={18} className="text-blue-600" />
                </div>
                <span className="font-medium text-gray-700 text-sm">Send Money</span>
              </Link>
              <Link
                to="/transactions"
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <ArrowDownLeft size={18} className="text-indigo-600" />
                </div>
                <span className="font-medium text-gray-700 text-sm">Transactions</span>
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Recent Transactions</h2>
              </div>

              {transactions.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  No transactions yet
                </p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {transactions.map((tx) => {
                    const isSent = tx.fromAccountId?._id?.toString() === account._id?.toString()
                    const counterparty = isSent
                      ? tx.toAccountId?.user?.username || tx.toAccountId?._id
                      : tx.fromAccountId?.user?.username || tx.fromAccountId?._id

                    return (
                      <li key={tx._id} className="px-5 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-full ${isSent ? "bg-red-50" : "bg-green-50"}`}>
                            {isSent
                              ? <ArrowUpRight size={14} className="text-red-500" />
                              : <ArrowDownLeft size={14} className="text-green-500" />
                            }
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {isSent ? "Sent to" : "Received from"}{" "}
                              <span className="text-blue-600">{counterparty}</span>
                            </p>
                            <p className="text-xs text-gray-400">{tx.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${isSent ? "text-red-500" : "text-green-600"}`}>
                            {isSent ? "-" : "+"}₹{tx.amount}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard