// import { X } from "lucide-react";
// import { useEffect } from "react";

// function MediaPreviewModal({ media, onClose }) {
//   if (!media) return null;

//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
//       <div className="relative bg-white rounded-lg max-w-4xl w-full p-3">
//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
//         >
//           <X />
//         </button>

//         {/* Media */}
//         <div className="flex justify-center">
//           {media.mediaType === "Image" ? (
//             <img
//               src={media.preview}
//               alt={media.title}
//               className="max-h-[80vh] w-auto rounded"
//             />
//           ) : (
//             <video
//               src={media.preview}
//               controls
//               autoPlay
//               className="max-h-[80vh] w-full rounded"
//             />
//           )}
//         </div>

//         {/* Title */}
//         <p className="text-center mt-3 font-medium">
//           {media.title}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default MediaPreviewModal;


import { X } from "lucide-react";
import { useEffect } from "react";

function MediaPreviewModal({ media, onClose }) {
  if (!media) return null;

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg max-w-4xl w-full p-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
        >
          <X />
        </button>

        {/* Media */}
        <div className="flex justify-center">
          {media.mediaType === "Image" ? (
            <img
              src={media.preview}
              alt={media.title}
              className="max-h-[80vh] w-full object-contain rounded bg-black"
            />
          ) : (
            <video
              src={media.preview}
              controls
              autoPlay
              className="max-h-[80vh] w-full aspect-video object-contain rounded bg-black"
            />
          )}
        </div>

        {/* Title */}
        <p className="text-center mt-3 font-medium">{media.title}</p>
      </div>
    </div>
  );
}

export default MediaPreviewModal;
