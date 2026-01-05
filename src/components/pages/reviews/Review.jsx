import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { shops } from "../../../data"; // Ensure this path is correct
import {
  FiDownload,
  FiTrash2,
  FiTrendingUp,
  FiUsers,
  FiFilter,
  FiCheckSquare,
  FiChevronDown,
  FiChevronUp,
  FiX,
} from "react-icons/fi";

// --- Simple Toast Component ---
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded shadow-lg animate-slide-up z-50 flex items-center gap-3">
    <span>{message}</span>
    <button onClick={onClose}>
      <FiX />
    </button>
  </div>
);

export default function Review() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [shopList, setShopList] = useState(shops);
  const [toast, setToast] = useState(null);

  // Advanced State
  const [selectedShops, setSelectedShops] = useState([]);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  // Sorting State
  const [sortConfig, setSortConfig] = useState({
    key: "joined",
    direction: "desc",
  });

  const itemsPerPage = 7;

  // --- Helper: Show Toast ---
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // --- Logic: Sorting ---
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // --- Logic: Filtering & Sorting ---
  const processedShops = useMemo(() => {
    let data = shopList.filter((shop) => {
      const matchesSearch =
        shop.name.toLowerCase().includes(search.toLowerCase()) ||
        shop.seller.toLowerCase().includes(search.toLowerCase()) ||
        shop.email.toLowerCase().includes(search.toLowerCase());

      const matchesRating =
        filterRating === "all" ||
        Math.round(shop.rating) === parseInt(filterRating);

      const joinedDate = new Date(shop.joined);
      const start = dateStart ? new Date(dateStart) : null;
      const end = dateEnd ? new Date(dateEnd) : null;
      const matchesDate =
        (!start || joinedDate >= start) && (!end || joinedDate <= end);

      return matchesSearch && matchesRating && matchesDate;
    });

    // Apply Sorting
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [shopList, search, filterRating, dateStart, dateEnd, sortConfig]);

  // --- Bulk Actions ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const visibleIds = processedShops
        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
        .map((s) => s.id);
      setSelectedShops(visibleIds);
    } else {
      setSelectedShops([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedShops.includes(id)) {
      setSelectedShops(selectedShops.filter((sid) => sid !== id));
    } else {
      setSelectedShops([...selectedShops, id]);
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedShops.length} shops?`
      )
    ) {
      setShopList((prev) => prev.filter((s) => !selectedShops.includes(s.id)));
      setSelectedShops([]);
      showToast("Shops deleted successfully");
    }
  };

  // --- Professional CSV Export ---
  const handleBulkExport = () => {
    const dataToExport = shopList.filter((s) => selectedShops.includes(s.id));
    if (dataToExport.length === 0) return;

    const headers = [
      "ID",
      "Name",
      "Seller",
      "Email",
      "Phone",
      "Rating",
      "Joined Date",
    ];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((row) =>
        [
          row.id,
          row.name,
          row.seller,
          row.email,
          row.phone,
          row.rating,
          row.joined,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "shops_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`${selectedShops.length} shops exported to CSV`);
  };

  // Pagination
  const totalPages = Math.ceil(processedShops.length / itemsPerPage);
  const paginatedShops = processedShops.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Helper for Status Badge
  const getStatusBadge = (rating) => {
    if (rating >= 4.5)
      return (
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
          Top Rated
        </span>
      );
    if (rating >= 3)
      return (
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
          Active
        </span>
      );
    return (
      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
        At Risk
      </span>
    );
  };

  // Helper for Sort Icon
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column)
      return <span className="opacity-20 ml-1">⇅</span>;
    return sortConfig.direction === "asc" ? (
      <FiChevronUp className="inline ml-1" />
    ) : (
      <FiChevronDown className="inline ml-1" />
    );
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen relative font-sans">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-600 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Shops</p>
            <h2 className="text-2xl font-bold text-gray-700">
              {shopList.length}
            </h2>
          </div>
          <FiTrendingUp className="text-3xl text-green-100" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Active Sellers</p>
            <h2 className="text-2xl font-bold text-gray-700">
              {shopList.filter((s) => s.rating > 3).length}
            </h2>
          </div>
          <FiUsers className="text-3xl text-blue-100" />
        </div>
        <div
          className="bg-white p-4 rounded-lg shadow flex items-center justify-center cursor-pointer hover:bg-gray-50 transition border border-gray-100"
          onClick={() => showToast("Downloading full report...")}
        >
          <div className="flex flex-col items-center text-green-600">
            <FiDownload className="text-2xl mb-1" />
            <span className="font-bold text-sm">Download Full Report</span>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-700 text-left mb-4">
        Shop Management
      </h1>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Search
            </label>
            <input
              type="text"
              placeholder="Shop, Seller, Email..."
              className="w-full px-3 py-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <div className="w-1/2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Joined From
              </label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm mt-1 text-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div className="w-1/2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                To
              </label>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm mt-1 text-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Min Rating
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm mt-1 bg-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden relative min-h-[400px]">
        {paginatedShops.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => handleSort("name")}
                >
                  Shop Details <SortIcon column="name" />
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                  Contacts
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => handleSort("rating")}
                >
                  Status <SortIcon column="rating" />
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => handleSort("joined")}
                >
                  Joined Date <SortIcon column="joined" />
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedShops.map((shop) => (
                <tr
                  key={shop.id}
                  className={
                    selectedShops.includes(shop.id)
                      ? "bg-green-50"
                      : "hover:bg-gray-50"
                  }
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedShops.includes(shop.id)}
                      onChange={() => handleSelectOne(shop.id)}
                      className="w-4 h-4 rounded text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {shop.name}
                      </div>
                      <div className="text-gray-500 text-xs">{shop.seller}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 text-sm">{shop.email}</div>
                    <div className="text-gray-500 text-xs">{shop.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(shop.rating)}
                    <div className="text-xs text-gray-500 mt-1">
                      {shop.rating} ★
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {shop.joined}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/review/${shop.id}`)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm shadow-sm"
                    >
                      Manage Reviews
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-10 text-center text-gray-400 flex flex-col items-center justify-center h-full">
            <FiFilter className="text-4xl mb-2" />
            <span>No shops match your filters</span>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      {selectedShops.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-bounce-slight">
          <span className="font-semibold flex items-center gap-2">
            <FiCheckSquare className="text-green-400" /> {selectedShops.length}{" "}
            Selected
          </span>
          <div className="h-4 w-[1px] bg-gray-600"></div>
          <button
            onClick={handleBulkExport}
            className="hover:text-green-400 flex items-center gap-1 font-medium text-sm transition"
          >
            <FiDownload /> Export
          </button>
          <button
            onClick={handleBulkDelete}
            className="hover:text-red-400 flex items-center gap-1 font-medium text-sm transition"
          >
            <FiTrash2 /> Delete
          </button>
          <button
            onClick={() => setSelectedShops([])}
            className="text-gray-400 hover:text-white text-xs ml-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 gap-2 text-sm pb-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded hover:text-green-600 disabled:opacity-50"
        >
          PREV
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1
                ? "bg-green-600 text-white"
                : "hover:bg-green-600 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded hover:text-green-600 disabled:opacity-50"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
