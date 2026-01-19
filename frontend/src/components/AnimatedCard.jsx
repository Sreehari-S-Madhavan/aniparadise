import { motion } from 'framer-motion';
import { cardHover } from '../animations/variants';
import styles from './AnimatedCard.module.css';

/**
 * Reusable animated card component
 * Handles hover animations with mobile detection
 */
export default function AnimatedCard({ children, className = '', onClick, ...props }) {
  return (
    <motion.div
      className={`${styles.card} ${className}`}
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
