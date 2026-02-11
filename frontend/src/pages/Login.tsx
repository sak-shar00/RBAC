import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store";
import { login } from "../features/authSlice";
import { Button } from "../components/ui/button";
import Spinner from "../components/Spinner";
import { useNotification } from "../context/NotificationContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { showToast } = useNotification();

  // Loading stages
  const stages = [
    { text: "Initializing...", delay: 500 },
    { text: "Loading assets...", delay: 1000 },
    { text: "Verifying connection...", delay: 1500 },
    { text: "Preparing dashboard...", delay: 2500 },
  ];

  useEffect(() => {
    stages.forEach((stage) => {
      setTimeout(() => {
        setLoadingText(stage.text);
      }, stage.delay);
    });

    // Show login form after all stages
    const timer = setTimeout(() => {
      setShowLoginForm(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result) && result.payload?.user?.name) {
      showToast(`Welcome back, ${result.payload.user.name}!`, "success");
      navigate(`/${result.payload.role}/home`);
    } else {
      // Get error message from result payload or Redux state
      const errorMsg = result.payload?.message || error || "Login failed. Please try again.";
      showToast(errorMsg, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      {loading && <Spinner />}
      
      {!showLoginForm ? (
        <div className="text-center text-white">
          <div className="mb-8">
            <svg className="w-20 h-20 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2">RBAC System</h1>
          <p className="text-blue-100 mb-8">Role-Based Access Control</p>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <p className="text-lg font-medium mb-4">{loadingText}</p>
            <div className="w-full bg-white/30 rounded-full h-2 mb-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stages.findIndex(s => s.text === loadingText) + 1) * 33, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-100">Please wait while we set things up...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl w-96">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">RBAC System</h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Role-Based Access Control for efficient team management
          </p>
          <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">Login to Continue</h2>
          {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <Button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
