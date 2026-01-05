//author-prajakta darade
import React, { useState, useEffect } from "react";
import {
  Cloud,
  Save,
  Key,
  RotateCw,
  MapPin,
  CheckCircle,
  Wifi,
} from "lucide-react";

// --- Import Service ---
// Note: 'getAllApiKeys' function service file madhe add kara
import {
  getWeatherSettings,
  saveWeatherSettings,
  saveApiKey,
  getLiveWeather,
  getAllApiKeys,
} from "../../../api/WeatherService";

// --- Sub-Component 1: InputGroup ---
const InputGroup = ({ label, type, value, onChange, editable }) => {
  const getIcon = (inputType) => {
    switch (inputType) {
      case "key":
        return <Key className="w-5 h-5 text-gray-400" />;
      case "refresh":
        return <RotateCw className="w-5 h-5 text-gray-400" />;
      case "location":
        return <MapPin className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center text-sm text-gray-700 mb-1 font-medium">
        {getIcon(type)}
        <label className="ml-2">{label}</label>
      </div>
      <input
        type={type === "key" ? "password" : "text"}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={!editable}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
};

// --- Sub-Component 2: ProviderCard ---
const ProviderCard = ({
  name,
  rateLimit,
  requestsToday,
  status,
  onActivate,
}) => {
  const isActive = status === "Active";
  const getProviderIcon = (providerName) => {
    if (providerName && providerName.includes("Bit"))
      return (
        <Wifi
          className={`w-6 h-6 ${isActive ? "text-green-700" : "text-gray-500"}`}
        />
      );
    return (
      <Cloud
        className={`w-6 h-6 ${isActive ? "text-green-700" : "text-gray-500"}`}
      />
    );
  };

  const buttonClass = isActive
    ? "bg-green-600 hover:bg-green-700 text-white"
    : "bg-white hover:bg-gray-50 text-green-700 border border-green-700";

  const cardClass = isActive
    ? "border border-green-500"
    : "border border-gray-200";

  return (
    <div
      className={`p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 mb-4 bg-white ${cardClass}`}
    >
      <div className="flex items-center">
        <div
          className={`mr-4 p-2 rounded-full ${
            isActive ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          {getProviderIcon(name)}
        </div>
        <div>
          <h3
            className={`text-lg font-semibold ${
              isActive ? "text-gray-800" : "text-gray-600"
            }`}
          >
            {name}
          </h3>
          <p className="text-sm text-gray-500">
            Rate Limit: <span className="font-medium">{rateLimit}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">Requests Today</p>
          {/* --- CHANGE: Real Data Display --- */}
          <p className="text-lg font-semibold text-gray-800">{requestsToday}</p>
        </div>
        <button
          onClick={() => onActivate(name)}
          className={`px-4 py-2 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${buttonClass}`}
        >
          {isActive ? "Active" : "Activate"}
        </button>
      </div>
    </div>
  );
};

// --- Main Component: App ---
const App = () => {
  // --- CHANGE: State initially empty (Fetch from Backend) ---
  const [providers, setProviders] = useState([]);

  // Settings State
  const [apiSettings, setApiSettings] = useState({
    refreshRate: "30", // Default minutes
    location: "Pune",
  });
  const [tempUnit, setTempUnit] = useState("Celsius"); // Celsius or Fahrenheit
  const [enableForecast, setEnableForecast] = useState(true);

  // API Keys State
  const [apiKeys, setApiKeys] = useState({
    openWeather: "",
    weatherBit: "",
    weatherApi: "",
  });

  // Live Weather Status (Display purpose)
  const [liveWeather, setLiveWeather] = useState(null);

  // --- 1. Load Data on Component Mount ---
  useEffect(() => {
    fetchSettings();
    checkLiveWeather();
    fetchProviders(); // --- NEW: Fetch Real Providers Data ---
  }, []);

  // --- NEW FUNCTION: Fetch Providers & Request Counts from Backend ---
  const fetchProviders = async () => {
    try {
      const keysData = await getAllApiKeys();
      // Backend Data la Frontend format madhe convert kara
      const formattedProviders = keysData.map((key) => ({
        name: key.provider.name,
        // Rate Limit sadhya hardcode thevla ahe (API madhe nasto)
        rateLimit: key.provider.name.includes("Bit") ? "50/min" : "60/min",
        // 🔥 HE REAL COUNT AHE 🔥
        requestsToday: key.requestsToday,
        // Active Status Backend varun
        status: key.active ? "Active" : "Inactive",
      }));

      setProviders(formattedProviders);

      // Key Inputs pan auto-fill kara (Optional)
      if (keysData.length > 0) {
        // Logic to pre-fill input boxes if needed
        const openWeatherKey = keysData.find(
          (k) => k.provider.name === "OpenWeatherMap"
        );
        if (openWeatherKey) {
          setApiKeys((prev) => ({
            ...prev,
            openWeather: openWeatherKey.apiKey,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      // Error aala tar Fallback Static Data dakhva
      setProviders([
        {
          name: "OpenWeatherMap",
          rateLimit: "60/min",
          requestsToday: "Error",
          status: "Inactive",
        },
      ]);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await getWeatherSettings();
      if (data) {
        setApiSettings({
          refreshRate: data.refreshRateMinutes?.toString() || "30",
          location: data.defaultLocation || "Pune",
        });
        setTempUnit(
          data.temperatureUnit === "metric" ? "Celsius" : "Fahrenheit"
        );
        setEnableForecast(data.enableForecast);
      }
    } catch (error) {
      alert("Failed to load settings from backend");
    }
  };

  const checkLiveWeather = async () => {
    try {
      const data = await getLiveWeather();
      setLiveWeather(data);
    } catch (error) {
      console.log("Live weather check failed (maybe invalid key)");
    }
  };

  // --- 2. Handle Save Settings ---
  const handleSaveSettings = async () => {
    const payload = {
      refreshRateMinutes: parseInt(apiSettings.refreshRate),
      defaultLocation: apiSettings.location,
      temperatureUnit: tempUnit === "Celsius" ? "metric" : "imperial",
      enableForecast: enableForecast,
    };

    try {
      await saveWeatherSettings(payload);
      alert("Settings Saved Successfully!");
      checkLiveWeather();
    } catch (error) {
      alert("Error saving settings.");
    }
  };

  // --- 3. Handle Update API Keys ---
  const handleUpdateApiKeys = async () => {
    if (apiKeys.openWeather) {
      try {
        await saveApiKey(1, apiKeys.openWeather);
        alert("OpenWeatherMap API Key Updated!");
        checkLiveWeather();
        fetchProviders(); // Refresh Counter/Status
      } catch (error) {
        alert("Error updating API Key");
      }
    } else {
      alert("Please enter a key for OpenWeatherMap");
    }
  };

  const handleActivateProvider = (providerName) => {
    // Frontend update sathi (Backend la API call karayla hava asl tar ithe add kara)
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        status: p.name === providerName ? "Active" : "Inactive",
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-3 sm:mb-0">
          <h1 className="text-xl font-semibold text-gray-800">
            Weather Settings
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Configure API and display settings
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150"
        >
          <Save className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Save Changes</span>
          <span className="sm:hidden">Save</span>
        </button>
      </header>

      {/* Live Status Banner */}
      {liveWeather && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-lg flex justify-between items-center">
          <div className="flex">
            <Cloud className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Live Weather in {liveWeather.cityName}
              </p>
              <p className="text-xs text-blue-600">
                Temp: {liveWeather.temperature}° {liveWeather.unit} |{" "}
                {liveWeather.description}
              </p>
            </div>
          </div>
          <img
            src={liveWeather.iconUrl}
            alt="weather icon"
            className="w-10 h-10"
          />
        </div>
      )}

      {/* Providers Section */}
      <h2 className="text-lg font-bold text-gray-800 mb-3">
        Weather API Providers
      </h2>

      {/* --- Change: Loading State or Empty Check --- */}
      {providers.length === 0 ? (
        <p className="text-gray-500">Loading Providers...</p>
      ) : (
        providers.map((provider) => (
          <ProviderCard
            key={provider.name}
            {...provider}
            onActivate={handleActivateProvider}
          />
        ))
      )}

      <hr className="my-8 border-gray-200" />

      {/* Grid: Keys & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Keys Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg border-b border-gray-200 pb-4 font-bold text-gray-800 mb-6">
            API Keys
          </h2>

          <InputGroup
            label="OpenWeatherMap API Key"
            type="key"
            value={apiKeys.openWeather}
            editable
            onChange={(v) => setApiKeys({ ...apiKeys, openWeather: v })}
          />
          <InputGroup
            label="WeatherBit API Key"
            type="key"
            value={apiKeys.weatherBit}
            editable
            onChange={(v) => setApiKeys({ ...apiKeys, weatherBit: v })}
          />
          <InputGroup
            label="WeatherAPI Key"
            type="key"
            value={apiKeys.weatherApi}
            editable
            onChange={(v) => setApiKeys({ ...apiKeys, weatherApi: v })}
          />

          <button
            onClick={handleUpdateApiKeys}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150"
          >
            Update API Keys
          </button>
        </div>

        {/* Settings Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg border-b border-gray-200 pb-4 font-bold text-gray-800 mb-6">
            Settings
          </h2>

          <InputGroup
            label="Refresh Rate (Minutes)"
            type="refresh"
            value={apiSettings.refreshRate}
            editable
            onChange={(v) => setApiSettings({ ...apiSettings, refreshRate: v })}
          />

          <InputGroup
            label="Default Location"
            type="location"
            value={apiSettings.location}
            editable
            onChange={(v) => setApiSettings({ ...apiSettings, location: v })}
          />

          {/* Temperature Unit */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-700 mb-2 font-medium">
              <RotateCw className="w-5 h-5 text-gray-400" />
              <span className="ml-2">Temperature Unit</span>
            </div>
            <div className="flex items-center space-x-6">
              {/* Celsius */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tempUnit"
                  value="Celsius"
                  checked={tempUnit === "Celsius"}
                  onChange={() => setTempUnit("Celsius")}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 transition duration-150 ${
                    tempUnit === "Celsius"
                      ? "border-green-600 bg-green-600 flex items-center justify-center"
                      : "border-gray-400"
                  }`}
                >
                  {tempUnit === "Celsius" && (
                    <CheckCircle className="w-4 h-4 text-white p-[1px]" />
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-700 font-medium">
                  Celsius (°C)
                </span>
              </label>

              {/* Fahrenheit */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tempUnit"
                  value="Fahrenheit"
                  checked={tempUnit === "Fahrenheit"}
                  onChange={() => setTempUnit("Fahrenheit")}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 transition duration-150 ${
                    tempUnit === "Fahrenheit"
                      ? "border-green-600 bg-green-600 flex items-center justify-center"
                      : "border-gray-400"
                  }`}
                >
                  {tempUnit === "Fahrenheit" && (
                    <CheckCircle className="w-4 h-4 text-white p-[1px]" />
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-700 font-medium">
                  Fahrenheit (°F)
                </span>
              </label>
            </div>
          </div>

          {/* Enable Forecast Toggle */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-700 font-medium">
              Enable Forecast
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableForecast}
                onChange={() => setEnableForecast(!enableForecast)}
                className="sr-only peer"
              />
              <div
                className={`w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 transition-colors duration-200 ${
                  enableForecast ? "bg-green-600" : "bg-gray-200"
                }`}
              >
                <div
                  className={`absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow ${
                    enableForecast ? "translate-x-full" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
