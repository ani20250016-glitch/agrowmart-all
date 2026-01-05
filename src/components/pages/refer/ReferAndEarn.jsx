import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Users,
  UserPlus,
  DollarSign,
} from "lucide-react";

const ReferAndEarn = () => {
  const [expandedVendor, setExpandedVendor] = useState(null);
  const vendors = [
    {
      id: "VD001",
      name: "Acme Electronics",
      phone: "123 456 7890",
      status: "Active",
      reward: "$1,250",
      customers: [
        {
          id: "C001",
          name: "John Doe",
          phone: "123 456 7890",
          date: "Dec 1, 2024",
          reward: "$250",
        },
        {
          id: "C002",
          name: "Jane Smith",
          phone: "123 456 7891",
          date: "Dec 5, 2024",
          reward: "$250",
        },
      ],
    },
    {
      id: "VD004",
      name: "Bright Future Ventures",
      phone: "123 456 7900",
      status: "Active",
      reward: "$2,000",
      customers: [
        {
          id: "C003",
          name: "Bob Johnson",
          phone: "123 456 7892",
          date: "Dec 10, 2024",
          reward: "$250",
        },
        {
          id: "C004",
          name: "Alice Brown",
          phone: "123 456 7893",
          date: "Dec 12, 2024",
          reward: "$250",
        },
      ],
    },
    {
      id: "VD006",
      name: "Digital Dynamics",
      phone: "123 456 7912",
      status: "Pending",
      reward: "$250",
      customers: [],
    },

    /* -------- NEW DATA -------- */

    {
      id: "VD007",
      name: "TechNova Solutions",
      phone: "123 456 7920",
      status: "Active",
      reward: "$1,750",
      customers: [
        {
          id: "C005",
          name: "Rahul Mehta",
          phone: "987 654 3210",
          date: "Dec 15, 2024",
          reward: "$300",
        },
        {
          id: "C006",
          name: "Neha Sharma",
          phone: "987 654 3211",
          date: "Dec 18, 2024",
          reward: "$300",
        },
      ],
    },
    {
      id: "VD008",
      name: "NextGen Retail",
      phone: "123 456 7930",
      status: "Inactive",
      reward: "$500",
      customers: [
        {
          id: "C007",
          name: "Amit Verma",
          phone: "987 654 3220",
          date: "Dec 20, 2024",
          reward: "$250",
        },
      ],
    },
    {
      id: "VD009",
      name: "Urban Market Hub",
      phone: "123 456 7940",
      status: "Active",
      reward: "$3,000",
      customers: [
        {
          id: "C008",
          name: "Priya Kapoor",
          phone: "987 654 3230",
          date: "Dec 22, 2024",
          reward: "$500",
        },
        {
          id: "C009",
          name: "Sanjay Patel",
          phone: "987 654 3231",
          date: "Dec 25, 2024",
          reward: "$500",
        },
        {
          id: "C010",
          name: "Ritu Singh",
          phone: "987 654 3232",
          date: "Dec 27, 2024",
          reward: "$500",
        },
      ],
    },
  ];

  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const filteredVendors = vendors.filter((vendor) => {
    const term = searchTerm.toLowerCase();

    const vendorMatch =
      vendor.name.toLowerCase().includes(term) || vendor.phone.includes(term);

    return vendorMatch;
  });

  const statusFilteredVendors =
    statusFilter === "All"
      ? filteredVendors
      : filteredVendors.filter((vendor) => vendor.status === statusFilter);

  const totalPages = Math.ceil(statusFilteredVendors.length / ITEMS_PER_PAGE);

  const paginatedVendors = statusFilteredVendors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalCustomers = statusFilteredVendors.reduce(
    (sum, vendor) => sum + vendor.customers.length,
    0
  );

  const totalRewards = statusFilteredVendors.reduce((sum, vendor) => {
    const reward = Number(vendor.reward.replace(/[$,]/g, ""));
    return sum + reward;
  }, 0);

  const stats = [
    {
      label: "Total Vendors",
      value: statusFilteredVendors.length,
      icon: <Users size={20} className="text-gray-400" />,
    },
    {
      label: "Total Customers Referred",
      value: totalCustomers,
      icon: <UserPlus size={20} className="text-gray-400" />,
    },
    {
      label: "Total Rewards",
      value: `$${totalRewards.toLocaleString()}`,
      icon: <DollarSign size={20} className="text-gray-400" />,
    },
  ];

  const exportCSV = () => {
    const headers = ["Vendor Name", "Phone", "Referred", "Reward", "Status"];

    // Rows: wrap each value in double quotes
    const rows = vendors.map((v) => [
      `"${v.name}"`,
      `"${v.phone}"`,
      `"${v.customers.length}"`,
      `"${v.reward}"`,
      `"${v.status}"`,
    ]);

    // Join headers + rows
    const csv = [headers.map((h) => `"${h}"`), ...rows]
      .map((e) => e.join(","))
      .join("\n");

    // Blob with UTF-8 charset
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "refer_and_earn.csv";
    a.click();

    URL.revokeObjectURL(url); // Clean up memory
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold">Refer & Earn</h1>
        <p className="text-md text-gray-500">
          View vendors and their referred customers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex justify-between items-start"
          >
            <div>
              <p className="text-md font-semibold text-gray-600 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            {stat.icon}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div
        className="flex flex-col gap-4 mb-6 w-full
                md:flex-row md:items-center md:justify-between"
      >
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by vendor name, mobile number, or customer name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2
                  border border-gray-300 rounded-md
                  focus:outline-none focus:ring-1 focus:ring-blue-500
                  text-sm"
          />
        </div>

        {/* Buttons Group */}
        <div
          className="flex flex-col gap-2 w-full
                  sm:flex-row sm:justify-end
                  md:w-auto md:gap-3"
        >
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setIsStatusOpen((prev) => !prev)}
              className="flex items-center justify-center gap-2
      w-full sm:w-auto
      px-4 py-2
      border border-gray-300 rounded-md
      bg-white text-sm hover:bg-gray-50"
            >
              <Filter size={16} />
              <span>{statusFilter}</span>
              {isStatusOpen ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>

            {isStatusOpen && (
              <div
                className="absolute right-0 mt-2 w-full sm:w-32
      bg-white border border-gray-200 rounded-md shadow-lg z-20"
              >
                {["All", "Active", "Pending"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                      setIsStatusOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50
            ${statusFilter === status ? "font-semibold text-blue-600" : ""}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2
                 w-full sm:w-auto
                 px-4 py-2
                 border border-gray-300 rounded-md
                 bg-white text-sm hover:bg-gray-50"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-4 font-semibold">Vendor Name</th>
                <th className="p-4 font-semibold">Vendor Mobile Number</th>
                <th className="p-4 font-semibold">Referred</th>
                <th className="p-4 font-semibold">Reward</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVendors.map((vendor) => (
                <React.Fragment key={vendor.id}>
                  <tr
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      expandedVendor === vendor.id ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-semibold text-black-700">
                            {vendor.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {vendor.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{vendor.phone}</td>
                    <td className="p-4 text-green-600 font-medium cursor-pointer">
                      {vendor.customers.length} customers
                    </td>

                    <td className="p-4 font-bold text-green-600">
                      {vendor.reward}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          vendor.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        className="text-gray-500 hover:text-green-600 flex items-center gap-1 mx-auto text-xs"
                        onClick={() =>
                          setExpandedVendor(
                            expandedVendor === vendor.id ? null : vendor.id
                          )
                        }
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Customer Details */}
                  {expandedVendor === vendor.id && (
                    <tr>
                      <td colSpan="6" className="p-6 bg-blue-50/50">
                        <div className="bg-white rounded-lg border border-blue-100 overflow-hidden shadow-sm">
                          <p className="p-3 text-xs font-bold text-gray-600 bg-blue-50/50">
                            Referred Customers
                          </p>
                          <table className="w-full text-left text-xs">
                            <thead className="border-b border-blue-100 text-gray-500">
                              <tr>
                                <th className="p-3">Customer Name</th>
                                <th className="p-3">Mobile Number</th>
                                <th className="p-3 text-center">
                                  Date Referred
                                </th>
                                <th className="p-3 text-right">Reward</th>
                              </tr>
                            </thead>
                            <tbody>
                              {vendor.customers.length === 0 ? (
                                <tr>
                                  <td
                                    colSpan="4"
                                    className="p-4 text-center text-gray-400"
                                  >
                                    No customers referred
                                  </td>
                                </tr>
                              ) : (
                                vendor.customers.map((cust) => (
                                  <tr
                                    key={cust.id}
                                    className="border-b border-gray-50 last:border-0"
                                  >
                                    <td className="p-3">
                                      <div className="font-semibold">
                                        {cust.name}
                                      </div>
                                      <div className="text-[10px] text-gray-400">
                                        {cust.id}
                                      </div>
                                    </td>
                                    <td className="p-3 text-gray-600">
                                      {cust.phone}
                                    </td>
                                    <td className="p-3 text-center text-gray-500">
                                      📅 {cust.date}
                                    </td>
                                    <td className="p-3 text-right font-bold text-green-600">
                                      {cust.reward}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200">
          {paginatedVendors.map((vendor) => (
            <div key={vendor.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-black-700">{vendor.name}</h3>
                  <p className="text-xs text-gray-400">{vendor.id}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    vendor.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {vendor.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="text-gray-500 text-xs">
                  Phone:{" "}
                  <span className="text-gray-800 block">{vendor.phone}</span>
                </div>
                <div className="text-gray-500 text-xs">
                  Reward:{" "}
                  <span className="text-green-600 font-bold block">
                    {vendor.reward}
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  setExpandedVendor(
                    expandedVendor === vendor.id ? null : vendor.id
                  )
                }
                className="w-full py-2 bg-blue-50 text-green-700 text-xs font-bold rounded flex items-center justify-center gap-2"
              >
                <Eye size={14} /> View Customers
              </button>

              {expandedVendor === vendor.id && (
                <div className="mt-4 space-y-2">
                  {vendor.customers.length === 0 ? (
                    <p className="text-center text-gray-400 text-xs">
                      No customers referred
                    </p>
                  ) : (
                    vendor.customers.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 bg-gray-50 rounded border border-gray-100 flex justify-between items-center text-xs"
                      >
                        <div>
                          <p className="font-bold">{c.name}</p>
                          <p className="text-gray-400">{c.date}</p>
                        </div>
                        <p className="font-bold text-green-600">{c.reward}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(
              currentPage * ITEMS_PER_PAGE,
              statusFilteredVendors.length
            )}{" "}
            of {statusFilteredVendors.length} vendors
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded text-xs disabled:opacity-40"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-xs rounded ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white"
                    : "border hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;
