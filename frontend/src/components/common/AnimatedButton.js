import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  animationType = 'framer',
  onClick,
  disabled = false,
  loading = false,
  ...props 
}) => {
  const buttonRef = useRef(null);

  // CSS-based ripple effect
  const createRipple = (e) => {
    if (!buttonRef.current || disabled || loading) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      animation: ripple 0.6s linear forwards;
    `;

    // Add CSS keyframes if not already added
    if (!document.querySelector('#ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 600);
  };

  // Base styles
  const baseStyles = "relative overflow-hidden font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-500",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white focus:ring-gray-500",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white focus:ring-green-500",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white focus:ring-red-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (animationType === 'framer') {
    return (
      <motion.button
        ref={buttonRef}
        initial={{ scale: 1 }}
        whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={combinedClassName}
        onClick={(e) => {
          createRipple(e);
          if (onClick && !disabled && !loading) onClick(e);
        }}
        disabled={disabled || loading}
        {...props}
      >
        <span className={`flex items-center justify-center ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {children}
        </span>
        
        {loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        )}
      </motion.button>
    );
  }

  // Default framer motion button
  return (
    <motion.button
      ref={buttonRef}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={combinedClassName}
      onClick={(e) => {
        createRipple(e);
        if (onClick && !disabled && !loading) onClick(e);
      }}
      disabled={disabled || loading}
      {...props}
    >
      <span className={`flex items-center justify-center ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      
      {loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      )}
    </motion.button>
  );
};

export default AnimatedButton;
