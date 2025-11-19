# Planning Guide

A comprehensive digital platform for Pandit Rajesh Joshi to showcase Hindu religious services, share spiritual wisdom, and connect with devotees seeking traditional ceremonies, consultations, and spiritual guidance.

**Experience Qualities**: 
1. **Reverent** - The interface should honor Hindu traditions with dignified presentation of sacred services and spiritual content
2. **Accessible** - Clear navigation through 40+ services, making it effortless for families to find the right ceremony for their needs
3. **Trustworthy** - Professional yet warm design that establishes credibility while welcoming visitors of all spiritual backgrounds

**Complexity Level**: Light Application (multiple features with basic state)
  - Multi-page navigation with service catalog, gallery, blog, contact forms, and video integration requiring state management for navigation, form handling, and content filtering

## Essential Features

### Service Catalog Browser
- **Functionality**: Displays 40+ religious services organized by category (Poojas, Sanskars, Paath, Consultations, Wellness) with detailed descriptions, durations, and purposes
- **Purpose**: Helps families discover and understand the appropriate ceremonies for their spiritual needs
- **Trigger**: User navigates to Services page or clicks service category
- **Progression**: View all services → Filter by category → Select service → Read detailed description with duration → Contact for booking
- **Success criteria**: Users can easily find specific services, understand what each ceremony entails, and know approximate time commitments

### Multi-Page Navigation System
- **Functionality**: Seamless navigation between Home, Services, About, Gallery, Blog, Charity Work, Testimonials, and Contact pages
- **Purpose**: Organizes extensive content into logical sections while maintaining easy access to all information
- **Trigger**: User clicks navigation menu items or internal page links
- **Progression**: Land on home → Navigate via menu → View content → Access related pages → Contact for services
- **Success criteria**: Users never feel lost, can access any page within 2 clicks, and understand their current location

### Contact & Inquiry System
- **Functionality**: Contact form with service selection, WhatsApp integration, email display, and social media links
- **Purpose**: Provides multiple channels for devotees to connect with Pandit Joshi for bookings and spiritual guidance
- **Trigger**: User clicks Contact button/link or completes browsing services
- **Progression**: Select service of interest → Fill contact form (name, email, phone, message) → Submit → Confirmation toast
- **Success criteria**: Forms submit successfully, user receives confirmation, contact information is clearly visible on every page

### Multimedia Gallery
- **Functionality**: Photo galleries of past ceremonies and embedded YouTube videos (17+ educational, poetry, charity, podcast content)
- **Purpose**: Builds trust through visual documentation and provides free spiritual education resources
- **Trigger**: User navigates to Gallery page or clicks video thumbnails
- **Progression**: Browse gallery → Select media type (photos/videos) → View content → Watch videos or view ceremony photos
- **Success criteria**: All media loads efficiently, videos embed properly, galleries are organized and browsable

### Blog & Educational Content
- **Functionality**: Article system showcasing spiritual wisdom, Hindu traditions, and educational content
- **Purpose**: Establishes thought leadership and provides valuable spiritual knowledge to community
- **Trigger**: User navigates to Blog section or clicks article links
- **Progression**: View blog listing → Select article → Read content → Navigate to related articles
- **Success criteria**: Articles are readable, well-formatted, and encourage engagement with spiritual teachings

## Edge Case Handling

- **Service Discovery** - Search/filter functionality helps users find specific ceremonies from 40+ options without overwhelming scrolling
- **Mobile Contact** - WhatsApp and phone number become direct-tap links on mobile devices for immediate connection
- **Video Loading** - YouTube embeds with lazy loading prevent page slowdown; fallback links if embed fails
- **Form Validation** - Clear error messages guide users to complete required fields correctly before submission
- **Empty States** - Graceful handling if gallery sections or testimonials are being populated over time

## Design Direction

The design should evoke spiritual serenity and cultural authenticity while remaining clean and modern - balancing traditional Hindu aesthetic elements (Om symbols, lotus motifs, rangoli patterns) with contemporary web design that feels professional and accessible to both traditional devotees and younger generations seeking spiritual connection. A rich interface with meaningful imagery and warm colors serves the sacred nature of the content better than stark minimalism.

## Color Selection

Triadic color scheme drawing from traditional Hindu ceremonial colors - saffron (spiritual fire and sacrifice), deep maroon (devotion and strength), and golden amber (divine light and prosperity) - creating a warm, reverent atmosphere that honors tradition.

- **Primary Color**: Deep Saffron `oklch(0.70 0.18 55)` - Communicates spiritual energy, purity, and the sacred fire of Hindu ceremonies; used for primary actions and key headings
- **Secondary Colors**: Rich Maroon `oklch(0.35 0.12 15)` for depth and grounding; Cream `oklch(0.95 0.02 80)` for soft backgrounds that reduce eye strain
- **Accent Color**: Golden Amber `oklch(0.75 0.15 75)` - Draws attention to booking CTAs, special offerings, and moments of spiritual significance
- **Foreground/Background Pairings**: 
  - Background (Soft Cream #F8F5F0 / oklch(0.97 0.01 75)): Deep Brown text (#2D1B14 / oklch(0.22 0.03 35)) - Ratio 11.2:1 ✓
  - Card (Pure White #FFFFFF / oklch(1 0 0)): Deep Brown text (#2D1B14) - Ratio 13.8:1 ✓
  - Primary (Deep Saffron oklch(0.68 0.18 55)): White text (#FFFFFF) - Ratio 4.6:1 ✓
  - Secondary (Rich Maroon oklch(0.35 0.12 15)): White text (#FFFFFF) - Ratio 8.9:1 ✓
  - Accent (Golden Amber oklch(0.72 0.15 75)): Deep Brown text (#2D1B14) - Ratio 5.2:1 ✓
  - Muted (Light Sand oklch(0.92 0.02 70)): Medium Brown text (#5D4A3F / oklch(0.45 0.03 40)) - Ratio 5.8:1 ✓

## Font Selection

Typography should balance traditional elegance with modern readability, using a refined serif for headings that evokes classical Indian typography while maintaining a clean sans-serif for body text that ensures excellent readability across devices and long-form spiritual content.

- **Typographic Hierarchy**: 
  - H1 (Page Titles): Crimson Text Bold/38px/tight letter-spacing/line-height 1.2 - Classical elegance for main headings
  - H2 (Section Headers): Crimson Text Semibold/28px/normal spacing/line-height 1.3 - Organizing major content sections
  - H3 (Service Names): Crimson Text Semibold/22px/line-height 1.4 - Individual service and feature headings
  - Body Text: Inter Regular/16px/normal spacing/line-height 1.6 - Comfortable reading for descriptions and articles
  - Service Duration/Meta: Inter Medium/14px/slightly wide spacing/line-height 1.5 - Subtle information display
  - Buttons/CTAs: Inter Semibold/15px/wide letter-spacing - Clear, actionable elements

## Animations

Animations should feel contemplative and purposeful, like the steady flame of a diya (oil lamp) - gentle movements that guide attention and create moments of grace without disrupting the meditative quality visitors seek when exploring spiritual services.

- **Purposeful Meaning**: Smooth fade-in transitions as content loads mirror the gradual dawning of spiritual understanding; hover states on service cards create subtle lifting effects suggesting divine elevation
- **Hierarchy of Movement**: Primary CTAs (Contact, Book Service) receive gentle pulse animations on hover; service category cards have subtle scale transforms; page transitions use soft cross-fades maintaining continuity

## Component Selection

- **Components**: 
  - Navigation: Sticky header with custom navigation menu using shadcn Sheet component for mobile drawer
  - Service Cards: Card component with hover effects, displaying service name, duration, category badge
  - Contact Form: Form components (Input, Textarea, Select, Button) with validation feedback
  - Gallery: Tabs component for Photos/Videos switching; Dialog component for full-size image viewing
  - Video Embeds: Custom YouTube embed components with AspectRatio wrapper
  - Testimonials: Card components with Avatar for client photos and ratings
  - Blog: Card layouts for article previews with Badge for categories
  - Social Links: Button components styled as icon buttons with Tooltip for accessibility
  - FAQ: Accordion component for expandable question/answer pairs
  - Service Filter: RadioGroup or Tabs for category filtering

- **Customizations**: 
  - Custom hero section with background pattern/gradient and Om symbol watermark
  - Service category badges with custom colors matching each service type
  - YouTube embed component with play overlay and thumbnail
  - WhatsApp floating action button for quick contact
  - Lotus flower divider elements between major sections

- **States**: 
  - Buttons: Default (saffron gradient), Hover (darker saffron with subtle lift), Active (pressed state), Disabled (muted)
  - Form Inputs: Default (cream border), Focus (golden amber border with soft glow), Error (red border with error message), Success (green border)
  - Service Cards: Default (white with subtle shadow), Hover (lifted with stronger shadow, accent border), Selected (golden amber border)
  - Navigation Links: Default (brown text), Hover (saffron color), Active/Current Page (saffron with underline)

- **Icon Selection**: 
  - Phosphor icons: FlowerLotus for spiritual elements, BookOpen for blog/scriptures, Phone/WhatsappLogo/EnvelopeSimple for contact methods, Calendar for bookings, PlayCircle for videos, Images for gallery, UserCircle for testimonials, Heart for charity work, List for services menu, CaretRight for navigation arrows, Clock for service duration

- **Spacing**: 
  - Section padding: py-16 md:py-24 for major page sections
  - Card padding: p-6 for service cards, p-8 for testimonial cards
  - Grid gaps: gap-6 for service grids, gap-8 for content sections
  - Container max-width: max-w-7xl for main content, max-w-4xl for article text
  - Consistent spacing scale: 4, 6, 8, 12, 16, 24 in Tailwind units

- **Mobile**: 
  - Navigation collapses to hamburger menu with slide-in drawer
  - Service cards stack vertically on mobile (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)
  - Hero section adjusts text sizes (text-4xl md:text-5xl lg:text-6xl)
  - Contact form switches to full-width single-column layout
  - Video embeds maintain 16:9 aspect ratio responsively
  - Footer links reorganize into accordion sections on mobile
  - Floating WhatsApp button remains accessible but smaller on mobile
  - Touch-friendly button sizes (min 44x44px) for all interactive elements
