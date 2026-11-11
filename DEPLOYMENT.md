# Deployment setup

Set this environment variable in the hosting provider before building the app:

- `NEXT_PUBLIC_SITE_URL`: the public HTTPS origin you choose. This value is embedded during the Next.js build and controls canonical links, social metadata, sitemap URLs, robots.txt, structured data, and HTTPS redirects. The current fallback is `https://lookchecker.com`.

The static Apache redirect in `public/.htaccess` also targets `https://lookchecker.com`. If you deploy on another domain, update that redirect target and the absolute origin references in `public/robots.txt`, `public/home.md`, `public/.htaccess`, and `public/.well-known/mcp/server-card.json` to match `NEXT_PUBLIC_SITE_URL` before building and uploading.

## Hostinger static deployment

This project is configured for a static export because Hostinger Premium does not run Next.js Node applications. Run `npm run build`; Next.js writes the complete deployable website to `out/`. Upload the **contents** of `out/` to the website document root, including `.htaccess`, so `index.html` sits at the root. Keep `favicon.ico` at the document root; the homepage declares this stable URL for search engines. The Apache rules provide HTTPS redirection, security headers, extensionless page routing, the exported 404 page, compression when the host enables `mod_deflate` or `mod_brotli`, and long-lived caching for hashed Next.js assets. Verify response headers on the deployed host because Apache modules and hosting-level proxy settings vary. Image optimization is disabled at the Next.js layer because a static host cannot run the Next.js image optimizer.

The export includes all guide and tool pages generated at build time, plus the static sitemap, robots file, and health response. No server runtime, database, or Hostinger Node.js build is required. Do not upload `node_modules/` or `.next/`; neither is needed for the static output.

The static export also publishes `/llms.txt`, `/home.md`, and `/.well-known/mcp/server-card.json`. Apache serves the Markdown homepage for requests whose `Accept` header includes `text/markdown` and emits `Link` headers for the Markdown alternate and `llms.txt`; keep the included `.htaccess` and confirm the deployed Apache host permits `mod_rewrite`, `mod_headers`, and `mod_mime`. Because this static site has no remote MCP endpoint, `server-card.json` is explicitly a site-discovery manifest, not a conformant [SEP-2127 MCP Server Card](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2127-mcp-server-cards.md). It discloses that the listed WebMCP tool is browser-only.

## IndexNow

The IndexNow verification key is included as `public/8e28c9f7a37e4c409b7c9762bd1fd6aa.txt`. The static export copies it to the document root, so after deployment verify that `https://lookchecker.com/8e28c9f7a37e4c409b7c9762bd1fd6aa.txt` returns the key as plain text. If `NEXT_PUBLIC_SITE_URL` is set to a different domain, deploy the same file at that domain's root and use that host in submissions.

To notify IndexNow of URLs, send an HTTP POST to `https://api.indexnow.org/indexnow` with a JSON body containing the site host, this key, the key file URL, and the changed URLs. For example:

```json
{
  "host": "lookchecker.com",
  "key": "8e28c9f7a37e4c409b7c9762bd1fd6aa",
  "keyLocation": "https://lookchecker.com/8e28c9f7a37e4c409b7c9762bd1fd6aa.txt",
  "urlList": ["https://lookchecker.com/"]
}
```

For a Node.js deployment instead, use a Business or Cloud plan, upload the source files and `package-lock.json`, and let Hostinger install dependencies for its Linux environment. The lockfile is synchronized with `package.json`; avoid broad framework or CSS-toolchain upgrades without a confirmed compatibility issue.

The app does not require a database. It does not provide user accounts or save photos, face landmarks, scan results, or preferences. Photos and measurements are processed temporarily in the browser and are cleared when the scan is reset or the page is closed.

The health endpoint checks that the app responds and does not require a database.

The production server expects the hosting proxy to pass `x-forwarded-proto: https` for HTTPS requests. It redirects plain HTTP to the configured public origin.

If a previous deployment used the saved-report database feature, removing this app's database code does not delete data already stored in that separate database. Review and securely delete any legacy `saved_reports` records and the table through the database provider before decommissioning it. No database connection is configured in this workspace, so existing remote records could not be checked or deleted here.
