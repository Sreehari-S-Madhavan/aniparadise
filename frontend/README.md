# AniParadise Frontend

## Animation Strategy

### Philosophy
Animations in AniParadise are **subtle, purposeful, and performant**. They enhance UX without distracting from content.

### Animation System

#### 1. **Page Transitions** (`PageTransition.jsx`)
- **Effect**: Fade + slight vertical slide (12px)
- **Duration**: 0.3s
- **Easing**: Custom easeOut curve
- **Usage**: Wraps all page components for smooth route changes

#### 2. **Card Animations** (`AnimatedCard.jsx`)
- **Hover**: Scale to 1.02x + increased shadow
- **Duration**: 0.2s
- **Mobile**: Hover effects automatically disabled on touch devices
- **Usage**: All anime cards, discussion cards, etc.

#### 3. **List Animations** (`AnimatedList.jsx`)
- **Effect**: Staggered fade-in with upward motion
- **Stagger**: 50ms delay between items
- **Usage**: Anime lists, search results

#### 4. **Button Interactions** (`AnimatedButton.jsx`)
- **Hover**: Slight lift (2px up) + scale to 1.02x
- **Tap**: Scale down to 0.95x
- **Duration**: 0.2s hover, 0.1s tap
- **Usage**: All interactive buttons

### Performance Rules
- ✅ Only animate `transform` and `opacity` (GPU-accelerated)
- ✅ No layout-thrashing properties (width, height, margin, etc.)
- ✅ Mobile-first: Hover effects disabled on touch devices
- ✅ Animations are optional and can be disabled via `prefers-reduced-motion`

### File Structure
```
src/
├── animations/
│   └── variants.js          # Centralized animation variants
├── components/
│   ├── AnimatedCard.jsx     # Reusable card with hover
│   ├── AnimatedButton.jsx   # Reusable button with feedback
│   ├── AnimatedList.jsx     # Staggered list animations
│   └── PageTransition.jsx   # Page transition wrapper
├── pages/
│   ├── Home.jsx
│   ├── AnimeDetail.jsx
│   ├── Login.jsx
│   └── Register.jsx
└── App.jsx                  # Router with AnimatePresence
```

### Usage Example

```jsx
import PageTransition from '../components/PageTransition';
import AnimatedCard from '../components/AnimatedCard';

function MyPage() {
  return (
    <PageTransition>
      <AnimatedCard onClick={handleClick}>
        <h3>Anime Title</h3>
        <p>Description</p>
      </AnimatedCard>
    </PageTransition>
  );
}
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
