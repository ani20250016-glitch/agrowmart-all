import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, ArrowLeft } from "lucide-react";
import milk from "../../../assets/Logo1.png";

const INITIAL_FORM_STATE = {
  productName: "",
  shortDescription: "",
  categoryId: "",
  price: "",
  stockQuantityKg: "",

  // Dairy
  volume: "",
  brand: "",
  fatContent: "",
  packagingType: "",
  shelfLife: "",
  storageInstruction: "",

  // Meat & Seafood
  cutType: "",
  netWeight: "",
  isFrozen: "",

  // Veg & Fruits
  freshness: "",
  organic: false,

  // Veterinary
  doctorName: "",
  experience: "",
  consultationFee: "",
  availableTimings: "",

  // Gruh Udyog
  ingredients: "",
  homemadeDate: "",

  keyFeatures: "",
  usage: "",
  energy: "",
  disclaimer: "",
  refundPolicy: "",
  status: "ACTIVE",
};

const AddProduct = () => {
  const navigate = useNavigate();

  const location = useLocation();

  /* ===============================
      CATEGORY CONFIG (INLINE)
  ================================ */
  const CATEGORY_CONFIG = {
    DAIRY: {
      label: "Dairy",
      requiredFields: [
        "volume",
        "brand",
        "fatContent",
        "storageInstruction",
        "packagingType",
        "shelfLife",
      ],
    },
    MEAT_SEAFOOD: {
      label: "Meat & Seafood",
      requiredFields: ["cutType", "netWeight", "storageInstruction"],
    },
    VEG_FRUITS: {
      label: "Vegetables & Fruits",
      requiredFields: ["netWeight", "freshness"],
    },
    VETERINARY: {
      label: "Veterinary Doctor",
      requiredFields: ["doctorName", "experience", "consultationFee"],
    },
    GRUH_UDYOG: {
      label: "Gruh Udyog",
      requiredFields: ["ingredients", "shelfLife"],
    },
  };

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===============================
      HANDLERS
  ================================ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const saveProductToLocalStorage = (formData, images) => {
    const existingProducts = JSON.parse(localStorage.getItem("products")) || [];

    const newProduct = {
      id: Date.now(),
      name: formData.productName,
      description: formData.shortDescription,
      category: formData.categoryId,
      price: formData.price || 0,
      stock: formData.stockQuantityKg || 0,
      image: images[0] ? URL.createObjectURL(images[0]) : "",
      addedDate: new Date().toISOString(),
      status: formData.status || "ACTIVE",
    };

    localStorage.setItem(
      "products",
      JSON.stringify([newProduct, ...existingProducts])
    );
  };

  const handleSave = async () => {
    if (!formData.productName || !formData.categoryId || images.length === 0) {
      alert("Please fill required fields and upload images");
      return;
    }

    const category = CATEGORY_CONFIG[formData.categoryId];

    if (category?.requiredFields) {
      for (let field of category.requiredFields) {
        if (!formData[field]) {
          alert(`Please fill required field: ${field}`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      images.forEach((img) => data.append("images", img));

      saveProductToLocalStorage(formData, images);

      console.log("Submitting product", Object.fromEntries(data));

      alert("Product Added Successfully!");
      setFormData(INITIAL_FORM_STATE);
      setImages([]);
      navigate("/products");
    } catch (err) {
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-10 py-8">
      {/* HEADER */}
      <div className="mb-8">
        {/* BACK BUTTON – ABOVE TITLE */}
        {location.state?.fromDashboard && (
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg hover:bg-gray-100"
  >
    <ArrowLeft size={18} />
    Back
  </button>
)}


        {/* TITLE + SAVE BUTTON */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">Add New Product</h1>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-[green] text-white rounded-lg"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* IMAGE SECTION */}
        <div className="w-full lg:w-[35%] rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold mb-4">Product Images</h2>

          <img
            src={images[0] ? URL.createObjectURL(images[0]) : milk}
            className="w-full max-w-[280px] mx-auto rounded-lg mb-4"
          />

          <div className="flex gap-2 flex-wrap mb-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                className="w-14 h-14 rounded-lg border object-cover"
              />
            ))}
          </div>

          <div className="border-2 border-dashed rounded-lg border border-gray-300 p-6 text-center">
            <Upload className="mx-auto mb-2 text-[green]" />
            <input
              type="file"
              id="uploadImg"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="uploadImg"
              className="cursor-pointer text-[green]"
            >
              Select Images
            </label>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="flex-1 flex flex-col gap-6">
          {/* GENERAL */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="font-bold mb-4">General Information</h2>

            <input
              name="productName"
              placeholder="Product Name *"
              value={formData.productName}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-lg w-full mb-3"
            />

            <textarea
              name="shortDescription"
              placeholder="Description"
              value={formData.shortDescription}
              onChange={handleChange}
              rows="3"
              className="border border-gray-200 p-3 rounded-lg w-full"
            />

            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-lg w-full mt-3"
            >
              <option value="">Select Category *</option>
              {Object.entries(CATEGORY_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY BASED FIELDS */}
          {formData.categoryId === "DAIRY" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="font-bold mb-4">Dairy Details</h2>
              <input
                name="volume"
                placeholder="Volume *"
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-lg w-full mb-3"
              />
              <input
                name="brand"
                placeholder="Brand *"
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-lg w-full mb-3"
              />
              <input
                name="shelfLife"
                placeholder="Shelf Life *"
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-lg w-full"
              />
            </div>
          )}

          {formData.categoryId === "MEAT_SEAFOOD" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="font-bold mb-4">Meat & Seafood Details</h2>
              <input
                name="cutType"
                placeholder="Cut Type *"
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-lg w-full mb-3"
              />
              <input
                name="netWeight"
                placeholder="Net Weight *"
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-lg w-full"
              />
            </div>
          )}

          {formData.categoryId === "VEG_FRUITS" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="font-bold mb-4">Vegetables & Fruits</h2>
              <input
                name="netWeight"
                placeholder="Net Weight *"
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-lg w-full mb-3"
              />
              <input
                name="freshness"
                placeholder="Freshness *"
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-lg w-full"
              />
            </div>
          )}

          {formData.categoryId === "VETERINARY" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="font-bold mb-4">Veterinary Doctor</h2>
              <input
                name="doctorName"
                placeholder="Doctor Name *"
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-lg w-full mb-3"
              />
              <input
                name="consultationFee"
                placeholder="Consultation Fee *"
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-lg w-full"
              />
            </div>
          )}

          {formData.categoryId === "GRUH_UDYOG" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="font-bold mb-4">Gruh Udyog</h2>
              <textarea
                name="ingredients"
                placeholder="Ingredients *"
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-lg w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
