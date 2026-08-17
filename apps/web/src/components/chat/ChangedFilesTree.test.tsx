import { TurnId } from "@t3tools/contracts";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import { ChangedFilesCard, ChangedFilesTree } from "./ChangedFilesTree";

describe("ChangedFilesCard", () => {
  it("keeps its compact header sticky while preserving singular labels", () => {
    const markup = renderToStaticMarkup(
      <ChangedFilesCard
        turnId={TurnId.make("turn-1")}
        files={[{ path: "README.md", kind: "modified", additions: 2, deletions: 1 }]}
        expanded
        showCompactPreview={false}
        defaultAllDirectoriesExpanded
        resolvedTheme="light"
        onExpandedChange={() => {}}
        onOpenTurnDiff={() => {}}
      />,
    );

    expect(markup).toContain('data-changed-files-state="expanded"');
    expect(markup).toContain('aria-expanded="true"');
    expect(markup).toContain("whitespace-nowrap");
    expect(markup).toContain(
      'class="group flex min-w-0 flex-1 cursor-pointer items-center rounded-xl',
    );
    expect(markup).not.toMatch(
      /class="group flex min-w-0 flex-1 cursor-pointer items-center[^"]*overflow-hidden/,
    );
    expect(markup).toContain('class="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden"');
    expect(markup).toContain('class="flex shrink-0 items-center gap-1 whitespace-nowrap');
    expect(markup).toContain('class="ml-1 hidden min-w-0 flex-1 truncate');
    expect(markup).toContain("@[24rem]/changed-files:inline");
    expect(markup).not.toContain("sm:inline");
    expect(markup).toContain('class="flex shrink-0 items-center gap-1.5 pr-1"');
    expect(markup).not.toContain("!size-[22px]");
    expect(markup).toContain("size-3");
    // A root-only change has no folders to fold, so the collapse-all control
    // is omitted instead of rendering as a dead button.
    expect(markup).not.toContain("all folders");
    expect(markup).toContain('aria-label="Open diff"');
    expect(markup).toContain('role="group" aria-label="2 additions, 1 deletions"');
    expect(markup).toContain("1 changed file");
    expect(markup).not.toContain("1 changed files");
  });

  it("shows the collapse-all control when the change spans folders", () => {
    const markup = renderToStaticMarkup(
      <ChangedFilesCard
        turnId={TurnId.make("turn-1")}
        files={[
          { path: "apps/web/src/App.tsx", kind: "modified", additions: 2, deletions: 1 },
          { path: "README.md", kind: "modified", additions: 1, deletions: 0 },
        ]}
        expanded
        showCompactPreview={false}
        defaultAllDirectoriesExpanded
        resolvedTheme="light"
        onExpandedChange={() => {}}
        onOpenTurnDiff={() => {}}
      />,
    );

    expect(markup).toContain('aria-label="Collapse all folders"');
  });

  it("renders a scope and representative-file preview for a large latest change", () => {
    const markup = renderToStaticMarkup(
      <ChangedFilesCard
        turnId={TurnId.make("turn-1")}
        files={[
          { path: "apps/web/src/App.tsx", kind: "modified", additions: 120, deletions: 20 },
          { path: "apps/web/src/App.test.tsx", kind: "modified", additions: 30, deletions: 2 },
          {
            path: "packages/shared/src/git.ts",
            kind: "modified",
            additions: 15,
            deletions: 4,
          },
          { path: "README.md", kind: "modified", additions: 3, deletions: 0 },
        ]}
        expanded={false}
        showCompactPreview
        defaultAllDirectoriesExpanded={false}
        resolvedTheme="light"
        onExpandedChange={() => {}}
        onOpenTurnDiff={() => {}}
      />,
    );

    expect(markup).toContain('data-changed-files-state="preview"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain("apps");
    expect(markup).toContain("2 files");
    expect(markup).toContain("packages");
    expect(markup).toContain("root");
    expect(markup).toContain("App.tsx");
    expect(markup).toContain("git.ts");
    expect(markup).toContain("README.md");
    expect(markup).toContain("Show all 4 files");
    expect(markup).not.toContain("App.test.tsx");
  });

  it("keeps older collapsed changes to a one-line receipt", () => {
    const markup = renderToStaticMarkup(
      <ChangedFilesCard
        turnId={TurnId.make("turn-1")}
        files={[{ path: "apps/web/src/App.tsx", kind: "modified", additions: 120, deletions: 20 }]}
        expanded={false}
        showCompactPreview={false}
        defaultAllDirectoriesExpanded={false}
        resolvedTheme="light"
        onExpandedChange={() => {}}
        onOpenTurnDiff={() => {}}
      />,
    );

    expect(markup).toContain('data-changed-files-state="collapsed"');
    expect(markup).toContain("1 changed file");
    expect(markup).not.toContain("Show all");
    expect(markup).not.toContain("App.tsx");
  });
});

describe("ChangedFilesTree", () => {
  it.each([
    {
      name: "a compacted single-chain directory",
      files: [
        { path: "apps/web/src/index.ts", kind: "modified", additions: 2, deletions: 1 },
        { path: "apps/web/src/main.ts", kind: "modified", additions: 3, deletions: 0 },
      ],
      visibleLabels: ["apps/web/src"],
      hiddenLabels: ["index.ts", "main.ts"],
    },
    {
      name: "a branch point after a compacted prefix",
      files: [
        {
          path: "apps/server/src/git/Layers/GitCore.ts",
          kind: "modified",
          additions: 4,
          deletions: 3,
        },
        {
          path: "apps/server/src/provider/Layers/CodexAdapter.ts",
          kind: "modified",
          additions: 7,
          deletions: 2,
        },
      ],
      visibleLabels: ["apps/server/src"],
      hiddenLabels: ["git", "provider", "GitCore.ts", "CodexAdapter.ts"],
    },
    {
      name: "mixed root files and nested compacted directories",
      files: [
        { path: "README.md", kind: "modified", additions: 1, deletions: 0 },
        { path: "packages/shared/src/git.ts", kind: "modified", additions: 8, deletions: 2 },
        {
          path: "packages/contracts/src/orchestration.ts",
          kind: "modified",
          additions: 13,
          deletions: 3,
        },
      ],
      visibleLabels: ["README.md", "packages"],
      hiddenLabels: ["shared/src", "contracts/src", "git.ts", "orchestration.ts"],
    },
  ])(
    "renders $name collapsed on the first render when collapse-all is active",
    ({ files, visibleLabels, hiddenLabels }) => {
      const markup = renderToStaticMarkup(
        <ChangedFilesTree
          turnId={TurnId.make("turn-1")}
          files={files}
          allDirectoriesExpanded={false}
          expandedDirectories={{}}
          resolvedTheme="light"
          onToggleDirectory={() => {}}
          onOpenTurnDiff={() => {}}
        />,
      );

      for (const label of visibleLabels) {
        expect(markup).toContain(label);
      }
      for (const label of hiddenLabels) {
        expect(markup).not.toContain(label);
      }
    },
  );

  it.each([
    {
      name: "a compacted single-chain directory",
      files: [
        { path: "apps/web/src/index.ts", kind: "modified", additions: 2, deletions: 1 },
        { path: "apps/web/src/main.ts", kind: "modified", additions: 3, deletions: 0 },
      ],
      visibleLabels: ["apps/web/src", "index.ts", "main.ts"],
    },
    {
      name: "a branch point after a compacted prefix",
      files: [
        {
          path: "apps/server/src/git/Layers/GitCore.ts",
          kind: "modified",
          additions: 4,
          deletions: 3,
        },
        {
          path: "apps/server/src/provider/Layers/CodexAdapter.ts",
          kind: "modified",
          additions: 7,
          deletions: 2,
        },
      ],
      visibleLabels: [
        "apps/server/src",
        "git/Layers",
        "provider/Layers",
        "GitCore.ts",
        "CodexAdapter.ts",
      ],
    },
    {
      name: "mixed root files and nested compacted directories",
      files: [
        { path: "README.md", kind: "modified", additions: 1, deletions: 0 },
        { path: "packages/shared/src/git.ts", kind: "modified", additions: 8, deletions: 2 },
        {
          path: "packages/contracts/src/orchestration.ts",
          kind: "modified",
          additions: 13,
          deletions: 3,
        },
      ],
      visibleLabels: [
        "README.md",
        "packages",
        "shared/src",
        "contracts/src",
        "git.ts",
        "orchestration.ts",
      ],
    },
  ])(
    "renders $name expanded on the first render when expand-all is active",
    ({ files, visibleLabels }) => {
      const markup = renderToStaticMarkup(
        <ChangedFilesTree
          turnId={TurnId.make("turn-1")}
          files={files}
          allDirectoriesExpanded
          expandedDirectories={{}}
          resolvedTheme="light"
          onToggleDirectory={() => {}}
          onOpenTurnDiff={() => {}}
        />,
      );

      for (const label of visibleLabels) {
        expect(markup).toContain(label);
      }
    },
  );

  // Overrides are keyed by directory path on a plain object, so a top-level
  // directory sharing a name with an Object.prototype member must still read as
  // "no override" rather than inheriting a truthy one.
  it("honors collapse-all for directories named like Object.prototype members", () => {
    const markup = renderToStaticMarkup(
      <ChangedFilesTree
        turnId={TurnId.make("turn-1")}
        files={[
          { path: "toString/alpha.ts", kind: "modified", additions: 2, deletions: 1 },
          { path: "toString/beta.ts", kind: "modified", additions: 1, deletions: 0 },
          { path: "constructor/gamma.ts", kind: "modified", additions: 3, deletions: 0 },
          { path: "constructor/delta.ts", kind: "modified", additions: 1, deletions: 1 },
        ]}
        allDirectoriesExpanded={false}
        expandedDirectories={{}}
        resolvedTheme="light"
        onToggleDirectory={() => {}}
        onOpenTurnDiff={() => {}}
      />,
    );

    expect(markup).toContain("toString");
    expect(markup).toContain("constructor");
    expect(markup).not.toContain("alpha.ts");
    expect(markup).not.toContain("beta.ts");
    expect(markup).not.toContain("gamma.ts");
    expect(markup).not.toContain("delta.ts");
  });
});
