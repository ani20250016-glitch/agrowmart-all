import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const deliveryPartners = [
    {
      name: "Santos Knight",
      phone: "+91-888-777-0080",
      email: "santos_knight@gmail.com",
      delivered: 64,
      earning: "₹3,750",
      license: "EST-269869708-31020",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Myron Buchanan",
      phone: "+91-888-777-0080",
      email: "myron.buchanan@gmail.com",
      delivered: 50,
      earning: "₹5,500",
      license: "EST-269869708-31020",
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Everett Price",
      phone: "+91-888-777-0080",
      email: "everett90@gmail.com",
      delivered: 101,
      earning: "₹6,890",
      license: "EST-269869708-31020",
      image: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Carroll Griffin",
      phone: "+91-888-777-0080",
      email: "carroll.griffin@hotmail.com",
      delivered: 84,
      earning: "₹4,850",
      license: "EST-269869708-31020",
      image: "https://i.pravatar.cc/150?img=4",
    },
    {
      name: "Ruben Copeland",
      phone: "+91-888-777-0080",
      email: "ruben.copeland@calocdelivery.com",
      delivered: 29,
      earning: "₹2,900",
      license: "EST-269869708-31020",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "Stuart Lindsey",
      phone: "+91-888-777-0080",
      email: "stuart.lindsey@gmail.com",
      delivered: 10,
      earning: "₹1,550",
      license: "EST-269869708-31020",
      image: "https://i.pravatar.cc/150?img=6",
    },
    {
      name: "Alonzo Baldwin",
      phone: "+91-888-777-0080",
      email: "alonzo909@gmail.com",
      delivered: 90,
      earning: "₹5,890",
      license: "EST-269869708-31020",
      image: "https://i.pravatar.cc/150?img=7",
    },
    {
      name: "Nathan Maldonado",
      phone: "+91-888-777-0080",
      email: "mmaldonado@gmail.com",
      delivered: 249,
      earning: "₹7,690",
      license: "EST-269869708-31020",
      image: "https://i.pravatar.cc/150?img=8",
    },
    {
      name: "Cory Jenkins",
      phone: "+91-888-777-0080",
      email: "cory.jenkins@gmail.com",
      delivered: 198,
      earning: "₹7,000",
      license: "EST-269869708-31020",
      image: "https://i.pravatar.cc/150?img=9",
    },
    {
      name: "Emmett Graves",
      phone: "+91-888-777-0080",
      email: "emmett.graves@hotmail.com",
      delivered: 84,
      earning: "₹4,789",
      license: "EST-269869708-31020",
      image: "https://i.pravatar.cc/150?img=10",
    },
  ];

  // Search filter + pagination
  const filtered = useMemo(() => {
    return deliveryPartners.filter((p) =>
      [p.name, p.email, p.phone].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedData = filtered.slice((page - 1) * perPage, page * perPage);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Delivery Partners ({filtered.length})
        </h1>

        <input
          type="text"
          placeholder="Search by name, email or phone"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border hover:border-[green] rounded-md w-full md:w-80"
        />
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 lg:hidden">
        {paginatedData.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full py-8">
            No delivery partners found.
          </div>
        ) : (
          paginatedData.map((p, i) => (
            <div
              key={i}
              className="bg-white shadow-sm rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={p.image}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-600">{p.email}</div>
                </div>
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Phone:</strong> {p.phone}
                </p>
                <p>
                  <strong>Delivered:</strong> {p.delivered}
                </p>
                <p>
                  <strong>Earning:</strong> {p.earning}
                </p>
                <p>
                  <strong>License:</strong> {p.license}
                </p>
              </div>

              <button
                onClick={() => navigate(`/delivery-profile/${i}`)}
                className="mt-3 w-full border border-[green] text-[green] hover:bg-[green] hover:text-white py-2 rounded-md text-sm"
              >
                View Profile
              </button>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      {paginatedData.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No delivery partners found.
        </div>
      ) : (
        <div className="hidden lg:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-100 text-xs text-gray-500">
                <th className="px-4 py-3 text-left">NAME</th>
                <th className="px-4 py-3 text-left">PHONE NUMBER</th>
                <th className="px-4 py-3 text-left">EMAIL</th>
                <th className="px-4 py-3 text-left">DELIVERED</th>
                <th className="px-4 py-3 text-left">EARNING</th>
                <th className="px-4 py-3 text-left">LICENSE NO.</th>
                <th className="px-4 py-3 text-left">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-300 hover:bg-gray-50 align-middle"
                >
                  {/* NAME + IMAGE */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-700">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">{p.phone}</td>
                  <td className="px-4 py-3">{p.email}</td>

                  <td className="px-4 py-3 text-center">{p.delivered}</td>

                  <td className="px-4 py-3 font-medium text-right">
                    {p.earning}
                  </td>

                  <td className="px-4 py-3">{p.license}</td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/delivery-profile/${i}`)}
                      className="text-[green] hover:text-white hover:bg-[green] border border-[green] px-3 py-1 rounded-md text-xs"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination  */}
      <div className="flex justify-end items-center gap-2 mt-6 text-sm select-none">
        {/* PREV */}
        <span
          className={`px-3 py-1 rounded cursor-pointer ${
            page === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-[green]"
          }`}
          onClick={() => page > 1 && setPage(page - 1)}
        >
          PREV
        </span>

        {/* Numbers */}
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-2.5 py-1 text-sm rounded border ${
              page === i + 1
                ? "bg-[green] text-white border-[green]"
                : "text-gray-700 bg-white hover:bg-[green] hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        {/* NEXT */}
        <span
          className={`px-3 py-1 rounded cursor-pointer ${
            page === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:text-[green]"
          }`}
          onClick={() => page < totalPages && setPage(page + 1)}
        >
          NEXT
        </span>
      </div>
    </div>
  );
}
