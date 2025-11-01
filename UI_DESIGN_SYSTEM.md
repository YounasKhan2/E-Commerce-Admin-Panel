# UI Design System - Metrix Commerce Admin Panel

## Color Palette

### Primary Colors
- **Primary**: `#1173d4` - Used for primary actions, active states, and key UI elements
- **Background Dark**: `#101922` - Main background color
- **Sidebar**: `#192734` - Sidebar and card backgrounds
- **Positive**: `#0bda5b` - Success states and positive indicators
- **Negative**: `#fa6238` - Error states and negative indicators

### Text Colors
- **Primary Text**: `white` - Main content text
- **Secondary Text**: `slate-400` or `#92adc9` - Labels, descriptions, helper text
- **Tertiary Text**: `slate-500` - Placeholder text

### Border Colors
- **Default**: `slate-700` - Card borders, dividers
- **Input**: `slate-600` - Input field borders
- **Focus**: `primary` - Focus ring color

## Typography

### Font Family
- **Primary**: Inter (via `--font-display`)
- **Icons**: Material Symbols Outlined

### Font Sizes
- **text-xs**: 0.75rem (12px) - Labels, badges, helper text, table headers
- **text-sm**: 0.875rem (14px) - Body text, buttons, inputs, navigation links
- **text-base**: 1rem (16px) - Page descriptions, larger body text
- **text-lg**: 1.125rem (18px) - Card titles, section headers
- **text-xl**: 1.25rem (20px) - Modal titles
- **text-2xl**: 1.5rem (24px) - Metric values
- **text-3xl**: 1.875rem (30px) - Page titles

### Font Weights
- **font-normal**: 400 - Body text
- **font-medium**: 500 - Navigation links, labels
- **font-semibold**: 600 - Card titles, section headers
- **font-bold**: 700 - Page titles, metric values

## Spacing

### Padding
- **Compact**: `p-2` (0.5rem / 8px) - Very tight spacing
- **Small**: `p-3` (0.75rem / 12px) - Tight spacing for mobile
- **Medium**: `p-4` (1rem / 16px) - Standard spacing
- **Large**: `p-6` (1.5rem / 24px) - Comfortable spacing
- **Extra Large**: `p-8` (2rem / 32px) - Spacious layouts

### Gaps
- **Tight**: `gap-2` (0.5rem / 8px) - Between related items
- **Standard**: `gap-3` (0.75rem / 12px) - Between form fields
- **Comfortable**: `gap-4` (1rem / 16px) - Between sections

### Margins
- **Small**: `mb-2` (0.5rem / 8px) - Between label and input
- **Medium**: `mb-4` (1rem / 16px) - Between form sections
- **Large**: `mb-6` (1.5rem / 24px) - Between page sections (mobile)
- **Extra Large**: `mb-8` (2rem / 32px) - Between page sections (desktop)

## Components

### Buttons
- **Sizes**: sm (text-xs), md (text-sm), lg (text-base)
- **Variants**: primary, secondary, danger, ghost
- **Padding**: Compact (px-3 py-1.5 for sm, px-4 py-2 for md)
- **Icons**: Material Symbols Outlined, text-base size

### Inputs
- **Text Size**: text-sm
- **Label Size**: text-sm
- **Helper Text**: text-xs
- **Padding**: px-3 py-2
- **Border**: border-slate-600, focus:ring-2 focus:ring-primary

### Badges
- **Text Size**: text-xs
- **Padding**: px-2 py-0.5 (sm), px-2.5 py-1 (md)
- **Variants**: success, warning, danger, info, neutral

### Cards
- **Background**: bg-sidebar
- **Border**: border-slate-700
- **Padding**: p-3 md:p-4 (responsive)
- **Title Size**: text-base md:text-lg
- **Border Radius**: rounded-xl

### Tables
- **Header Text**: text-xs uppercase
- **Body Text**: text-sm
- **Row Padding**: px-4 py-3
- **Hover**: hover:bg-white/5

### Modals
- **Title Size**: text-lg sm:text-xl
- **Padding**: p-4 sm:p-6 (responsive)
- **Max Height**: max-h-[95vh] sm:max-h-[90vh]

### Navigation
- **Link Text**: text-sm
- **Icon Size**: text-base (20px)
- **Active State**: bg-primary with filled icon
- **Hover**: hover:bg-white/10

## Icons

### Material Symbols Outlined
- **Default Size**: 20px (text-base)
- **Large Icons**: 24px (text-xl)
- **Extra Large**: 32px (text-3xl)
- **Configuration**:
  - FILL: 0 (default), 1 (filled for active states)
  - wght: 400
  - GRAD: 0
  - opsz: 24

### Common Icons
- Dashboard: `dashboard`
- Orders: `shopping_cart`
- Products: `inventory_2`
- Categories: `category`
- Customers: `group`
- Analytics: `bar_chart`
- Settings: `settings`
- Logout: `logout`
- Add: `add`
- Edit: `edit`
- Delete: `delete`
- Search: `search`
- Filter: `filter_list`
- Close: `close`
- Menu: `menu`

## Responsive Breakpoints

### Tailwind Breakpoints
- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Desktops
- **xl**: 1280px - Large desktops

### Responsive Patterns
- **Mobile First**: Start with mobile styles, add breakpoints for larger screens
- **Sidebar**: Hidden on mobile (< lg), visible on desktop
- **Padding**: Smaller on mobile (p-3), larger on desktop (p-4, p-6)
- **Text**: Smaller on mobile (text-sm), larger on desktop (text-base)
- **Layout**: Stack on mobile (flex-col), side-by-side on desktop (flex-row)

## Transitions

### Duration
- **Fast**: 150ms - Hover states
- **Standard**: 200ms - Most transitions
- **Slow**: 300ms - Sidebar, modals

### Easing
- **Default**: ease-in-out
- **Smooth**: cubic-bezier(0.4, 0, 0.2, 1)

### Common Transitions
- **Colors**: `transition-colors duration-200`
- **All**: `transition-all duration-200`
- **Transform**: `transition-transform duration-300`

## Accessibility

### Focus States
- **Ring**: `focus:ring-2 focus:ring-primary`
- **Offset**: `focus:ring-offset-2 focus:ring-offset-background-dark`
- **Outline**: `focus:outline-none` (when using ring)

### Disabled States
- **Opacity**: `disabled:opacity-50`
- **Cursor**: `disabled:cursor-not-allowed`

### ARIA Labels
- Use `aria-label` for icon-only buttons
- Use `aria-describedby` for form field descriptions
- Use `role` attributes for custom components

## Best Practices

### Consistency
- Always use the defined color palette
- Stick to the typography scale
- Use consistent spacing (multiples of 4px)
- Follow the component patterns

### Performance
- Use Tailwind's JIT mode for optimal bundle size
- Lazy load heavy components
- Optimize images with Next.js Image component
- Use skeleton loaders for better perceived performance

### Dark Theme
- All components are designed for dark mode
- Use appropriate contrast ratios (WCAG AA minimum)
- Test with different screen brightness levels
- Provide sufficient visual hierarchy

### Mobile Experience
- Touch targets minimum 44x44px
- Adequate spacing between interactive elements
- Scrollable tables with overflow-x-auto
- Collapsible sidebar on mobile
- Responsive text sizes and padding
