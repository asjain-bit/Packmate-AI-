# PackMate Design System Guidelines

This document outlines the core design language, tokens, and component guidelines for the PackMate application. Keeping this in a centralized design folder ensures a consistent and premium user experience as the application scales.

## 1. Brand Colors

The application relies on a curated palette of natural, earthy, and vibrant tones to evoke a sense of travel and calmness.

- **Primary (`#062E1C`)**: Deep, rich green used for the sidebar, major branding elements, and primary text contrast.
- **Secondary (`#22C55E`)**: Vibrant, energetic green used for primary buttons, focus outlines, and success indicators.
- **Accent (`#86EFAC`)**: Light, pastel green used for hover states on active elements and subtle highlights.
- **Light (`#DCFCE7`)**: Very faint green used for backgrounds of badges and active list items.
- **Neutral (`#F3EBD3`)**: A warm, off-white/beige tone used to add softness to backgrounds or secondary cards.
- **Background (`#FAFAF8`)**: The primary application background color. It's a crisp, slightly warm white that reduces eye strain.

## 2. Text & Surface Colors

- **Text Dark (`#021a10`)**: Used for all major headings (`h1`, `h2`, `h3`, `h4`).
- **Text Main (`#2b3a30`)**: Used for standard body copy.
- **Text Muted (`#5c6e62`)**: Used for secondary information, timestamps, and subtitles.
- **Text Light (`#8fa094`)**: Used for placeholders and disabled text.
- **Card Background (`#ffffff`)**: Pure white for elevated surfaces.
- **Card Border (`rgba(22, 101, 52, 0.08)`)**: A very subtle green-tinted border for all cards, ensuring they blend harmoniously rather than using harsh grays.

## 3. Typography

PackMate uses a modern, unified font system to keep the interface highly legible and beautifully clean.

- **Display, Headings & UI**: `Poppins`, sans-serif. Used for all elements, including the logo, major headings, body copy, and UI controls. Provides a friendly, geometric, and modern aesthetic.

**Sizes:**
- `.text-xs`: `0.75rem`
- `.text-sm`: `0.875rem`
- `.text-md`: `1rem`
- `.text-lg`: `1.125rem`

## 4. Radii & Shapes

Curved edges create a friendly, approachable interface.
- **Cards (`--radius-card`)**: `24px`. Used for major structural containers and onboarding cards.
- **Buttons (`--radius-button`)**: `16px`. Provides a pill-like softness to CTAs.
- **Inputs (`--radius-input`)**: `16px`. Matches buttons for consistency.
- **Hero/Large Elements (`--radius-hero`)**: `32px`. Used for large imagery and top-level structural elements.

## 5. Elevations & Shadows

Shadows are tinted slightly with the primary green to prevent "muddy" gray shadows and keep the interface looking vibrant.
- **Soft (`--shadow-soft`)**: `0 4px 20px rgba(22, 101, 52, 0.03)`. Used for resting states of cards.
- **Medium (`--shadow-medium`)**: `0 10px 30px rgba(22, 101, 52, 0.06)`. Used for floating elements like the prompt bar.
- **Hover (`--shadow-hover`)**: `0 16px 40px rgba(22, 101, 52, 0.1)`. Used when a user interacts with a clickable card.

## 6. Interactive States & Buttons

### Primary Button (`.btn-primary`)
- **Resting**: Background `--secondary`, Text `white`.
- **Hover**: Transforms slightly upward (`translateY(-2px)`), shadow increases to `--shadow-medium`, background slightly brightens.
- **Active**: Transforms downward (`translateY(0)`).

### Neutral/Ghost Button (`.btn-neutral`)
- **Resting**: Background `transparent`, border `1px solid var(--card-border)`.
- **Hover**: Background `#f8f9fa`, border darkens slightly.

### Accessibility (Focus States)
- All interactive elements (inputs, buttons, links) use a WCAG AA compliant focus outline: `3px solid var(--secondary)` with a `3px` offset.
- Exception: The main AI prompt input explicitly removes the focus ring to rely on the wrapper's styling for a cleaner look.

## 7. Animations & Transitions

Micro-interactions are crucial for a premium feel.
- **Standard Transition**: `0.3s cubic-bezier(0.25, 0.8, 0.25, 1)`. Used for hover states, color changes, and minor movements.
- **Slow Transition**: `0.5s cubic-bezier(0.25, 0.8, 0.25, 1)`. Used for layout shifts or modal appearances.
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` by stripping animations to 0s for accessibility.

## 8. Assets

Here are the primary image assets used throughout the application. 

### Brand Logo
The main typography logo used in the top navigation and dashboard.
![PackMate Logo](/Users/ashika/Documents/PackMate/src/assets/logo.png)

### AI Assistant Icon
The glowing sphere representing the intelligent assistant in the sidebar.
![Packmate AI Icon](/Users/ashika/Documents/PackMate/public/packmate-ai.png)

### Hero Illustrations
The large, immersive illustration used in the "Start a New Trip" dashboard card.
![Start Trip Hero](/Users/ashika/Documents/PackMate/src/assets/start_trip_hero.png)

### Pollinations AI Dynamic Imagery
High-quality, rounded corner imagery is pulled dynamically for trips (e.g., `https://image.pollinations.ai/prompt/...`) rather than statically stored, keeping the app lightweight while providing beautiful, contextual destination photography.

## 9. Layout Principles

- **Sidebar**: Fixed width (`260px`), sticky positioning, deeply colored (`#042013`) to anchor the application.
- **Main Dashboard**: Fluid layout, max-width constrained content areas (e.g., `max-width: 1080px` for cards), flexbox-driven to ensure responsiveness.
- **Z-Index Strategy**:
  - `100`: Sidebar Navigation
  - `1000`: Sticky floating components (AI prompt bar)
  - `2000`: Modal Overlays
