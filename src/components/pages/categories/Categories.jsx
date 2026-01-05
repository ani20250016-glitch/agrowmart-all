import React, { useState } from "react";

export default function CategoryList() {
  const [categories, setCategories] = useState([
    {
      name: "Oranges",
      sub: "Pune Oranges",
      img: "https://www.bing.com/th/id/OIP.YcXfuojdWojGLbS0GgW6gwHaFS?w=254&h=211",
    },
    {
      name: "Chicken Thighs",
      sub: "Chicken",
      img: "https://th.bing.com/th/id/OIP.QV9nLsosd2GuFfqmwBD7NAHaF0?w=236&h=186",
    },
    {
      name: "Brinjals",
      sub: "Organic",
      img: "https://www.bing.com/th/id/OIP.-HPm4zIOjXLfQtMIdPUmMgHaHa?w=157&h=211",
    },
    {
      name: "Pineapple",
      sub: "Tropical Fruit",
      img: "https://www.bing.com/th/id/OIP.3yrzbKoKIgyR7eBhHma26AHaGm?w=219&h=211",
    },
    {
      name: "Watermelon",
      sub: "Sweet + Organic",
      img: "https://www.bing.com/th/id/OIP.iJm7Raz14pLpYXCimjoLbgHaE8?w=281&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1",
    },
    {
      name: "Broccoli",
      sub: "Healthy Greens",
      img: "https://www.bing.com/th/id/OIP.QqgZGQ5gYNfrc6dF44lhbgHaGp?w=202&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1",
    },
    
    {
      name: "Dragon Fruit",
      sub: "Premium",
      img: "https://th.bing.com/th/id/OIP.qnCESIKJMsNxBEsjNDhHngHaE8?w=261&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
    },
  ]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const [newName, setNewName] = useState("");
  const [newSub, setNewSub] = useState("");
  const [newImage, setNewImage] = useState(null);

  const [editName, setEditName] = useState("");
  const [editSub, setEditSub] = useState("");
  const [editImage, setEditImage] = useState(null);

  // ========= IMAGE UPLOAD ===========
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(URL.createObjectURL(file)); // preview store
  };

  // ========= IMAGE UPLOAD (EDIT) ===========
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditImage(URL.createObjectURL(file)); 
  };

  // =================== ADD CATEGORY ===================
  const handleAddCategory = () => {
    const newCat = {
      name: newName,
      sub: newSub,
      img: newImage || "https://via.placeholder.com/150",
    };

    setCategories([...categories, newCat]);
    setOpenAddModal(false);
    setNewName("");
    setNewSub("");
    setNewImage(null);
  };

  // =================== UPDATE CATEGORY ===================
  const handleUpdateCategory = () => {
    const updated = categories.map((cat) =>
      cat.name === editModal.name
        ? { ...cat, name: editName, sub: editSub, img: editImage || cat.img }
        : cat
    );

    setCategories(updated);
    setEditModal(null);
    setEditImage(null);
  };

  // =================== DELETE CATEGORY ===================
  const handleDeleteCategory = () => {
    const filtered = categories.filter((cat) => cat.name !== deleteModal.name);
    setCategories(filtered);
    setDeleteModal(null);
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 px-3 sm:px-6 lg:px-10">

      {/* MAIN CARD */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-700">Categories</h2>

          <button
            onClick={() => setOpenAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition"
          >
            Add New
          </button>
        </div>

        {/* Category List */}
        <div>
          {categories.map((cat, index) => (
            <div
              key={index}
              className="w-full bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 rounded-md p-4 mb-4 shadow-sm"
            >
              {/* Left Image + Text */}
              <div className="flex items-center gap-3">
                <div className="border border-dashed border-gray-200 rounded-md p-1 w-20 h-20 flex justify-center items-center">
                  <img src={cat.img} alt={cat.name} className="object-contain w-full h-full" />
                </div>

                <div>
                  <p className="text-gray-800 font-medium">{cat.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Sub Categories</p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-sm text-gray-600 mt-1 inline-block">
                    {cat.sub}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3 sm:mt-0">
                <button
                  onClick={() => {
                    setEditModal(cat);
                    setEditName(cat.name);
                    setEditSub(cat.sub);
                    setEditImage(cat.img);
                  }}
                  className="text-sm border border-green-500 text-green-600 px-4 py-1 rounded-md hover:bg-green-50 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteModal(cat)}
                  className="text-sm border border-green-500 text-green-600 px-4 py-1 rounded-md hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ADD MODAL ================= */}
      {openAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-11/12 sm:w-2/3 lg:w-1/2 xl:w-2/5 shadow-lg p-6 relative">

            <button
              onClick={() => setOpenAddModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Category</h2>

            {/* IMAGE UPLOAD */}
            <div className="mb-3">
              <p className="text-sm mb-1">Category Photo</p>

              <div className="border border-dashed rounded-md h-40 flex justify-center items-center text-xs text-gray-500 relative">
                {newImage ? (
                  <img
                    src={newImage}
                    alt="preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  "Supported files : jpg, png"
                )}

                <label className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded cursor-pointer">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* NAME */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Category Name</p>
              <input
                type="text"
                placeholder="Enter category name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-green-500"
              />
            </div>

            {/* SUB */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Sub Categories</p>
              <textarea
                placeholder="Enter sub categories (comma separated)"
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm h-24 resize-none focus:outline-green-500"
              />
            </div>

            <button
              onClick={handleAddCategory}
              className="w-full bg-green-600 text-white py-2 rounded-md mt-6 hover:bg-green-700 transition"
            >
              Add Category
            </button>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-11/12 sm:w-2/3 lg:w-1/2 xl:w-2/5 shadow-lg p-6 relative">

            <button
              onClick={() => setEditModal(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit Category</h2>

            {/* IMAGE */}
            <div className="mb-3">
              <p className="text-sm mb-1">Category Photo</p>

              <div className="border border-dashed rounded-md h-40 flex justify-center items-center text-xs relative">
                {editImage ? (
                  <img src={editImage} alt="preview" className="h-full w-full object-contain" />
                ) : (
                  "No Image"
                )}

                <label className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded cursor-pointer">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleEditImageUpload}
                  />
                </label>
              </div>
            </div>

           {/* NAME */}
            <div>
              <p className="text-sm mb-1">Category Name</p>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border rounded-md px-2 py-2 text-sm"
              />
            </div>

            {/* SUB */}
            <div className="mt-4">
              <p className="text-sm mb-1">Sub Categories</p>
              <textarea
                value={editSub}
                onChange={(e) => setEditSub(e.target.value)}
                className="w-full border rounded-md px-2 py-2 text-sm h-24 resize-none"
              />
            </div>

           

            <button
              onClick={handleUpdateCategory}
              className="w-full bg-green-600 text-white py-2 rounded-md mt-6 hover:bg-green-700 transition"
            >
              Update Category
            </button>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-96 shadow-lg p-6 relative">

            <button
              onClick={() => setDeleteModal(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Delete Category
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <b>{deleteModal.name}</b>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteCategory}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
