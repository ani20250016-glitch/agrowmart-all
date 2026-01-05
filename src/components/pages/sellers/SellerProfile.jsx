// src/pages/SellerProfile.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { AiFillStar } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import {
  getVendorProfile,
  blockVendor,
  unblockVendor,
  getVendorProducts, // ← NEW IMPORT
} from "../../../api/adminVendorsApi";

const SellerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [seller, setSeller] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState("");
  const [activeTab, setActiveTab] = useState("Store Info");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsTotal, setProductsTotal] = useState(0);

  const tabs = ["Store Info", "Products", "Payment", "Review & Rating"];

  useEffect(() => {
    loadSeller();
  }, [id]);

  // Load products when Products tab is active
  useEffect(() => {
    if (activeTab === "Products" && seller?.id) {
      loadProducts();
    }
  }, [activeTab, seller]);

  const loadSeller = async () => {
    try {
      setLoading(true);
      const res = await getVendorProfile(id);
      const data = res.data.data;

      setSeller(data);
      setIsBlocked(data.status === "BLOCKED" || data.status === "blocked");
    } catch (err) {
      console.error("Failed to load vendor", err);
      alert("Failed to load seller profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    if (!seller?.id) return;

    setProductsLoading(true);
    try {
      const res = await getVendorProducts(seller.id);
      setProducts(res.data.data || []);
      setProductsTotal(res.data.pagination?.totalElements || 0);
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
      setProductsTotal(0);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      if (actionType === "block") {
        await blockVendor(id);
        setIsBlocked(true);
      } else {
        await unblockVendor(id);
        setIsBlocked(false);
      }
      setShowConfirm(false);
      loadSeller();
    } catch (err) {
      console.error("Action failed", err);
      alert("Operation failed. Please try again.");
    }
  };

  const formatMemberSince = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading seller profile...</p>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-600">Seller not found</p>
      </div>
    );
  }

  const StatCard = ({ title, value }) => (
    <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
      <p className="text-xs font-semibold text-gray-500 uppercase">{title}</p>
      <span className="text-lg font-bold text-gray-800 mt-1 block">{value}</span>
    </div>
  );

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
      <img
        src={
          product.imageUrls && product.imageUrls.length > 0
            ? product.imageUrls[0]
            : "/default-product.png"
        }
        alt={product.productName}
        className="w-full h-28 sm:h-32 object-cover"
        onError={(e) => (e.target.src = "/default-product.png")}
      />
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
            {product.productName || "Unnamed Product"}
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            {product.serialNo ? `SN: ${product.serialNo}` : "N/A"}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs font-medium ${
            product.stockStatus === "IN_STOCK" ? "text-green-600" : "text-red-600"
          }`}>
            {product.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock"}
          </span>
          <span className="flex items-center text-xs bg-[green] text-white px-2 py-0.5 rounded-full">
            <AiFillStar className="w-3 h-3 mr-1" />
            4.5
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-black transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Profile</h1>
            <div className="flex gap-2 bg-gray-200 rounded-full p-1">
              <button
                disabled={!isBlocked}
                onClick={() => {
                  setActionType("unblock");
                  setShowConfirm(true);
                }}
                className={`px-5 py-2 text-sm font-medium rounded-full transition ${
                  isBlocked
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Unblock
              </button>
              <button
                disabled={isBlocked}
                onClick={() => {
                  setActionType("block");
                  setShowConfirm(true);
                }}
                className={`px-5 py-2 text-sm font-medium rounded-full transition ${
                  !isBlocked
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Block
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 pb-6 border-b border-gray-200">
            <div className="flex flex-1 gap-4">
              <img
                src={seller.photoUrl || "/default-avatar.png"}
                alt={seller.storeName}
                className="w-20 h-20 rounded-full object-cover shadow"
                onError={(e) => (e.target.src = "/default-avatar.png")}
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {seller.storeName || "N/A"}
                </h2>
                <p className="text-sm text-gray-600">
                  {seller.address || seller.city || "Location not provided"}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-[green] text-white text-xs px-2 py-1 rounded-md flex items-center">
                    <AiFillStar className="mr-1 w-4 h-4" /> 4.5
                  </span>
                  <span className="text-xs text-gray-500">
                    19,630 ratings and 146 reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
              <StatCard title="Sold Products" value={seller.soldProducts ?? "0"} />
              <StatCard title="Total Earning" value={`₹${seller.totalEarning ?? "0"}`} />
              <StatCard
                title="Member Since"
                value={formatMemberSince(seller.memberSince || seller.createdAt)}
              />
            </div>
          </div>

          <div className="border-b border-gray-300 mt-6 overflow-x-auto">
            <nav className="flex space-x-6 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 text-sm whitespace-nowrap transition ${
                    activeTab === tab
                      ? "border-b-2 border-[green] text-[green] font-semibold"
                      : "text-gray-500 hover:text-[green]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6 pb-4">
            {activeTab === "Store Info" && (
              <div>
                <h3 className="text-xl font-bold mb-5">Store Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Store Name</p>
                    <p className="font-semibold text-gray-800">{seller.storeName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Email</p>
                    <p className="font-semibold text-gray-800">{seller.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Mobile</p>
                    <p className="font-semibold text-gray-800">{seller.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Business Number</p>
                    <p className="font-semibold text-gray-800">GHNEC00947829809</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Address</p>
                    <p className="font-semibold text-gray-800">
                      {seller.address || seller.city || "N/A"}
                    </p>
                  </div>
                </div>

                <h4 className="text-lg font-bold mt-8 mb-3 border-t border-gray-200 pt-6">
                  Description
                </h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                  Lorem ipsum simply dummy text...
                </p>
              </div>
            )}

            {activeTab === "Products" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
                  <h3 className="text-xl font-bold">
                    All Products ({productsTotal})
                  </h3>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                    <FiSearch className="text-gray-500" />
                    <input
                      className="bg-transparent outline-none text-sm w-full"
                      placeholder="Search product..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                </div>

                {productsLoading ? (
                  <p className="text-center py-8 text-gray-500">Loading products...</p>
                ) : products.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No products listed yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {products
                      .filter((p) =>
                        p.productName?.toLowerCase().includes(searchText.toLowerCase())
                      )
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "Payment" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-white p-6 shadow rounded-xl border-t-4 border-[green]">
                  <h4 className="font-bold mb-3">Mobile Payment</h4>
                  <p className="text-sm">Network: <span className="font-semibold">MTN Mobile Money</span></p>
                  <p className="text-sm mt-1">Mobile Number: {seller.phone || "N/A"}</p>
                  <p className="text-sm mt-1">Merchant ID: 4075800480</p>
                </div>
                <div className="bg-white p-6 shadow rounded-xl border-t-4 border-[green]">
                  <h4 className="font-bold mb-3">Bank Transfer</h4>
                  <p className="text-sm">Account Number: 093879723908723</p>
                  <p className="text-sm mt-1">Name: Sanjay Kumar</p>
                  <p className="text-sm mt-1">IFSC: UTIB984776</p>
                </div>
                <div className="bg-white p-6 shadow rounded-xl border-t-4 border-[green] flex flex-col items-center text-center">
                  <h4 className="font-bold mb-3">Cash On Delivery</h4>
                  <CheckCircle className="w-10 h-10 text-[green]" />
                  <p className="text-sm text-[green] mt-3 font-semibold">Available</p>
                </div>
              </div>
            )}

            {activeTab === "Review & Rating" && (
              <div className="space-y-4">
                <p className="text-center text-gray-500 py-8">
                  No reviews yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {actionType === "block" ? "Block Seller" : "Unblock Seller"}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to{" "}
                <span className="font-semibold">
                  {actionType === "block" ? "block" : "unblock"}
                </span>{" "}
                this seller?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 text-sm rounded-lg text-white ${
                    actionType === "block" ? "bg-red-500" : "bg-green-600"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;