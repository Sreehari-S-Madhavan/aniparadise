/**
 * Centralized animation variants for AniParadise
 * All animations are subtle, performant, and UX-focused
 */

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } // easeOut
};

export const cardHover = {
  rest: { scale: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  hover: { 
    scale: 1.02, 
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    transition: { duration: 0.2 }
  }
};

export const listItem = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05, // Staggered animation
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

export const buttonTap = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02,
    y: -2,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};
