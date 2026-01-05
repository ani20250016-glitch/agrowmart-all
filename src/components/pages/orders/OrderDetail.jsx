import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockOrders, rupee } from "./Orders";
import { ArrowLeft } from "lucide-react";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'track'

  const order = mockOrders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">Order not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 px-3 py-1 border rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-700 mb-4 hover:text-black transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Top section: product info + amount */}
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={order.productImg}
            alt={order.productName}
            className="w-32 h-32 object-cover rounded border border-gray-200"
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-green-600 font-medium">{order.orderNo}</div>
              <div className="text-xl font-semibold">{order.productName}</div>
              <div className="text-gray-600 mt-1">Qty: {order.qty}</div>
              <div className="text-gray-600">
                Payment Mode: {order.paymentMode}
              </div>
            </div>
            <div className="text-2xl font-bold text-[green] mt-2">
              {rupee(order.amount)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-b border-gray-300 mt-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 px-4 py-2 text-center text-sm sm:text-base ${
                activeTab === "info"
                  ? "text-[green] border-b-2 border-[green]"
                  : "text-gray-600"
              }`}
            >
              Order Info
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`flex-1 px-4 py-2 text-center text-sm sm:text-base ${
                activeTab === "track"
                  ? "text-[green] border-b-2 border-[green]"
                  : "text-gray-600"
              }`}
            >
              Track Order
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="px-4 sm:px-6 py-4">
          {activeTab === "info" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-500">Customer Name</div>
                <div className="font-medium text-gray-800">
                  {order.customer}
                </div>

                <div className="text-gray-500 text-xs mt-3">
                  Merchant / Seller
                </div>
                <div className="font-medium text-gray-800">
                  {order.merchant}
                </div>

                <div className="text-gray-500 text-xs mt-3">
                  Shipping Address
                </div>
                <div className="text-sm text-gray-700">
                  Sample address, Baner, Pune
                </div>
              </div>

              <div>
                <div className="text-gray-500 text-xs">Order Date</div>
                <div className="font-medium text-gray-800">
                  {order.orderDate}
                </div>

                <div className="text-gray-500 text-xs mt-3">Delivery Date</div>
                <div className="font-medium text-gray-800">
                  {order.deliveryDate}
                </div>

                <div className="text-gray-500 text-xs mt-3">Quantity</div>
                <div className="text-sm text-gray-700">{order.qty}kg</div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 text-sm">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                <div
                  className="w-px bg-gray-200 flex-1 my-2"
                  style={{ minHeight: 36 }}
                />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                <div
                  className="w-px bg-gray-200 flex-1 my-2"
                  style={{ minHeight: 36 }}
                />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              </div>

              <div className="flex-1">
                <div className="mb-4">
                  <div className="text-sm font-medium">Ordered</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {order.orderDate}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-400">
                    Packed
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Expected by {order.deliveryDate.split(" ")[0]}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-400">
                    Shipped
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Expected by {order.deliveryDate.split(" ")[0]}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400">
                    Delivery
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Expected by {order.deliveryDate}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
