import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVendors } from "../../../api/adminVendorsApi";

const Sellers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("popular");
  const [page, setPage] = useState(1);
  const [sellers, setSellers] = useState([]); // API data
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const perPage = 8;

  // Fetch sellers from API
  useEffect(() => {
    fetchSellers();
  }, [page, search]);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const res = await getVendors({
        page: page - 1,
        size: perPage,
        search,
      });
      console.log("API Response:", res.data);

      // res structure from your JSON example
      setSellers(res.data.data || []);
      setTotalElements(res.data.pagination?.totalElements || 0);
    } catch (err) {
      console.error(err);
      setSellers([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering (in case backend search is partial) + sorting
  const filteredSellers = useMemo(() => {
    let list = sellers.filter(
      (s) =>
        (s.storeName || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.phone || "").includes(search)
    );

    // Sorting - limited since we don't have rating/earning yet
    if (sortType === "popular") {
      // Keep API order (usually most relevant/popular)
      return list;
    }
    // You can extend later when data is available
    return list;
  }, [sellers, search, sortType]);

  const totalPages = Math.ceil(totalElements / perPage); // Use backend total for accurate pagination

  const paginatedData = filteredSellers; // Already sized by backend

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-lg font-semibold text-gray-700">
          All Merchant / Seller{" "}
          <span className="text-gray-500">({totalElements})</span>
        </h2>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by shopname, seller name, email or phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to first page on new search
              }}
              className="w-full border hover:border-[green] rounded-md py-2 pl-2 pr-3 text-sm outline-none"
            />
          </div>

          <select
            className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm"
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            <option value="popular">Sort By : Most Popular</option>
            <option value="high-rating">Highest Rating</option>
            <option value="low-rating">Lowest Rating</option>
            <option value="earning">Highest Earnings</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-8">Loading sellers...</div>}

      {/* Data Table / Cards */}
      {!loading && paginatedData.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm text-gray-600">
              <thead>
                <tr className="bg-gray-100 text-xs text-gray-500">
                  <th className="px-4 py-3 text-left">SHOP NAME</th>
                  <th className="px-4 py-3 text-left">SELLER NAME</th>
                  <th className="px-4 py-3 text-left">PHONE NUMBER</th>
                  <th className="px-4 py-3 text-left">EMAIL</th>
                  <th className="px-4 py-3 text-left">RATING</th>
                  <th className="px-4 py-3 text-left">TOTAL PRODUCTS</th>
                  <th className="px-4 py-3 text-left">SOLD PRODUCTS</th>
                  <th className="px-4 py-3 text-left">EARNING</th>
                  <th className="px-4 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-gray-300 hover:bg-gray-50 align-middle"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={s.photoUrl || "/default-avatar.png"}
                          alt={s.storeName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-700">
                            {s.storeName || "N/A"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Member since {s.memberSince}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-700">
                      {s.businessName || "N/A"}
                    </td>

                    <td className="px-4 py-3">{s.phone || "-"}</td>
                    <td className="px-4 py-3">{s.email || "-"}</td>

                    <td className="px-4 py-3 text-green-500">⭐ <span className="text-gray-700">-</span></td>

                    <td className="px-4 py-3 text-center">-</td>
                    <td className="px-4 py-3 text-center">-</td>

                    <td className="px-4 py-3 font-medium text-right">-</td>

                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-[green] hover:text-white hover:bg-[green] border border-[green] px-3 py-1 rounded-md text-xs"
                        onClick={() => navigate(`/seller/${s.id}`)}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid gap-4">
            {paginatedData.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-center gap-3">
                  <img
                    src={s.photoUrl || "/default-avatar.png"}
                    alt={s.storeName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      {s.storeName || "N/A"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Member since {s.memberSince}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p>👤 Seller: {s.businessName || "N/A"}</p>
                  <p>📞 {s.phone || "-"}</p>
                  <p>📩 {s.email || "-"}</p>
                  <p>⭐ Rating: -</p>
                  <p>Total Products: -</p>
                  <p>Sold Products: -</p>
                  <p>Earning: -</p>
                </div>

                <button
                  className="mt-3 w-full text-[green] border border-[green] px-3 py-2 rounded-md text-sm"
                  onClick={() => navigate(`/seller/${s.id}`)}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        !loading && (
          <div className="text-center p-6 text-gray-500">
            No sellers found matching your search.
          </div>
        )
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-6 text-sm select-none">
          <span
            className={`px-3 py-1 rounded ${page === 1 ? "text-gray-300" : "text-gray-600 hover:text-[green] cursor-pointer"}`}
            onClick={() => page > 1 && setPage(page - 1)}
          >
            PREV
          </span>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-2.5 py-1 text-sm rounded border ${
                page === i + 1
                  ? "bg-[green] text-white border-[green]"
                  : "text-gray-700 bg-white hover:bg-[green] hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <span
            className={`px-3 py-1 rounded ${page === totalPages ? "text-gray-300" : "text-gray-700 hover:text-[green] cursor-pointer"}`}
            onClick={() => page < totalPages && setPage(page + 1)}
          >
            NEXT
          </span>
        </div>
      )}
    </div>
  );
};

export default Sellers;