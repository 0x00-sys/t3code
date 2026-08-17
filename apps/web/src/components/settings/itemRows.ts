/** Direct row in a settings section. Whitespace, rather than rules, separates peers. */
export const ITEM_ROW_CLASSNAME = "rounded-xl px-3 py-3 sm:px-4";

export const ITEM_ROW_INNER_CLASSNAME =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

/**
 * Row and section-header typography. Shared so a change to the heading scale
 * reaches section headers as well as the rows rendered by SettingsRow.
 */
export const ITEM_ROW_TITLE_CLASSNAME = "text-sm font-medium tracking-[-0.005em] text-foreground";

export const ITEM_ROW_DESCRIPTION_CLASSNAME = "text-[13px] leading-[1.45] text-muted-foreground/80";
