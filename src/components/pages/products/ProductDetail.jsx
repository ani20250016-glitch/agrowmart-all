import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  getProductById,
  blockProduct,
  unblockProduct,
  getRatingById,
} from "../../../api/adminProduct";

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);

  // ================= GET PRODUCT =================
  useEffect(() => {
    getProductById(id)
      .then((res) => {
        setProduct(res.data);
        const imgs = res.data.imagePaths?.split(",") || [];
        setSelectedImage(imgs[0] || "");
        setIsBlocked(res.data.blockStatus === "BLOCKED");
      })
      .catch(console.error);
  }, [id]);
  // ================= MOCK REVIEWS (FIX) =================
  const [rating, setRating] = useState(null);

  useEffect(() => {
    getRatingById(id)
      .then((res) => setRating(res.data))
      .catch(console.error);
  }, [id]);

  if (!rating) return <div>Loading...</div>;

  if (!product) return <div className="p-6">Loading...</div>;

  const images = product.imagePaths?.split(",") || [];

  // ================= CONFIRM BLOCK / UNBLOCK =================
  const handleConfirm = () => {
    if (actionType === "block") {
      blockProduct(id)
        .then(() => {
          setIsBlocked(true);
          setShowModal(false);
        })
        .catch(console.error);
    }

    if (actionType === "unblock") {
      unblockProduct(id)
        .then(() => {
          setIsBlocked(false);
          setShowModal(false);
        })
        .catch(console.error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 md:p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-7xl p-6 space-y-6">
        {/* BACK */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-700 mb-4 hover:text-black transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center mb-6 border-b pb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Product Detail
          </h1>

          {/* BLOCK / UNBLOCK */}
          <div className="flex gap-2 bg-gray-200 rounded-full p-1">
            <button
              onClick={() => {
                setActionType("unblock");
                setShowModal(true);
              }}
              className={`px-4 py-2 text-sm rounded-full ${
                !isBlocked ? "bg-green-600 text-white" : "hover:bg-gray-300"
              }`}
            >
              Unblock
            </button>

            <button
              onClick={() => {
                setActionType("block");
                setShowModal(true);
              }}
              className={`px-4 py-2 text-sm rounded-full ${
                isBlocked ? "bg-red-600 text-white" : "hover:bg-gray-300"
              }`}
            >
              Block
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">{product.productName}</p>

            <div className="flex gap-3 mt-4">
              <div className="flex flex-col gap-2">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className={`w-14 h-14 border rounded cursor-pointer ${
                      selectedImage === img
                        ? "border-green-600"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>

              <img
                src={selectedImage}
                className="flex-1 max-h-64 object-cover rounded"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-6 bg-white rounded-lg shadow space-y-4">
            <p className="text-gray-600">{product.shortDescription}</p>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p className="text-gray-400">Product ID</p>
              <p>{product.id}</p>

              <p className="text-gray-400">Category</p>
              <p>{product.category?.name}</p>

              <p className="text-gray-400">Stock</p>
              <p>{product.stockQuantity}</p>
            </div>
          </div>
        </div>
        {/* Reviews */}
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Rating Detail</h2>

          <p>⭐ Stars: {rating.stars}</p>
          <p>📝 Feedback: {rating.feedback}</p>
          <p>👤 Customer: {rating.customerName}</p>
          <p>🏪 Vendor ID: {rating.vendorId}</p>
          <p>📅 Date: {new Date(rating.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {actionType === "block" ? "Block Product" : "Unblock Product"}
            </h2>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-white rounded ${
                  actionType === "block" ? "bg-red-600" : "bg-green-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
