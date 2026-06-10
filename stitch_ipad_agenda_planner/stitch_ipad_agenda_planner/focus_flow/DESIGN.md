---
name: Focus & Flow
colors:
  surface: '#faf9fa'
  surface-dim: '#dbdadb'
  surface-bright: '#faf9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#efedee'
  surface-container-high: '#e9e8e9'
  surface-container-highest: '#e3e2e3'
  on-surface: '#1b1c1d'
  on-surface-variant: '#593f49'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f1'
  outline: '#8d6f79'
  outline-variant: '#e1bdc9'
  surface-tint: '#b7006f'
  primary: '#b3006d'
  on-primary: '#ffffff'
  primary-container: '#e00089'
  on-primary-container: '#fffcff'
  inverse-primary: '#ffb0ce'
  secondary: '#5a5f63'
  on-secondary: '#ffffff'
  secondary-container: '#dfe3e8'
  on-secondary-container: '#606569'
  tertiary: '#0b6c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#248715'
  on-tertiary-container: '#fbfff3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e5'
  primary-fixed-dim: '#ffb0ce'
  on-primary-fixed: '#3e0022'
  on-primary-fixed-variant: '#8c0054'
  secondary-fixed: '#dfe3e8'
  secondary-fixed-dim: '#c2c7cc'
  on-secondary-fixed: '#171c20'
  on-secondary-fixed-variant: '#42474b'
  tertiary-fixed: '#95fa7c'
  tertiary-fixed-dim: '#7add63'
  on-tertiary-fixed: '#012200'
  on-tertiary-fixed-variant: '#065300'
  background: '#faf9fa'
  on-background: '#1b1c1d'
  surface-variant: '#e3e2e3'
typography:
  display-date:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: '8'
  sidebar_width: 280px
  gutter: 24px
  margin_tablet: 32px
  card_padding: 16px
  stack_gap: 12px
---

## Brand & Style
The design system is centered on **Efficiency, Clarity, and Intent**. Designed specifically for high-performance users on iPad, it bridges the gap between a physical planner and a digital powerhouse. The aesthetic has shifted toward a **Vibrant Fruit Salad**—a high-energy, high-contrast approach that maintains **Elevated Minimalism** while introducing a bold, electric color palette to stimulate productivity and mental focus.

The system avoids unnecessary decorative elements, favoring functional aesthetics that prioritize the user's schedule. The emotional response is one of "energized focus"—the interface should feel like a fresh, high-contrast workspace where the user’s data pops against a professional, structured background.

## Colors
This design system utilizes a "Vibrant Fruit Salad" palette, moving away from soft tones toward high-energy, high-contrast professional spectrums.

- **Primary (Electric Magenta):** Used for active states, primary actions, and current date indicators. It represents high energy and urgent intent.
- **Secondary (Charcoal):** Used for metadata, secondary labels, and structural elements. It provides a grounded, professional foundation.
- **Tertiary (Neon Green):** Reserved strictly for high-priority highlights, success states, or "Must-Do" items. Its high visibility ensures key tasks are never missed.
- **Neutral/Surface:** The system uses a deep charcoal (`#202122`) and stark grayscale hierarchy to create a clear visual frame, ensuring the vibrant primary and tertiary colors command attention.

## Typography
The typography relies on **Inter** for its exceptional legibility and systematic feel. On an iPad, the hierarchy is emphasized through weight and size to ensure the user can scan their day at a glance.

- **Numbers & Dates:** Use `display-date` for the current day view.
- **Event Titles:** Use `title-lg` for primary calendar events and `title-md` for secondary or sub-tasks.
- **Metadata:** Use `label-sm` for time stamps and location data.
- **Section Headers:** Use `label-caps` for day names (e.g., MON, TUE) to distinguish headers from content.

## Layout & Spacing
Designed for **iPad Landscape**, the layout follows a multi-pane architecture.

- **Sidebar (Fixed):** A 280px left-hand navigation pane for monthly overview and calendar toggles.
- **Main Content (Fluid):** A 12-column grid system for the daily/weekly view. 
- **The "Breathe" Principle:** Generous margins (32px) around the iPad screen edge prevent the UI from feeling cramped despite the high-contrast color palette. 
- **Rhythm:** All spacing is based on an 8px base unit. Gaps between calendar event cards are strictly 4px to show density, while gaps between UI sections are 24px+.

## Elevation & Depth
Depth is used as a functional tool for "focusing." This design system avoids heavy skeuomorphism, opting for **Ambient Elevation**.

- **Level 0 (Background):** Solid background surface. Non-interactive.
- **Level 1 (Event Cards):** Surface container with a very soft shadow (0px 4px 12px rgba(0,0,0,0.05)). This makes events appear "lifted" and tappable.
- **Level 2 (Modals/Popovers):** Higher elevation (0px 12px 32px rgba(0,0,0,0.12)) to indicate temporary task entry or event editing.
- **Backdrop Blur:** Use a 20px blur behind sidebars or popovers to maintain context while focusing the user on the foreground action.

## Shapes
The shape language is **Soft-Geometric**. A `0.5rem` (8px) corner radius is the standard for cards and buttons, providing a modern, approachable feel that balances the aggressive, high-contrast color palette.

- **Calendar Cards:** 8px radius.
- **Action Buttons:** 8px radius (avoid pills to maintain a more structured, grid-aligned professional aesthetic).
- **Selection Rings:** Indicators for the "Current Day" should be perfect circles for maximum contrast against the rectangular grid.

## Components
- **Event Cards:** Minimalist blocks with a vertical "Category Strip" (2px wide) on the left edge. Title and time are the only visible data points until tapped.
- **Primary Action Button (FAB):** A floating "+" button in the bottom right, using **Electric Magenta** and a `rounded-lg` (16px) shape for maximum visibility.
- **Time Indicators:** A horizontal **Neon Green** line with a small circular "bulb" representing the current time, cutting across the calendar grid for high-contrast tracking.
- **Input Fields:** Inset styles with a 1px border using Charcoal. On focus, the border thickens to 2px Electric Magenta.
- **Status Chips:** Small, high-contrast pills using `label-sm` with a background tint of the **Neon Green** for success or **Electric Magenta** for urgent states.
- **Segmentation Control:** Used at the top of the main pane to toggle between Day, Week, and Month views—utilizing a subtle Charcoal background slide effect.