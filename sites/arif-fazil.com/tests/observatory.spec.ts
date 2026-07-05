import { test, expect } from '@playwright/test';

test.describe('arif-fazil.com (Main Site)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Metadata and SEO tags are present and valid', async ({ page }) => {
    // Title check
    await expect(page).toHaveTitle(/Arif Fazil — Exploration Geoscientist/);

    // Meta description check
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /Muhammad Arif bin Fazil/);

    // Canonical link check
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://arif-fazil.com/');

    // Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /Arif Fazil/);

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'website');
  });

  test('No index-blocking meta tag is present', async ({ page }) => {
    const robots = page.locator('meta[name="robots"]');
    if (await robots.count() > 0) {
      const content = await robots.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });

  test('MCP link points to the canonical gateway', async ({ page }) => {
    const mcpLink = page.locator('link[rel="mcp"]');
    await expect(mcpLink).toHaveAttribute('href', 'https://mcp.arif-fazil.com/mcp');
  });

  test('No stale APEX or deprecated endpoint references exist on the homepage', async ({ page }) => {
    const bodyText = await page.innerText('body');
    
    // Should not reference APEX as an active service
    expect(bodyText.toLowerCase()).not.toContain('apex active');
    
    // Should not reference the deprecated MCP URL
    expect(bodyText).not.toContain('arifos.arif-fazil.com/mcp');
  });
});

test.describe('arifos.arif-fazil.com (Observatory)', () => {
  test.beforeEach(async ({ page }) => {
    // Observatory served on port 8080 by python server
    await page.goto('http://127.0.0.1:8080/');
  });

  test('Observatory homepage loads and presents itself as read-only observatory', async ({ page }) => {
    // Title check
    await expect(page).toHaveTitle(/arifOS Observatory/);

    // Canonical link check
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://arifos.arif-fazil.com/');

    // Header structure
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Constitutional Infrastructure Layer');

    // Hero or body text check for read-only focus
    const bodyText = await page.innerText('body');
    expect(bodyText.toLowerCase()).toContain('observatory');
    
    // MCP link check — use evaluate() since <link> in <head> isn't in Playwright's visible DOM
    const mcpHref = await page.evaluate(
      () => document.querySelector('link[rel="mcp"]')?.getAttribute('href') ?? null
    );
    expect(mcpHref).toBe('https://mcp.arif-fazil.com/mcp');
  });

  test('Federation map page loads successfully and references canonical endpoints', async ({ page }) => {
    await page.goto('http://127.0.0.1:8080/federation.html');
    
    // Title check
    await expect(page).toHaveTitle(/Federation Map — arifOS Observatory/);

    // MCP link check
    const mcpLink = page.locator('link[rel="mcp"]');
    await expect(mcpLink).toHaveAttribute('href', 'https://mcp.arif-fazil.com/mcp');

    // Body text checks
    const bodyText = await page.innerText('body');
    
    // Should not reference APEX or stale MCP
    expect(bodyText.toLowerCase()).not.toContain('apex active');
    expect(bodyText).not.toContain('arifos.arif-fazil.com/mcp');
  });
});
