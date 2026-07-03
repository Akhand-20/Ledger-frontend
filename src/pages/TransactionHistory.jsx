import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import api from "../api/axios"

function TransactionHistory() {
  const [accountId, setAccountId] = useState("")
  const [transactions, setTransactions] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAccountId = async () => {
      try {
        const res = await api.get("/accounts")
        if (res.data.accounts.length > 0) {
          setAccountId(res.data.accounts[0]._id)
        }
      } catch (err) {
        navigate("/login")
      }
    }
    fetchAccountId()
  }, [navigate])

  useEffect(() => {
    if (!accountId) return

    const fetchHistory = async () => {
      setLoading(true)
      try {
        const res = await api.get(
          `/transactions/${accountId}/history?page=${page}&limit=10`
        )
        setTransactions(res.data.transactions)
        setPagination(res.data.pagination)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [accountId, page])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          {loading ? (
            <p className="p-8 text-center text-gray-400">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="p-8 text-center text-gray-400">No transactions found</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => {
                  const isSent = tx.fromAccountId?._id?.toString() === accountId
                  const counterparty = isSent
                    ? tx.toAccountId?.user?.username || tx.toAccountId?._id
                    : tx.fromAccountId?.user?.username || tx.fromAccountId?._id

                  return (
                    <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-full ${isSent ? "bg-red-50" : "bg-green-50"}`}>
                            {isSent
                              ? <ArrowUpRight size={13} className="text-red-500" />
                              : <ArrowDownLeft size={13} className="text-green-500" />
                            }
                          </div>
                          <span className="font-medium text-gray-700">
                            {isSent ? "Sent" : "Received"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-blue-600 font-medium">
                        {counterparty}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`font-semibold ${isSent ? "text-red-500" : "text-green-600"}`}>
                          {isSent ? "-" : "+"}₹{tx.amount}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          tx.status === "COMPLETED" ? "bg-green-50 text-green-700" :
                          tx.status === "REVERSED" ? "bg-orange-50 text-orange-700" :
                          tx.status === "FAILED" ? "bg-red-50 text-red-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Prev
            </button>
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default TransactionHistory