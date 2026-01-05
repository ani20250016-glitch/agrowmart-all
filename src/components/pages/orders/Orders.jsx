import React, { useMemo, useState } from "react";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ----------------- Mock data (replace with real data) ----------------- */
const sampleImages = [
  "https://www.bing.com/th/id/OIP.-2QdepLpzF3_krchZtFKpQHaE8?w=285",
  "https://www.bing.com/th/id/OIP.-2QdepLpzF3_krchZtFKpQHaE8?w=285",
];

const mockOrders = [
  {
    id: "1",
    productName: "Potato",
    qty: 2,
    productImg: sampleImages[0],
    orderNo: "#JHG400824SG",
    merchant: "Fresh Fruits Store",
    customer: "Sanjay Kumar",
    customerLocation: "Baner, Pune",
    amount: 220,
    orderDate: "22 Nov 2025 1:30 PM",
    deliveryDate: "22 Nov 2025 2:00 PM",
    paymentMode: "COD",
  },
  {
    id: "2",
    productName: "Tomato",
    qty: 1,
    productImg: sampleImages[1],
    orderNo: "#JHG400824SG",
    merchant: "Green Farm Store",
    customer: "Vijay Patil",
    customerLocation: "Baner, Pune",
    amount: 50,
    orderDate: "22 Nov 2025 2:10 PM",
    deliveryDate: "22 Nov 2025 2:40 AM",
    paymentMode: "COD",
  },
];

/* ----------------- Helpers ----------------- */
const rupee = (v) => `₹${v}`;
const PER_PAGE = 7;

/* ----------------- Component ----------------- */
export default function OrdersPage() {
  const navigate = useNavigate?.() || (() => {});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("info"); // 'info' | 'track'

  // filter (search)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mockOrders;
    return mockOrders.filter(
      (o) =>
        o.productName.toLowerCase().includes(q) ||
        (o.orderNo || "").toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  // page data (pagination)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // AllProducts सारखी safety – filters बदलले तर page reset
  if (page > totalPages) setPage(1);

  function openModal(order) {
    setSelectedOrder(order);
    setActiveModalTab("info");
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedOrder(null);
    document.body.style.overflow = "";
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header + Search (AllProducts style) */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
          In Progress Orders ({filtered.length})
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64 lg:w-80 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, order # or customer"
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm shadow-sm outline-none bg-white"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table – same shell as AllProducts */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 font-semibold text-gray-600 text-xs">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Order Date</th>
              <th className="px-4 py-3">Delivery Date</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              paginated.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-gray-200 hover:bg-gray-50 text-gray-600 text-sm"
                >
                  {/* Product + image + qty */}
                  <td className="px-4 py-3 flex gap-3 items-center">
                    <img
                      className="w-10 h-10 rounded border border-gray-200 object-cover"
                      src={o.productImg}
                      alt={o.productName}
                    />
                    <div>
                      <div className="font-medium text-gray-800">
                        {o.productName}
                      </div>
                      <div className="text-xs text-gray-400">Qty: {o.qty}</div>
                    </div>
                  </td>

                  <td className="px-4 py-3">{o.orderNo}</td>
                  <td className="px-4 py-3">{o.merchant}</td>

                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">
                      {o.customer}
                    </div>
                    <div className="text-xs text-gray-400">
                      {o.customerLocation}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right font-semibold">
                    {rupee(o.amount)}
                  </td>

                  <td className="px-4 py-3">
                    <div>{o.orderDate.split(" ").slice(0, 3).join(" ")}</div>
                    <div className="text-xs text-gray-400">
                      {o.orderDate.split(" ").slice(3).join(" ")}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div>{o.deliveryDate.split(" ").slice(0, 3).join(" ")}</div>
                    <div className="text-xs text-gray-400">
                      {o.deliveryDate.split(" ").slice(3).join(" ")}
                    </div>
                  </td>

                  <td className="px-4 py-3">{o.paymentMode}</td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`/orders/${o.id}`)}
                      className="px-3 py-1 text-xs border rounded-md text-[green] border-[green] hover:bg-[green] hover:text-white transition inline-flex items-center gap-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards – same pattern as AllProducts mobile */}
      <div className="md:hidden space-y-4">
        {paginated.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg">
            No orders found.
          </div>
        ) : (
          paginated.map((o) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-white shadow-sm rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <img
                  src={o.productImg}
                  alt={o.productName}
                  className="w-16 h-16 rounded object-cover border border-gray-200"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">
                      {o.productName}
                    </h3>
                    <div className="text-sm font-semibold text-gray-700">
                      {rupee(o.amount)}
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <div className="text-xs text-gray-500">
                      {o.orderNo} • {o.paymentMode}
                    </div>
                    <div className="text-xs text-gray-500">Qty: {o.qty}</div>
                    <div className="text-xs text-gray-400">
                      {o.orderDate.split(" ").slice(0, 3).join(" ")} •{" "}
                      {o.deliveryDate.split(" ").slice(0, 3).join(" ")}
                    </div>
                    <div className="text-xs text-gray-500">{o.merchant}</div>
                    <div className="text-xs text-gray-400">
                      {o.customer} • {o.customerLocation}
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      onClick={() => navigate(`/orders/${o.id}`)}
                      className="w-full px-3 py-2 text-sm border rounded-md text-[green] border-[green] hover:bg-[green] hover:text-white transition flex items-center justify-center gap-2"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View Detail
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination – copy logic from AllProducts (sliding window) */}
      <div className="flex justify-end items-center mt-6 gap-2 text-sm">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded-md disabled:opacity-50 hover:text-[green] disabled:hover:text-inherit"
        >
          Prev
        </button>

        {/* page numbers (show up to 5 pages with sliding window) */}
        {(() => {
          const pages = [];
          const maxShown = 5;
          let start = Math.max(1, page - Math.floor(maxShown / 2));
          let end = start + maxShown - 1;
          if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxShown + 1);
          }
          for (let i = start; i <= end; i++) {
            pages.push(i);
          }
          return pages.map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 border rounded-md ${
                page === num
                  ? "bg-[green] text-white"
                  : "hover:bg-[green] hover:text-white"
              }`}
            >
              {num}
            </button>
          ));
        })()}

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded-md disabled:opacity-50 hover:text-[green] disabled:hover:text-inherit"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export { mockOrders, rupee };
