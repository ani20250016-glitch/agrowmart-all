import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import {
  deleteProduct,
  getAllProducts,
  getAllRatings,
  getCategories,
} from "../../../api/adminProduct";

export default function AllProducts() {
  const navigate = useNavigate();

  const sortOptions = [
    "Most Popular",
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [ratings, setRatings] = useState([]);

  const itemsPerPage = 7;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  //Deepti Kadam
  // ================= FETCH PRODUCTS + CATEGORIES =================
  useEffect(() => {
    getAllProducts()
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, []);
  //Deepti Kadam
  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategories([
          { id: 0, name: "All Categories" }, // default option
          ...res.data, // API response
        ]);
      })
      .catch((err) => console.error("Category fetch error", err));
  }, []);
  //Deepti Kadam
  useEffect(() => {
    getAllRatings()
      .then((res) => setRatings(res.data))
      .catch(console.error);
  }, []);

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;

    deleteProduct(id)
      .then(() => {
        setProducts(products.filter((p) => p.id !== id));
      })
      .catch(console.error);
  };

  // ================= FILTER + SORT =================
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const q = search.trim().toLowerCase();

      const matchesCategory =
        selectedCategory === "All Categories" ||
        p.category?.name === selectedCategory;

      const matchesSearch =
        q === "" ||
        p.productName?.toLowerCase().includes(q) ||
        String(p.details?.price ?? "").includes(q) ||
        String(p.merchantId).includes(q);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "Price: Low to High") {
      list.sort((a, b) => (a.details?.price ?? 0) - (b.details?.price ?? 0));
    } else if (sortBy === "Price: High to Low") {
      list.sort((a, b) => (b.details?.price ?? 0) - (a.details?.price ?? 0));
    }

    return list;
  }, [products, selectedCategory, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  // const getAverageRating = (merchantId) => {
  //   if (!ratings || ratings.length === 0) return "-";

  //   // Backend does NOT send vendorId, so show global avg safely
  //   const avg =
  //     ratings.reduce((sum, r) => sum + (r.stars ?? 0), 0) /
  //     ratings.length;

  //   return isNaN(avg) ? "-" : avg.toFixed(1);
  // };
  //Deepti Kadam
  const getAverageRating = (merchantId) => {
    const vendorRatings = ratings.filter((r) => r.vendorId === merchantId);

    if (vendorRatings.length === 0) return "-";

    const avg =
      vendorRatings.reduce((s, r) => s + r.stars, 0) / vendorRatings.length;

    return avg.toFixed(1);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
          All Products ({filtered.length})
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, merchant or price"
            className="w-full sm:w-64 px-3 py-2 border rounded-lg text-sm"
          />

          <select
            className="border px-3 py-2 rounded-lg text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            className="border px-3 py-2 rounded-lg text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id ?? c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 text-xs">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 flex gap-3 items-center">
                    <img
                      src={p.imagePaths?.split(",")[0]}
                      alt={p.productName}
                      className="w-10 h-10 rounded border object-cover"
                    />
                    {p.productName}
                  </td>
                  <td className="px-4 py-3">₹{p.details?.price ?? "-"}</td>
                  <td className="px-4 py-3">Merchant #{p.merchantId}</td>
                  <td className="px-4 py-3">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{p.stockQuantity}</td>
                  <td className="px-4 py-3">{p.category?.name ?? "-"}</td>
                  <td className="px-4 py-3">
                    ⭐ {getAverageRating(p.merchantId)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="px-3 py-1 text-xs border text-green-600 border-green-600 mr-2"
                    >
                      View Detail
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-2 py-1 border text-red-600 border-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-4">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            No records found
          </div>
        ) : (
          paginated.map((p) => (
            <div
              key={p.id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <div className="flex gap-3 items-center mb-2">
                <img
                  src={p.imagePaths?.split(",")[0]}
                  alt={p.productName}
                  className="w-16 h-16 rounded border object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {p.productName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Merchant #{p.merchantId}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                <p>💰 Price: ₹{p.details?.price ?? "-"}</p>
                <p>📦 Stock: {p.stockQuantity}</p>
                <p>⭐ Rating: {getAverageRating(p.merchantId)}</p>
                <p>📂 Category: {p.category?.name ?? "-"}</p>
                <p>📅 Date: {new Date(p.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="flex-1 border border-green-600 text-green-600 px-3 py-2 rounded text-sm"
                >
                  View Detail
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="border border-red-600 text-red-600 px-3 py-2 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end items-center mt-6 gap-2 text-sm select-none">
        {/* PREV */}
        <span
          className={`px-3 py-1 rounded cursor-pointer ${
            page === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:text-green-600"
          }`}
          onClick={() => page > 1 && setPage(page - 1)}
        >
          PREV
        </span>

        {/* PAGE NUMBERS */}
        {(() => {
          const pages = [];
          const maxShown = 5;
          let start = Math.max(1, page - Math.floor(maxShown / 2));
          let end = start + maxShown - 1;

          if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxShown + 1);
          }

          for (let i = start; i <= end; i++) pages.push(i);

          return pages.map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-2.5 py-1 rounded border ${
                page === num
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 hover:bg-green-50"
              }`}
            >
              {num}
            </button>
          ));
        })()}

        {/* NEXT */}
        <span
          className={`px-3 py-1 rounded cursor-pointer ${
            page === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:text-green-600"
          }`}
          onClick={() => page < totalPages && setPage(page + 1)}
        >
          NEXT
        </span>
      </div>
    </div>
  );
}
