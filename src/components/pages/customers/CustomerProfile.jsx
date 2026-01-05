import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById } from "../../../api/customerProfileApi";
import { blockCustomer, unblockCustomer } from "../../../api/customers.api";



/* ---------------- SMALL UI COMPONENTS (UNCHANGED) ---------------- */

const TopStatCard = ({ title, value }) => (
  <div className="flex-1 min-w-[100px] py-3 px-3 bg-gray-100 border border-gray-200 rounded-md text-center">
    <p className="text-xs font-medium text-gray-600">{title}</p>
    <p className="text-sm font-bold text-gray-800 mt-0.5">{value}</p>
  </div>
);

const DetailField = ({ label, value, readOnly = false, isAddress = false }) => (
  <div className={isAddress ? "md:col-span-3 lg:col-span-1" : "md:col-span-1"}>
    <label className="block text-sm font-medium text-gray-500 mb-1">
      {label}
    </label>
    <p
      className={`w-full py-1 text-gray-800 font-medium ${
        readOnly ? "text-gray-600" : ""
      }`}
    >
      {value || "N/A"}
    </p>
    <div
      className={`w-full h-[1px] ${readOnly ? "bg-gray-200" : "bg-gray-300"}`}
    ></div>
  </div>
);

const FavoriteItemCard = ({ title, price, img }) => (
  <div className="group border border-gray-100 rounded-lg bg-white overflow-hidden hover:shadow-lg transition cursor-pointer">
    <div className="relative overflow-hidden h-40">
      <img
        src={img}
        className="h-full w-full object-cover transform group-hover:scale-105 duration-500"
        alt={title}
      />
    </div>
    <div className="p-3">
      <p className="text-sm font-semibold text-gray-700 truncate mb-1">
        {title}
      </p>
      <p className="text-lg font-extrabold text-green-600">₹{price}</p>
    </div>
  </div>
);

/* ---------------- MAIN COMPONENT ---------------- */

export default function UserProfileOverview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  /* ---------------- FETCH PROFILE FROM DB ---------------- */

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
  try {
    setLoading(true);

    const res = await getCustomerById(id);
    console.log("PROFILE API:", res);

    if (!res?.success) {
      setUser(null);
      return;
    }

    const {
      user,
      profile,
      purchasedItems,
      rewardPoints,
      memberSinceFormatted,
    } = res.data;

    setUser({
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: profile?.streetAddress
        ? `${profile.streetAddress}, ${profile.city || ""}`
        : "No address provided",
      img:
        user.photoUrl ||
        `https://ui-avatars.com/api/?name=${user.name}`,
    });

    setStats({
      purchasedItems: purchasedItems ?? 0,
      rewardPoints: rewardPoints ?? 0,
      memberSince: memberSinceFormatted ?? "N/A",
    });

    setIsBlocked(user.status === "BLOCKED");
  } catch (err) {
    console.error("PROFILE LOAD ERROR", err);
    setUser(null);
  } finally {
    setLoading(false);
  }
};


  /* ---------------- BLOCK / UNBLOCK ---------------- */

  const confirmAction = async () => {
  try {
    if (pendingAction === "block") {
      await blockCustomer(id);
      setIsBlocked(true);
    } else {
      await unblockCustomer(id);
      setIsBlocked(false);
    }
  } catch (err) {
    console.error("STATUS UPDATE ERROR", err);
  } finally {
    setPendingAction(null);
  }
};


  /* ---------------- STATES ---------------- */

  if (loading)
    return <div className="p-6 text-center">Loading profile...</div>;

  if (!user)
    return (
      <div className="p-6 text-center text-red-600">
        User not found
      </div>
    );

  /* ---------------- UI (UNCHANGED) ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 mb-4"
      >
        <ArrowLeft /> Back
      </button>

      <div className="bg-white rounded-2xl shadow p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Profile</h1>

          <div className="flex gap-2 bg-gray-200 rounded-full p-1">
            <button
              disabled={!isBlocked}
              onClick={() => setPendingAction("unblock")}
              className={`px-4 py-2 rounded-full text-sm ${
                isBlocked
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Unblock
            </button>

            <button
              disabled={isBlocked}
              onClick={() => setPendingAction("block")}
              className={`px-4 py-2 rounded-full text-sm ${
                !isBlocked
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Block
            </button>
          </div>
        </div>

        {/* USER INFO */}
        <div className="flex gap-6 items-center mb-6">
          <img
            src={user.img}
            className="w-16 h-16 rounded-full"
            alt="avatar"
          />

          <div className="flex-1">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p>{user.phone}</p>
          </div>

          <div className="flex gap-3">
            <TopStatCard
              title="Purchased Items"
              value={stats.purchasedItems}
            />
            <TopStatCard
              title="Reward Point"
              value={stats.rewardPoints}
            />
            <TopStatCard
  title="Member Since"
  value={stats.memberSince}
/>

          </div>
        </div>

        {/* ACCOUNT INFO */}
        <h3 className="font-bold mb-3">Account Information</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <DetailField label="Full Name" value={user.name} />
          <DetailField label="Email Address" value={user.email} readOnly />
          <DetailField label="Mobile Number" value={user.phone} />
        </div>

        {/* ADDRESS */}
        <h3 className="font-bold mt-6 mb-3">Address</h3>
        <DetailField label="Address" value={user.address} />

        {/* FAVORITES */}
        <h3 className="font-bold mt-8 mb-4">
          Favorites ({favorites.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map((item, i) => (
            <FavoriteItemCard
              key={i}
              title={item.name}
              price={item.price}
              img={item.imageUrl}
            />
          ))}
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="font-bold mb-3">
              Confirm {pendingAction === "block" ? "Block" : "Unblock"}
            </h3>
            <p className="mb-6">
              Are you sure you want to {pendingAction} this user?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingAction(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded text-white ${
                  pendingAction === "block"
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
