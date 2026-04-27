```markdown
# Design System Strategy: Urban Sophistication

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Midnight."** 

This system is designed to evoke the feeling of a premium Mercedes-Benz gliding through the Melbourne CBD at 11:00 PM—where the deep shadows of bluestone laneways meet the sharp, electric glow of streetlights and high-end architecture. We are moving away from the "utility app" aesthetic and toward a "luxury concierge" experience. 

To break the "template" look, this system utilizes **Intentional Asymmetry**. We favor large, editorial-style typography that overlaps container edges and high-contrast tonal shifts that define space without the need for restrictive lines. The layout should feel like a high-end fashion editorial: breathing room is a luxury, and whitespace is our most valuable asset.

## 2. Colors & Surface Architecture
The palette is rooted in a deep, nocturnal foundation, punctuated by "Melbourne Gold."

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections or cards. In this system, boundaries are created through "Tonal Carving." A section is defined by a shift from `surface` (#121416) to `surface-container-low` (#1a1c1e). This creates a sophisticated, seamless transition that feels integrated, not boxed in.

### Surface Hierarchy & Nesting
Treat the UI as a physical environment with depth. Use the following tiers to nest information:
- **Base Layer:** `surface` (#121416) for the main background.
- **Sectional Layer:** `surface-container-low` (#1a1c1e) for large content blocks.
- **Interactive Layer:** `surface-container-high` (#282a2c) for cards or floating elements.
- **Primary Action:** `primary_container` (#ffd700) reserved for the most critical user path (e.g., "Book Now").

### The "Glass & Gradient" Rule
To add "soul" to the digital interface:
- **Glassmorphism:** Use `surface_variant` at 60% opacity with a `20px` backdrop-blur for navigation bars and floating action sheets. This allows the vibrant city photography to bleed through, maintaining the "Urban Sophistication" vibe.
- **Signature Textures:** Apply a subtle linear gradient from `primary_container` (#ffd700) to `primary_fixed_dim` (#e9c400) on primary CTAs to give them a metallic, premium weight.

## 3. Typography
Our typography pairing balances technical precision with high-end editorial flair.

*   **Display & Headlines (Space Grotesk):** This is our "Architectural" voice. It is modern, slightly wide, and carries a sense of movement. Use `display-lg` for hero headlines with tight letter-spacing (-2%) to create an authoritative, premium impact.
*   **Body & Labels (Manrope):** This is our "Concierge" voice. Manrope provides exceptional legibility at small sizes, ensuring that even in a moving vehicle, the user can easily read trip details. 
*   **Editorial Hierarchy:** Don't be afraid of scale. A `display-md` headline can sit comfortably next to a `body-sm` label; the extreme contrast in scale is what creates the "High-End Transport" feel.

## 4. Elevation & Depth
We eschew traditional "drop shadows" in favor of light-based depth.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-highest` card on a `surface-container-low` background. The subtle shift in hex value is enough to signify elevation to the human eye without visual clutter.
*   **Ambient Shadows:** If an element must float (e.g., a booking modal), use a shadow with a 32px blur, 0px offset, and 6% opacity. The shadow color must be derived from `on-surface` (#e2e2e5) to simulate ambient urban light.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a container edge, use a "Ghost Border": `outline-variant` (#4d4732) at 15% opacity. It should be felt, not seen.

## 5. Components

### Buttons
- **Primary:** `primary_container` background with `on-primary_fixed` text. Shape: `md` (0.375rem). Use uppercase for the label to enhance the premium "logotype" feel.
- **Secondary:** `surface-container-highest` background. No border. Subtle hover state shifting to `surface-bright`.
- **Tertiary/Ghost:** No background. Text in `primary`. Used for low-emphasis actions like "Cancel."

### Input Fields
- **Styling:** Use `surface-container-lowest` as the field background. This creates an "inset" look.
- **Focus State:** Instead of a thick border, use a 2px underline of `primary_container` and a subtle glow (4px blur) of the same color.
- **Typography:** Placeholder text should use `label-md` in `on-surface-variant`.

### Cards & Lists
- **The Zero-Divider Rule:** Explicitly forbid horizontal lines between list items. Use 16px or 24px of vertical whitespace to separate items.
- **Vehicle Selection Cards:** Use a large image of the Maxi Taxi overlapping the card edge (Asymmetry). The card background should be `surface-container-high`.

### Special Component: The "Progress Ribbon"
For the booking flow, use a thin 2px line of `primary_fixed_dim` that runs across the very top of the screen, rather than a bulky stepper component. It is a minimalist nod to the journey ahead.

## 6. Do's and Don'ts

### Do:
- **Do** use high-quality, high-contrast imagery of Melbourne (e.g., Crown Towers, Flinders St Station at night).
- **Do** lean into the `xl` (0.75rem) roundedness for large image containers to soften the urban grit.
- **Do** use `on-surface-variant` for secondary information to maintain a clear visual hierarchy.

### Don't:
- **Don't** use pure black (#000000). Always use the `surface` palette to keep the "Midnight Blue" depth alive.
- **Don't** use standard icons. Use "Thin" or "Light" weight stroke icons to match the sophistication of Space Grotesk.
- **Don't** crowd the interface. If a screen feels full, increase the whitespace and move secondary actions into a "More" menu. Space is the ultimate signifier of luxury.

---
*Document end. This system is a living framework. When in doubt, prioritize the "Kinetic Midnight" aesthetic: dark, glowing, and effortlessly smooth.*```