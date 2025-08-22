import React from 'react';
import { motion } from 'framer-motion';

const AnimatedTable = ({ 
  data = [], 
  columns = [], 
  className = '',
  onRowClick,
  loading = false,
  emptyMessage = "No data available"
}) => {

  // Framer Motion variants for table container
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden ${className}`}
      >
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9M4 13v4a2 2 0 002 2h2m0 0h2a2 2 0 002-2v-1" />
            </svg>
          </div>
          <p className="text-white/80 text-lg">{emptyMessage}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={tableVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <motion.thead 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5"
          >
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-6 py-4 text-left text-sm font-semibold text-white/90 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </motion.thead>
          <tbody className="divide-y divide-white/10">
            {data.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`
                  hover:bg-white/5 transition-colors duration-200 cursor-pointer
                  ${onRowClick ? 'hover:scale-[1.01] transform-gpu' : ''}
                `}
                onClick={() => onRowClick && onRowClick(item, index)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? (
                      column.render(item[column.key], item, index)
                    ) : (
                      <span className="text-white/80">
                        {item[column.key]}
                      </span>
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AnimatedTable;
