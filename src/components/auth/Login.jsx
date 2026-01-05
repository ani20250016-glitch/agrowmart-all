import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo1.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@agrowmartindia.com" && password === "admin123") {
      navigate("/dashboard");
    } else {
      alert("Invalid login details");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
         {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <img 
            src={logo} 
            alt="Agrowmart Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
        <h1 className="text-center text-2xl font-semibold mb-1">
          Agrowmart Admin Portal
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
         <div>
  <label className="block text-sm font-medium mb-1">Password</label>


    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter your password"
      className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
      required
    />
</div>

        

          <button
            type="submit"
            className="w-full bg-[green] text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 bg-green-100 text-center p-4 rounded-lg">
          <p className="font-semibold text-sm mb-1">For Demo Purposes</p>
          <div className="flex justify-between text-sm">
            <p><strong>Email</strong><br />admin@agrowmartindia.com</p>
            <p><strong>Password</strong><br />admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
