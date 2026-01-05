import React, { useEffect, useState } from "react";
import {
  getAllRatings,
  getDeletedProducts,
  restoreProduct,
} from "../../../api/adminProduct";

export default function DeletedProducts() {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;
  const [ratings, setRatings] = useState([]);

  // 🔥 LOAD DELETED PRODUCTS FROM API
  useEffect(() => {
    fetchDeletedProducts();
  }, []);
  //Deepti Kadam
  useEffect(() => {
    getAllRatings()
      .then((res) => setRatings(res.data))
      .catch(console.error);
  }, []);

  const fetchDeletedProducts = () => {
    getDeletedProducts()
      .then((res) => setDeletedProducts(res.data))
      .catch(console.error);
  };

  // 🔁 RESTORE PRODUCT
  const handleAddBack = (productId) => {
    restoreProduct(productId)
      .then(() => {
        setDeletedProducts((prev) => prev.filter((p) => p.id !== productId));
      })
      .catch(console.error);
  };

  // ================= PAGINATION =================
  const totalPages = Math.max(
    1,
    Math.ceil(deletedProducts.length / itemsPerPage)
  );

  if (page > totalPages) setPage(1);

  const paginated = deletedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
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
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-6">
        Deleted Products ({deletedProducts.length})
      </h2>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 font-semibold text-gray-600 text-xs">
            <tr>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Price</th> {/* ✅ ADDED */}
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {deletedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No deleted products
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 text-gray-600"
                >
                  <td className="px-4 py-3 flex gap-3 items-center">
                    <img
                      src={p.imagePaths?.split(",")[0]}
                      alt={p.productName}
                      className="w-10 h-10 rounded border object-cover"
                    />
                    <span className="font-medium text-gray-800">
                      {p.productName}
                    </span>
                  </td>

                  {/* ✅ PRICE COLUMN */}
                  <td className="px-4 py-3">₹{p.details?.price ?? "-"}</td>

                  <td className="px-4 py-3">Merchant #{p.merchantId}</td>
                  <td className="px-4 py-3">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{p.stockQuantity}</td>
                  <td className="px-4 py-3">{p.category?.name}</td>
                  <td className="px-4 py-3">
                    ⭐ {getAverageRating(p.merchantId)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleAddBack(p.id)}
                      className="px-3 py-1 text-xs border rounded-md text-[green] border-[green] hover:bg-[green] hover:text-white transition"
                    >
                      Add
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
        {deletedProducts.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">
            No deleted products
          </div>
        ) : (
          paginated.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-sm rounded-lg p-4 border"
            >
              <div className="flex gap-3 items-center mb-3">
                <img
                  src={p.imagePaths?.split(",")[0]}
                  alt={p.productName}
                  className="w-16 h-16 rounded border object-cover"
                />
                <h3 className="font-semibold text-gray-800">{p.productName}</h3>
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                <div>💰 Price: ₹{p.details?.price ?? "-"}</div> {/* ✅ ADDED */}
                <div>Merchant #{p.merchantId}</div>
                <div>Stock: {p.stockQuantity}</div>
                <div>{p.category?.name}</div>
                <p>⭐ Rating: {getAverageRating(p.merchantId)}</p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => handleAddBack(p.id)}
                  className="w-full px-3 py-2 text-sm border rounded-md text-[green] border-[green] hover:bg-[green] hover:text-white transition"
                >
                  Add
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-end items-center mt-6 gap-2 text-sm">
        <span
          className={`px-3 py-1 ${
            page === 1 ? "text-gray-300" : "cursor-pointer"
          }`}
          onClick={() => page > 1 && setPage(page - 1)}
        >
          PREV
        </span>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-2 py-1 border rounded ${
              page === num ? "bg-[green] text-white" : "hover:bg-[green]"
            }`}
          >
            {num}
          </button>
        ))}

        <span
          className={`px-3 py-1 ${
            page === totalPages ? "text-gray-300" : "cursor-pointer"
          }`}
          onClick={() => page < totalPages && setPage(page + 1)}
        >
          NEXT
        </span>
      </div>
    </div>
  );
}
