import React, { useState, useEffect } from "react";

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [bases, setBases] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "logistics_officer",
    base_id: "1"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch bases when component mounts or when switching to signup
  useEffect(() => {
    if (isSignup) {
      fetchBases();
    }
  }, [isSignup]);

  const fetchBases = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/bases');
      if (response.ok) {
        const data = await response.json();
        setBases(data.bases || []);
        // Set the first base as default if available
        if (data.bases && data.bases.length > 0) {
          setFormData(prev => ({
            ...prev,
            base_id: data.bases[0].id.toString()
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch bases:', error);
      // Fallback to default bases if API fails
      setBases([
        { id: 1, name: 'Fort Alpha', location: 'Washington, DC' },
        { id: 2, name: 'Base Beta', location: 'San Diego, CA' },
        { id: 3, name: 'Station Gamma', location: 'Norfolk, VA' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Call the onLogin callback with the complete response
      onLogin(data);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          base_id: parseInt(formData.base_id)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMessage("Account created successfully! You can now sign in.");
      setIsSignup(false);
      setFormData({
        username: "",
        email: formData.email, // Keep email for easy login
        password: "",
        confirmPassword: "",
        role: "logistics_officer",
        base_id: "1"
      });
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials for easy testing
  const fillDemoCredentials = (role) => {
    const demoCredentials = {
      admin: { email: "admin@military.gov", password: "admin123" },
      commander: { email: "commander.alpha@military.gov", password: "commander123" },
      logistics: { email: "logistics.alpha@military.gov", password: "logistics123" }
    };

    setFormData(prev => ({
      ...prev,
      ...demoCredentials[role]
    }));
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setSuccessMessage("");
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "logistics_officer",
      base_id: "1"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Military Asset Management
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignup ? 'Create your account' : 'Sign in to access the system'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={isSignup ? handleSignup : handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            {isSignup && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required={isSignup}
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email address"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>

            {isSignup && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required={isSignup}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm your password"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="logistics_officer">Logistics Officer</option>
                    <option value="base_commander">Base Commander</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="base_id" className="block text-sm font-medium text-gray-700">Base Assignment</label>
                  <select
                    id="base_id"
                    name="base_id"
                    value={formData.base_id}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {bases.length > 0 ? (
                      bases.map(base => (
                        <option key={base.id} value={base.id.toString()}>
                          {base.name} - {base.location}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="1">Fort Alpha - Washington, DC</option>
                        <option value="2">Base Beta - San Diego, CA</option>
                        <option value="3">Station Gamma - Norfolk, VA</option>
                      </>
                    )}
                  </select>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {loading ? (isSignup ? 'Creating Account...' : 'Signing in...') : (isSignup ? 'Create Account' : 'Sign in')}
            </button>
          </div>

          {/* Toggle between login and signup */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Demo Credentials - only show for login */}
          {!isSignup && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Demo Credentials</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border"
                >
                  <strong>Admin:</strong> admin@military.gov
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('commander')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border"
                >
                  <strong>Base Commander:</strong> commander.alpha@military.gov
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('logistics')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border"
                >
                  <strong>Logistics Officer:</strong> logistics.alpha@military.gov
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
