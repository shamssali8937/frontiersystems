/**
 * Accessible skip link for keyboard and screen-reader users.
 * Positioned off-screen until focused, then rendered visibly at the top left.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#111416] focus:text-[#63C7D9] focus:border focus:border-[#63C7D9] focus:rounded-sm focus:font-medium focus:text-sm focus:outline-none focus:ring-2 focus:ring-[#63C7D9] focus:ring-offset-2 focus:ring-offset-[#0B0D0E] focus:shadow-lg transition-transform"
    >
      Skip to main content
    </a>
  );
}
