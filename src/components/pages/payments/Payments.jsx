import { useState } from "react";
import {
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

const paymentsData = [
  {
    id: 1,
    transactionId: "TXN123456789",
    seller: "Green Harvest Store",
    amount: "₹24,500",
    type: "payout",
    status: "completed",
    date: "2024-11-26",
    method: "Bank Transfer"
  },
  {
    id: 2,
    transactionId: "TXN123456790",
    buyer: "Anita Desai",
    amount: "₹2,340",
    type: "order",
    status: "completed",
    date: "2024-11-26",
    method: "UPI"
  },
  {
    id: 3,
    transactionId: "TXN123456791",
    seller: "Organic Traders",
    amount: "₹48,700",
    type: "payout",
    status: "pending",
    date: "2024-11-25",
    method: "Bank Transfer"
  },
  {
    id: 4,
    transactionId: "TXN123456792",
    buyer: "Rohit Sharma",
    amount: "₹1,890",
    type: "refund",
    status: "processing",
    date: "2024-11-25",
    method: "UPI"
  },
  {
    id: 5,
    transactionId: "TXN123456793",
    seller: "Farm Fresh Supplies",
    amount: "₹15,600",
    type: "payout",
    status: "failed",
    date: "2024-11-24",
    method: "Bank Transfer"
  }
];

const settlementCycles = [
  {
    id: 1,
    cycle: "Cycle #45 - Nov 20-26",
    sellers: 45,
    amount: "₹2,45,000",
    status: "processing",
    date: "2024-11-26"
  },
  {
    id: 2,
    cycle: "Cycle #44 - Nov 13-19",
    sellers: 42,
    amount: "₹2,12,000",
    status: "completed",
    date: "2024-11-19"
  },
  {
    id: 3,
    cycle: "Cycle #43 - Nov 06-12",
    sellers: 38,
    amount: "₹1,98,500",
    status: "completed",
    date: "2024-11-12"
  }
];

const statusConfig = {
  completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { color: "bg-blue-100 text-blue-800", icon: Clock },
  failed: { color: "bg-red-100 text-red-800", icon: XCircle }
};

export default function Payments() {
  const [selectedTab, setSelectedTab] = useState("transactions");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold">Payments Management</h2>
          <p className="text-gray-600 text-sm">
            Track payments, payouts, and settlements
          </p>
        </div>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: "₹4,87,234",
            sub: "+18% from last month",
            icon: DollarSign,
            color: "bg-green-500",
            textColor: "text-green-600"
          },
          {
            label: "Pending Payouts",
            value: "₹1,24,500",
            icon: TrendingUp,
            color: "bg-blue-500"
          },
          {
            label: "Processing",
            value: "₹45,800",
            icon: Clock,
            color: "bg-orange-500",
            textColor: "text-orange-600"
          },
          {
            label: "Completed Today",
            value: "₹67,890",
            icon: CheckCircle,
            color: "bg-purple-500"
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}
              >
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-600 text-sm">{item.label}</p>
            </div>
            <p className={item.textColor || "text-gray-900"}>{item.value}</p>
            {item.sub && (
              <p className="text-xs text-gray-600 mt-1">{item.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200 flex-wrap">
          {["transactions", "payouts", "settlements"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-4 transition-colors ${
                selectedTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "transactions"
                ? "All Transactions"
                : tab === "payouts"
                ? "Seller Payouts"
                : "Settlement Cycles"}
            </button>
          ))}
        </div>

        {/* Transactions */}
        {selectedTab === "transactions" && (
          <div className="p-6">
            {/* Search */}
            <div className="mb-4">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by transaction ID, user, or amount..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-600">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-gray-600">User</th>
                    <th className="px-6 py-3 text-left text-gray-600">Amount</th>
                    <th className="px-6 py-3 text-left text-gray-600">Type</th>
                    <th className="px-6 py-3 text-left text-gray-600">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-gray-600">Date</th>
                    <th className="px-6 py-3 text-left text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentsData.map((payment) => {
                    const StatusIcon =
                      statusConfig[payment.status].icon;

                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono">
                          {payment.transactionId}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {payment.type === "payout"
                            ? payment.seller
                            : payment.buyer || payment.seller}
                        </td>
                        <td className="px-6 py-4">{payment.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              payment.type === "payout"
                                ? "bg-blue-100 text-blue-800"
                                : payment.type === "refund"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {payment.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">{payment.method}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
                              statusConfig[payment.status].color
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{payment.date}</td>
                        <td className="px-6 py-4">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payouts */}
        {selectedTab === "payouts" && (
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900">
                Seller payouts are processed weekly. Review and approve pending
                payouts to transfer funds.
              </p>
            </div>

            {paymentsData
              .filter((p) => p.type === "payout")
              .map((payout) => (
                <div
                  key={payout.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium">{payout.seller}</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            statusConfig[payout.status].color
                          }`}
                        >
                          {payout.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Transaction ID</p>
                          <p className="font-mono">{payout.transactionId}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Amount</p>
                          <p>{payout.amount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p>{payout.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {payout.status === "pending" && (
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                          Approve Payout
                        </button>
                      )}
                      {payout.status === "failed" && (
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                          Retry
                        </button>
                      )}
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Settlements */}
        {selectedTab === "settlements" && (
          <div className="p-6 space-y-4">
            {settlementCycles.map((cycle) => (
              <div
                key={cycle.id}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <div>
                    <h4 className="font-medium">{cycle.cycle}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {cycle.sellers} sellers • Processed on {cycle.date}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      cycle.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {cycle.status}
                  </span>
                </div>

                <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-200 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="mt-1 font-medium">{cycle.amount}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refunds */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4 font-medium">Refund Requests</h3>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 rounded-lg gap-2">
            <div>
              <p className="font-medium">Order #ORD-2024-1234</p>
              <p className="text-sm text-gray-600">
                Rohit Sharma • ₹1,890
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Approve Refund
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
