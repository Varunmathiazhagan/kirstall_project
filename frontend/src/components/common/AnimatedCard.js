import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = '', 
  delay = 0, 
  animationType = 'framer',
  onClick,
  ...props 
}) => {

  // Default framer motion animation
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: delay / 1000,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`transform transition-all duration-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
