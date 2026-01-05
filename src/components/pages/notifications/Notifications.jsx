import React, { useState } from "react";
import { Eye, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [schedule, setSchedule] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sendTo, setSendTo] = useState("All Users");
  const [scheduleDate, setScheduleDate] = useState("");

  const [templates, setTemplates] = useState([
    {
      title: "Market Rate Update",
      desc: "New mandi rates for {commodity} available",
    },
    {
      title: "Product Approval",
      desc: "Your product {product_name} has been approved",
    },
    { title: "Order Update", desc: "Your order #{order_id} status: {status}" },
    {
      title: "Welcome Message",
      desc: "Welcome to AgroFresh! Start exploring now.",
    },
  ]);

  const [history, setHistory] = useState([
    {
      title: "New Product Launch",
      message: "Check out our latest organic products",
      sentTo: "All Users",
      recipients: "15,234",
      date: "2025-12-02",
      status: "Sent",
    },
  ]);

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setSendTo("All Users");
    setSchedule(false);
    setScheduleDate("");
  };

  const handleSend = () => {
    if (!title || !message) {
      alert("Title and Message are required");
      return;
    }

    const newNotification = {
      title,
      message,
      sentTo: sendTo,
      recipients: Math.floor(Math.random() * 10000),
      date: schedule ? scheduleDate : new Date().toISOString().split("T")[0],
      status: schedule ? "Scheduled" : "Sent",
    };

    setHistory([newNotification, ...history]);
    resetForm();
  };

  const handleSaveTemplate = () => {
    if (!title || !message) {
      alert("Title and Message are required");
      return;
    }

    setTemplates([
      ...templates,
      {
        title,
        desc: message,
      },
    ]);

    resetForm();
  };

  const handleUseTemplate = (template) => {
    setTitle(template.title);
    setMessage(template.desc);
  };

  const handleView = (row) => {
    alert(
      `Title: ${row.title}\nMessage: ${row.message}\nSent To: ${row.sentTo}\nStatus: ${row.status}`
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 space-y-6">
      {location.state?.fromDashboard && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      )}

      <h2 className="text-xl font-semibold">Notifications Management</h2>
      <p className="text-sm text-gray-600">
        Send push notifications via Firebase (FCM)
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Sent", value: "4,678" },
          { label: "This Month", value: "2,345" },
          { label: "Scheduled", value: "8" },
          { label: "Templates", value: "4" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-gray-300 shadow rounded-lg px-4 py-3"
          >
            <p className="text-gray-500 text-xs">{stat.label}</p>
            <p className="font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
      {/* Send Notification */}
      <div className="bg-white shadow rounded-lg p-4 md:p-6 space-y-4">
        <h3 className="font-semibold text-xl">Send New Notification</h3>

        <div>
          <p className="text-sm mb-1 text-black">Title *</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          />
        </div>

        <div>
          <p className="text-sm mb-1 text-black">Message *</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm h-24"
          />
        </div>

        <div>
          <p className="text-sm mb-1 text-black">Send To *</p>
          <select
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          >
            <option>All Users</option>
            <option>Farmers</option>
            <option>Buyers</option>
          </select>
        </div>

        <div>
          <p className="text-sm mb-1 text-black">Image (Optional)</p>
          <input
            type="file"
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={schedule}
            onChange={() => setSchedule(!schedule)}
          />
          <p className="text-xs text-gray-600">Schedule for later</p>
        </div>

        {schedule && (
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="w-full border rounded-md px-2 py-2 text-sm"
          />
        )}

        <div className="flex justify-between gap-3">
          <button
            onClick={handleSaveTemplate}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium"
          >
            Save as Template
          </button>

          <button
            onClick={handleSend}
            className="bg-green-500 text-white px-5 py-2 rounded-md text-sm font-medium"
          >
            Send Now
          </button>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-white shadow rounded-md p-4 md:p-6 space-y-4">
        <h3 className="text-xl font-semibold border-b border-gray-300 pb-4">
          Saved Templates
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-3">
          {templates.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-gray-300 rounded-lg p-3 hover:shadow"
            >
              <p className="text-md font-semibold">{t.title}</p>
              <p className="text-sm text-gray-500">{t.desc}</p>
              <button
                onClick={() => handleUseTemplate(t)}
                className="text-sm text-green-600 mt-2 underline-none hover:underline"
              >
                Use
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Notification History</h3>

        <div className="hidden md:block overflow-hidden rounded-lg">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-100 text-md text-gray-600">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Sent To</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="p-2">{row.title}</td>
                  <td className="p-2">{row.message}</td>
                  <td className="p-2">{row.sentTo}</td>
                  <td className="p-2">{row.date}</td>
                  <td className="p-2 text-green-600">{row.status}</td>
                  <td className="p-2">
                    <Eye
                      size={16}
                      className="cursor-pointer"
                      onClick={() => handleView(row)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile stacked cards */}
        <div className="md:hidden space-y-3">
          {history.map((row, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-3 text-xs"
            >
              <p className="font-semibold">{row.title}</p>
              <p>{row.message}</p>
              <p>
                <span className="font-medium">Sent to:</span> {row.sentTo}
              </p>
              <p>
                <span className="font-medium">Recipients:</span>
                {row.recipients}
              </p>
              <p>
                <span className="font-medium">Date:</span> {row.date}
              </p>
              <p className="text-green-600 font-semibold">{row.status}</p>
              <div className="flex justify-end mt-2">
                <Eye size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
