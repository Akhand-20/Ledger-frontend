import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, SendHorizontal, CircleCheck } from "lucide-react"
import api from "../api/axios"

function SendMoney() {
  const [fromAccountId, setFromAccountId] = useState("")
  const [recipientUsername, setRecipientUsername] = useState("")
  const [resolvedAccount, setResolvedAccount] = useState(null)
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await api.get("/accounts")
        if (res.data.accounts.length > 0) {
          setFromAccountId(res.data.accounts[0]._id)
        }
      } catch (err) {
        navigate("/login")
      }
    }
    fetchAccount()
  }, [navigate])

  const handleSearch = async () => {
    if (!recipientUsername.trim()) return
    setSearching(true)
    setError("")
    setResolvedAccount(null)

    try {
      const res = await api.get(`/accounts/find/${recipientUsername.trim()}`)
      setResolvedAccount(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "User not found")
    } finally {
      setSearching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!resolvedAccount) {
      setError("Please search and confirm a recipient first")
      return
    }
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const idempotencyKey = crypto.randomUUID()

      await api.post("/transactions", {
        fromAccountId,
        toAccountId: resolvedAccount.accountId,
        amount: Number(amount),
        idempotencyKey
      })

      setSuccess(`₹${amount} sent to ${resolvedAccount.username} successfully`)
      setRecipientUsername("")
      setResolvedAccount(null)
      setAmount("")
    } catch (err) {
      setError(err.response?.data?.message || "Transaction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
          <p className="text-gray-500 text-sm mt-1">Transfer funds to another user instantly</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <CircleCheck size={16} />
              {success}
            </div>
          )}

          {/* Recipient search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by username"
                  value={recipientUsername}
                  onChange={(e) => {
                    setRecipientUsername(e.target.value)
                    setResolvedAccount(null)
                  }}
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searching}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 transition-colors disabled:opacity-50"
              >
                {searching ? "..." : "Find"}
              </button>
            </div>

            {resolvedAccount && (
              <div className="mt-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-sm text-green-700">
                <CircleCheck size={16} />
                Sending to <strong>{resolvedAccount.username}</strong>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-medium">₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !fromAccountId || !resolvedAccount || !amount}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            <SendHorizontal size={16} />
            {loading ? "Sending..." : "Send Money"}
          </button>

        </div>
      </div>
    </div>
  )
}

export default SendMoney