import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shops, reviewsData } from "../../../data";
import {
  FiEyeOff,
  FiEdit,
  FiTrash2,
  FiMessageSquare,
  FiCheckCircle,
  FiSmile,
  FiFrown,
  FiMeh,
  FiCalendar,
  FiArrowLeft,
  FiX,
} from "react-icons/fi";

// --- Components ---
const ReplyModal = ({ isOpen, onClose, onSubmit, customerName }) => {
  const [msg, setMsg] = useState("");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-scale-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Reply to {customerName}
          </h3>
          <button onClick={onClose}>
            <FiX className="text-gray-500 hover:text-red-500" />
          </button>
        </div>
        <textarea
          className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none h-32 resize-none"
          placeholder="Type your professional response here..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(msg);
              setMsg("");
            }}
            disabled={!msg.trim()}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shopId = parseInt(id);
  const shop = shops.find((s) => s.id === shopId);

  // Initial Data Setup
  const [reviews, setReviews] = useState(
    reviewsData
      .filter((r) => r.shopId === shopId)
      .map((r) => ({
        ...r,
        sentiment:
          r.rating >= 4 ? "positive" : r.rating <= 2 ? "negative" : "neutral",
      }))
  );

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [page, setPage] = useState(1);

  // Modal State
  const [replyModal, setReplyModal] = useState({
    open: false,
    id: null,
    name: "",
  });

  const itemsPerPage = 10;

  if (!shop) return <div className="p-6">Shop not found</div>;

  // --- Sentiment Analytics ---
  const sentimentStats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { pos: 0, neu: 0, neg: 0 };
    return {
      pos: Math.round(
        (reviews.filter((r) => r.sentiment === "positive").length / total) * 100
      ),
      neu: Math.round(
        (reviews.filter((r) => r.sentiment === "neutral").length / total) * 100
      ),
      neg: Math.round(
        (reviews.filter((r) => r.sentiment === "negative").length / total) * 100
      ),
    };
  }, [reviews]);

  // --- Filtering Logic ---
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        r.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.review.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating =
        filterRating === "all" || r.rating === parseInt(filterRating);
      const matchesSentiment =
        filterSentiment === "all" || r.sentiment === filterSentiment;
      return matchesSearch && matchesRating && matchesSentiment;
    });
  }, [reviews, searchTerm, filterRating, filterSentiment]);

  // --- Actions ---
  const handleReplySubmit = (message) => {
    // Here you would typically call your backend API
    console.log(`Replying to review ${replyModal.id} with: ${message}`);
    setReplyModal({ open: false, id: null, name: "" });
    alert("Reply sent successfully! (Mock Action)");
  };

  const openReplyModal = (id, name) => {
    setReplyModal({ open: true, id, name });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const visibleIds = filteredReviews
        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
        .map((r) => r.id);
      setSelectedReviews(visibleIds);
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this review permanently?")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const starRating = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

  // Badge Helper
  const getSentimentBadge = (type) => {
    switch (type) {
      case "positive":
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
            <FiSmile /> Positive
          </span>
        );
      case "negative":
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full">
            <FiFrown /> Negative
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
            <FiMeh /> Neutral
          </span>
        );
    }
  };

  return (
    <div className="p-6 md:p-8 bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full shadow hover:bg-gray-50 text-gray-600"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Reviews for {shop.name}
          </h1>
          <p className="text-sm text-gray-500">
            Managing {reviews.length} total reviews
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-green-500">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm font-semibold uppercase">
              Positive
            </span>
            <FiSmile className="text-green-500 text-xl" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-700">
            {sentimentStats.pos}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${sentimentStats.pos}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-gray-400">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm font-semibold uppercase">
              Neutral
            </span>
            <FiMeh className="text-gray-500 text-xl" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-700">
            {sentimentStats.neu}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-gray-400 h-1.5 rounded-full"
              style={{ width: `${sentimentStats.neu}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-red-500">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm font-semibold uppercase">
              Negative
            </span>
            <FiFrown className="text-red-500 text-xl" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-700">
            {sentimentStats.neg}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-red-500 h-1.5 rounded-full"
              style={{ width: `${sentimentStats.neg}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Search Keywords
            </label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Sentiment
            </label>
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="all">All</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Rating
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div className="w-full md:w-1/4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterRating("all");
                setFilterSentiment("all");
              }}
              className="text-sm text-blue-600 hover:underline mb-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-4 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  className="rounded text-green-600 focus:ring-green-500"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                Sentiment
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                Review
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedReviews.map((r) => (
              <tr
                key={r.id}
                className={`group hover:bg-gray-50 transition ${
                  selectedReviews.includes(r.id) ? "bg-green-50" : ""
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedReviews.includes(r.id)}
                    onChange={() => handleSelectOne(r.id)}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                </td>
                <td className="px-6 py-4">{getSentimentBadge(r.sentiment)}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-800">
                    {r.customer}
                  </div>
                  <div className="text-xs text-gray-500">{r.product}</div>
                  <div className="text-xs text-yellow-500 mt-1">
                    {starRating(r.rating)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {r.review}
                  </p>
                  <span className="text-xs text-gray-400 mt-1">{r.date}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openReplyModal(r.id, r.customer)}
                      className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition"
                      title="Reply"
                    >
                      <FiMessageSquare />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedReviews.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 gap-2 text-sm pb-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded bg-white border hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-500">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded bg-white border hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Floating Action Bar (Bulk) */}
      {selectedReviews.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 animate-bounce-slight">
          <span>{selectedReviews.length} selected</span>
          <button className="text-red-400 font-bold hover:text-red-300">
            Delete All
          </button>
        </div>
      )}

      {/* Reply Modal Component */}
      <ReplyModal
        isOpen={replyModal.open}
        customerName={replyModal.name}
        onClose={() => setReplyModal({ open: false, id: null, name: "" })}
        onSubmit={handleReplySubmit}
      />
    </div>
  );
}
