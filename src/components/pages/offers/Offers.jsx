import { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Upload,
  X,
  Clock,
  Tag,
  Filter,
  Target,
} from "lucide-react";

// =================================================================
// GLOBAL DATA & HELPER FUNCTIONS
// =================================================================

const statusColors = {
  Active: "bg-green-100 text-green-700 border-green-200",
  Upcoming: "bg-green-100 text-green-700 border-green-200",
  Expired: "bg-slate-100 text-slate-600 border-slate-200",
};

const merchantCategories = [
  "Dairy Merchants",
  "Meat Merchants",
  "Vegetable Merchants",
  "Grocery Merchants",
  "Restaurants",
];

const sampleMerchants = [
  { id: "101", name: "Fresh Dairy Co." },
  { id: "102", name: "Green Valley Farms" },
  { id: "103", name: "Prime Cuts Butcher" },
  { id: "104", name: "Organic Greens" },
  { id: "105", name: "City Grocery Store" },
];

const mockOffers = [
  {
    id: "1",
    title: "20% Off on Fresh Dairy Products",
    description:
      "Special discount for all dairy merchants to boost sales this season",
    bannerUrl:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80",
    startDate: "2025-12-01",
    endDate: "2025-12-31",
    merchantTarget: "Merchant Categories",
    selectedCategories: ["Dairy Merchants"],
    status: "Active",
    createdOn: "2025-11-25",
  },
  {
    id: "2",
    title: "New Year Mega Sale - All Categories",
    description: "Exclusive year-end promotion for premium merchants",
    bannerUrl:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80",
    startDate: "2025-12-25",
    endDate: "2026-01-10",
    merchantTarget: "All Merchants",
    status: "Upcoming",
    createdOn: "2025-11-30",
  },
  {
    id: "3",
    title: "Fresh Vegetables Bundle Offer",
    description: "Buy 2 Get 1 Free on all fresh produce",
    bannerUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    merchantTarget: "Merchant Categories",
    selectedCategories: ["Vegetable Merchants"],
    status: "Expired",
    createdOn: "2025-10-28",
  },
  {
    id: "4",
    title: "Premium Meat Selection Discount",
    description: "Get 15% off on premium cuts and specialty meats",
    bannerUrl:
      "https://th.bing.com/th/id/OIP.QV9nLsosd2GuFfqmwBD7NAHaF0?w=236&h=186&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
    startDate: "2025-12-05",
    endDate: "2025-12-20",
    merchantTarget: "Merchant Categories",
    selectedCategories: ["Meat Merchants"],
    status: "Active",
    createdOn: "2025-12-01",
  },
];

const formatDate = (date, long = false) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-US", {
    month: long ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
};

// =================================================================
// COMPONENTS
// =================================================================

// --- OfferDetailsPanel Component ---
function OfferDetailsPanel({ offer, isOpen, onClose, onDelete, onEdit }) {
  if (!isOpen || !offer) return null;

  const getMerchantList = () => {
    if (offer.merchantTarget === "All Merchants") {
      return ["All Merchants"];
    } else if (
      offer.selectedCategories &&
      offer.selectedCategories.length > 0
    ) {
      return offer.selectedCategories;
    } else if (offer.selectedMerchants && offer.selectedMerchants.length > 0) {
      return offer.selectedMerchants.map((id) => {
        const merchant = sampleMerchants.find((m) => m.id === id);
        return merchant ? merchant.name : `Vendor #${id}`;
      });
    }
    return [];
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete the offer "${offer.title}"? This action cannot be undone.`
      )
    ) {
      onDelete(offer.id);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 sm:px-8 py-5 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-slate-900">
            Offer Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Close Panel"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-6">
          {/* Banner */}
          <div className="relative rounded-xl overflow-hidden mb-6 shadow-lg border border-slate-100">
            <img
              src={offer.bannerUrl}
              alt={offer.title}
              className="w-full h-48 sm:h-64 object-cover"
            />
            <div className="absolute top-4 right-4">
              <span
                className={`px-4 py-2 text-sm font-semibold rounded-full border ${
                  statusColors[offer.status]
                } backdrop-blur-sm shadow-sm`}
              >
                {offer.status}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {offer.title}
            </h3>
            <p className="text-slate-600 leading-relaxed text-base">
              {offer.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 text-slate-700 mb-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Validity Period</span>
              </div>
              <div className="text-slate-900 ml-8 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">Start Date:</span>
                  <span className="font-medium">
                    {formatDate(offer.startDate, true)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">End Date:</span>
                  <span className="font-medium">
                    {formatDate(offer.endDate, true)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 text-slate-700 mb-3">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Targeting Method</span>
              </div>
              <div className="text-slate-900 ml-8 text-sm font-medium">
                {offer.merchantTarget}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 text-slate-700 mb-3">
                <Tag className="w-5 h-5 text-green-600" />
                <span className="font-semibold">
                  Assigned Targets ({getMerchantList().length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2 ml-8 max-h-40 overflow-y-auto">
                {getMerchantList().map((merchant, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-full border border-green-200 font-medium whitespace-nowrap"
                  >
                    {merchant}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 text-slate-700 mb-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold">Timeline</span>
              </div>
              <div className="ml-8 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">Created on:</span>
                  <span className="text-slate-900 font-medium">
                    {formatDate(offer.createdOn, true)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Last updated:</span>
                  <span className="text-slate-900 font-medium">
                    {formatDate(offer.createdOn, true)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={() => {
                onEdit(offer);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Edit className="w-5 h-5" />
              Edit Offer
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-semibold"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// --- OffersCardView Component (for Mobile) ---
function OffersCardView({
  offers,
  searchQuery,
  filters,
  onViewDetails,
  onDelete,
  onEdit,
}) {
  // Reuse the same filtering logic as the OffersTable
  const filteredOffers = offers.filter((offer) => {
    // Search filter
    if (
      searchQuery &&
      !offer.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      filters.category &&
      !offer.selectedCategories?.includes(filters.category)
    ) {
      return false;
    }

    // Status filter
    if (filters.status && offer.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start) {
      const filterStart = new Date(filters.dateRange.start);
      const offerEnd = new Date(offer.endDate);
      if (offerEnd < filterStart) return false;
    }
    if (filters.dateRange.end) {
      const filterEnd = new Date(filters.dateRange.end);
      const offerStart = new Date(offer.startDate);
      if (offerStart > filterEnd) return false;
    }

    return true;
  });

  const getMerchantBadges = (offer) => {
    if (offer.merchantTarget === "All Merchants") {
      return ["All Merchants"];
    } else if (
      offer.selectedCategories &&
      offer.selectedCategories.length > 0
    ) {
      return offer.selectedCategories;
    } else if (offer.selectedMerchants && offer.selectedMerchants.length > 0) {
      return offer.selectedMerchants.map((id) => `Vendor #${id}`);
    }
    return [];
  };

  return (
    <div className="lg:hidden">
      {" "}
      {/* HIDE on large screens (desktop), SHOW on mobile */}
      <h3 className="text-xl font-semibold text-slate-900 mb-4 px-1">
        Existing Offers ({filteredOffers.length})
      </h3>
      {filteredOffers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center text-slate-500 text-base">
          No offers found matching your criteria. Try adjusting the filters or
          search query.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
            >
              {/* Card Header & Status */}
              <div className="relative h-24 bg-slate-100 overflow-hidden">
                <img
                  src={offer.bannerUrl}
                  alt={offer.title}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-3 py-1.5 text-xs rounded-full border font-semibold ${
                      statusColors[offer.status]
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h4 className="text-lg font-bold text-slate-900 line-clamp-2 mb-1">
                  {offer.title}
                </h4>
                <p className="text-slate-500 text-xs line-clamp-2 mb-3">
                  {offer.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm border-t border-slate-100 pt-3">
                  {/* Validity */}
                  <div>
                    <p className="text-slate-600 font-medium flex items-center gap-1 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-green-500" />{" "}
                      Validity
                    </p>
                    <p className="text-slate-900 text-xs pl-0.5">
                      {formatDate(offer.startDate)} →{" "}
                      {formatDate(offer.endDate)}
                    </p>
                  </div>

                  {/* Created On */}
                  <div className="text-right">
                    <p className="text-slate-600 font-medium mb-1">
                      Created On
                    </p>
                    <p className="text-slate-900 text-xs">
                      {formatDate(offer.createdOn)}
                    </p>
                  </div>
                </div>

                {/* Assigned Merchants */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Assigned Targets
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getMerchantBadges(offer)
                      .slice(0, 3)
                      .map((badge, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-xs bg-grren-100 text-green-700 rounded-full border border-green-200 font-medium"
                        >
                          {badge}
                        </span>
                      ))}
                    {getMerchantBadges(offer).length > 3 && (
                      <span className="px-2.5 py-1 text-xs bg-slate-100 text-slate-600 rounded-full border border-slate-200 font-medium">
                        +{getMerchantBadges(offer).length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onViewDetails(offer)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => onEdit(offer)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-semibold"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this offer?")
                      ) {
                        onDelete(offer.id);
                      }
                    }}
                    className="flex items-center justify-center gap-2 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- OfferPreview Component ---
function OfferPreview({ formData }) {
  const getStatus = () => {
    if (!formData.startDate || !formData.endDate) return "Upcoming";

    const today = new Date();
    const start = new Date(formData.startDate + "T00:00:00Z");
    const end = new Date(formData.endDate + "T23:59:59Z");

    if (today < start) return "Upcoming";
    if (today > end) return "Expired";
    return "Active";
  };

  const status = getStatus();

  const getMerchantTags = () => {
    if (formData.merchantTarget === "All Merchants") {
      return ["All Merchants"];
    } else if (formData.merchantTarget === "Selected Merchants") {
      const merchants = formData.selectedMerchants
        .slice(0, 3)
        .map((id) => `Vendor #${id}`);
      if (formData.selectedMerchants.length > 3) {
        merchants.push(`+${formData.selectedMerchants.length - 3} more`);
      }
      return merchants;
    } else if (formData.merchantTarget === "Merchant Categories") {
      return formData.selectedCategories;
    }
    return [];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 sticky top-28 h-fit">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">
        Live Preview
      </h2>

      {/* Preview Card */}
      <div className="bg-gradient-to-br from-white to-green-50 rounded-xl border border-slate-200 overflow-hidden shadow-xl">
        {/* Banner */}
        <div className="relative h-48 sm:h-64 bg-slate-300 overflow-hidden">
          {formData.bannerUrl ? (
            <img
              src={formData.bannerUrl}
              alt="Offer banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-green-500/80">
              <div className="text-center">
                <Tag className="w-12 h-12 text-white/80 mx-auto mb-2" />
                <p className="text-white/90 font-medium">
                  Banner Preview (Upload Image)
                </p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1.5 text-sm font-semibold rounded-full border ${statusColors[status]} backdrop-blur-sm shadow-sm`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {formData.title || "Offer Title Preview"}
          </h3>

          {/* Description */}
          <p className="text-slate-600 mb-4 text-sm line-clamp-2">
            {formData.description ||
              "Your offer description will appear here. Add compelling details to attract merchants."}
          </p>

          {/* Validity */}
          <div className="flex items-center gap-2 text-slate-600 mb-4 text-sm">
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="font-medium">
              {formatDate(formData.startDate)} → {formatDate(formData.endDate)}
            </span>
          </div>

          {/* Vendor Tags */}
          {getMerchantTags().length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {getMerchantTags().map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full border border-green-200 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
        <p className="text-green-800 text-sm">
          **Note:** This is an approximation of how merchants will see your
          offer card.
        </p>
      </div>
    </div>
  );
}

// --- OfferForm Component ---
function OfferForm({ formData, setFormData, onSubmit, onCancel, isEditing }) {
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (!formData.bannerUrl) {
      setUploadedFile(null);
    }
  }, [formData.bannerUrl]);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setFormData({ ...formData, bannerUrl: url });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const toggleCategory = (category) => {
    const updated = formData.selectedCategories.includes(category)
      ? formData.selectedCategories.filter((c) => c !== category)
      : [...formData.selectedCategories, category];
    setFormData({ ...formData, selectedCategories: updated });
  };

  const toggleMerchant = (merchantId) => {
    const updated = formData.selectedMerchants.includes(merchantId)
      ? formData.selectedMerchants.filter((m) => m !== merchantId)
      : [...formData.selectedMerchants, merchantId];
    setFormData({ ...formData, selectedMerchants: updated });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">
        {isEditing ? "Edit Offer" : "Create New Offer"}
      </h2>

      <div className="space-y-6">
        {/* Merchant Targeting */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Merchant / Vendor Targeting
          </label>
          <select
            value={formData.merchantTarget}
            onChange={(e) =>
              setFormData({ ...formData, merchantTarget: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option>All Merchants</option>
            <option>Selected Merchants</option>
            <option>Merchant Categories</option>
          </select>
        </div>

        {/* Conditional: Selected Merchants */}
        {formData.merchantTarget === "Selected Merchants" && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Select Merchants:
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sampleMerchants.map((merchant) => (
                <label
                  key={merchant.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedMerchants.includes(merchant.id)}
                    onChange={() => toggleMerchant(merchant.id)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-sm text-slate-700">
                    {merchant.name} (#{merchant.id})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Conditional: Merchant Categories */}
        {formData.merchantTarget === "Merchant Categories" && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Select Categories:
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {merchantCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-sm text-slate-700">{category}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Offer Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Offer Title
          </label>
          <input
            type="text"
            placeholder="Enter offer title..."
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Offer Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Offer Description
          </label>
          <textarea
            placeholder="Describe the offer details..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
          />
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Offer Banner
          </label>
          {!uploadedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-green-400 transition-colors cursor-pointer bg-slate-50"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="banner-upload"
              />
              <label htmlFor="banner-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-700 mb-1 font-medium">
                  Drag & Drop Banner Here
                </p>
                <p className="text-slate-500 text-sm">or Click to Upload</p>
                <p className="text-slate-400 text-xs mt-2">
                  Supported formats: JPG, PNG, WebP
                </p>
              </label>
            </div>
          ) : (
            <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-4">
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setFormData({ ...formData, bannerUrl: "" });
                }}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                title="Remove Image"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
              <img
                src={formData.bannerUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="text-slate-600 mt-3 text-sm font-medium">
                {uploadedFile.name}
              </p>
              <p className="text-slate-500 text-xs">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md font-semibold"
            onClick={onSubmit}
          >
            {isEditing ? "Save Changes" : "Create Offer"}{" "}
            {/* 👈 CONDITIONAL TEXT */}
          </button>
          {onCancel && (
            <button
              type="button"
              className="px-6 bg-slate-100 text-slate-700 py-3 rounded-lg hover:bg-slate-200 transition-colors shadow-md font-semibold"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- FilterBar Component ---
function FilterBar({ filters, setFilters }) {
  const hasActiveFilters =
    filters.category ||
    filters.status ||
    filters.dateRange.start ||
    filters.dateRange.end;

  const clearFilters = () => {
    setFilters({
      category: "",
      status: "",
      dateRange: { start: "", end: "" },
      searchText: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-green-600" />
          <h3 className="text-xl font-semibold text-slate-900">
            Filter Offers
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" />
            Clear All Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Merchant Category
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="">All Categories</option>
            {merchantCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        {/* Date Range Start (Offer Start Date after this date) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Valid After
          </label>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value },
              })
            }
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Date Range End (Offer End Date before this date) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Valid Before
          </label>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value },
              })
            }
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// --- OffersTable Component ---
function OffersTable({
  offers,
  searchQuery,
  filters,
  onViewDetails,
  onDelete,
  onEdit,
}) {
  const filteredOffers = offers.filter((offer) => {
    // Search filter (from main search bar)
    if (
      searchQuery &&
      !offer.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter (from FilterBar)
    if (
      filters.category &&
      !offer.selectedCategories?.includes(filters.category)
    ) {
      return false;
    }

    // Status filter (from FilterBar)
    if (filters.status && offer.status !== filters.status) {
      return false;
    }

    // Date range filter (from FilterBar)
    if (filters.dateRange.start) {
      const filterStart = new Date(filters.dateRange.start);
      const offerEnd = new Date(offer.endDate);
      if (offerEnd < filterStart) return false;
    }
    if (filters.dateRange.end) {
      const filterEnd = new Date(filters.dateRange.end);
      const offerStart = new Date(offer.startDate);
      if (offerStart > filterEnd) return false;
    }

    return true;
  });

  const getMerchantBadges = (offer) => {
    if (offer.merchantTarget === "All Merchants") {
      return ["All Merchants"];
    } else if (
      offer.selectedCategories &&
      offer.selectedCategories.length > 0
    ) {
      return offer.selectedCategories;
    } else if (offer.selectedMerchants && offer.selectedMerchants.length > 0) {
      return offer.selectedMerchants.map((id) => `Vendor #${id}`);
    }
    return [];
  };

  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      {" "}
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-xl font-semibold text-slate-900">
          Existing Offers ({filteredOffers.length})
        </h3>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left font-medium text-slate-700 min-w-[80px]">
                Banner
              </th>
              <th className="px-6 py-4 text-left font-medium text-slate-700 min-w-[200px]">
                Offer Title
              </th>
              <th className="px-6 py-4 text-left font-medium text-slate-700 min-w-[150px]">
                Assigned Merchants
              </th>
              <th className="px-6 py-4 text-left font-medium text-slate-700 min-w-[150px]">
                Validity
              </th>
              <th className="px-6 py-4 text-left font-medium text-slate-700 min-w-[100px]">
                Status
              </th>
              <th className="px-6 py-4 text-left font-medium text-slate-700 min-w-[100px]">
                Created On
              </th>
              <th className="px-6 py-4 text-left font-medium text-slate-700 min-w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-500 text-base"
                >
                  No offers found matching your criteria. Try adjusting the
                  filters or search query.
                </td>
              </tr>
            ) : (
              filteredOffers.map((offer, index) => (
                <tr
                  key={offer.id}
                  className={`border-b border-slate-100 transition-colors ${
                    index % 2 === 0
                      ? "bg-white hover:bg-slate-50"
                      : "bg-slate-50/50 hover:bg-slate-100"
                  }`}
                >
                  {/* Banner Thumbnail */}
                  <td className="px-6 py-4">
                    <img
                      src={offer.bannerUrl}
                      alt={offer.title}
                      className="w-16 h-10 object-cover rounded-md border border-slate-200"
                    />
                  </td>

                  {/* Title */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {offer.title}
                    </p>
                    <p className="text-slate-500 mt-0.5 line-clamp-1 text-xs">
                      {offer.description}
                    </p>
                  </td>

                  {/* Assigned Merchants */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {getMerchantBadges(offer)
                        .slice(0, 2)
                        .map((badge, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full border border-green-200 font-medium"
                          >
                            {badge}
                          </span>
                        ))}
                      {getMerchantBadges(offer).length > 2 && (
                        <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full border border-slate-200 font-medium">
                          +{getMerchantBadges(offer).length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Validity */}
                  <td className="px-6 py-4 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="font-medium">
                          {formatDate(offer.startDate)}
                        </div>
                        <div className="text-slate-400">
                          → {formatDate(offer.endDate)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 text-xs rounded-full border font-semibold ${
                        statusColors[offer.status]
                      }`}
                    >
                      {offer.status}
                    </span>
                  </td>

                  {/* Created On */}
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {formatDate(offer.createdOn)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onViewDetails(offer)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(offer)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this offer?"
                            )
                          ) {
                            onDelete(offer.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =================================================================
// MAIN APP COMPONENT
// =================================================================

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [offers, setOffers] = useState(mockOffers);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const formRef = useRef(null);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    dateRange: { start: "", end: "" },
    searchText: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    merchantTarget: "All Merchants",
    selectedMerchants: [],
    selectedCategories: [],
    startDate: "",
    endDate: "",
    bannerUrl: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState(null);

  // Scroll to form when it opens
  useEffect(() => {
    if (showCreateForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showCreateForm]);

  const handleViewDetails = (offer) => {
    setSelectedOffer(offer);
    setIsPanelOpen(true);
  };

  const handleDeleteOffer = (offerId) => {
    setOffers(offers.filter((o) => o.id !== offerId));
    if (selectedOffer?.id === offerId) {
      setIsPanelOpen(false);
    }
    console.log("Offer deleted successfully"); // Replaced toast.success
  };

  const handleEditOffer = (offer) => {
    setFormData({
      title: offer.title,
      description: offer.description,
      merchantTarget: offer.merchantTarget,
      selectedMerchants: offer.selectedMerchants || [],
      selectedCategories: offer.selectedCategories || [],
      startDate: offer.startDate,
      endDate: offer.endDate,
      bannerUrl: offer.bannerUrl,
    });

    setIsEditing(true);
    setEditingOfferId(offer.id);

    setShowCreateForm(true);
    setIsPanelOpen(false);
  };
  const handleCreateOffer = () => {
    // Validation
    if (!formData.title.trim()) {
      alert("Please enter an offer title");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter an offer description");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      alert("Please select start and end dates");
      return;
    }
    if (!formData.bannerUrl) {
      alert("Please upload a banner image");
      return;
    }

    // Determine status
    const today = new Date();
    const start = new Date(formData.startDate + "T00:00:00Z");
    const end = new Date(formData.endDate + "T23:59:59Z");

    let status;
    if (today >= start && today <= end) {
      status = "Active";
    } else if (today < start) {
      status = "Upcoming";
    } else {
      status = "Expired";
    }

    // ================================
    // EDIT MODE (UPDATE OFFER)
    // ================================
    if (isEditing) {
      setOffers(
        offers.map((o) =>
          o.id === editingOfferId
            ? {
                ...o,
                title: formData.title,
                description: formData.description,
                bannerUrl: formData.bannerUrl,
                startDate: formData.startDate,
                endDate: formData.endDate,
                merchantTarget: formData.merchantTarget,
                selectedMerchants: formData.selectedMerchants,
                selectedCategories: formData.selectedCategories,
                status,
              }
            : o
        )
      );

      console.log("Offer updated successfully!");
    } else {
      // ================================
      // CREATE MODE (NEW OFFER)
      // ================================
      const newOffer = {
        id: String(Date.now()),
        title: formData.title,
        description: formData.description,
        bannerUrl: formData.bannerUrl,
        startDate: formData.startDate,
        endDate: formData.endDate,
        merchantTarget: formData.merchantTarget,
        selectedMerchants: formData.selectedMerchants,
        selectedCategories: formData.selectedCategories,
        status,
        createdOn: new Date().toISOString().split("T")[0],
      };

      setOffers([newOffer, ...offers]);
      console.log("Offer created successfully!");
    }

    // ================================
    // RESET & CLOSE FORM
    // ================================
    setIsEditing(false);
    setEditingOfferId(null);
    setShowCreateForm(false);

    setFormData({
      title: "",
      description: "",
      merchantTarget: "All Merchants",
      selectedMerchants: [],
      selectedCategories: [],
      startDate: "",
      endDate: "",
      bannerUrl: "",
    });
  };

  const handleCancelForm = () => {
    setFormData({
      title: "",
      description: "",
      merchantTarget: "All Merchants",
      selectedMerchants: [],
      selectedCategories: [],
      startDate: "",
      endDate: "",
      bannerUrl: "",
    });

    setIsEditing(false);
    setEditingOfferId(null);
    setShowCreateForm(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 w-full">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* LEFT — Title + Subtitle */}
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Merchant Offer Management
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Create and manage promotional offers for your merchants
              </p>
            </div>

            {/* RIGHT — Search + Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto justify-end">
              {/* MOBILE SEARCH BAR (VISIBLE ONLY ON MOBILE) */}
              <div className="relative w-full sm:hidden order-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* DESKTOP SEARCH BAR */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-64 md:w-80 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* CREATE OFFER BUTTON */}
              <button
                onClick={() => {
                  if (!showCreateForm) {
                    // Reset form (Blank for create)
                    setFormData({
                      title: "",
                      description: "",
                      merchantTarget: "All Merchants",
                      selectedMerchants: [],
                      selectedCategories: [],
                      startDate: "",
                      endDate: "",
                      bannerUrl: "",
                    });

                    setIsEditing(false);
                    setEditingOfferId(null);
                  }
                  setShowCreateForm((prev) => !prev);
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap w-full sm:w-auto order-3 sm:order-none"
              >
                <Plus className="w-5 h-5" />
                  <span>
                    {showCreateForm
                      ? isEditing
                        ? "Cancel Editing"
                        : "Hide Form"
                      : "Create New Offer"}
                  </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
        {/* Create Offer Section */}
        {showCreateForm && (
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-300"
            ref={formRef}
          >
            {/* Left Side - Form */}
            <OfferForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateOffer}
              onCancel={handleCancelForm}
              isEditing={isEditing}
            />

            {/* Right Side - Preview */}
            <OfferPreview formData={formData} />
          </div>
        )}

        {/* Filters */}
        <FilterBar filters={filters} setFilters={setFilters} />

        <OffersCardView
          offers={offers}
          searchQuery={searchQuery}
          filters={filters}
          onViewDetails={handleViewDetails}
          onDelete={handleDeleteOffer}
          onEdit={handleEditOffer}
        />

        {/* Offers Table */}
        <OffersTable
          offers={offers}
          searchQuery={searchQuery}
          filters={filters}
          onViewDetails={handleViewDetails}
          onDelete={handleDeleteOffer}
          onEdit={handleEditOffer}
        />
      </div>

      {/* Offer Details Panel */}
      <OfferDetailsPanel
        offer={selectedOffer}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onDelete={handleDeleteOffer}
        onEdit={handleEditOffer}
      />
    </div>
  );
}
