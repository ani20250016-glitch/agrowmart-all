// src/pages/WebsiteContentManagement.jsx
// Author: Siddheshwar Swami 
// Date: 02/01/2026 - FULL PAGES INTEGRATION

// import React, { useState, useEffect } from "react";
// import {
//   Edit,
//   Trash2,
//   Plus,
//   Image as ImageIcon,
//   Newspaper,
//   Video,
//   Globe,
//   Menu,
//   X,
//   Eye,
//   Upload,
//   FileText,
//   ArrowLeft,
// } from "lucide-react";
// import AddContentModal from "./AddContentModal";
// import MediaPreviewModal from "./MediaPreviewModal";
// import ContentPreviewModal from "./ContentPreviewModal";
// import { useLocation, useNavigate } from "react-router-dom";

// // Banner APIs
// import {
//   getAllBanners,
//   createBanner,
//   updateBanner,
//   deleteBanner,
// } from "../api/bannerApi";

// // Blog APIs
// import {
//   getAllBlogs,
//   createBlog,
//   updateBlog,
//   deleteBlog,
// } from "../api/blogApi";

// // Media APIs
// import {
//   getAllMedia,
//   createMedia,
//   updateMedia,
//   deleteMedia,
// } from "../api/mediaApi";

// // ✅ PAGES APIs - FULLY INTEGRATED
// import {
//   getAllPages,
//   createPage,
//   updatePage,
//   deletePage,
// } from "../api/pageApi";

// export default function WebsiteContentManagement() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const tabs = ["Banners", "Blogs/News", "Media Gallery", "Pages"];
//   const [active, setActive] = useState("Banners");
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [contents, setContents] = useState([]);
//   const [editingContent, setEditingContent] = useState(null);
//   const [previewContent, setPreviewContent] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // ======== LOAD DATA BASED ON ACTIVE TAB ========
//   useEffect(() => {
//     loadContentForTab(active);
//   }, [active]);

//   const loadContentForTab = async (tabName) => {
//     setLoading(true);
//     try {
//       let data = [];
      
//       if (tabName === "Banners") {
//         data = await getAllBanners();
//         data = data.map((b) => ({
//           id: b.id,
//           type: "banner",
//           title: b.title,
//           sub: b.subtitle,
//           description: b.description,
//           imageUrl: b.imageUrl,
//           status: b.published ? "Published" : "Draft",
//           image: null,
//         }));
//       } else if (tabName === "Blogs/News") {
//         data = await getAllBlogs();
//         data = data.map((b) => ({
//           id: b.id,
//           type: "blog",
//           title: b.title,
//           content: b.content,
//           imageUrl: b.imageUrl,
//           status: b.published ? "Published" : "Draft",
//           createdAt: b.createdAt,
//           views: b.views || 0,
//           date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "Just now",
//           image: null,
//         }));
//       } else if (tabName === "Media Gallery") {
//         data = await getAllMedia();
//         data = data.map((m) => ({
//           id: m.id,
//           type: "media",
//           title: m.title,
//           mediaType: m.mediaType,
//           fileUrl: m.fileUrl,
//           fileName: m.fileName,
//           fileSize: m.fileSize,
//           mimeType: m.mimeType,
//           description: m.description,
//           status: m.isActive ? "Active" : "Inactive",
//           createdAt: m.createdAt,
//           date: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "Just now",
//           image: null,
//         }));
//       } else if (tabName === "Pages") {
//         // ✅ FULL PAGES API INTEGRATION
//         data = await getAllPages();
//         data = data.map((p) => ({
//           id: p.id,
//           type: "page",
//           title: p.title,
//           content: p.content,
//           status: "Active",
//           createdAt: p.createdAt,
//           updatedAt: p.updatedAt,
//           date: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "Just now",
//           excerpt: p.content ? (p.content.length > 150 ? p.content.substring(0, 150) + "..." : p.content) : "",
//         }));
//       }
      
//       setContents(data);
//     } catch (err) {
//       console.error(`Failed to load ${tabName}`, err);
//       alert(`Failed to load ${tabName.toLowerCase()} from server`);
//       setContents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingContent(item);
//     setShowAddModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) return;

//     try {
//       if (active === "Banners") {
//         await deleteBanner(id);
//       } else if (active === "Blogs/News") {
//         await deleteBlog(id);
//       } else if (active === "Media Gallery") {
//         await deleteMedia(id);
//       } else if (active === "Pages") {
//         // ✅ PAGES DELETE
//         await deletePage(id);
//       }
//       setContents((prev) => prev.filter((c) => c.id !== id));
//     } catch (err) {
//       console.error("Delete failed", err);
//       alert("Failed to delete item");
//     }
//   };

//   // ======== SAVE (CREATE / UPDATE) ========
//   const handleSaveContent = async (content) => {
//     setLoading(true);
//     try {
//       if (active === "Banners") {
//         const payload = {
//           title: content.title,
//           subtitle: content.sub,
//           description: content.description || "",
//           imageUrl: content.imageUrl,
//           published: content.status === "Published",
//         };

//         if (editingContent && editingContent.id) {
//           const updated = await updateBanner(editingContent.id, payload);
//           setContents((prev) =>
//             prev.map((c) =>
//               c.id === editingContent.id
//                 ? {
//                     ...c,
//                     title: updated.title,
//                     sub: updated.subtitle,
//                     description: updated.description,
//                     imageUrl: updated.imageUrl,
//                     status: updated.published ? "Published" : "Draft",
//                   }
//                 : c
//             )
//           );
//         } else {
//           const created = await createBanner(payload);
//           setContents((prev) => [
//             {
//               id: created.id,
//               type: "banner",
//               title: created.title,
//               sub: created.subtitle,
//               description: created.description,
//               imageUrl: created.imageUrl,
//               status: created.published ? "Published" : "Draft",
//               image: null,
//             },
//             ...prev,
//           ]);
//         }
//       } else if (active === "Blogs/News") {
//         const payload = {
//           title: content.title,
//           content: content.content || "",
//           imageUrl: content.imageUrl || "",
//           published: content.status === "Published",
//         };

//         if (editingContent && editingContent.id) {
//           const updated = await updateBlog(editingContent.id, payload);
//           setContents((prev) =>
//             prev.map((c) =>
//               c.id === editingContent.id
//                 ? {
//                     ...c,
//                     title: updated.title,
//                     content: updated.content,
//                     imageUrl: updated.imageUrl,
//                     status: updated.published ? "Published" : "Draft",
//                     createdAt: updated.createdAt,
//                   }
//                 : c
//             )
//           );
//         } else {
//           const created = await createBlog(payload);
//           setContents((prev) => [
//             {
//               id: created.id,
//               type: "blog",
//               title: created.title,
//               content: created.content,
//               imageUrl: created.imageUrl,
//               status: created.published ? "Published" : "Draft",
//               createdAt: created.createdAt,
//               date: new Date(created.createdAt).toLocaleDateString(),
//               views: 0,
//               image: null,
//             },
//             ...prev,
//           ]);
//         }
//       } else if (active === "Media Gallery") {
//         const payload = {
//           title: content.title,
//           mediaType: content.mediaType || "IMAGE",
//           fileUrl: content.fileUrl,
//           fileName: content.fileName || content.title,
//           fileSize: content.fileSize || 0,
//           mimeType: content.mimeType || "image/jpeg",
//           description: content.description || "",
//           isActive: content.status === "Active",
//         };

//         if (editingContent && editingContent.id) {
//           const updated = await updateMedia(editingContent.id, payload);
//           setContents((prev) =>
//             prev.map((c) =>
//               c.id === editingContent.id
//                 ? {
//                     ...c,
//                     title: updated.title,
//                     mediaType: updated.mediaType,
//                     fileUrl: updated.fileUrl,
//                     fileName: updated.fileName,
//                     fileSize: updated.fileSize,
//                     mimeType: updated.mimeType,
//                     description: updated.description,
//                     status: updated.isActive ? "Active" : "Inactive",
//                   }
//                 : c
//             )
//           );
//         } else {
//           const created = await createMedia(payload);
//           setContents((prev) => [
//             {
//               id: created.id,
//               type: "media",
//               title: created.title,
//               mediaType: created.mediaType,
//               fileUrl: created.fileUrl,
//               fileName: created.fileName,
//               fileSize: created.fileSize,
//               mimeType: created.mimeType,
//               description: created.description,
//               status: created.isActive ? "Active" : "Inactive",
//               createdAt: created.createdAt,
//               date: new Date(created.createdAt).toLocaleDateString(),
//               image: null,
//             },
//             ...prev,
//           ]);
//         }
//       } else if (active === "Pages") {
//         // ✅ FULL PAGES CRUD OPERATIONS
//         const payload = {
//           title: content.title,
//           content: content.content || "",
//         };

//         if (editingContent && editingContent.id) {
//           // UPDATE Page
//           const updated = await updatePage(editingContent.id, payload);
//           setContents((prev) =>
//             prev.map((c) =>
//               c.id === editingContent.id
//                 ? {
//                     ...c,
//                     title: updated.title,
//                     content: updated.content,
//                     updatedAt: updated.updatedAt,
//                     date: new Date(updated.updatedAt).toLocaleDateString(),
//                     excerpt: updated.content ? (updated.content.length > 150 ? updated.content.substring(0, 150) + "..." : updated.content) : "",
//                   }
//                 : c
//             )
//           );
//         } else {
//           // CREATE Page
//           const created = await createPage(payload);
//           setContents((prev) => [
//             {
//               id: created.id,
//               type: "page",
//               title: created.title,
//               content: created.content,
//               status: "Active",
//               createdAt: created.createdAt,
//               updatedAt: created.updatedAt,
//               date: new Date(created.updatedAt).toLocaleDateString(),
//               excerpt: created.content ? (created.content.length > 150 ? created.content.substring(0, 150) + "..." : created.content) : "",
//             },
//             ...prev,
//           ]);
//         }
//       }

//       setEditingContent(null);
//       setShowAddModal(false);
//     } catch (err) {
//       console.error("Save failed", err);
//       alert("Failed to save content. See console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActive(tab);
//     setShowMobileMenu(false);
//   };

//   if (loading) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-lg text-gray-600 animate-pulse">Loading {active}...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 w-full bg-gray-50 min-h-screen">
//       {location.state?.fromDashboard && (
//         <div className="mb-3">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
//           >
//             <ArrowLeft size={18} /> Back
//           </button>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900">Website Content Management</h2>
//           <p className="text-gray-500 text-sm">
//             Manage your website banners, blogs, media gallery, and pages
//           </p>
//         </div>

//         <button
//           onClick={() => {
//             setEditingContent(null);
//             setShowAddModal(true);
//           }}
//           disabled={loading}
//           className="px-4 py-2 bg-green-600 text-white flex items-center gap-1 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
//         >
//           <Plus size={18} /> Add New
//         </button>

//         {showAddModal && (
//           <AddContentModal
//             onClose={() => {
//               setShowAddModal(false);
//               setEditingContent(null);
//             }}
//             onSave={handleSaveContent}
//             editData={editingContent}
//             activeTab={active}
//           />
//         )}
//       </div>

//       {/* Main Card */}
//       <div className="bg-white shadow-lg rounded-xl p-4 md:p-6">
//         {/* Desktop Tabs */}
//         <div className="hidden md:flex gap-8 border-b border-gray-200 pb-4 mb-6 overflow-x-auto">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => handleTabClick(tab)}
//               className={`pb-3 px-1 flex items-center gap-2 whitespace-nowrap transition-all font-medium ${
//                 active === tab
//                   ? "border-b-2 border-green-600 text-green-600"
//                   : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
//               }`}
//             >
//               {tab === "Banners" && <ImageIcon size={20} />}
//               {tab === "Blogs/News" && <Newspaper size={20} />}
//               {tab === "Media Gallery" && <Video size={20} />}
//               {tab === "Pages" && <Globe size={20} />}
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Mobile Tabs */}
//         <div className="md:hidden border-b border-gray-200 pb-4 mb-6 flex justify-between items-center">
//           <div className="text-green-600 font-semibold flex items-center gap-2">
//             {active === "Banners" && <ImageIcon size={20} />}
//             {active === "Blogs/News" && <Newspaper size={20} />}
//             {active === "Media Gallery" && <Video size={20} />}
//             {active === "Pages" && <Globe size={20} />}
//             {active}
//           </div>
//           <button
//             onClick={() => setShowMobileMenu(!showMobileMenu)}
//             className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
//           >
//             {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>

//         {/* Mobile Tab Menu */}
//         {showMobileMenu && (
//           <div className="md:hidden mb-6 p-4 bg-gray-50 rounded-lg border">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => handleTabClick(tab)}
//                 className={`w-full flex items-center gap-3 p-3 rounded-lg text-left mb-2 transition-all ${
//                   active === tab
//                     ? "bg-green-100 text-green-700 border-2 border-green-200"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`}
//               >
//                 {tab === "Banners" && <ImageIcon size={18} />}
//                 {tab === "Blogs/News" && <Newspaper size={18} />}
//                 {tab === "Media Gallery" && <Video size={18} />}
//                 {tab === "Pages" && <Globe size={18} />}
//                 {tab}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Content Tabs */}
//         <div className="space-y-6">
//           {active === "Banners" && (
//             <BannersTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />
//           )}
//           {active === "Blogs/News" && (
//             <BlogsTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />
//           )}
//           {active === "Media Gallery" && (
//             <MediaTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />
//           )}
//           {active === "Pages" && (
//             <PagesTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />
//           )}

//           {previewContent && (
//             <ContentPreviewModal
//               content={previewContent}
//               onClose={() => setPreviewContent(null)}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ALL TAB COMPONENTS WITH FULL PAGES SUPPORT
// function BannersTab({ data, onEdit, onDelete, onPreview }) {
//   if (!data.length) return <EmptyState icon={<ImageIcon size={48} />} title="No banners" subtitle="Click 'Add New' to create your first banner" />;

//   return (
//     <div className="space-y-4">
//       {data.map((item) => (
//         <BannerCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
//       ))}
//     </div>
//   );
// }

// function BlogsTab({ data, onEdit, onDelete, onPreview }) {
//   if (!data.length) return <EmptyState icon={<Newspaper size={48} />} title="No blogs" subtitle="Click 'Add New' to create your first blog post" />;

//   return (
//     <div className="space-y-4">
//       {data.map((item) => (
//         <BlogCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
//       ))}
//     </div>
//   );
// }

// function MediaTab({ data, onEdit, onDelete, onPreview }) {
//   if (!data.length) return <EmptyState icon={<Video size={48} />} title="No media" subtitle="Click 'Add New' to upload your first media file" />;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {data.map((item) => (
//         <MediaCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
//       ))}
//     </div>
//   );
// }

// function PagesTab({ data, onEdit, onDelete, onPreview }) {
//   if (!data.length) return <EmptyState icon={<Globe size={48} />} title="No pages" subtitle="Click 'Add New' to create static pages like About, Contact" />;

//   return (
//     <div className="space-y-4">
//       {data.map((item) => (
//         <PageCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
//       ))}
//     </div>
//   );
// }

// // COMPLETE PageCard COMPONENT
// function PageCard({ item, onEdit, onDelete, onPreview }) {
//   return (
//     <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
//       <div className="flex items-start gap-4">
//         <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
//           <Globe className="w-7 h-7 text-white" />
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 mb-3">
//             <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
//               Static Page
//             </span>
//             <span className="text-xs text-gray-500">
//               {item.date}
//             </span>
//           </div>
//           <h3 className="font-bold text-lg mb-2 truncate pr-2">{item.title}</h3>
//           <div 
//             className="text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed"
//             dangerouslySetInnerHTML={{ __html: item.excerpt || item.content || "No content available" }} 
//           />
//           {item.updatedAt && (
//             <div className="text-xs text-gray-400 mb-2">
//               Last updated: {new Date(item.updatedAt).toLocaleString()}
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
//         <button 
//           onClick={() => onPreview(item)} 
//           className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex-1 justify-center transition-all" 
//           title="Preview Page"
//         >
//           <Eye size={18} />
//         </button>
//         <button 
//           onClick={() => onEdit(item)} 
//           className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg flex-1 justify-center transition-all" 
//           title="Edit Page"
//         >
//           <Edit size={18} />
//         </button>
//         <button 
//           onClick={() => onDelete(item.id)} 
//           className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg flex-1 justify-center transition-all" 
//           title="Delete Page"
//         >
//           <Trash2 size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }

// // Other Card Components (keep existing BannerCard, BlogCard, MediaCard)
// function BannerCard({ item, onEdit, onDelete, onPreview }) {
//   const preview = item.imageUrl;
//   return (
//     <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
//       <div className="flex items-start gap-4">
//         <div className="flex-shrink-0">
//           {preview ? (
//             <img src={preview} alt={item.title} className="w-24 h-16 object-cover rounded-lg" />
//           ) : (
//             <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
//               <ImageIcon className="w-6 h-6 text-gray-400" />
//             </div>
//           )}
//         </div>
//         <div className="flex-1 min-w-0">
//           <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
//           <p className="text-sm text-gray-600 mb-2">{item.sub}</p>
//           {item.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>}
//           <span className={`text-xs px-3 py-1 rounded-full font-medium ${
//             item.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
//           }`}>
//             {item.status}
//           </span>
//         </div>
//       </div>
//       <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
//         <button onClick={() => onPreview(item)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Preview">
//           <Eye size={18} />
//         </button>
//         <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg" title="Edit">
//           <Edit size={18} />
//         </button>
//         <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg" title="Delete">
//           <Trash2 size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }

// function EmptyState({ icon, title, subtitle }) {
//   return (
//     <div className="text-center py-16 px-4">
//       <div className="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
//         {icon}
//       </div>
//       <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
//       <p className="text-gray-500 max-w-md mx-auto">{subtitle}</p>
//     </div>
//   );
// }

// NOTE: Keep your existing BlogCard, MediaCard, ContentPreviewModal, AddContentModal components
// They work perfectly with Pages integration!

// WebsiteContentManagement.jsx - Complete rewrite with FULL Media Gallery integration
// Author: Siddheshwar Swami 
// Date: 30/12/2025 

import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  Newspaper,
  Video,
  Globe,
  Menu,
  X,
  Eye,
  Upload,
} from "lucide-react";
import AddContentModal from "./AddContentModal";
import MediaPreviewModal from "./MediaPreviewModal";
import ContentPreviewModal from "./ContentPreviewModal";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Banner APIs
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../../../api/bannerApi";

// Blog APIs
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../../api/blogApi";

// Media APIs - FULLY INTEGRATED
import {
  getAllMedia,
  createMedia,
  updateMedia,
  deleteMedia,
} from "../../../api/mediaApi";

export default function WebsiteContentManagement() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = ["Banners", "Blogs/News", "Media Gallery", "Pages"];
  const [active, setActive] = useState("Banners");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [contents, setContents] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [loading, setLoading] = useState(false);

  // ======== LOAD DATA BASED ON ACTIVE TAB ========
  useEffect(() => {
    loadContentForTab(active);
  }, [active]);

  const loadContentForTab = async (tabName) => {
    setLoading(true);
    try {
      let data = [];
      
      if (tabName === "Banners") {
        data = await getAllBanners();
        data = data.map((b) => ({
          id: b.id,
          type: "banner",
          title: b.title,
          sub: b.subtitle,
          description: b.description,
          imageUrl: b.imageUrl,
          status: b.published ? "Published" : "Draft",
          image: null,
        }));
      } else if (tabName === "Blogs/News") {
        data = await getAllBlogs();
        data = data.map((b) => ({
          id: b.id,
          type: "blog",
          title: b.title,
          content: b.content,
          imageUrl: b.imageUrl,
          status: b.published ? "Published" : "Draft",
          createdAt: b.createdAt,
          views: b.views || 0,
          date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "Just now",
          image: null,
        }));
      } else if (tabName === "Media Gallery") {
        // ✅ FULL MEDIA API INTEGRATION
        data = await getAllMedia();
        data = data.map((m) => ({
          id: m.id,
          type: "media",
          title: m.title,
          mediaType: m.mediaType,
          fileUrl: m.fileUrl,
          fileName: m.fileName,
          fileSize: m.fileSize,
          mimeType: m.mimeType,
          description: m.description,
          status: m.isActive ? "Active" : "Inactive",
          createdAt: m.createdAt,
          date: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "Just now",
          image: null,
        }));
      } else {
        // Pages - empty for now (local state)
        data = [];
      }
      
      setContents(data);
    } catch (err) {
      console.error(`Failed to load ${tabName}`, err);
      alert(`Failed to load ${tabName.toLowerCase()} from server`);
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingContent(item);
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      if (active === "Banners") {
        await deleteBanner(id);
      } else if (active === "Blogs/News") {
        await deleteBlog(id);
      } else if (active === "Media Gallery") {
        // ✅ MEDIA DELETE
        await deleteMedia(id);
      }
      setContents((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete item");
    }
  };

  // ======== SAVE (CREATE / UPDATE) ========
  const handleSaveContent = async (content) => {
    setLoading(true);
    try {
      if (active === "Banners") {
        const payload = {
          title: content.title,
          subtitle: content.sub,
          description: content.description || "",
          imageUrl: content.imageUrl,
          published: content.status === "Published",
        };

        if (editingContent && editingContent.id) {
          const updated = await updateBanner(editingContent.id, payload);
          setContents((prev) =>
            prev.map((c) =>
              c.id === editingContent.id
                ? {
                    ...c,
                    title: updated.title,
                    sub: updated.subtitle,
                    description: updated.description,
                    imageUrl: updated.imageUrl,
                    status: updated.published ? "Published" : "Draft",
                  }
                : c
            )
          );
        } else {
          const created = await createBanner(payload);
          setContents((prev) => [
            {
              id: created.id,
              type: "banner",
              title: created.title,
              sub: created.subtitle,
              description: created.description,
              imageUrl: created.imageUrl,
              status: created.published ? "Published" : "Draft",
              image: null,
            },
            ...prev,
          ]);
        }
      } else if (active === "Blogs/News") {
        const payload = {
          title: content.title,
          content: content.content || "",
          imageUrl: content.imageUrl || "",
          published: content.status === "Published",
        };

        if (editingContent && editingContent.id) {
          const updated = await updateBlog(editingContent.id, payload);
          setContents((prev) =>
            prev.map((c) =>
              c.id === editingContent.id
                ? {
                    ...c,
                    title: updated.title,
                    content: updated.content,
                    imageUrl: updated.imageUrl,
                    status: updated.published ? "Published" : "Draft",
                    createdAt: updated.createdAt,
                  }
                : c
            )
          );
        } else {
          const created = await createBlog(payload);
          setContents((prev) => [
            {
              id: created.id,
              type: "blog",
              title: created.title,
              content: created.content,
              imageUrl: created.imageUrl,
              status: created.published ? "Published" : "Draft",
              createdAt: created.createdAt,
              date: new Date(created.createdAt).toLocaleDateString(),
              views: 0,
              image: null,
            },
            ...prev,
          ]);
        }
      } else if (active === "Media Gallery") {
        // ✅ FULL MEDIA CRUD OPERATIONS
        const payload = {
          title: content.title,
          mediaType: content.mediaType || "IMAGE",
          fileUrl: content.fileUrl,
          fileName: content.fileName || content.title,
          fileSize: content.fileSize || 0,
          mimeType: content.mimeType || "image/jpeg",
          description: content.description || "",
          isActive: content.status === "Active",
        };

        if (editingContent && editingContent.id) {
          // UPDATE Media
          const updated = await updateMedia(editingContent.id, payload);
          setContents((prev) =>
            prev.map((c) =>
              c.id === editingContent.id
                ? {
                    ...c,
                    title: updated.title,
                    mediaType: updated.mediaType,
                    fileUrl: updated.fileUrl,
                    fileName: updated.fileName,
                    fileSize: updated.fileSize,
                    mimeType: updated.mimeType,
                    description: updated.description,
                    status: updated.isActive ? "Active" : "Inactive",
                  }
                : c
            )
          );
        } else {
          // CREATE Media
          const created = await createMedia(payload);
          setContents((prev) => [
            {
              id: created.id,
              type: "media",
              title: created.title,
              mediaType: created.mediaType,
              fileUrl: created.fileUrl,
              fileName: created.fileName,
              fileSize: created.fileSize,
              mimeType: created.mimeType,
              description: created.description,
              status: created.isActive ? "Active" : "Inactive",
              createdAt: created.createdAt,
              date: new Date(created.createdAt).toLocaleDateString(),
              image: null,
            },
            ...prev,
          ]);
        }
      }

      setEditingContent(null);
      setShowAddModal(false);
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save content. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActive(tab);
    setShowMobileMenu(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600 animate-pulse">Loading {active}...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 w-full bg-gray-50 min-h-screen">
      {location.state?.fromDashboard && (
        <div className="mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Website Content Management</h2>
          <p className="text-gray-500 text-sm">
            Manage your website banners, blogs, media gallery, and pages
          </p>
        </div>

        <button
          onClick={() => {
            setEditingContent(null);
            setShowAddModal(true);
          }}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white flex items-center gap-1 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Plus size={18} /> Add New
        </button>

        {showAddModal && (
          <AddContentModal
            onClose={() => {
              setShowAddModal(false);
              setEditingContent(null);
            }}
            onSave={handleSaveContent}
            editData={editingContent}
            activeTab={active}
          />
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white shadow-lg rounded-xl p-4 md:p-6">
        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-8 border-b border-gray-200 pb-4 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`pb-3 px-1 flex items-center gap-2 whitespace-nowrap transition-all font-medium ${
                active === tab
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
              }`}
            >
              {tab === "Banners" && <ImageIcon size={20} />}
              {tab === "Blogs/News" && <Newspaper size={20} />}
              {tab === "Media Gallery" && <Video size={20} />}
              {tab === "Pages" && <Globe size={20} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden border-b border-gray-200 pb-4 mb-6 flex justify-between items-center">
          <div className="text-green-600 font-semibold flex items-center gap-2">
            {active === "Banners" && <ImageIcon size={20} />}
            {active === "Blogs/News" && <Newspaper size={20} />}
            {active === "Media Gallery" && <Video size={20} />}
            {active === "Pages" && <Globe size={20} />}
            {active}
          </div>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Tab Menu */}
        {showMobileMenu && (
          <div className="md:hidden mb-6 p-4 bg-gray-50 rounded-lg border">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left mb-2 transition-all ${
                  active === tab
                    ? "bg-green-100 text-green-700 border-2 border-green-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab === "Banners" && <ImageIcon size={18} />}
                {tab === "Blogs/News" && <Newspaper size={18} />}
                {tab === "Media Gallery" && <Video size={18} />}
                {tab === "Pages" && <Globe size={18} />}
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Content Tabs */}
        <div className="space-y-6">
          {active === "Banners" && (
            <BannersTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />
          )}
          {active === "Blogs/News" && (
            <BlogsTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />
          )}
          {active === "Media Gallery" && (
            <MediaTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />
          )}
          {active === "Pages" && (
            <PagesTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />
          )}

          {previewContent && (
            <ContentPreviewModal
              content={previewContent}
              onClose={() => setPreviewContent(null)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ************************ ALL TAB COMPONENTS ************************ */

function BannersTab({ data, onEdit, onDelete, onPreview }) {
  if (!data.length) return <EmptyState icon={<ImageIcon size={48} />} title="No banners" subtitle="Click 'Add New' to create your first banner" />;

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <BannerCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
      ))}
    </div>
  );
}

function BlogsTab({ data, onEdit, onDelete, onPreview }) {
  if (!data.length) return <EmptyState icon={<Newspaper size={48} />} title="No blogs" subtitle="Click 'Add New' to create your first blog post" />;

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <BlogCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
      ))}
    </div>
  );
}

function MediaTab({ data, onEdit, onDelete, onPreview }) {
  if (!data.length) return <EmptyState icon={<Video size={48} />} title="No media" subtitle="Click 'Add New' to upload your first media file" />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <MediaCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
      ))}
    </div>
  );
}

function PagesTab({ data, onEdit, onDelete, onPreview }) {
  if (!data.length) return <EmptyState icon={<Globe size={48} />} title="No pages" subtitle="Click 'Add New' to create static pages" />;

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <PageCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
      ))}
    </div>
  );
}

// Card Components (All Complete)
function BannerCard({ item, onEdit, onDelete, onPreview }) {
  const preview = item.imageUrl;
  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {preview ? (
            <img src={preview} alt={item.title} className="w-24 h-16 object-cover rounded-lg" />
          ) : (
            <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{item.sub}</p>
          {item.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>}
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            item.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}>
            {item.status}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button onClick={() => onPreview(item)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Preview">
          <Eye size={18} />
        </button>
        <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg" title="Edit">
          <Edit size={18} />
        </button>
        <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg" title="Delete">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function BlogCard({ item, onEdit, onDelete, onPreview }) {
  const preview = item.imageUrl;
  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {preview ? (
            <img src={preview} alt={item.title} className="w-24 h-20 object-cover rounded-lg" />
          ) : (
            <div className="w-24 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-blue-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-2 truncate">{item.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">{item.content}</p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
            <span>Admin</span>
            <span>•</span>
            <span>{item.date}</span>
            <span>•</span>
            <span>{item.views} views</span>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            item.status === "Published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}>
            {item.status}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button onClick={() => onPreview(item)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Preview">
          <Eye size={18} />
        </button>
        <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg" title="Edit">
          <Edit size={18} />
        </button>
        <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg" title="Delete">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function MediaCard({ item, onEdit, onDelete, onPreview }) {
  const preview = item.fileUrl;
  const isImage = item.mimeType?.startsWith('image/');
  const sizeFormatted = item.fileSize ? `${(item.fileSize / 1024).toFixed(1)} KB` : 'N/A';

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Media Preview */}
        <div className="mb-4 rounded-lg overflow-hidden bg-gray-50 aspect-video flex items-center justify-center">
          {preview && isImage ? (
            <img src={preview} alt={item.title} className="w-full h-full object-cover" />
          ) : preview ? (
            <video src={preview} className="w-full h-full object-cover" controls={false}>
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400">
              {isImage ? <ImageIcon className="w-12 h-12 mb-2" /> : <Video className="w-12 h-12 mb-2" />}
              <Upload className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-2 truncate pr-2">{item.title}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span className="capitalize font-medium">{item.mediaType || 'Unknown'}</span>
            <span>•</span>
            <span>{sizeFormatted}</span>
          </div>
          {item.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              item.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
            }`}>
              {item.status}
            </span>
            <span className="text-xs text-gray-400">{item.date}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button onClick={() => onPreview(item)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex-1 justify-center" title="Preview">
          <Eye size={16} />
        </button>
        <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg flex-1 justify-center" title="Edit">
          <Edit size={16} />
        </button>
        <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg flex-1 justify-center" title="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function PageCard({ item, onEdit, onDelete, onPreview }) {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
          <Globe className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-2 truncate">{item.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">{item.content || "Page content"}</p>
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700">Page</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button onClick={() => onPreview(item)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" title="Preview">
          <Eye size={18} />
        </button>
        <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg" title="Edit">
          <Edit size={18} />
        </button>
        <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg" title="Delete">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto">{subtitle}</p>
    </div>
  );
}




// // src/components/WebsiteContentManagement.jsx
// // Author: Siddheshwar Swami 
// // Date: 30/12/2025 
// // Complete Website Content Management with Media Gallery Backend Integration

// import React, { useState, useEffect } from 'react';
// import { Edit, Trash2, Plus, Image as ImageIcon, Newspaper, Video, Globe, Menu, X, Eye, ArrowLeft } from 'lucide-react';
// import { useLocation, useNavigate } from 'react-router-dom';

// // Banner APIs
// import { getAllBanners, createBanner, updateBanner, deleteBanner } from '../api/bannerApi';
// // Blog APIs  
// import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../api/blogApi';
// // Media APIs - NEW
// import { getAllMedia, createMedia, updateMedia, deleteMedia } from '../api/mediaApi';

// export default function WebsiteContentManagement() {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const tabs = ['Banners', 'BlogsNews', 'Media Gallery', 'Pages'];
//   const [active, setActive] = useState('Banners');
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [contents, setContents] = useState([]);
//   const [editingContent, setEditingContent] = useState(null);
//   const [previewContent, setPreviewContent] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // LOAD DATA BASED ON ACTIVE TAB
//   useEffect(() => {
//     loadContentForTab(active);
//   }, [active]);

//   const loadContentForTab = async (tabName) => {
//     setLoading(true);
//     try {
//       let data = [];
      
//       if (tabName === 'Banners') {
//         data = await getAllBanners();
//         data = data.map(b => ({
//           id: b.id,
//           type: 'banner',
//           title: b.title,
//           sub: b.subtitle,
//           description: b.description,
//           imageUrl: b.imageUrl,
//           status: b.published ? 'Published' : 'Draft'
//         }));
//       } else if (tabName === 'BlogsNews') {
//         data = await getAllBlogs();
//         data = data.map(b => ({
//           id: b.id,
//           type: 'blog',
//           title: b.title,
//           content: b.content,
//           imageUrl: b.imageUrl,
//           status: b.published ? 'Published' : 'Draft',
//           createdAt: b.createdAt,
//           views: b.views || 0,
//           date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Just now'
//         }));
//       } else if (tabName === 'Media Gallery') {
//         data = await getAllMedia(); // Backend integration
//         data = data.map(m => ({
//           id: m.id,
//           type: 'media',
//           title: m.title,
//           mediaType: m.mediaType,
//           fileUrl: m.fileUrl,
//           fileName: m.fileName,
//           fileSize: m.fileSize,
//           mimeType: m.mimeType,
//           description: m.description,
//           isActive: m.isActive,
//           position: m.position,
//           createdAt: m.createdAt,
//           preview: m.fileUrl
//         }));
//       } else if (tabName === 'Pages') {
//         // Local state for pages (implement backend later)
//         data = [];
//       }
      
//       setContents(data);
//     } catch (err) {
//       console.error(`Failed to load ${tabName}`, err);
//       alert(`Failed to load ${tabName.toLowerCase()} from server`);
//       setContents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingContent(item);
//     setShowAddModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this item?')) return;
    
//     try {
//       if (active === 'Banners') {
//         await deleteBanner(id);
//       } else if (active === 'BlogsNews') {
//         await deleteBlog(id);
//       } else if (active === 'Media Gallery') {
//         await deleteMedia(id);
//       }
//       setContents(prev => prev.filter(c => c.id !== id));
//     } catch (err) {
//       console.error('Delete failed', err);
//       alert('Failed to delete item');
//     }
//   };

//   // SAVE/CREATE/UPDATE
//   const handleSaveContent = async (content) => {
//     setLoading(true);
//     try {
//       if (active === 'Banners') {
//         const payload = {
//           title: content.title,
//           subtitle: content.sub,
//           description: content.description,
//           imageUrl: content.imageUrl,
//           published: content.status === 'Published'
//         };
        
//         if (editingContent?.id) {
//           const updated = await updateBanner(editingContent.id, payload);
//           setContents(prev => prev.map(c => 
//             c.id === editingContent.id ? {
//               ...c,
//               title: updated.title,
//               sub: updated.subtitle,
//               description: updated.description,
//               imageUrl: updated.imageUrl,
//               status: updated.published ? 'Published' : 'Draft'
//             } : c
//           ));
//         } else {
//           const created = await createBanner(payload);
//           setContents(prev => [{
//             id: created.id,
//             type: 'banner',
//             title: created.title,
//             sub: created.subtitle,
//             description: created.description,
//             imageUrl: created.imageUrl,
//             status: created.published ? 'Published' : 'Draft'
//           }, ...prev]);
//         }
//       } else if (active === 'BlogsNews') {
//         const payload = {
//           title: content.title,
//           content: content.content,
//           imageUrl: content.imageUrl,
//           published: content.status === 'Published'
//         };
        
//         if (editingContent?.id) {
//           const updated = await updateBlog(editingContent.id, payload);
//           setContents(prev => prev.map(c => 
//             c.id === editingContent.id ? {
//               ...c,
//               title: updated.title,
//               content: updated.content,
//               imageUrl: updated.imageUrl,
//               status: updated.published ? 'Published' : 'Draft',
//               createdAt: updated.createdAt
//             } : c
//           ));
//         } else {
//           const created = await createBlog(payload);
//           setContents(prev => [{
//             id: created.id,
//             type: 'blog',
//             title: created.title,
//             content: created.content,
//             imageUrl: created.imageUrl,
//             status: created.published ? 'Published' : 'Draft',
//             createdAt: created.createdAt,
//             date: new Date(created.createdAt).toLocaleDateString(),
//             views: 0
//           }, ...prev]);
//         }
//       } else if (active === 'Media Gallery') {
//         const payload = {
//           title: content.title,
//           mediaType: content.mediaType,
//           fileUrl: content.fileUrl,
//           fileName: content.fileName,
//           fileSize: content.fileSize,
//           mimeType: content.mimeType,
//           description: content.description,
//           isActive: content.isActive !== false,
//           position: content.position || 0
//         };
        
//         if (editingContent?.id) {
//           const updated = await updateMedia(editingContent.id, payload);
//           setContents(prev => prev.map(c => 
//             c.id === editingContent.id ? { ...c, ...updated } : c
//           ));
//         } else {
//           const created = await createMedia(payload);
//           setContents(prev => [{
//             id: created.id,
//             type: 'media',
//             title: created.title,
//             mediaType: created.mediaType,
//             fileUrl: created.fileUrl,
//             fileName: created.fileName,
//             description: created.description,
//             isActive: created.isActive,
//             position: created.position,
//             preview: created.fileUrl
//           }, ...prev]);
//         }
//       }
      
//       setEditingContent(null);
//       setShowAddModal(false);
//     } catch (err) {
//       console.error('Save failed', err);
//       alert('Failed to save content. See console for details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActive(tab);
//     setShowMobileMenu(false);
//   };

//   if (loading) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-lg text-gray-600 animate-pulse">Loading {active}...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 w-full bg-gray-50 min-h-screen">
//       {location.state?.fromDashboard && (
//         <div className="mb-3">
//           <button 
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
//           >
//             <ArrowLeft size={18} />
//             Back
//           </button>
//         </div>
//       )}
      
//       {/* Header */}
//       <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900">Website Content Management</h2>
//           <p className="text-gray-500 text-sm">Manage your website banners, blogs, media gallery, and pages</p>
//         </div>
//         <button 
//           onClick={() => {
//             setEditingContent(null);
//             setShowAddModal(true);
//           }} 
//           disabled={loading}
//           className="px-4 py-2 bg-green-600 text-white flex items-center gap-1 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
//         >
//           <Plus size={18} />
//           Add New
//         </button>
//       </div>

//       {showAddModal && (
//         <AddContentModal 
//           onClose={() => {
//             setShowAddModal(false);
//             setEditingContent(null);
//           }} 
//           onSave={handleSaveContent}
//           editData={editingContent}
//           activeTab={active}
//         />
//       )}

//       {previewContent && (
//         <ContentPreviewModal 
//           content={previewContent}
//           onClose={() => setPreviewContent(null)}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       )}

//       {/* Main Card */}
//       <div className="bg-white shadow-lg rounded-xl p-4 md:p-6">
//         {/* Desktop Tabs */}
//         <div className="hidden md:flex gap-8 border-b border-gray-200 pb-4 mb-6 overflow-x-auto">
//           {tabs.map(tab => (
//             <button 
//               key={tab}
//               onClick={() => handleTabClick(tab)}
//               className={`pb-3 px-1 flex items-center gap-2 whitespace-nowrap transition-all font-medium ${
//                 active === tab 
//                   ? 'border-b-2 border-green-600 text-green-600' 
//                   : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
//               }`}
//             >
//               {tab === 'Banners' && <ImageIcon size={20} />}
//               {tab === 'BlogsNews' && <Newspaper size={20} />}
//               {tab === 'Media Gallery' && <Video size={20} />}
//               {tab === 'Pages' && <Globe size={20} />}
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Mobile Tabs */}
//         <div className="md:hidden border-b border-gray-200 pb-4 mb-6 flex justify-between items-center">
//           <div className="text-green-600 font-semibold flex items-center gap-2">
//             {active === 'Banners' && <ImageIcon size={20} />}
//             {active === 'BlogsNews' && <Newspaper size={20} />}
//             {active === 'Media Gallery' && <Video size={20} />}
//             {active === 'Pages' && <Globe size={20} />}
//             {active}
//           </div>
//           <button 
//             onClick={() => setShowMobileMenu(!showMobileMenu)}
//             className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
//           >
//             {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>

//         {/* Mobile Tab Menu */}
//         {showMobileMenu && (
//           <div className="md:hidden mb-6 p-4 bg-gray-50 rounded-lg border">
//             {tabs.map(tab => (
//               <button 
//                 key={tab}
//                 onClick={() => handleTabClick(tab)}
//                 className={`w-full flex items-center gap-3 p-3 rounded-lg text-left mb-2 transition-all ${
//                   active === tab 
//                     ? 'bg-green-100 text-green-700 border-2 border-green-200' 
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 {tab === 'Banners' && <ImageIcon size={18} />}
//                 {tab === 'BlogsNews' && <Newspaper size={18} />}
//                 {tab === 'Media Gallery' && <Video size={18} />}
//                 {tab === 'Pages' && <Globe size={18} />}
//                 {tab}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Content Tabs */}
//         <div className="space-y-6">
//           {active === 'Banners' && <BannersTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />}
//           {active === 'BlogsNews' && <BlogsTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />}
//           {active === 'Media Gallery' && <MediaTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />}
//           {active === 'Pages' && <PagesTab data={contents} onEdit={handleEdit} onDelete={handleDelete} onPreview={setPreviewContent} />}
//         </div>
//       </div>
//     </div>
//   );
// }

// // TAB COMPONENTS
// function BannersTab({ data, onEdit, onDelete, onPreview }) {
//   if (!data.length) return EmptyState({ icon: ImageIcon, size: 48, title: 'No banners', subtitle: 'Click Add New to create your first banner' });
//   return (
//     <div className="space-y-4">
//       {data.map(item => (
//         <BannerCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
//       ))}
//     </div>
//   );
// }

// function BlogsTab({ data, onEdit, onDelete, onPreview }) {
//   if (!data.length) return EmptyState({ icon: Newspaper, size: 48, title: 'No blogs', subtitle: 'Click Add New to create your first blog post' });
//   return (
//     <div className="space-y-4">
//       {data.map(item => (
//         <BlogCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
//       ))}
//     </div>
//   );
// }

// function MediaTab({ data, onEdit, onDelete, onPreview }) {
//   if (!data.length) return EmptyState({ icon: Video, size: 48, title: 'No media', subtitle: 'Click Add New to upload media files' });
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//       {data.map(item => (
//         <MediaCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
//       ))}
//     </div>
//   );
// }

// function PagesTab({ data, onEdit, onDelete, onPreview }) {
//   if (!data.length) return EmptyState({ icon: Globe, size: 48, title: 'No pages', subtitle: 'Click Add New to create static pages' });
//   return (
//     <div className="space-y-4">
//       {data.map(item => (
//         <PageCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
//       ))}
//     </div>
//   );
// }

// // CARD COMPONENTS
// function BannerCard({ item, onEdit, onDelete, onPreview }) {
//   const preview = item.imageUrl;
//   return (
//     <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
//       <div className="flex items-start gap-4">
//         <div className="flex-shrink-0">
//           {preview ? (
//             <img src={preview} alt={item.title} className="w-24 h-16 object-cover rounded-lg" />
//           ) : (
//             <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
//               <ImageIcon className="w-6 h-6 text-gray-400" />
//             </div>
//           )}
//         </div>
//         <div className="flex-1 min-w-0">
//           <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
//           <p className="text-sm text-gray-600 mb-2">{item.sub}</p>
//           <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
//           <span className={`text-xs px-3 py-1 rounded-full font-medium ${
//             item.status === 'Published' 
//               ? 'bg-green-100 text-green-700' 
//               : 'bg-gray-100 text-gray-700'
//           }`}>
//             {item.status}
//           </span>
//         </div>
//       </div>
//       <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
//         <button onClick={() => onPreview(item)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
//           <Eye size={18} />
//         </button>
//         <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
//           <Edit size={18} />
//         </button>
//         <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
//           <Trash2 size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }

// function BlogCard({ item, onEdit, onDelete, onPreview }) {
//   const preview = item.imageUrl;
//   return (
//     <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
//       <div className="flex items-start gap-4">
//         <div className="flex-shrink-0">
//           {preview ? (
//             <img src={preview} alt={item.title} className="w-24 h-20 object-cover rounded-lg" />
//           ) : (
//             <div className="w-24 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
//               <Newspaper className="w-6 h-6 text-blue-400" />
//             </div>
//           )}
//         </div>
//         <div className="flex-1 min-w-0">
//           <h3 className="font-bold text-lg mb-2 truncate">{item.title}</h3>
//           <p className="text-sm text-gray-600 mb-3 line-clamp-3">{item.content}</p>
//           <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
//             <span>Admin</span>
//             <span>{item.date}</span>
//             <span>{item.views} views</span>
//           </div>
//           <span className={`text-xs px-3 py-1 rounded-full font-medium ${
//             item.status === 'Published' 
//               ? 'bg-green-100 text-green-700' 
//               : 'bg-gray-100 text-gray-700'
//           }`}>
//             {item.status}
//           </span>
//         </div>
//       </div>
//       <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
//         <button onClick={() => onPreview(item)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
//           <Eye size={18} />
//         </button>
//         <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
//           <Edit size={18} />
//         </button>
//         <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
//           <Trash2 size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }

// function MediaCard({ item, onEdit, onDelete, onPreview }) {
//   const preview = item.preview;
//   const isImage = item.mediaType === 'IMAGE' || item.mimeType?.startsWith('image/');
  
//   return (
//     <div className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-xl transition-all hover:-translate-y-1">
//       <div className="mb-3 cursor-pointer" onClick={() => onPreview(item)}>
//         {preview && isImage ? (
//           <img src={preview} alt={item.title} className="h-40 sm:h-32 md:h-36 w-full object-cover rounded" />
//         ) : preview ? (
//           <video src={preview} controls className="h-40 sm:h-32 md:h-36 w-full object-cover rounded">
//             Your browser does not support the video tag.
//           </video>
//         ) : (
//           <div className="h-40 sm:h-32 md:h-36 w-full bg-gray-100 rounded flex items-center justify-center">
//             <Video className="w-12 h-12 text-gray-400" />
//           </div>
//         )}
//       </div>
//       <div>
//         <p className="font-medium">{item.title}</p>
//         <p className="text-sm text-gray-500">{item.mediaType || item.mimeType}</p>
//         {item.fileSize && (
//           <p className="text-xs text-gray-400">
//             {Math.round(item.fileSize / 1024)} KB
//           </p>
//         )}
//       </div>
//       <div className="flex gap-2 mt-3">
//         <button onClick={() => onPreview(item)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex-1">
//           <Eye size={16} />
//         </button>
//         <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
//           <Edit size={16} />
//         </button>
//         <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
//           <Trash2 size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }

// function PageCard({ item, onEdit, onDelete, onPreview }) {
//   return (
//     <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//         <div>
//           <p className="font-medium">{item.title}</p>
//           <p className="text-sm text-gray-500">{item.sub}</p>
//         </div>
//         <div className="flex gap-2 w-full md:w-auto md:justify-end">
//           {item.title === 'Footer' || item.title === 'Header' ? (
//             <button className="px-3 py-1 border border-gray-300 rounded text-gray-700 text-xs">
//               Edit Links
//             </button>
//           ) : null}
//           <button onClick={() => onPreview(item)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
//             <Eye size={18} />
//           </button>
//           <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
//             <Edit size={18} />
//           </button>
//           <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
//             <Trash2 size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // EMPTY STATE
// function EmptyState({ icon: Icon, size, title, subtitle }) {
//   return (
//     <div className="text-center py-16 px-4">
//       <div className="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
//         <Icon size={size} />
//       </div>
//       <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
//       <p className="text-gray-500 max-w-md mx-auto">{subtitle}</p>
//     </div>
//   );
// }











// // // Author : Siddheshwar Swami 
// // // Date : 24 to 26 / 12/ 2025 

// // import React, { useState, useEffect } from "react";
// // import {
// //   Edit,
// //   Trash2,
// //   Plus,
// //   Image as ImageIcon,
// //   Newspaper,
// //   Video,
// //   Globe,
// //   Menu,
// //   X,
// //   Eye,
// // } from "lucide-react";
// // import AddContentModal from "./AddContentModal";
// // import MediaPreviewModal from "./MediaPreviewModal";
// // import ContentPreviewModal from "./ContentPreviewModal";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { ArrowLeft } from "lucide-react";

// // import {
// //   getAllBanners,
// //   createBanner,
// //   updateBanner,
// //   deleteBanner,
// // } from "../api/bannerApi"; // <-- API import

// // export default function WebsiteContentManagement() {
// //   const location = useLocation();
// //   const navigate = useNavigate();

// //   const tabs = ["Banners", "Blogs/News", "Media Gallery", "Pages"];
// //   const [active, setActive] = useState("Banners");
// //   const [showMobileMenu, setShowMobileMenu] = useState(false);
// //   const [showAddModal, setShowAddModal] = useState(false);
// //   const [contents, setContents] = useState([]);
// //   const [editingContent, setEditingContent] = useState(null);
// //   const [previewContent, setPreviewContent] = useState(null);

// //   // ======== LOAD BANNERS FROM BACKEND ========
// //   useEffect(() => {
// //     async function loadBanners() {
// //       try {
// //         const data = await getAllBanners();
// //         const mapped = data.map((b) => ({
// //           id: b.id,
// //           type: "banner",
// //           title: b.title,
// //           sub: b.subtitle,
// //           description: b.description,
// //           imageUrl: b.imageUrl,
// //           status: b.published ? "Published" : "Draft",
// //           image: null, // file object just for preview
// //         }));
// //         setContents(mapped);
// //       } catch (err) {
// //         console.error("Failed to load banners", err);
// //         alert("Failed to load banners from server");
// //       }
// //     }

// //     loadBanners();
// //   }, []);

// //   const handleEdit = (item) => {
// //     setEditingContent(item);
// //     setShowAddModal(true);
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this item?")) return;

// //     try {
// //       if (active === "Banners") {
// //         await deleteBanner(id);
// //       }
// //       setContents((prev) => prev.filter((c) => c.id !== id));
// //     } catch (err) {
// //       console.error("Delete failed", err);
// //       alert("Failed to delete item");
// //     }
// //   };

// //   // ======== SAVE (CREATE / UPDATE) ========
// //   const handleSaveContent = async (content) => {
// //     try {
// //       if (active === "Banners") {
// //         const payload = {
// //           title: content.title,
// //           subtitle: content.sub,
// //           description: content.description || "",
// //           imageUrl: content.imageUrl, // AddContentModal must send this
// //           published: content.status === "Published",
// //         };

// //         if (editingContent && editingContent.id) {
// //           // UPDATE
// //           const updated = await updateBanner(editingContent.id, payload);

// //           setContents((prev) =>
// //             prev.map((c) =>
// //               c.id === editingContent.id
// //                 ? {
// //                     ...c,
// //                     title: updated.title,
// //                     sub: updated.subtitle,
// //                     description: updated.description,
// //                     imageUrl: updated.imageUrl,
// //                     status: updated.published ? "Published" : "Draft",
// //                   }
// //                 : c
// //             )
// //           );
// //         } else {
// //           // CREATE
// //           const created = await createBanner(payload);

// //           setContents((prev) => [
// //             {
// //               id: created.id,
// //               type: "banner",
// //               title: created.title,
// //               sub: created.subtitle,
// //               description: created.description,
// //               imageUrl: created.imageUrl,
// //               status: created.published ? "Published" : "Draft",
// //               image: null,
// //             },
// //             ...prev,
// //           ]);
// //         }
// //       } else {
// //         // Local-only logic for other tabs (Blogs/Media/Pages)
// //         if (editingContent) {
// //           setContents((prev) =>
// //             prev.map((c) => (c.id === editingContent.id ? { ...c, ...content } : c))
// //           );
// //         } else {
// //           setContents((prev) => [{ id: Date.now(), ...content }, ...prev]);
// //         }
// //       }

// //       setEditingContent(null);
// //       setShowAddModal(false);
// //     } catch (err) {
// //       console.error("Save failed", err);
// //       alert("Failed to save content. See console for details.");
// //     }
// //   };

// //   const handleAddContent = (newContent) => {
// //     setContents((prev) => [{ id: Date.now(), ...newContent }, ...prev]);
// //   };

// //   const handleTabClick = (tab) => {
// //     setActive(tab);
// //     setShowMobileMenu(false);
// //   };

// //   return (
// //     <div className="p-4 md:p-6 w-full bg-gray-50 min-h-screen">
// //       {location.state?.fromDashboard && (
// //         <div className="mb-3">
// //           <button
// //             onClick={() => navigate(-1)}
// //             className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition"
// //           >
// //             <ArrowLeft size={18} />
// //             Back
// //           </button>
// //         </div>
// //       )}

// //       {/* Header */}
// //       <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
// //         <div>
// //           <h2 className="text-xl font-semibold">Website Content Management</h2>
// //           <p className="text-gray-500 text-sm">
// //             Manage your website content, banners, and pages
// //           </p>
// //         </div>

// //         <button
// //           onClick={() => {
// //             setEditingContent(null);
// //             setShowAddModal(true);
// //           }}
// //           className="px-4 py-2 bg-green-600 text-white flex items-center gap-1 rounded-md hover:bg-green-700"
// //         >
// //           <Plus size={18} /> Add New
// //         </button>

// //         {showAddModal && (
// //           <AddContentModal
// //             onClose={() => {
// //               setShowAddModal(false);
// //               setEditingContent(null);
// //             }}
// //             onSave={handleSaveContent}
// //             editData={editingContent}
// //           />
// //         )}
// //       </div>

// //       {/* Card */}
// //       <div className="bg-white shadow rounded-lg p-3 md:p-4">
// //         {/* Desktop Tabs */}
// //         <div className="hidden md:flex gap-6 border-b border-gray-200 overflow-x-auto mb-4">
// //           {tabs.map((t) => (
// //             <button
// //               key={t}
// //               onClick={() => setActive(t)}
// //               className={`pb-2 flex items-center gap-2 whitespace-nowrap transition-all ${
// //                 active === t
// //                   ? "border-b-2 border-green-500 text-green-600 font-medium"
// //                   : "text-gray-500"
// //               }`}
// //             >
// //               {t === "Banners" && <ImageIcon size={18} />}
// //               {t === "Blogs/News" && <Newspaper size={18} />}
// //               {t === "Media Gallery" && <Video size={18} />}
// //               {t === "Pages" && <Globe size={18} />}
// //               {t}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Mobile Menu Button */}
// //         <div className="md:hidden border-b border-gray-200 mb-4 pb-2 flex justify-between items-center">
// //           <p className="text-green-600 font-medium flex gap-2 items-center">
// //             {active === "Banners" && <ImageIcon size={18} />}
// //             {active === "Blogs/News" && <Newspaper size={18} />}
// //             {active === "Media Gallery" && <Video size={18} />}
// //             {active === "Pages" && <Globe size={18} />}
// //             {active}
// //           </p>

// //           <button
// //             onClick={() => setShowMobileMenu(!showMobileMenu)}
// //             className="px-2 py-1 rounded text-gray-600 border border-gray-300"
// //           >
// //             {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
// //           </button>
// //         </div>

// //         {/* Mobile Dropdown Menu */}
// //         {showMobileMenu && (
// //           <div className="md:hidden flex flex-col gap-2 mb-4 bg-gray-50 p-2 rounded border border-gray-300 shadow-sm">
// //             {tabs.map((t) => (
// //               <button
// //                 key={t}
// //                 onClick={() => handleTabClick(t)}
// //                 className={`flex items-center gap-2 px-3 py-2 rounded text-left ${
// //                   active === t
// //                     ? "bg-green-100 text-green-600 font-medium"
// //                     : "text-gray-700 hover:bg-gray-200"
// //                 }`}
// //               >
// //                 {t === "Banners" && <ImageIcon size={18} />}
// //                 {t === "Blogs/News" && <Newspaper size={18} />}
// //                 {t === "Media Gallery" && <Video size={18} />}
// //                 {t === "Pages" && <Globe size={18} />}
// //                 {t}
// //               </button>
// //             ))}
// //           </div>
// //         )}

// //         <div className="mt-2">
// //           {active === "Banners" && (
// //             <BannersTab
// //               data={contents.filter((c) => c.type === "banner")}
// //               onEdit={handleEdit}
// //               onDelete={handleDelete}
// //               onPreview={setPreviewContent}
// //             />
// //           )}
// //           {active === "Blogs/News" && (
// //             <BlogsTab
// //               data={contents.filter((c) => c.type === "blog")}
// //               onEdit={handleEdit}
// //               onDelete={handleDelete}
// //               onPreview={setPreviewContent}
// //             />
// //           )}
// //           {active === "Media Gallery" && (
// //             <MediaTab
// //               data={contents.filter((c) => c.type === "media")}
// //               onEdit={handleEdit}
// //               onDelete={handleDelete}
// //               onPreview={setPreviewContent}
// //             />
// //           )}
// //           {active === "Pages" && (
// //             <PagesTab
// //               data={contents.filter((c) => c.type === "page")}
// //               onEdit={handleEdit}
// //               onDelete={handleDelete}
// //               onPreview={setPreviewContent}
// //             />
// //           )}

// //           {previewContent && (
// //             <ContentPreviewModal
// //               content={previewContent}
// //               onClose={() => setPreviewContent(null)}
// //               onEdit={handleEdit}
// //               onDelete={handleDelete}
// //             />
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ************************ BANNERS ************************ */

// // function BannersTab({ data, onEdit, onDelete, onPreview }) {
// //   if (!data.length)
// //     return <p className="text-gray-500">No banners added yet.</p>;

// //   return (
// //     <div className="space-y-4">
// //       {data.map((b) => {
// //         const mediaType = b.image?.type?.startsWith("image") ? "Image" : "Video";
// //         const preview = b.image
// //           ? URL.createObjectURL(b.image)
// //           : b.imageUrl || null;

// //         return (
// //           <div
// //             key={b.id}
// //             className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 shadow flex flex-col md:flex-row md:items-center justify-between gap-3"
// //           >
// //             <div className="flex items-center gap-4 flex-1">
// //               {preview && mediaType === "Image" ? (
// //                 <img
// //                   src={preview}
// //                   alt={b.title}
// //                   className="w-28 h-16 object-cover rounded-md border border-gray-200"
// //                 />
// //               ) : preview ? (
// //                 <video
// //                   src={preview}
// //                   className="w-28 h-16 object-cover rounded-md border border-gray-200"
// //                   muted
// //                 />
// //               ) : (
// //                 <div className="w-28 h-16 flex items-center justify-center border border-dashed border-gray-300 text-xs text-gray-400">
// //                   No image
// //                 </div>
// //               )}

// //               <div>
// //                 <h3 className="font-semibold text-sm md:text-base">
// //                   {b.title}
// //                 </h3>
// //                 <p className="text-sm text-gray-500">{b.sub}</p>
// //                 {b.description && (
// //                   <p className="text-xs text-gray-400 mt-1">
// //                     {b.description}
// //                   </p>
// //                 )}

// //                 <span
// //                   className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
// //                     b.status === "Published"
// //                       ? "bg-green-100 text-green-600"
// //                       : "bg-gray-200 text-gray-600"
// //                   }`}
// //                 >
// //                   {b.status}
// //                 </span>
// //               </div>
// //             </div>

// //             <div className="flex gap-3 justify-end">
// //               <button
// //                 className="text-gray-600 hover:text-gray-800"
// //                 onClick={() =>
// //                   onPreview({ ...b, type: "banner", preview, mediaType })
// //                 }
// //                 title="Preview"
// //               >
// //                 <Eye size={18} />
// //               </button>
// //               <button
// //                 className="text-blue-600 hover:text-blue-800"
// //                 onClick={() => onEdit(b)}
// //               >
// //                 <Edit size={18} />
// //               </button>
// //               <button
// //                 className="text-red-600 hover:text-red-800"
// //                 onClick={() => onDelete(b.id)}
// //               >
// //                 <Trash2 size={18} />
// //               </button>
// //             </div>
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // }

// // /* ************************ BLOGS ************************ */

// // function BlogsTab({ data, onEdit, onDelete, onPreview }) {
// //   if (!data.length) return <p className="text-gray-500">No blogs added yet.</p>;

// //   return (
// //     <div className="space-y-3">
// //       {data.map((b) => {
// //         const preview = b.image ? URL.createObjectURL(b.image) : null;
// //         return (
// //           <div key={b.id} className="bg-white p-4 shadow rounded-lg">
// //             <p className="font-semibold">{b.title}</p>
// //             <p className="text-sm text-gray-500">Admin • {b.date}</p>
// //             <p className="text-sm text-gray-500">{b.views} views</p>
// //             <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded inline-block mt-1">
// //               Published
// //             </span>

// //             <div className="flex gap-3 justify-end mt-2">
// //               <button
// //                 className="text-gray-600 hover:text-gray-800"
// //                 onClick={() => onPreview({ ...b, type: "blog", preview })}
// //                 title="Preview"
// //               >
// //                 <Eye size={18} />
// //               </button>
// //               <button
// //                 className="text-blue-600 hover:text-blue-800"
// //                 onClick={() => onEdit(b)}
// //               >
// //                 <Edit size={18} />
// //               </button>
// //               <button
// //                 className="text-red-600 hover:text-red-800"
// //                 onClick={() => onDelete(b.id)}
// //               >
// //                 <Trash2 size={18} />
// //               </button>
// //             </div>
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // }

// // /* ************************ MEDIA ************************ */

// // function MediaTab({ data, onEdit, onDelete, onPreview }) {
// //   if (!data.length) return <p className="text-gray-500">No media added yet.</p>;

// //   return (
// //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
// //       {data.map((m) => (
// //         <div
// //           key={m.id}
// //           className="bg-white border border-gray-300 shadow rounded-lg p-3 flex flex-col"
// //         >
// //           <div
// //             className="mb-3 cursor-pointer"
// //             onClick={() =>
// //               onPreview({ ...m, type: "media", preview: m.preview })
// //             }
// //           >
// //             {m.mediaType === "Image" ? (
// //               <img
// //                 src={m.preview}
// //                 alt={m.title}
// //                 className="h-40 sm:h-32 md:h-36 w-full object-cover rounded"
// //               />
// //             ) : (
// //               <video
// //                 src={m.preview}
// //                 controls
// //                 className="h-40 sm:h-32 md:h-36 w-full object-cover rounded"
// //               />
// //             )}
// //           </div>

// //           <p className="font-medium">{m.title}</p>
// //           <p className="text-sm text-gray-500">{m.mediaType}</p>

// //           <div className="flex gap-3 justify-end mt-2">
// //             <button
// //               className="text-gray-600 hover:text-gray-800"
// //               onClick={() =>
// //                 onPreview({ ...m, type: "media", preview: m.preview })
// //               }
// //               title="Preview"
// //             >
// //               <Eye size={18} />
// //             </button>
// //             <button
// //               className="text-blue-600 hover:text-blue-800"
// //               onClick={() => onEdit(m)}
// //             >
// //               <Edit size={18} />
// //             </button>
// //             <button
// //               className="text-red-600 hover:text-red-800"
// //               onClick={() => onDelete(m.id)}
// //             >
// //               <Trash2 size={18} />
// //             </button>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // /* ************************ PAGES ************************ */

// // function PagesTab({ data, onEdit, onDelete, onPreview }) {
// //   if (!data.length) return <p className="text-gray-500">No pages added yet.</p>;

// //   return (
// //     <div className="space-y-3">
// //       {data.map((p) => (
// //         <div
// //           key={p.id}
// //           className="bg-white border border-gray-300 shadow rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
// //         >
// //           <div>
// //             <p className="font-medium">{p.title}</p>
// //             <p className="text-sm text-gray-500">{p.sub}</p>
// //           </div>

// //           <div className="flex gap-3 w-full md:w-auto md:justify-end">
// //             {p.title === "Footer & Header" ? (
// //               <button className="px-3 py-1 border border-gray-300 rounded text-gray-700">
// //                 Edit Links
// //               </button>
// //             ) : (
// //               <>
// //                 <button
// //                   className="text-gray-600 hover:text-gray-800"
// //                   onClick={() => onPreview({ ...p, type: "page" })}
// //                   title="Preview"
// //                 >
// //                   <Eye size={18} />
// //                 </button>
// //                 <button
// //                   className="text-blue-600 hover:text-blue-800"
// //                   onClick={() => onEdit(p)}
// //                 >
// //                   <Edit size={18} />
// //                 </button>
// //                 <button
// //                   className="text-red-600 hover:text-red-800"
// //                   onClick={() => onDelete(p.id)}
// //                 >
// //                   <Trash2 size={18} />
// //                 </button>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

