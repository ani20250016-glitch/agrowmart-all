import React, { useState } from "react";
import {
  Users,
  Sprout,
  Store,
  ShoppingCart,
  Package,
  CheckCircle,
  DollarSign,
  Clock,
  Plus,
  Bell,
  TrendingUp,
  Image,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const statsCards = [
  {
    label: "Total Farmers",
    value: "2,847",
    icon: Sprout,
    color: "bg-green-500",
    change: "+12%",
  },
  {
    label: "Total Sellers",
    value: "1,234",
    icon: Store,
    color: "bg-blue-500",
    change: "+8%",
  },
  {
    label: "Total Buyers",
    value: "5,621",
    icon: ShoppingCart,
    color: "bg-purple-500",
    change: "+15%",
  },
  {
    label: "Total Products",
    value: "8,932",
    icon: Package,
    color: "bg-orange-500",
    change: "+23%",
  },
  {
    label: "Active Orders",
    value: "342",
    icon: Clock,
    color: "bg-yellow-500",
    change: "+5%",
  },
  {
    label: "Completed Orders",
    value: "12,483",
    icon: CheckCircle,
    color: "bg-emerald-500",
    change: "+18%",
  },
  {
    label: "Total Revenue",
    value: "$487,234",
    icon: DollarSign,
    color: "bg-indigo-500",
    change: "+27%",
  },
  {
    label: "Pending Approvals",
    value: "28",
    icon: Clock,
    color: "bg-red-500",
    change: "-3%",
  },
];

const registrationData = [
  { name: "Mon", farmers: 45, sellers: 12, buyers: 89 },
  { name: "Tue", farmers: 52, sellers: 18, buyers: 102 },
  { name: "Wed", farmers: 48, sellers: 15, buyers: 95 },
  { name: "Thu", farmers: 61, sellers: 22, buyers: 118 },
  { name: "Fri", farmers: 55, sellers: 19, buyers: 108 },
  { name: "Sat", farmers: 38, sellers: 10, buyers: 76 },
  { name: "Sun", farmers: 42, sellers: 14, buyers: 85 },
];

const ordersData = [
  { name: "Jan", orders: 245 },
  { name: "Feb", orders: 312 },
  { name: "Mar", orders: 289 },
  { name: "Apr", orders: 367 },
  { name: "May", orders: 423 },
  { name: "Jun", orders: 398 },
];

const productSalesData = [
  { name: "Jan", productA: 4200, productB: 3800 },
  { name: "Feb", productA: 1800, productB: 2900 },
  { name: "Mar", productA: 2400, productB: 2600 },
  { name: "Apr", productA: 4800, productB: 2000 },
  { name: "May", productA: 2800, productB: 3500 },
  { name: "Jun", productA: 3200, productB: 3100 },
  { name: "Jul", productA: 3500, productB: 3300 },
  { name: "Aug", productA: 2100, productB: 2000 },
  { name: "Sep", productA: 2900, productB: 2700 },
  { name: "Oct", productA: 800, productB: 1400 },
  { name: "Nov", productA: 2100, productB: 2600 },
  { name: "Dec", productA: 3200, productB: 3100 },
].map((item, index) => ({
  ...item,
  total: item.productA + item.productB,
  fillColor: index % 2 === 0 ? "#5dbe2dff" : "#3b82f6",
}));

// Weekly sales for the current month (4 weeks)
const monthlyProductSalesData = [
  { name: "Week 1", total: 4200, fillColor: "#5dbe2dff" },
  { name: "Week 2", total: 3800, fillColor: "#3b82f6" },
  { name: "Week 3", total: 4500, fillColor: "#5dbe2dff" },
  { name: "Week 4", total: 4000, fillColor: "#3b82f6" },
];

const getWeeksInCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // day of week
  const lastDate = new Date(year, month + 1, 0).getDate(); // last date of month
  const used = firstDay + lastDate;
  return Math.ceil(used / 7); // total weeks in this month
};

const generateMonthlySalesData = () => {
  const weeks = getWeeksInCurrentMonth();
  const colors = ["#5dbe2dff", "#3b82f6"];
  const data = [];
  for (let i = 1; i <= weeks; i++) {
    data.push({
      name: `Week ${i}`,
      total: Math.floor(Math.random() * 5000) + 2000, // example sales value
      fillColor: colors[i % 2],
    });
  }
  return data;
};

// Daily sales for the current week (7 days)
const weeklyProductSalesData = [
  { name: "Mon", total: 1200, fillColor: "#5dbe2dff" },
  { name: "Tue", total: 1500, fillColor: "#3b82f6" },
  { name: "Wed", total: 1300, fillColor: "#5dbe2dff" },
  { name: "Thu", total: 1700, fillColor: "#3b82f6" },
  { name: "Fri", total: 1600, fillColor: "#5dbe2dff" },
  { name: "Sat", total: 1400, fillColor: "#3b82f6" },
  { name: "Sun", total: 1800, fillColor: "#5dbe2dff" },
];

const quickActions = [
  { label: "Add Product", icon: Plus, color: "bg-blue-500" },
  { label: "Send Notification", icon: Bell, color: "bg-green-500" },
  { label: "Market Rates", icon: TrendingUp, color: "bg-purple-500" },
  { label: "Create Banner", icon: Image, color: "bg-orange-500" },
];

export default function Dashboard() {
  const [filter, setFilter] = useState("year");
  const navigate = useNavigate();

  const handleQuickAction = (label) => {
    if (label === "Add Product") {
      navigate("/admin/addproduct", {
        state: { fromDashboard: true },
      });
    } else if (label === "Send Notification") {
      navigate("/notifications", {
        state: { fromDashboard: true },
      });
    } else if (label === "Market Rates") {
      navigate("/market-rates", {
        state: { fromDashboard: true },
      });
    } else if (label === "Create Banner") {
      navigate("/websites", {
        state: { fromDashboard: true },
      });
    }
  };

  // Filter product sales data based on dropdown selection
  let filteredProductSalesData = [];

  if (filter === "year") {
    filteredProductSalesData = productSalesData; // all months
  } else if (filter === "month") {
    filteredProductSalesData = generateMonthlySalesData(); // dynamic weeks
  } else if (filter === "week") {
    filteredProductSalesData = weeklyProductSalesData; // 7 days
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg md:text-2xl font-semibold">Dashboard</h2>
        <p className="text-gray-600 text-sm md:text-base">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200 flex flex-col justify-between transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`text-sm ${
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
              <p className="mt-1 text-base md:text-lg font-semibold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
        <h3 className="mb-4 font-semibold text-base md:text-lg">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                className={`${action.color} text-white p-3 md:p-4 rounded-lg flex items-center gap-2 md:gap-3 hover:opacity-90 transition`}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">{action.label}</span>
              </button>
            );
          })} */}
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => handleQuickAction(action.label)}
                className={`${action.color} text-white p-4 rounded-lg flex items-center gap-3 hover:opacity-90`}
              >
                <Icon />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
          <h3 className="mb-4 font-semibold text-base md:text-lg">
            Daily Registrations
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={registrationData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="farmers"
                stroke="#22c55e"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="sellers"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="buyers"
                stroke="#a855f7"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
          <h3 className="mb-4 font-semibold text-base md:text-lg">
            Orders Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={ordersData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Sales Analysis */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base md:text-lg">
            Products Sell Analysis
          </h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-100 rounded-md text-sm cursor-pointer hover:bg-gray-200"
          >
            <option value="year">This Year</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={330}>
          <BarChart
            data={filteredProductSalesData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `₹${value}`} />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Legend />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} name="Total Sales">
              {filteredProductSalesData.map((entry, index) => (
                <Cell key={index} fill={entry.fillColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sellers & Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Sellers */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base md:text-lg">
              New Merchant / Seller
            </h3>
            <button
              onClick={() => navigate("/sellers")}
              className="text-green-600 text-sm md:text-base font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                name: "The Home Depot",
                address: "Opposite Furniture City, 77 Spintex Rd, Accra, Ghana",
                color: "bg-orange-500",
              },
              {
                name: "BraveWe Collection",
                address: "2 Adoley Abla Street, Accra, Ghana",
                color: "bg-green-500",
              },
              {
                name: "STYLY Fashion",
                address: "202 Dean Plaza, Accra - Kumasi Rd, Accra, Ghana",
                color: "bg-gray-700",
              },
              {
                name: "Refco Bag Ltd",
                address: "Airport Bypass Rd, Accra, Ghana",
                color: "bg-purple-500",
              },
              {
                name: "Jeamy Deal",
                address: "301, Itrade Commercial, Adjiringano Rd, Accra, Ghana",
                color: "bg-pink-500",
              },
            ].map((merchant, i) => (
              <div key={i} className="flex items-start justify-between pb-1">
                <div className="flex gap-3">
                  <div
                    className={`${merchant.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm`}
                  >
                    {merchant.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base">
                      {merchant.name}
                    </p>
                    <p className="text-gray-500 text-xs md:text-sm">
                      {merchant.address}
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base md:text-lg">
              New Customers
            </h3>
            <button
              onClick={() => navigate("/customers")}
              className="text-green-600 text-sm md:text-base font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: "Kigen pieterson", email: "kegenpet980@gmail.com" },
              { name: "Brandon Walsh", email: "iambrandon90@hotmail.com" },
              { name: "Sam Wilson", email: "samwilson@reppeducation.com" },
              { name: "Dean Mayer", email: "dmayer1987@gmail.com" },
              { name: "Kagiso Morris", email: "kgmorrison@hotmail.com" },
            ].map((user, i) => (
              <div key={i} className="flex items-start justify-between pb-1">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={`https://i.pravatar.cc/150?img=${i + 5}`}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm md:text-base">
                      {user.name}
                    </p>
                    <p className="text-gray-500 text-xs md:text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Products Section */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200 w-full mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base md:text-lg">
            Popular Product
          </h3>
           <button
          onClick={() => navigate("/products")}
          className="text-green-600 text-sm md:text-base font-medium hover:underline"
        >
          View All
        </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow group hover:shadow-md transition">
            <img
              src="https://th.bing.com/th/id/OIP.RPJw-1gIkSfV3aOCPp3I1wHaE7?w=278&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              alt="Vegetables"
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <p className="text-green-600 text-xs font-semibold uppercase">
                By Refco Bags Ltd
              </p>
              <p className="text-gray-800 font-medium text-sm md:text-base">
                Organic Fresh Vegetables
              </p>
              <p className="text-gray-900 font-semibold mt-2 text-sm md:text-base">
                ₹70
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow group hover:shadow-md transition">
            <img
              src="https://th.bing.com/th/id/OIP.KiUo3wuffRE19HPCb2EVPQHaE8?w=253&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              alt="Seafood"
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <p className="text-green-600 text-xs font-semibold uppercase">
                By Silverstart Mobile
              </p>
              <p className="text-gray-800 font-medium text-sm md:text-base">
                Organic Fresh Seafood
              </p>

              <div className="flex gap-2 items-center mt-2">
                <p className="text-gray-900 font-semibold text-sm md:text-base">
                  ₹30
                </p>
                <p className="text-gray-400 text-xs line-through">₹120</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow group hover:shadow-md transition">
            <img
              src="https://th.bing.com/th/id/OIP.OJBTHZ_Z1d1eFQiE8LoZgQHaEz?w=322&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              alt="Dairy"
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <p className="text-green-600 text-xs font-semibold uppercase">
                By Kitty Shop
              </p>
              <p className="text-gray-800 font-medium text-sm md:text-base">
                Organic Fresh Dairy Products
              </p>
              <p className="text-gray-900 font-semibold mt-2 text-sm md:text-base">
                ₹60
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow group hover:shadow-md transition">
            <img
              src="https://th.bing.com/th/id/OIP.QV9nLsosd2GuFfqmwBD7NAHaF0?w=206&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              alt="Meat"
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <p className="text-green-600 text-xs font-semibold uppercase">
                By Brand Factory
              </p>
              <p className="text-gray-800 font-medium text-sm md:text-base">
                Organic Fresh Meat
              </p>
              <p className="text-gray-900 font-semibold mt-2 text-sm md:text-base">
                ₹120
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
