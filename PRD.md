# Planning Guide

A visual JSON URL crawler that fetches JSON from a URL, recursively discovers and fetches nested URLs (including relative paths), and presents an interactive graph visualization of the discovered URL network.

**Experience Qualities**:
1. **Exploratory** - Users should feel like they're uncovering a hidden network of interconnected data, with each discovered URL revealing new connections
2. **Technical** - The interface should communicate precision and capability, appealing to developers and technical users who work with APIs
3. **Insightful** - The visualization should make complex URL relationships immediately comprehensible through spatial positioning and visual hierarchy

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused tool with clear inputs (URL), processing (crawling/fetching), and outputs (visualization), but requires state management for crawl progress, error handling, and interactive graph manipulation.

## Essential Features

**URL Input & Validation**
- Functionality: Accept a URL input that returns JSON data
- Purpose: Starting point for the crawl operation
- Trigger: User enters URL and clicks "Crawl" button
- Progression: Input field → Validation → Loading state → Crawl initiation
- Success criteria: Valid URLs are accepted; invalid URLs show clear error messages

**JSON Crawling Engine**
- Functionality: Recursively walk JSON objects/arrays to find URL strings, resolve relative URLs, fetch them, and continue the process
- Purpose: Core discovery mechanism that builds the URL network
- Trigger: User initiates crawl from valid starting URL
- Progression: Fetch initial JSON → Parse for URLs (strings matching URL patterns) → Resolve relative URLs against base → Fetch discovered URLs → Repeat → Complete when no new URLs found or max depth reached
- Success criteria: Successfully discovers and fetches all reachable JSON URLs; handles circular references; respects depth limits

**Interactive Graph Visualization**
- Functionality: Display discovered URLs as an interactive force-directed graph with nodes (URLs) and edges (relationships)
- Purpose: Make the URL network structure immediately understandable
- Trigger: Crawl completes or updates in real-time as URLs are discovered
- Progression: Empty canvas → Nodes appear as discovered → Edges connect parent to child URLs → Force simulation positions nodes → User can drag/zoom/pan → Click node to see details
- Success criteria: Graph updates smoothly; user can interact with all nodes; visual hierarchy clearly shows crawl depth and relationships

**URL Details Panel**
- Functionality: Show detailed information about selected URL (status code, response time, JSON preview, discovered URLs)
- Purpose: Provide detailed inspection of individual nodes in the network
- Trigger: User clicks on a node in the graph
- Progression: Node click → Panel slides in → Display URL metadata and JSON preview → Show outgoing connections
- Success criteria: Panel shows relevant data; JSON is syntax highlighted; easy to dismiss

**Crawl Progress Indicator**
- Functionality: Real-time display of crawl status (URLs queued, fetched, failed)
- Purpose: User confidence during longer crawl operations
- Trigger: Crawl operation begins
- Progression: Crawl starts → Counter updates → Progress percentage → Complete/error states
- Success criteria: Accurate counts; clear completion state

## Edge Case Handling

- **Circular References**: Track visited URLs to prevent infinite loops
- **Relative URL Resolution**: Properly resolve relative paths against the correct base URL
- **Non-JSON Responses**: Handle URLs that don't return JSON gracefully (show error state but continue crawl)
- **CORS Errors**: Display clear messaging when fetch fails due to CORS (common with external APIs)
- **Malformed URLs**: Validate and skip invalid URL strings found in JSON
- **Deep Nesting**: Implement maximum depth limit (e.g., 5 levels) to prevent runaway crawls
- **Large Response Bodies**: Handle and display large JSON objects efficiently
- **Network Timeouts**: Set reasonable timeout limits and show timeout errors

## Design Direction

The design should evoke a sense of technical sophistication and data discovery - like peering into the structure of the web itself. It should feel like a developer tool that's both powerful and refined, with a futuristic, slightly cyberpunk aesthetic that emphasizes connectivity and networks.

## Color Selection

A dark, technical color scheme with vibrant accent colors for the graph visualization.

- **Primary Color**: Deep space blue `oklch(0.25 0.08 250)` - Communicates depth, technical precision, and creates a canvas for bright graph elements
- **Secondary Colors**: Dark slate backgrounds `oklch(0.18 0.02 250)` for cards and elevated surfaces; Medium blue-gray `oklch(0.35 0.04 250)` for secondary elements
- **Accent Color**: Electric cyan `oklch(0.75 0.15 200)` - High-tech, attention-grabbing color for CTAs, active nodes, and successful states
- **Foreground/Background Pairings**:
  - Background (Deep Space Blue `oklch(0.25 0.08 250)`): Light cyan text `oklch(0.95 0.02 200)` - Ratio 11.2:1 ✓
  - Card (Dark Slate `oklch(0.18 0.02 250)`): Light cyan text `oklch(0.95 0.02 200)` - Ratio 13.8:1 ✓
  - Accent (Electric Cyan `oklch(0.75 0.15 200)`): Dark text `oklch(0.15 0.02 250)` - Ratio 10.5:1 ✓
  - Error states: Warning red `oklch(0.65 0.22 25)` on dark backgrounds

## Font Selection

The typeface should convey technical precision while maintaining readability - something that feels at home in a developer's environment but with more personality than standard monospace.

- **Typographic Hierarchy**:
  - H1 (Page Title): Space Grotesk Bold/32px/tight letter spacing/-0.02em
  - H2 (Section Headers): Space Grotesk SemiBold/20px/normal
  - Body (UI Text): Space Grotesk Regular/14px/relaxed line height/1.6
  - Code/URLs: JetBrains Mono Regular/13px/normal line height/1.5
  - Captions (Metadata): Space Grotesk Regular/12px/text-muted-foreground

## Animations

Animations should emphasize the discovery and connection aspects - nodes appearing, edges drawing, data flowing through the network.

- **Graph Entrance**: Nodes fade in with a subtle scale animation (0.8 → 1.0) over 400ms with spring physics
- **Edge Drawing**: Edges animate their stroke-dashoffset to create a "drawing" effect when connections are discovered
- **Loading States**: Pulsing glow effect on active/loading nodes; smooth spinner for initial load
- **Panel Transitions**: Slide-in from right with ease-out timing (300ms) for details panel
- **Hover States**: Subtle scale (1.0 → 1.05) and glow intensification on nodes (150ms)
- **Success Feedback**: Brief green pulse when crawl completes successfully

## Component Selection

- **Components**:
  - Input + Button: URL entry field with prominent "Crawl" button
  - Card: Container for input area and progress stats
  - Badge: Status indicators (success, error, loading) on nodes and in lists
  - Sheet: Slide-out panel for URL details
  - ScrollArea: For JSON preview and discovered URLs list
  - Separator: Dividing sections in the details panel
  - Progress: Visual indicator for crawl completion percentage
  - Skeleton: Loading placeholders during initial render

- **Customizations**:
  - Custom D3 force-directed graph component (not in shadcn)
  - Custom URL node visualization with status indicators
  - Syntax-highlighted JSON viewer component
  - Custom zoom/pan controls overlay

- **States**:
  - Input: Focus state with glowing cyan ring
  - Button: Disabled during active crawl; loading spinner replaces icon
  - Graph nodes: Default (dim), Discovered (bright), Loading (pulsing), Error (red tint), Active/Selected (cyan glow)
  - Details panel: Collapsed/Expanded with smooth slide transition

- **Icon Selection**:
  - Globe: Starting URL/external links
  - Graph: Visualization mode
  - Link: Internal connections
  - Warning: Error states
  - Check: Successfully fetched
  - Clock: Loading/pending
  - ArrowsOut: Zoom controls

- **Spacing**:
  - Page padding: p-6 on desktop, p-4 on mobile
  - Card padding: p-6
  - Input group gap: gap-3
  - Graph canvas: Full remaining height (flex-1)
  - Details panel: p-6 with internal gap-4 sections
  - Node spacing: Controlled by D3 force simulation (link distance ~80px)

- **Mobile**:
  - Stack input and button vertically on mobile (<768px)
  - Details panel becomes full-screen Sheet on mobile
  - Touch-friendly node sizes (minimum 44px hit area)
  - Simplified graph controls (pinch-to-zoom, drag-to-pan)
  - Reduced padding (p-4 instead of p-6)
  - Progress stats stack vertically
