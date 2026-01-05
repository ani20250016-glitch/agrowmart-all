import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// --- Layout Component ---
import Layout from "../components/layout/Layout"; // Main wrapper with Sidebar/Navbar

// --- Auth Components ---
import LoginPage from "../components/auth/Login"; // Login screen for authentication

// --- Page Components ---
import Dashboard from "../components/pages/dashboard/Dashboard";
import Customers from "../components/pages/customers/Customers";
import CustomerProfile from "../components/pages/customers/CustomerProfile";
import Sellers from "../components/pages/sellers/Sellers";
import SellerProfile from "../components/pages/sellers/SellerProfile";
import DeliveryPartners from "../components/pages/delivery/DeliveryPartners";
import DeliveryProfile from "../components/pages/delivery/DeliveryProfile";
import AllProducts from "../components/pages/products/AllProducts";
import ProductDetail from "../components/pages/products/ProductDetail";
import Categories from "../components/pages/categories/Categories";
import MarketRates from "../components/pages/market/MarketRates";
import WeatherSettings from "../components/pages/weather/WeatherSettings";
import WebsiteContentMgnt from "../components/pages/website-content/WebsiteContentMgnt";
import Admins from "../components/pages/admins/Admins";
import TicketsSupport from "../components/pages/support/TicketsSupport";
import TicketDetail from "../components/pages/support/TicketDetail";
import Offers from "../components/pages/offers/Offers";
import Notifications from "../components/pages/notifications/Notifications";
import Profile from "../components/pages/profile/Profile";
import Settings from "../components/pages/settings/Settings";
import Payments from "../components/pages/payments/Payments";
import Orders from "../components/pages/orders/Orders";
import OrderDetail from "../components/pages/orders/OrderDetail";
import Review from "../components/pages/reviews/Review";
import ReviewDetail from "../components/pages/reviews/ReviewDetail";
import DeletedProducts from "../components/pages/products/DeletedProducts";
import ReferAndEarn from "../components/pages/refer/ReferAndEarn";
import AddProduct from "../components/pages/products/AddProduct";

const AllRoutes = () => {
  // ✅ Shared state to manage product data across different components
  const [products, setProducts] = useState([]); // Stores the list of active products
  const [deletedProducts, setDeletedProducts] = useState([]); // Stores the list of deleted/archived products

  return (
    <BrowserRouter>
      {" "}
      {/* Enables navigation features in the browser */}
      <Routes>
        {" "}
        {/* Container for all individual route definitions */}
        {/* --- Public Routes --- */}
        {/* Default landing page showing Login */}
        <Route path="/" element={<LoginPage />} />
        {/* Explicit login path */}
        <Route path="/login" element={<LoginPage />} />
        {/* --- Protected Routes (Inside Layout) --- */}
        {/* Routes wrapped in <Layout /> will share common UI like Sidebar/Header */}
        <Route element={<Layout />}>
          {/* Main admin dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Product management: Adding a new product */}
          <Route path="/admin/addproduct" element={<AddProduct />} />
          {/* Customer management routes */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customer/:id" element={<CustomerProfile />} />{" "}
          {/* Dynamic ID for specific profile */}
          {/* Seller management routes */}
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/seller/:id" element={<SellerProfile />} />
          {/* Delivery partner management */}
          <Route path="/delivery" element={<DeliveryPartners />} />
          <Route path="/delivery-profile/:id" element={<DeliveryProfile />} />
          {/* --- Products Section with Shared State --- */}
          <Route
            path="/products"
            element={
              <AllProducts
                products={products}
                setProducts={setProducts}
                deletedProducts={deletedProducts}
                setDeletedProducts={setDeletedProducts}
              />
            }
          />
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* Section to view and restore deleted products */}
          <Route
            path="/deletedproducts"
            element={
              <DeletedProducts
                deletedProducts={deletedProducts}
                setDeletedProducts={setDeletedProducts}
                setProducts={setProducts}
              />
            }
          />
          {/* Order tracking and details */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          {/* Customer reviews and feedback details */}
          <Route path="/review" element={<Review />} />
          <Route path="/review/:id" element={<ReviewDetail />} />
          {/* --- Miscellaneous Administrative Routes --- */}
          <Route path="/categories" element={<Categories />} />{" "}
          {/* Product categories */}
          <Route path="/market-rates" element={<MarketRates />} />{" "}
          {/* Commodity/Market pricing */}
          <Route path="/weather-settings" element={<WeatherSettings />} />{" "}
          {/* Weather related config */}
          <Route path="/websites" element={<WebsiteContentMgnt />} />{" "}
          {/* CMS/Web content */}
          <Route path="/admins" element={<Admins />} />{" "}
          {/* Admin user management */}
          <Route path="/support" element={<TicketsSupport />} />{" "}
          {/* Helpdesk tickets */}
          <Route path="/ticket/:id" element={<TicketDetail />} />
          <Route path="/offers" element={<Offers />} />{" "}
          {/* Discount/Promo management */}
          <Route path="/refer-earn" element={<ReferAndEarn />} />{" "}
          {/* Referral system settings */}
          <Route path="/payment" element={<Payments />} />{" "}
          {/* Transaction history/settings */}
          <Route path="/settings" element={<Settings />} />{" "}
          {/* General App settings */}
          <Route path="/notifications" element={<Notifications />} />{" "}
          {/* Push notification management */}
          <Route path="/profile" element={<Profile />} />{" "}
          {/* Admin's personal profile */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;
