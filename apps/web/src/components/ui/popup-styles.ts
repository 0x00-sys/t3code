/**
 * Elevation for dropdown-glass surfaces. The `dropdown-glass` utility paints no
 * shadow of its own, so each popup that wants this lift opts into it; sharing
 * the pair here keeps a retune from having to be repeated at every call site.
 */
const DROPDOWN_ELEVATION_CLASS =
  "shadow-[0_16px_40px_-18px_rgb(0_0_0/55%)] dark:shadow-[0_18px_44px_-18px_rgb(0_0_0/80%)]";

const DROPDOWN_LIST_POPUP_CLASS = `dropdown-glass relative flex max-h-[min(var(--available-height),23rem)] min-w-(--anchor-width) max-w-(--available-width) flex-col origin-(--transform-origin) rounded-lg text-foreground transition-[scale,opacity] data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0 data-instant:duration-0 ${DROPDOWN_ELEVATION_CLASS}`;

export { DROPDOWN_ELEVATION_CLASS, DROPDOWN_LIST_POPUP_CLASS };
