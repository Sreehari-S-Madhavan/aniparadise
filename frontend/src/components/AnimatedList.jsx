import { motion } from 'framer-motion';
import { listItem } from '../animations/variants';

/**
 * Reusable animated list component
 * Provides staggered fade-in animation for list items
 * @param {Array} items - Array of React elements to animate
 * @param {string} className - Additional CSS classes
 */
export default function AnimatedList({ items = [], className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.key || index}
          custom={index}
          variants={listItem}
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}
