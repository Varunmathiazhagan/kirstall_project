import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ShieldCheckIcon,
  UserIcon,
  KeyIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

function Login({ onLogin }) {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const [isSignup, setIsSignup] = useState(false);
  const [bases, setBases] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Animation effects
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current.querySelectorAll('.form-field'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [isSignup]);

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
        { id: 3, name: 'Station Gamma', location: 'Norfolk, VA' },
        { id: 4, name: 'Camp Delta', location: 'Fort Bragg, NC' },
        { id: 5, name: 'Naval Base Echo', location: 'Pearl Harbor, HI' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (isSignup) {
      if (!formData.username.trim()) {
        setError("Username is required");
        return false;
      }
      if (!formData.email.trim()) {
        setError("Email is required");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Please enter a valid email address");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    } else {
      if (!formData.username.trim()) {
        setError("Username is required");
        return false;
      }
      if (!formData.password.trim()) {
        setError("Password is required");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(error);
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const endpoint = isSignup ? 'signup' : 'login';
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isSignup) {
          setSuccessMessage(data.message || "Account created successfully! You can now log in.");
          toast.success("Account created successfully!");
          setTimeout(() => {
            setIsSignup(false);
            setFormData({
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
              role: "logistics_officer",
              base_id: "1"
            });
          }, 2000);
        } else {
          toast.success("Login successful!");
          onLogin(data.token, data.user);
        }
      } else {
        setError(data.message || 'An error occurred');
        toast.error(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = 'Network error. Please check your connection.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <motion.div 
        ref={containerRef}
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ShieldCheckIcon className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Military Asset Manager
          </h1>
          <p className="text-blue-200">
            {isSignup ? "Create your account" : "Secure access to military assets"}
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div 
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Tab Switcher */}
          <div className="flex mb-8 bg-black/20 rounded-xl p-1">
            <motion.button
              onClick={() => !isSignup && handleModeSwitch()}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                !isSignup 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={() => isSignup && handleModeSwitch()}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                isSignup 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Username Field */}
              <motion.div 
                className="form-field"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-white mb-2">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="Enter your username"
                  />
                </div>
              </motion.div>

              {/* Email Field (Signup only) */}
              {isSignup && (
                <motion.div 
                  className="form-field"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </motion.div>
              )}

              {/* Password Field */}
              <motion.div 
                className="form-field"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: isSignup ? 0.2 : 0.1 }}
              >
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Confirm Password Field (Signup only) */}
              {isSignup && (
                <motion.div 
                  className="form-field"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-300"
                      placeholder="Confirm your password"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Role and Base Fields (Signup only) */}
              {isSignup && (
                <>
                  <motion.div 
                    className="form-field"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-white mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    >
                      <option value="logistics_officer" className="text-slate-900">Logistics Officer</option>
                      <option value="commander" className="text-slate-900">Commander</option>
                      <option value="admin" className="text-slate-900">Administrator</option>
                      <option value="inventory_manager" className="text-slate-900">Inventory Manager</option>
                    </select>
                  </motion.div>

                  <motion.div 
                    className="form-field"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-white mb-2">
                      Base Assignment
                    </label>
                    <div className="relative">
                      <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                      <select
                        name="base_id"
                        value={formData.base_id}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-300"
                      >
                        {bases.map(base => (
                          <option key={base.id} value={base.id} className="text-slate-900">
                            {base.name} - {base.location}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="flex items-center space-x-2 text-red-300 bg-red-500/20 border border-red-500/30 rounded-xl p-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  className="flex items-center space-x-2 text-green-300 bg-green-500/20 border border-green-500/30 rounded-xl p-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Processing...</span>
                </div>
              ) : (
                isSignup ? "Create Account" : "Sign In"
              )}
            </motion.button>
          </form>

          {/* Switch Mode */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white/70">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
            </p>
            <motion.button
              onClick={handleModeSwitch}
              className="text-blue-300 hover:text-blue-200 font-medium underline transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSignup ? "Sign in here" : "Create one here"}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8 text-white/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>© 2025 Military Asset Management System</p>
          <p>Secure • Reliable • Efficient</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
