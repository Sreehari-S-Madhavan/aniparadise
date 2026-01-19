import { motion } from 'framer-motion';
import { buttonTap } from '../animations/variants';
import styles from './AnimatedButton.module.css';

/**
 * Reusable animated button component
 * Provides clear visual feedback on interaction
 */
export default function AnimatedButton({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}) {
  return (
    <motion.button
      className={`${styles.button} ${styles[variant]} ${className}`}
      variants={buttonTap}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {children}
    </motion.button>
  );
}
