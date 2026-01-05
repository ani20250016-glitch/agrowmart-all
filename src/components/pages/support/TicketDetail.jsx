import { useParams, useNavigate } from "react-router-dom";
import { ticketsData, statusConfig, priorityColors } from "./TicketsSupport";
import { User, Paperclip, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ticket = ticketsData.find((t) => t.id === parseInt(id));
  const [replyText, setReplyText] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [status, setStatus] = useState(ticket?.status);
  const [messages, setMessages] = useState(() => {
    const replies = Array.isArray(ticket?.replies) ? ticket.replies : [];
    return [
      {
        sender: ticket?.user,
        text: ticket?.message || "Initial ticket message",
        date: ticket?.date,
        file: ticket?.file || null,
        isUser: true,
      },
      ...replies,
    ];
  });

  const fileInputRef = useRef(null);

  if (!ticket) return <p>Ticket not found</p>;

  /* ===================== HANDLERS ===================== */
  const handleAttachClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return alert("Please type a reply");

    const newReply = {
      sender: "Support Agent",
      text: replyText,
      date: new Date().toLocaleString(),
      file: attachedFile?.name || null,
      isUser: false,
    };

    // Update messages locally
    setMessages((prev) => [...prev, newReply]);

    // Update ticket data (mock persistence)
    const ticketIndex = ticketsData.findIndex((t) => t.id === ticket.id);
    if (ticketIndex !== -1) {
      if (!ticketsData[ticketIndex].replies)
        ticketsData[ticketIndex].replies = [];
      ticketsData[ticketIndex].replies.push(newReply);
    }

    setReplyText("");
    setAttachedFile(null);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);

    const ticketIndex = ticketsData.findIndex((t) => t.id === ticket.id);
    if (ticketIndex !== -1) {
      ticketsData[ticketIndex].status = newStatus;
    }

    alert(`Ticket status changed to ${newStatus}`);
  };

  const handleDeleteReply = (index) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  /* ===================== UI ===================== */
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 mb-4 hover:text-black transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <h2 className="text-xl font-semibold">
        {ticket.ticketId} - {ticket.subject}
      </h2>

      <div className="flex flex-wrap gap-2">
        <span
          className={`px-2 py-1 rounded-full ${
            statusConfig[status]?.color || "bg-gray-300"
          }`}
        >
          {status}
        </span>
        <span
          className={`px-2 py-1 rounded-full ${
            priorityColors[ticket.priority]
          }`}
        >
          {ticket.priority} priority
        </span>
      </div>

      {/* Ticket Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 rounded border">
        <div>
          <p className="text-xs text-gray-600">User</p>
          <p>
            {ticket.user} ({ticket.userType})
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Category</p>
          <p>{ticket.category}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Created</p>
          <p>{ticket.date}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Assigned To</p>
          <p>Support Team</p>
        </div>
      </div>

      {/* Conversation */}
      <div className="space-y-4">
        <h4 className="font-semibold">Conversation</h4>

        {messages.map((msg, index) => (
          <div key={index} className="flex gap-3">
            <div
              className={`w-10 h-10 rounded-full flex justify-center items-center ${
                msg.isUser ? "bg-blue-500" : "bg-green-500"
              }`}
            >
              <User className="text-white" />
            </div>

            <div className="flex-1 relative">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div>
                  <p className="font-medium">{msg.sender}</p>
                  <p className="text-sm mt-1">{msg.text}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {msg.date}
                  </span>
                </div>

                {msg.file && (
                  <div className="flex gap-2 mt-2 text-xs text-gray-600">
                    <Paperclip className="w-4 h-4" />
                    <a href={`/${msg.file}`} download className="underline">
                      {msg.file}
                    </a>
                  </div>
                )}
              </div>

              {!msg.isUser && (
                <button
                  onClick={() => handleDeleteReply(index)}
                  className="absolute top-2 right-2 text-red-600 text-sm bg-red-100 hover:bg-red-200 p-1 rounded transition"
                  title="Delete reply"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      <div className="border-t pt-6 space-y-3">
        <h4 className="font-semibold">Reply to Ticket</h4>

        <textarea
          rows={4}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply..."
          className="w-full px-4 py-2 border rounded-lg text-sm"
        />

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex justify-between flex-wrap gap-3">
          <button
            onClick={handleAttachClick}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
          >
            <Paperclip className="w-4 h-4" /> Attach File
          </button>

          <button
            onClick={handleSendReply}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
          >
            Send Reply
          </button>
        </div>

        {attachedFile && (
          <p className="text-xs text-gray-600">Attached: {attachedFile.name}</p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t pt-4 flex gap-3 flex-wrap">
        <button
          onClick={() => handleStatusChange("Resolved")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm"
        >
          Mark as Resolved
        </button>

        <button
          onClick={() => handleStatusChange("Closed")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
        >
          Close Ticket
        </button>
      </div>
    </div>
  );
}
