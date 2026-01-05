import { X } from "lucide-react";
import { useState } from "react";

/* ===================== BANNER FORM ===================== */
// function BannerForm({ onSubmit }) {
//   const [form, setForm] = useState({
//     title: "",
//     subtitle: "",
//     status: "Published",
//     image: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setForm({ ...form, [name]: files ? files[0] : value });
//   };

//   const handleSubmit = () => {
//     onSubmit({ type: "banner", ...form });
//   };

//   return (
//     <div className="flex flex-col space-y-3">
//       <input name="title" placeholder="Banner Title" onChange={handleChange} className="input border border-gray-300 p-2 rounded-md placeholder:text-gray-400" />
//       <input name="subtitle" placeholder="Subtitle" onChange={handleChange} className="input border border-gray-300 p-2 rounded-md placeholder:text-gray-400" />
//       <input type="file" name="image" onChange={handleChange} className="input border border-gray-300 p-2 rounded-md placeholder:text-gray-400" />
//       <select name="status" onChange={handleChange} className="input border border-gray-300 p-2 rounded-md placeholder:text-gray-400">
//         <option>Published</option>
//         <option>Draft</option>
//       </select>
//       <button onClick={handleSubmit} className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 placeholder:text-gray-400">
//         Save Banner
//       </button>
//     </div>
//   );
// }

function BannerForm({ onSubmit, editData }) {
  const [form, setForm] = useState({
    title: editData?.title || "",
    subtitle: editData?.subtitle || "",
    description: editData?.description || "",
    status: editData?.status || "Published",
    image: null,
    preview:
      editData?.image instanceof File
        ? URL.createObjectURL(editData.image)
        : editData?.image || "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* Text inputs */}
      <input
        name="title"
        value={form.title}
        placeholder="Banner Title"
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded-md text-gray-800 placeholder:text-gray-400"
      />

      <input
        name="subtitle"
        value={form.subtitle}
        placeholder="Subtitle"
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded-md text-gray-800 placeholder:text-gray-400"
      />

      <textarea
        name="description"
        value={form.description}
        placeholder="Banner Description"
        onChange={handleChange}
        rows={3}
        className="border border-gray-300 p-2 rounded-md text-gray-800 placeholder:text-gray-400"
      />

      <label className="border border-gray-300 p-2 rounded-md text-gray-400 cursor-pointer">
        {form.image ? form.image.name : "Choose Banner Image"}
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {/* Select */}
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded-md text-gray-800"
      >
        <option value="Published">Published</option>
        <option value="Draft">Draft</option>
      </select>

      {form.preview && (
        <img
          src={form.preview}
          alt="Blog Preview"
          className="h-32 object-cover rounded-md border"
        />
      )}

      {/* Button */}
      <button
        onClick={() => onSubmit({ type: "banner", ...form })}
        className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
      >
        {editData ? "Update Banner" : "Save Banner"}{" "}
      </button>
    </div>
  );
}

/* ===================== BLOG FORM ===================== */
// function BlogForm({ onSubmit }) {
//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//     image: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setForm({ ...form, [name]: files ? files[0] : value });
//   };

//   return (
//     <div className="flex flex-col space-y-3">
//       <input name="title" placeholder="Blog Title" onChange={handleChange} className="input border p-2 rounded-md border border-gray-300" />
//       <textarea name="content" placeholder="Content" onChange={handleChange} className="input h-24 border p-2 rounded-md border border-gray-300" />
//       <label className="border border-gray-300 p-2 rounded-md text-gray-400 cursor-pointer">
//         {form.image ? form.image.name : "Choose Banner Image"}
//         <input
//           type="file"
//           name="image"
//           onChange={handleChange}
//           className="hidden"
//         />
//       </label>
//       <button
//         onClick={() => onSubmit({ type: "blog", ...form })}
//         className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
//       >
//         Publish Blog
//       </button>
//     </div>
//   );
// }

function BlogForm({ onSubmit, editData }) {
  const [form, setForm] = useState({
    title: editData?.title || "",
    content: editData?.content || "",
    image: null,
    preview:
      editData?.image instanceof File
        ? URL.createObjectURL(editData.image)
        : editData?.image || "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file), // preview selected image
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!form.title || !form.content) {
      alert("Please fill in all fields");
      return;
    }

    onSubmit({
      type: "blog",
      ...form,
      id: editData?.id || Date.now(), // preserve ID if editing
    });
  };

  return (
    <div className="flex flex-col space-y-3">
      <input
        name="title"
        value={form.title}
        placeholder="Blog Title"
        onChange={handleChange}
        className="input border p-2 rounded-md border-gray-300"
      />

      <textarea
        name="content"
        value={form.content}
        placeholder="Content"
        onChange={handleChange}
        className="input h-24 border p-2 rounded-md border-gray-300"
      />

      <label className="border border-gray-300 p-2 rounded-md text-gray-400 cursor-pointer">
        {form.image ? form.image.name : "Choose Blog Image"}
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {/* Preview of selected or existing image */}
      {form.preview && (
        <img
          src={form.preview}
          alt="Blog Preview"
          className="h-32 object-cover rounded-md border"
        />
      )}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
      >
        {editData ? "Update Blog" : "Publish Blog"}
      </button>
    </div>
  );
}

/* ===================== MEDIA FORM ===================== */
// function MediaForm({ onSubmit , editData}) {
//   const [form, setForm] = useState({
//     title:editData?.title || "",
//     mediaType:editData?.mediaType || "Image",
//     file: editData?.file || null,
//     preview:
//      editData?.image instanceof File
//     ? URL.createObjectURL(editData.image)
//     : editData?.image || "",
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (files) {
//       const file = files[0];
//       setForm({
//         ...form,
//         file,
//         preview: URL.createObjectURL(file), // ✅ important
//       });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = () => {
//     if (!form.file) return;

//     onSubmit({
//       id: Date.now(),
//       type: "media",
//       title: form.title,
//       mediaType: form.mediaType,
//       file: form.file,
//       preview: form.preview,
//     });
//   };

//   return (
//     <div className="flex flex-col space-y-3">
//       <input name="title" placeholder="Media Title" onChange={handleChange} className="input border p-2 rounded-md border border-gray-300" />
//       <label className="border border-gray-300 p-2 rounded-md text-gray-400 cursor-pointer">
//         {form.image ? form.image.name : "Choose Banner Image"}
//         <input
//           type="file"
//           name="image"
//           onChange={handleChange}
//           className="hidden"
//         />
//       </label>
//       <select name="mediaType" value={form.mediaType} onChange={handleChange} className="input border p-2 rounded-md border border-gray-300">
//         <option>Image</option>
//         <option>Video</option>
//       </select>

//       {form.preview && (
//         <div className="border rounded-md p-2">
//           {form.mediaType === "Image" ? (
//             <img
//               src={form.preview}
//               alt="preview"
//               className="h-32 object-cover rounded"
//             />
//           ) : (
//             <video
//               src={form.preview}
//               controls
//               className="h-32 rounded"
//             />
//           )}
//         </div>
//       )}

//       <button
//         onClick={() => onSubmit({ type: "media", ...form })}
//         className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
//       >
//         Upload Media
//       </button>
//     </div>
//   );
// }

function MediaForm({ onSubmit, editData }) {
  const [form, setForm] = useState({
    title: editData?.title || "",
    mediaType: editData?.mediaType || "Image",
    file: null,
    preview:
      editData?.preview ||
      (editData?.file instanceof File
        ? URL.createObjectURL(editData.file)
        : ""),
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        file,
        preview: URL.createObjectURL(file),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!form.title || (!form.file && !form.preview)) {
      alert("Please fill all fields");
      return;
    }

    onSubmit({
      type: "media",
      title: form.title,
      mediaType: form.mediaType,
      file: form.file,
      preview: form.preview,
    });
  };

  return (
    <div className="flex flex-col space-y-3">
      <input
        name="title"
        value={form.title}
        placeholder="Media Title"
        onChange={handleChange}
        className="border p-2 rounded-md"
      />

      <select
        name="mediaType"
        value={form.mediaType}
        onChange={handleChange}
        className="border p-2 rounded-md"
      >
        <option>Image</option>
        <option>Video</option>
      </select>

      <label className="border p-2 rounded-md cursor-pointer text-gray-400">
        Choose Media
        <input type="file" onChange={handleChange} className="hidden" />
      </label>

      {form.preview &&
        (form.mediaType === "Image" ? (
          <img src={form.preview} className="h-32 rounded object-cover" />
        ) : (
          <video src={form.preview} controls className="h-32 rounded" />
        ))}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white py-2 rounded-md"
      >
        {editData ? "Update Media" : "Upload Media"}
      </button>
    </div>
  );
}

/* ===================== PAGE FORM ===================== */
// function PageForm({ onSubmit }) {
//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//   });

//   return (
//     <div className="flex flex-col space-y-3">
//       <input
//         placeholder="Page Title"
//         onChange={(e) => setForm({ ...form, title: e.target.value })}
//         className="input border p-2 rounded-md border border-gray-300"
//       />
//       <textarea
//         placeholder="Page Content"
//         onChange={(e) => setForm({ ...form, content: e.target.value })}
//         className="input h-28 border p-2 rounded-md border border-gray-300"
//       />
//       <button
//         onClick={() => onSubmit({ type: "page", ...form })}
//         className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
//       >
//         Save Page
//       </button>
//     </div>
//   );
// }

function PageForm({ onSubmit, editData }) {
  const [form, setForm] = useState({
    title: editData?.title || "",
    content: editData?.content || "",
  });

  const handleSubmit = () => {
    if (!form.title || !form.content) {
      alert("Please fill all fields");
      return;
    }

    onSubmit({
      type: "page",
      ...form,
    });
  };

  return (
    <div className="flex flex-col space-y-3">
      <input
        value={form.title}
        placeholder="Page Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border p-2 rounded-md"
      />

      <textarea
        value={form.content}
        placeholder="Page Content"
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        className="border p-2 h-28 rounded-md"
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white py-2 rounded-md"
      >
        {editData ? "Update Page" : "Save Page"}
      </button>
    </div>
  );
}

/* ===================== MAIN MODAL ===================== */

export default function AddContentModal({ onClose, onSave, editData }) {
  const [type, setType] = useState(editData?.type || "");

  const handleSubmit = (data) => {
    console.log("SUBMITTED DATA 👉", data);
    onSave({
      ...data,
      id: editData?.id || Date.now(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-4 md:p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editData ? "Edit Content" : "Add New Content"}
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        {!editData && (
          <>
            <label className="text-sm font-medium">Select Content Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
            >
              <option value="">-- Select --</option>
              <option value="banner">Banner</option>
              <option value="blog">Blog / News</option>
              <option value="media">Media Gallery</option>
              <option value="page">Page</option>
            </select>
          </>
        )}

        <div className="mt-4">
          {type === "banner" && (
            <BannerForm onSubmit={handleSubmit} editData={editData} />
          )}
          {type === "blog" && (
            <BlogForm onSubmit={handleSubmit} editData={editData} />
          )}
          {type === "media" && (
            <MediaForm onSubmit={handleSubmit} editData={editData} />
          )}
          {type === "page" && (
            <PageForm onSubmit={handleSubmit} editData={editData} />
          )}
        </div>
      </div>
    </div>
  );
}
