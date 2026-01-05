// import { X } from "lucide-react";

// export function ContentPreviewModal({ content, onClose, onEdit, onDelete }) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative">
//         <button
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//           onClick={onClose}
//         >
//           <X size={20} />
//         </button>

//         <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
//         {content.sub && <p className="text-gray-600 mb-3">{content.sub}</p>}
//         {content.content && <p className="mb-3">{content.content}</p>}

//         {content.image && content.mediaType === "Image" && (
//           <img src={content.preview} alt={content.title} className="w-full h-auto mb-3 rounded" />
//         )}
//         {content.image && content.mediaType === "Video" && (
//           <video src={content.preview} controls className="w-full h-auto mb-3 rounded" />
//         )}

//         <div className="flex justify-end gap-3 mt-4">
//           <button
//             onClick={() => onEdit(content)}
//             className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => {
//               onDelete(content.id);
//               onClose();
//             }}
//             className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { X, Edit, Trash2 } from "lucide-react";

export default function ContentPreviewModal({ content, onClose, onEdit, onDelete }) {
  const renderContent = () => {
    switch (content.type) {
      case "banner":
        return (
          <>
            {content.preview && (
              <img
                src={content.preview}
                alt={content.title}
                className="w-100 h-auto object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
            {content.subtitle && <p className="text-gray-600 mb-2">{content.subtitle}</p>}
            {content.status && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  content.status === "Published"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {content.status}
              </span>
            )}
          </>
        );

      case "blog":
        return (
          <>
            {content.preview && (
              <img
                src={content.preview}
                alt={content.title}
                className="w-100 h-auto object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
            {content.content && <p className="mb-2">{content.content}</p>}
          </>
        );

      case "media":
        return (
          <>
            {content.mediaType === "Image" && content.preview && (
              <img
                src={content.preview}
                alt={content.title}
                className="w-200 h-auto object-cover rounded mb-4"
              />
            )}
            {content.mediaType === "Video" && content.preview && (
              <video
                src={content.preview}
                controls
                className="w-200 h-auto object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
            <p className="text-gray-500">{content.mediaType}</p>
          </>
        );

      case "page":
        return (
          <>
            <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
            {content.content && <p className="mb-2">{content.content}</p>}
          </>
        );

      default:
        return <p>No content to display</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="mt-5 space-y-4">{renderContent()}</div>

        {/* <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => onEdit(content)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-1"
          >
            <Edit size={16} /> Edit
          </button>
          <button
            onClick={() => {
              onDelete(content.id);
              onClose();
            }}
            className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center gap-1"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div> */}
      </div>
    </div>
  );
}
