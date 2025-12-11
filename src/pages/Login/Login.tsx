import { useState, type FormEvent } from "react";
import { useAuth } from "../../pages/AuthContext"; 
import { useNavigate } from "react-router-dom"; 
import { LogIn, AlertCircle } from "lucide-react"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      navigate("/dashboard"); 
    } else {
      setError("Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="text-gray-500 mt-2">Please sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>

          <div className="flex items-center justify-between text-sm mt-4">
            <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
              Create Account
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 hover:underline">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}