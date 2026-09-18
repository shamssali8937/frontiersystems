import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Frontier Systems Dark & Light Theme Compatibility Audit", () => {
  const rootDir = process.cwd();

  test("globals.css contains dark and light theme tokens and contrast overrides", () => {
    const cssPath = path.join(rootDir, "app", "globals.css");
    assert.ok(fs.existsSync(cssPath), "globals.css must exist");
    const css = fs.readFileSync(cssPath, "utf-8");

    // Check dark mode declarations
    assert.match(css, /\[data-theme="dark"\]/, "globals.css must specify [data-theme='dark']");
    assert.match(css, /--bg-primary:\s*#0b0d0e/, "Dark mode primary background must be #0b0d0e");
    assert.match(css, /--text-primary:\s*#f5f5f3/, "Dark mode primary text must be #f5f5f3");
    assert.match(css, /--accent-cyan:\s*#63c7d9/, "Dark mode accent cyan must be #63c7d9");

    // Check light mode declarations
    assert.match(css, /\[data-theme="light"\]/, "globals.css must specify [data-theme='light']");
    assert.match(css, /--bg-primary:\s*#f8fafc/, "Light mode primary background must be #f8fafc");
    assert.match(css, /--text-primary:\s*#0f172a/, "Light mode primary text must be #0f172a");
    assert.match(css, /--accent-cyan:\s*#0891b2/, "Light mode accent cyan must be calibrated for WCAG AA (#0891b2)");

    // Check utility overrides for non-destructive instant styling
    assert.ok(css.includes(".bg-[#0B0D0E]") || css.includes(".bg-\\[\\#0B0D0E\\]"), "Should override bg-[#0B0D0E] in light mode");
    assert.ok(css.includes(".text-[#F5F5F3]") || css.includes(".text-\\[\\#F5F5F3\\]"), "Should override text-[#F5F5F3] in light mode");
    assert.ok(css.includes(".text-[#A6AAAC]") || css.includes(".text-\\[\\#A6AAAC\\]"), "Should override text-[#A6AAAC] in light mode");
    assert.ok(css.includes(".border-[#292D30]") || css.includes(".border-\\[\\#292D30\\]"), "Should override border-[#292D30] in light mode");
    assert.ok(css.includes("ring-offset") && css.includes("#0B0D0E"), "Should adapt focus ring offsets");
  });

  test("RootLayout in app/layout.tsx implements zero-FOUC script and ThemeProvider wrapper", () => {
    const layoutPath = path.join(rootDir, "app", "layout.tsx");
    assert.ok(fs.existsSync(layoutPath), "layout.tsx must exist");
    const layout = fs.readFileSync(layoutPath, "utf-8");

    // ThemeProvider import and wrapping
    assert.match(layout, /import\s*\{\s*ThemeProvider\s*\}\s*from\s*["']@\/components\/theme\/ThemeProvider["']/, "Must import ThemeProvider");
    assert.match(layout, /<ThemeProvider>/, "Must wrap root content in <ThemeProvider>");
    assert.match(layout, /data-theme="dark"/, "Root html element must default data-theme to dark");

    // FOUC prevention script in head
    assert.match(layout, /<head>/, "Must include <head> tag");
    assert.match(layout, /localStorage\.getItem\(['"]fs_theme['"]\)/, "Head script must read fs_theme from localStorage");
    assert.match(layout, /matchMedia\(['"]\(prefers-color-scheme:\s*light\)['"]\)/, "Head script must detect system prefers-color-scheme");
    assert.match(layout, /document\.documentElement\.setAttribute\(['"]data-theme['"]/, "Head script must synchronously set data-theme before paint");
  });

  test("ThemeProvider component provides theme state, toggle, persistence, and system listener", () => {
    const providerPath = path.join(rootDir, "components", "theme", "ThemeProvider.tsx");
    assert.ok(fs.existsSync(providerPath), "ThemeProvider.tsx must exist");
    const provider = fs.readFileSync(providerPath, "utf-8");

    assert.match(provider, /export type Theme = "dark" \| "light" \| "system"/, "Must support dark, light, and system modes");
    assert.match(provider, /localStorage\.setItem\(STORAGE_KEY/, "Must persist chosen theme to localStorage");
    assert.match(provider, /document\.cookie\s*=/, "Must synchronize theme to cookies for server awareness");
    assert.ok(provider.includes('prefers-color-scheme: light'), "Must listen to OS preference updates");
    assert.match(provider, /document\.documentElement\.setAttribute\("data-theme"/, "Must apply data-theme attribute on root element");
  });

  test("ThemeToggle component is accessible, SSR safe, and displays sun/moon icons", () => {
    const togglePath = path.join(rootDir, "components", "theme", "ThemeToggle.tsx");
    assert.ok(fs.existsSync(togglePath), "ThemeToggle.tsx must exist");
    const toggle = fs.readFileSync(togglePath, "utf-8");

    assert.match(toggle, /aria-label=\{isLight \? "Switch to dark theme" : "Switch to light theme"\}/, "Must provide dynamic accessible aria-label");
    assert.match(toggle, /focus-visible:ring-2 focus-visible:ring-\[#63C7D9\]/, "Must have visible focus state");
    assert.match(toggle, /!mounted/, "Must handle SSR mounting safely to avoid hydration mismatch");
    assert.match(toggle, /toggleTheme/, "Must call toggleTheme on click");
  });

  test("Header.tsx mounts ThemeToggle in both desktop and mobile navigation", () => {
    const headerPath = path.join(rootDir, "components", "layout", "Header.tsx");
    assert.ok(fs.existsSync(headerPath), "Header.tsx must exist");
    const header = fs.readFileSync(headerPath, "utf-8");

    assert.match(header, /import\s*\{\s*ThemeToggle\s*\}\s*from\s*["']@\/components\/theme\/ThemeToggle["']/, "Header must import ThemeToggle");

    // Check desktop actions mount
    const desktopActions = header.slice(header.indexOf("Desktop Direct Actions"), header.indexOf("Mobile Actions"));
    assert.match(desktopActions, /<ThemeToggle\s+size="sm"\s*\/>/, "Desktop navigation must contain ThemeToggle");

    // Check mobile actions mount
    const mobileActions = header.slice(header.indexOf("Mobile Actions"));
    assert.match(mobileActions, /<ThemeToggle\s+size="sm"\s*\/>/, "Mobile navigation must contain ThemeToggle");
  });

  test("Logo component provides UK precision engineering mark with meridian geometry", () => {
    const logoPath = path.join(rootDir, "components", "ui", "Logo.tsx");
    assert.ok(fs.existsSync(logoPath), "Logo.tsx must exist");
    const logo = fs.readFileSync(logoPath, "utf-8");

    assert.match(logo, /Frontier/, "Logo must contain Frontier");
    assert.match(logo, /Systems/, "Logo must contain Systems");
    assert.match(logo, /London &bull; High Assurance/, "Logo must include British London heritage submark");
    assert.match(logo, /M14 3L23 14L14 25L5 14L14 3Z/, "Logo must contain Meridian precision geometry");
  });

  test("InteractivePillarsVisualizer supports dynamic light and dark theme palettes", () => {
    const visualizerPath = path.join(rootDir, "components", "home", "InteractivePillarsVisualizer.tsx");
    assert.ok(fs.existsSync(visualizerPath), "InteractivePillarsVisualizer.tsx must exist");
    const visualizer = fs.readFileSync(visualizerPath, "utf-8");

    assert.match(visualizer, /useTheme/, "Visualizer must consume useTheme hook");
    assert.match(visualizer, /resolvedTheme === "light"/, "Visualizer must check for light theme state");
    assert.match(visualizer, /#0891B2/, "Visualizer must use WCAG AA calibrated light accent #0891B2");
    assert.match(visualizer, /AI & Autonomous Automation/, "Visualizer must include Pillar 01");
    assert.match(visualizer, /High-Assurance Digital Products/, "Visualizer must include Pillar 02");
    assert.match(visualizer, /Mission-Critical Business Systems/, "Visualizer must include Pillar 03");
    assert.match(visualizer, /Resilient Cloud & Security/, "Visualizer must include Pillar 04");
  });

  test("Footer contains Admin Console and Admin Access links to /admin/login", () => {
    const footerPath = path.join(rootDir, "components", "layout", "Footer.tsx");
    assert.ok(fs.existsSync(footerPath), "Footer.tsx must exist");
    const footer = fs.readFileSync(footerPath, "utf-8");

    assert.match(footer, /href="\/admin\/login"/, "Footer must link to /admin/login");
    assert.match(footer, /Admin Console/, "Footer NAVIGATION_LINKS must include Admin Console");
    assert.match(footer, /Admin Access/, "Footer bottom legal bar must include Admin Access");
  });

  test("globals.css implements scroll-reveal animations and hover transitions with reduced-motion support", () => {
    const cssPath = path.join(rootDir, "app", "globals.css");
    const css = fs.readFileSync(cssPath, "utf-8");

    assert.match(css, /\.scroll-reveal/, "globals.css must contain .scroll-reveal class");
    assert.match(css, /\.reveal-on-scroll/, "globals.css must contain .reveal-on-scroll class");
    assert.match(css, /\.stagger-1/, "globals.css must contain stagger classes");
    assert.match(css, /translateY\(-3px\)/, "globals.css must specify hover elevation transform");
    assert.ok(css.includes(".scroll-reveal") && css.includes("prefers-reduced-motion"), "Must include reduced motion override for scroll reveal");
  });

  test("Portal and Admin login pages render brand Logo centered horizontally", () => {
    const portalLoginPath = path.join(rootDir, "app", "portal", "login", "page.tsx");
    const adminLoginPath = path.join(rootDir, "app", "admin", "login", "page.tsx");

    assert.ok(fs.existsSync(portalLoginPath), "Portal login page must exist");
    assert.ok(fs.existsSync(adminLoginPath), "Admin login page must exist");

    const portal = fs.readFileSync(portalLoginPath, "utf-8");
    const admin = fs.readFileSync(adminLoginPath, "utf-8");

    // Check portal login has centered Logo
    assert.match(portal, /<Logo\s+size="md"\s*\/>/, "Portal login must render Logo");
    assert.match(portal, /justify-center[\s\S]*?<Logo/, "Portal login must wrap Logo in a justify-center container");

    // Check admin login has centered Logo
    assert.match(admin, /<Logo\s+size="md"\s*\/>/, "Admin login must render Logo");
    assert.match(admin, /justify-center[\s\S]*?<Logo/, "Admin login must wrap Logo in a justify-center container");
  });
});

