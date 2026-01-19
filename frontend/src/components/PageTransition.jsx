import { motion } from 'framer-motion';
import { pageTransition } from '../animations/variants';

/**
 * Page transition wrapper component
 * Wraps page content for smooth route transitions
 */
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  );
}
