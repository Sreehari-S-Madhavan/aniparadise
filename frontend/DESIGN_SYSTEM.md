# AniParadise Design System

## Overview
This design system is based on the Stitch design files provided in the `design/` folder. The design features a cyberpunk/anime aesthetic with a dark theme.

## Color Palette

### Primary Colors
- **Primary Cyan**: `#47ebeb` - Main brand color, used for CTAs and highlights
- **Accent Purple**: `#C580E6` - Secondary accent color
- **Accent Pink**: `#E680BC` - Tertiary accent color

### Background Colors
- **Background Light**: `#f2f2f3` - Light mode background (not currently used)
- **Background Dark**: `#1c1c22` - Main dark background
- **Card Dark**: `#2B2E33` - Card/surface background
- **Surface Dark**: `#2b2e33` - Alternative surface color

## Typography

### Font Family
- **Display Font**: Spline Sans (Google Fonts)
  - Weights: 300, 400, 500, 600, 700, 800
  - Used for all text content

### Icon System
- **Material Symbols Outlined** (Google Fonts)
  - Used for all icons throughout the application
  - Font variation settings: FILL 0, wght 400

## Border Radius
- **Small**: `0.5rem` (8px)
- **Medium**: `1rem` (16px)
- **Large**: `1.5rem` (24px)
- **Full**: `9999px` (circular)

## Design Patterns

### Glow Effects
- Primary buttons and hover states use a cyan glow: `box-shadow: 0 0 20px rgba(71, 235, 235, 0.3)`

### Genre Gradients
- **Gradient 1**: Primary → Purple (135deg)
- **Gradient 2**: Purple → Pink (135deg)
- **Gradient 3**: Pink → Primary (135deg)

### Glass Morphism
- Used for cards and overlays: `background: rgba(43, 46, 51, 0.6); backdrop-filter: blur(12px)`

### Hero Gradients
- Overlay gradient for hero sections: `linear-gradient(0deg, #1c1c22 0%, rgba(28, 28, 34, 0.8) 40%, rgba(28, 28, 34, 0) 100%)`

## Component Styles

### Buttons
- **Primary**: Cyan background with dark text, glow effect
- **Secondary**: Transparent with cyan border
- Uppercase text, letter-spacing, bold weight

### Cards
- Dark background (`#2B2E33`)
- Rounded corners (1.5rem)
- Border: `rgba(255, 255, 255, 0.05)`
- Hover: Border changes to `rgba(71, 235, 235, 0.3)`

## Animation Guidelines
- Hover transitions: 0.2s - 0.3s ease
- Scale transforms: 1.02x on hover
- Glow effects activate on hover
- Page transitions: 0.3s easeOut

## Responsive Breakpoints
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large: 1440px+

## Implementation Status

✅ **Completed:**
- Color system (CSS variables)
- Typography setup (Spline Sans + Material Icons)
- Base component styles (Button, Card)
- Design system CSS file
- Dark mode by default

⏳ **To Do:**
- Build out page components matching design files
- Implement navigation header
- Create anime card components
- Build tracker list components
- Add genre filter components

## Design Files Reference
All design files are located in: `design/stitch_aniparadise_home_dashboard/`

- `aniparadise_home_dashboard/` - Main dashboard design
- `aniparadise_login/` - Login page design
- `aniparadise_anime_details/` - Anime detail page
- `aniparadise_my_tracker/` - Tracker page
- `aniparadise_browse_anime/` - Browse/search page
