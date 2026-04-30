/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ DocuReview — Centralized Theme │
 * │ │
 * │ Single source of truth for all colors, typography, spacing, shadows, │
 * │ borders, and component-level style recipes. │
 * │ │
 * │ HOW TO USE │
 * │ ────────── │
 * │ import { theme } from "@/lib/theme"; │
 * │ import { cn } from "@/lib/utils"; │
 * │ │
 * │ <div className={theme.layout.page}>...</div> │
 * │ <h1 className={theme.typography.pageTitle}>...</h1> │
 * │ <div className={cn(theme.card.base, theme.card.hover)}>...</div> │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. RAW COLOR PALETTE
// Named color steps — use these to build semantic tokens below.
// Never use these directly in components; always use the semantic layer.
// ─────────────────────────────────────────────────────────────────────────────

const palette = {
// Slate scale (sidebar + neutrals)
 slate50: "#f8fafc",
 slate100: "#f1f5f9",
 slate200: "#e2e8f0",
 slate300: "#cbd5e1",
 slate400: "#94a3b8",
 slate500: "#64748b",
 slate600: "#475569",
 slate700: "#334155",
 slate800: "#1e293b",
 slate900: "#0f172a",

// White / off-white
 white: "#ffffff",
 warmBg: "#faf9f7", // auth page background
 warmBorder: "#e8e4df", // auth page border

// Accent — rich indigo for interactive states
 indigo50: "#eef2ff",
 indigo100: "#e0e7ff",
 indigo400: "#818cf8",
 indigo500: "#6366f1",
 indigo600: "#4f46e5",
 indigo700: "#4338ca",

// Semantic states
 red50: "#fef2f2",
 red200: "#fecaca",
 red400: "#f87171",
 red500: "#ef4444",
 red600: "#dc2626",
 red700: "#b91c1c",
 red800: "#991b1b",

 emerald50: "#ecfdf5",
 emerald200: "#a7f3d0",
 emerald600: "#059669",
 emerald700: "#047857",
 emerald800: "#065f46",

 amber50: "#fffbeb",
 amber200: "#fde68a",
 amber700: "#b45309",

// Brand accent (matches existing #c96442)
 brand: "#c96442",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 2. SEMANTIC COLOR TOKENS (exported as Tailwind class strings)
// These map palette values to intent. Components use these.
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
// ── Sidebar ────────────────────────────────────────────────────────────────
 sidebar: {
 bg: "bg-slate-800", // sidebar root background
 bgHover: "hover:bg-slate-700", // nav item hover
 bgActive: "bg-slate-700", // active nav item
 border: "border-slate-700", // all sidebar borders
 text: "text-white",
 textMuted: "text-slate-400", // sub-labels, captions
 avatarBg: "bg-slate-500",
 avatarText: "text-slate-100",
 dropdownBg: "bg-slate-900",
 overlay: "bg-black/50",
 },

// ── Page / Content ─────────────────────────────────────────────────────────
 page: {
 bg: "bg-slate-100", // dashboard content background
 surface: "bg-white", // cards, panels
 border: "border-slate-200",
 borderSubtle: "border-slate-100",
 },

// ── Auth pages ─────────────────────────────────────────────────────────────
 auth: {
 bg: "bg-[#faf9f7]",
 border: "border-[#e8e4df]",
 },

// ── Text hierarchy ─────────────────────────────────────────────────────────
 text: {
 primary: "text-slate-800",
 secondary: "text-slate-600",
 muted: "text-slate-500",
 subtle: "text-slate-400",
 inverse: "text-white",
 accent: "text-indigo-600",
 brand: "text-[#c96442]",
 error: "text-red-600",
 success: "text-emerald-700",
 },

// ── Interactive / Primary accent ───────────────────────────────────────────
 primary: {
 bg: "bg-indigo-600",
 bgHover: "hover:bg-indigo-700",
 bgLight: "bg-indigo-50",
 text: "text-white",
 textOnLight: "text-indigo-700",
 border: "border-indigo-500",
 ring: "focus-visible:ring-indigo-500/30 focus-visible:border-indigo-400",
 },

// ── Status (for toasts, alerts, badges) ───────────────────────────────────
 status: {
 success: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
 error: { bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
 warning: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
 info: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200" },
 },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 3. TYPOGRAPHY
// ─────────────────────────────────────────────────────────────────────────────

export const typography = {
// Page-level headings
 pageTitle: "text-xl sm:text-2xl font-bold text-slate-800 tracking-tight",
 pageSubtitle: "text-sm sm:text-base text-slate-500 mt-1",

// Section headings
 h1: "text-2xl font-bold text-slate-800 tracking-tight",
 h2: "text-xl font-bold text-slate-800 tracking-tight",
 h3: "text-lg font-semibold text-slate-700",
 h4: "text-base font-semibold text-slate-700",

// Body text
 body: "text-sm text-slate-600 leading-relaxed",
 small: "text-xs text-slate-500",

// Form / Label
 label: "text-sm font-medium text-slate-700",
 caption: "text-xs text-slate-400",
 error: "text-xs font-medium text-red-600 mt-1",

// Sidebar / Navigation
 navItem: "text-sm font-medium text-white",
 logoText: "text-lg font-bold tracking-tight text-white",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 4. SPACING (reusable padding / margin / gap tokens)
// ─────────────────────────────────────────────────────────────────────────────

export const spacing = {
// Responsive page padding
 pagePadding: "p-4 sm:p-6 lg:p-8",
// Section spacing
 sectionGap: "mb-6 lg:mb-8",
// Card internal padding
 cardPadding: "px-5 py-4",
// Form field gap
 fieldGap: "space-y-4",
// Nav item gap
 navGap: "space-y-0.5",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 5. BORDER RADIUS
// ─────────────────────────────────────────────────────────────────────────────

export const radius = {
 sm: "rounded-lg", // 8px — small buttons, tags
 md: "rounded-xl", // 12px — inputs, cards, dropdowns
 lg: "rounded-2xl", // 16px — large cards, upload areas
 full: "rounded-full", // — avatars, pills
 none: "rounded-none",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 6. SHADOWS
// ─────────────────────────────────────────────────────────────────────────────

export const shadows = {
 sm: "shadow-sm",
 md: "shadow-md",
 lg: "shadow-lg",
 xl: "shadow-xl",
 "2xl": "shadow-2xl",
// Semantic aliases
 card: "shadow-sm",
 dropdown: "shadow-2xl",
 modal: "shadow-2xl",
 toast: "shadow-lg",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 7. ANIMATION / TRANSITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const animation = {
 fast: "transition-all duration-150 ease-in-out",
 base: "transition-all duration-200 ease-in-out",
 slow: "transition-all duration-300 ease-in-out",
 colors: "transition-colors duration-150",
 width: "transition-[width] duration-300 ease-in-out",
// Sidebar collapse
 collapse: "transition-all duration-300 ease-in-out",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 8. Z-INDEX SCALE
// ─────────────────────────────────────────────────────────────────────────────

export const zIndex = {
 overlay: "z-20",
 sidebar: "z-30",
 dropdown: "z-50",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 9. COMPONENT RECIPES
// Compound class strings for full component styles.
// Use with cn() to add overrides: cn(theme.card.base, "my-extra-class")
// ─────────────────────────────────────────────────────────────────────────────

// ── Card ─────────────────────────────────────────────────────────────────────
export const card = {
 base: "bg-white rounded-2xl border border-slate-200 shadow-sm",
 hover: "hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer",
 header: "px-5 py-4 border-b border-slate-100",
 body: "px-5 py-4",
 footer: "px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl",
 title: "text-base font-semibold text-slate-800",
 desc: "text-sm text-slate-500 mt-0.5",
} as const;

// ── Input ─────────────────────────────────────────────────────────────────────
export const input = {
 base:
 "w-full h-10 px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl " +
 "text-slate-800 placeholder:text-slate-400 " +
 "transition-colors duration-150 outline-none " +
 "focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 " +
 "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50",
 error: "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20",
 label: "block text-sm font-medium text-slate-700 mb-1.5",
 hint: "text-xs text-slate-400 mt-1",
 errorMsg: "text-xs font-medium text-red-600 mt-1",
} as const;

// ── Button recipes (supplement CVA in button.tsx) ──────────────────────────
export const button = {
// Sizes (height + padding + text)
 sm: "h-8 px-3 text-xs rounded-lg",
 md: "h-10 px-5 text-sm rounded-xl",
 lg: "h-11 px-6 text-base rounded-xl",
 icon: "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",

// Base shared classes
 base: "inline-flex items-center justify-center font-medium transition-colors duration-150 " +
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 " +
 "disabled:pointer-events-none disabled:opacity-50 select-none",

// Semantic variants
 primary: "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700",
 secondary: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300",
 ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800",
 danger: "bg-red-600 text-white hover:bg-red-700",
 sidebarIcon:"text-white hover:bg-slate-700 transition-colors duration-150",
} as const;

// ── Badge / Pill ──────────────────────────────────────────────────────────────
export const badge = {
 base: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
 default: "bg-slate-100 text-slate-700",
 primary: "bg-indigo-50 text-indigo-700",
 success: "bg-emerald-50 text-emerald-700",
 warning: "bg-amber-50 text-amber-700",
 error: "bg-red-50 text-red-700",
} as const;

// ── Toast ─────────────────────────────────────────────────────────────────────
export const toast = {
 base: "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium",
 success: "bg-emerald-50 text-emerald-800 border-emerald-200",
 error: "bg-red-50 text-red-800 border-red-200",
 warning: "bg-amber-50 text-amber-800 border-amber-200",
 info: "bg-indigo-50 text-indigo-800 border-indigo-200",
} as const;

// ── Sidebar recipes ───────────────────────────────────────────────────────────
export const sidebar = {
// Shell
 root:
 "flex flex-col bg-slate-800 border-r border-slate-700 h-screen flex-shrink-0 " +
 "transition-all duration-300 ease-in-out",
// Mobile overrides (applied via cn())
 mobile: "fixed inset-y-0 left-0 z-30 w-[260px]",
 desktop: "lg:relative lg:inset-auto lg:translate-x-0 lg:z-auto",

// Header row
 header: "flex items-center h-16 border-b border-slate-700 flex-shrink-0 px-3",

// Navigation
 navRoot: "flex-1 py-3 overflow-y-auto overflow-x-hidden",
 navList: "space-y-0.5 px-2",

// Individual nav item
 navItem:
 "flex items-center w-full h-11 rounded-lg text-sm font-medium " +
 "text-white hover:bg-slate-700 transition-colors duration-150",
 navItemActive: "bg-slate-700",
 navItemCollapsed: "justify-center px-2",
 navItemExpanded: "justify-start px-3",

// Nav item label (animated)
 navLabel: "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
 navLabelExpanded: "max-w-[180px] opacity-100 ml-3",
 navLabelCollapsed: "max-w-0 opacity-0 ml-0",

// Toggle button
 toggleBtn:
 "hidden lg:flex items-center justify-center w-9 h-9 rounded-lg " +
 "hover:bg-slate-700 transition-colors duration-150 flex-shrink-0",

// Mobile close button
 closeMobileBtn:
 "lg:hidden ml-auto flex items-center justify-center w-9 h-9 rounded-lg " +
 "hover:bg-slate-700 transition-colors duration-150",

// Logo container
 logoWrap:
 "overflow-hidden transition-all duration-300 ease-in-out",
 logoWrapExpanded: "max-w-[200px] opacity-100 flex-1",
 logoWrapCollapsed: "lg:max-w-0 lg:opacity-0",

// User nav
 userNavRoot: "relative",
 userNavTrigger:
 "flex items-center w-full h-14 text-white transition-colors duration-150 border-t border-slate-700",
 userNavTriggerExpanded: "px-3 hover:bg-slate-700",
 userNavTriggerCollapsed: "justify-center px-2 cursor-default",
 userNavAvatar:
 "h-8 w-8 shrink-0 rounded-full bg-slate-500 flex items-center justify-center " +
 "font-semibold text-slate-100 text-sm select-none",
 userNavInfo:
 "overflow-hidden transition-all duration-300 ease-in-out text-left",
 userNavInfoExpanded: "max-w-[160px] opacity-100 ml-3 flex-1",
 userNavInfoCollapsed: "max-w-0 opacity-0 ml-0",
 userNavDropdown:
  "absolute bottom-full left-2 right-2 mb-3 z-50 " +
  "bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 overflow-hidden",
 userNavDropdownItem:
 "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white " +
 "hover:bg-slate-700 transition-colors duration-150",
 userNavName: "text-sm font-medium text-white whitespace-nowrap leading-tight",
 userNavCaption: "text-xs text-slate-400 whitespace-nowrap leading-tight mt-0.5",

// Mobile overlay
 overlay: "fixed inset-0 bg-black/50 z-20 lg:hidden",
} as const;

// ── Top bar (mobile) ──────────────────────────────────────────────────────────
export const topbar = {
 root: "lg:hidden flex items-center h-14 bg-slate-800 px-4 border-b border-slate-700 flex-shrink-0",
 title: "ml-3 text-white font-semibold text-base tracking-tight",
 menuBtn:
 "flex items-center justify-center w-9 h-9 rounded-lg text-white " +
 "hover:bg-slate-700 transition-colors duration-150",
} as const;

// ── Layout shell ──────────────────────────────────────────────────────────────
export const layout = {
 dashboard: "flex h-screen overflow-hidden bg-slate-100",
 content: "flex-1 flex flex-col min-w-0 overflow-hidden",
 main: "flex-1 overflow-auto",
// Page-level padding (used at the top of every page)
 page: "p-4 sm:p-6 lg:p-8",
// Page header block (title + subtitle) — white card surface for contrast against slate-100 bg
 pageHeader: "mb-6 lg:mb-8 bg-white rounded-xl px-5 py-5 shadow-sm border border-slate-200",
 pageTitle: "text-xl sm:text-2xl font-bold text-slate-900 tracking-tight",
 pageSubtitle: "text-sm sm:text-base text-slate-500 mt-1",
} as const;

// ── Upload area ───────────────────────────────────────────────────────────────
export const upload = {
 dropzone:
 "border-2 border-dashed border-slate-300 rounded-2xl " +
 "bg-white hover:border-indigo-400 hover:bg-indigo-50/30 " +
 "transition-colors duration-200 p-6 sm:p-8 lg:p-12",
 icon: "h-12 w-12 sm:h-16 sm:w-16 text-slate-400 mb-4",
 text: "text-base sm:text-lg text-slate-500 mb-6",
 btnRow: "flex flex-wrap items-center justify-center gap-3",
 poweredBy: "flex items-center justify-center gap-2 mt-6 text-slate-500 text-sm",
 claudeOrb:
 "h-5 w-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 " +
 "flex items-center justify-center",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 10. MASTER EXPORT
// Import as: import { theme } from "@/lib/theme"
// Or pick specific slices: import { sidebar, typography } from "@/lib/theme"
// ─────────────────────────────────────────────────────────────────────────────

export const theme = {
 colors,
 typography,
 spacing,
 radius,
 shadows,
 animation,
 zIndex,
 card,
 input,
 button,
 badge,
 toast,
 sidebar,
 topbar,
 layout,
 upload,
} as const;

export default theme;