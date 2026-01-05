import React, { useState, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaCalendarAlt,
  FaFilter,
  FaSync,
  FaDownload,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import milk from "../../../assets/market_rates/milk.jpg";
import bananas from "../../../assets/market_rates/bananas.png";

/* ===================== STATS ===================== */
const stats = [
  {
    id: 1,
    title: "Vegetables",
    avg: "$2.40",
    unit: "/kg",
    change: "+2.4%",
    icon: "🥦",
  },
  {
    id: 2,
    title: "Fruits",
    avg: "$4.10",
    unit: "/kg",
    change: "-0.8%",
    icon: "🍊",
  },
  {
    id: 3,
    title: "Dairy Products",
    avg: "$1.80",
    unit: "/ltr",
    change: "0.0%",
    icon: "🥛",
  },
  {
    id: 4,
    title: "Meat & Seafood",
    avg: "$12.50",
    unit: "/kg",
    change: "+5.1%",
    icon: "🍖",
  },
];

/* ===================== DATA ===================== */
const itemsData = [
  {
    id: "VEG-204",
    name: "Tomato",
    category: "Vegetables",
    price: "$3.50",
    updated: "12 mins ago",
    status: "Decreasing",
    statusColor: "green",
    img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=800",
  },
  {
    id: "MT-882",
    name: "Angus Beef Ribeye",
    category: "Meat",
    price: "$24.80",
    updated: "45 mins ago",
    status: "Increasing",
    statusColor: "red",
    img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800",
  },
  {
    id: "FR-101",
    name: "Apples",
    category: "Fruits",
    price: "$4.20",
    updated: "1 hr ago",
    status: "Stable",
    statusColor: "yellow",
    img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=800",
  },
  {
    id: "DA-305",
    name: "Milk (1L)",
    category: "Dairy",
    price: "$1.95",
    updated: "2 hrs ago",
    status: "Decreasing",
    statusColor: "green",
    img: milk,
  },
  {
    id: "VEG-512",
    name: "Potatoes",
    category: "Vegetables",
    price: "$1.10",
    updated: "3 hrs ago",
    status: "Stable",
    statusColor: "yellow",
    img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=800",
  },
  {
    id: "FR-202",
    name: "Bananas",
    category: "Fruits",
    price: "$2.30",
    updated: "30 mins ago",
    status: "Increasing",
    statusColor: "red",
    img: bananas,
  },
  {
    id: "MT-905",
    name: "Chicken Breast",
    category: "Meat",
    price: "$12.50",
    updated: "1 hr ago",
    status: "Stable",
    statusColor: "yellow",
    img: "https://images.unsplash.com/photo-1604908177521-c091e89aa61f?q=80&w=800",
  },
];

/* ===================== STATUS BADGE ===================== */
const statusStyles = {
  green: "bg-green-100 text-green-600 border border-green-300",
  red: "bg-red-100 text-red-600 border border-red-300",
  yellow: "bg-yellow-100 text-yellow-700 border border-yellow-300",
};

const StatusBadge = ({ color, text }) => {
  const icon =
    text === "Increasing" ? (
      <FaArrowUp size={10} />
    ) : text === "Decreasing" ? (
      <FaArrowDown size={10} />
    ) : (
      <FaMinus size={10} />
    );

  return (
    <span
      className={`flex items-center justify-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm whitespace-nowrap min-w-[70px] ${statusStyles[color]}`}
    >
      {icon} {text}
    </span>
  );
};

/* ===================== MAIN COMPONENT ===================== */
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const categories = ["All", ...new Set(itemsData.map((i) => i.category))];

  /* ---------- FILTER ---------- */
  const filteredItems = useMemo(() => {
    return itemsData.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(query.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [query, selectedCategory]);

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page]);

  /* ---------- RESET PAGE ON FILTER CHANGE ---------- */
  useEffect(() => {
    setPage(1);
  }, [query, selectedCategory]);

  /* ---------- EXPORT CSV ---------- */
  const exportToCSV = () => {
    if (!filteredItems.length) return;

    const headers = ["ID", "Name", "Category", "Price", "Updated", "Status"];
    const rows = filteredItems.map((i) => [
      i.id,
      i.name,
      i.category,
      i.price,
      i.updated,
      i.status,
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "market-rates.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ---------- REFRESH ---------- */
  const handleRefresh = () => {
    setQuery("");
    setSelectedCategory("All");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        {location.state?.fromDashboard && (
          <div className="mb-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 
                 hover:text-gray-800 hover:bg-gray-100 
                 rounded-lg transition"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        )}

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Market Rates
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Real-time tracking of global commodity prices.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition w-full sm:w-auto justify-center"
            >
              <FaDownload />
              <span className="text-sm">Export CSV</span>
            </button>
            {/* <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-lime-400 text-black font-semibold hover:bg-lime-300 transition w-full sm:w-auto justify-center">
               <FaPlus />
               <span className="text-sm">Add Item</span>
             </button> */}
          </div>
        </header>

        {/*Stats*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((s) => (
            <div
              key={s.id}
              // Added flex-col, h-full, and justify-between for vertical arrangement
              className="bg-white p-5 rounded-xl text-white shadow-lg border border-[gray-200] flex flex-col justify-between h-[150px]"
            >
              {/* TOP SECTION: Icon and Percentage Change */}
              <div className="flex justify-between items-start mb-2">
                {/* Icon (Left) */}
                <div className="w-12 h-12 rounded-full bg-gray-200/70 flex items-center justify-center text-3xl">
                  {s.icon}
                </div>

                {/* Percentage Change (Right) */}
                <div
                  className={`px-3 py-1 text-xs sm:text-sm rounded-md ${
                    s.change.startsWith("+")
                      ? "bg-green-600/20 text-green-400"
                      : s.change.startsWith("-")
                      ? "bg-red-600/20 text-red-400"
                      : "bg-yellow-600/20 text-yellow-400"
                  }`}
                >
                  {s.change}
                </div>
              </div>

              {/* BOTTOM SECTION: Title and Price */}
              <div className="mt-auto">
                {" "}
                {/* mt-auto pushes content to the bottom */}
                <div className="text-sm font-bold text-[green]">{s.title}</div>
                <div className="text-2xl sm:text-2xl font-bold tracking-wide text-gray-800 mt-1">
                  Avg {s.avg}
                  <span className="text-sm ml-1 font-bold text-[green]">
                    {s.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-white p-4 rounded-xl flex flex-wrap gap-4 items-center mb-6">
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full flex-1">
            <FaSearch />
            <input
              className="bg-transparent ml-3 outline-none w-full"
              placeholder="Search items..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
            <FaFilter />
            <select
              className="bg-transparent ml-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="p-3 bg-gray-100 rounded-full"
          >
            <FaSync />
          </button>
        </div>

        {/* TABLE */}
        <div className="hidden lg:block bg-white rounded-xl p-6 border border-gray-200 shadow overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="text-gray-800 text-sm border-b border-gray-300">
              <tr>
                <th className="pb-4 text-left">Item Name</th>
                <th className="pb-4 text-left">Category</th>
                <th className="pb-4 text-left">Price Per Kg/Ltr</th>
                <th className="pb-4 text-left">Last Updated</th>
                <th className="pb-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 flex items-center gap-4 min-w-[200px]">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: #{item.id}
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-700">{item.category}</td>
                  <td className="font-semibold text-gray-900">{item.price}</td>
                  <td className="text-gray-500">{item.updated}</td>
                  <td>
                    <StatusBadge color={item.statusColor} text={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lg:hidden grid gap-4">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow flex flex-col gap-4"
            >
              {/* IMAGE WITH STATUS BADGE */}
              <div className="relative w-full">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-40 rounded-lg object-cover"
                />
                <div className="absolute top-2 right-2">
                  <StatusBadge color={item.statusColor} text={item.status} />
                </div>
              </div>

              {/* ITEM DETAILS */}
              <div className="flex flex-col gap-2">
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ID: #{item.id}
                  </div>
                </div>

                <div className="text-sm text-gray-600">{item.category}</div>

                <div className="text-xl font-semibold text-gray-900">
                  {item.price}
                </div>

                <div className="text-xs text-gray-500 mt-1">{item.updated}</div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {filteredItems.length > 0 && (
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              Showing {paginatedItems.length} of {filteredItems.length} results
            </div>
            <div className="flex flex-wrap justify-end items-center gap-2 text-sm select-none">
              <button
                disabled={page === 1}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? "text-gray-300"
                    : "text-gray-700 hover:text-green-600"
                }`}
                onClick={() => page > 1 && setPage(page - 1)}
              >
                PREV
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-2.5 py-1 text-sm rounded border transition ${
                    page === i + 1
                      ? "bg-green-600 text-white border-green-600"
                      : "text-gray-700 bg-white hover:bg-green-600 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                className={`px-3 py-1 rounded ${
                  page === totalPages
                    ? "text-gray-300"
                    : "text-gray-700 hover:text-green-600"
                }`}
                onClick={() => page < totalPages && setPage(page + 1)}
              >
                NEXT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
