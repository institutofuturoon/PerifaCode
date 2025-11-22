import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, currentPage }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex items-center gap-2 mb-6 text-sm flex-wrap"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <motion.button
            onClick={() => navigate(item.path)}
            whileHover={{ x: 2 }}
            className="text-[#c4b5fd] hover:text-white transition-colors font-semibold text-xs sm:text-sm"
          >
            {item.label}
          </motion.button>
          <ChevronRight size={16} className="text-gray-600" />
        </React.Fragment>
      ))}
      <span className="text-gray-400 font-semibold text-xs sm:text-sm truncate">
        {currentPage}
      </span>
    </motion.div>
  );
};

export default Breadcrumb;
