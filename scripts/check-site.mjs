import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const baseUrl = process.env.SITE_URL?.replace(/\/$/, "");
const failures = [];
const passes = [];

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function expectFile(relativePath, label = relativePath) {
  const absolutePath = join(root, relativePath);
  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    failures.push(`Missing file: ${label}`);
    return null;
  }
  passes.push(`Found ${label}`);
  return absolutePath;
}

function expect(condition, message) {
  if (condition) passes.push(message);
  else failures.push(message);
}

const sourceFiles = [
  "app/sitemap.ts",
  "app/robots.ts",
  "app/template.tsx",
  "app/manifest.ts",
  "app/llms.txt/route.ts",
  "app/not-found.tsx",
  "app/error.tsx",
  "app/global-error.tsx",
  "app/page.tsx",
  "app/products/page.tsx",
  "app/contact/page.tsx",
  "lib/seo.ts",
  "components/seo/JsonLd.tsx",
];
sourceFiles.forEach((file) => expectFile(file));

const resumePath = expectFile("public/Al_Shahriar_Sowan_Resume.pdf", "resume PDF");
if (resumePath) {
  const header = readFileSync(resumePath).subarray(0, 5).toString("utf8");
  expect(header === "%PDF-", "Resume file has a valid PDF header");
}

const iconFiles = [
  "app/favicon.ico",
  "app/icon.png",
  "public/google21a248609224cf2d.html",
  "app/apple-icon.png",
  "public/icons/favicon-16x16.png",
  "public/icons/favicon-32x32.png",
  "public/icons/favicon-48x48.png",
  "public/icons/icon-192.png",
  "public/icons/icon-512.png",
];
iconFiles.forEach((file) => expectFile(file));

const ogPath = expectFile("public/og.png", "social preview image");
if (ogPath) {
  const png = readFileSync(ogPath);
  const signature = png.subarray(0, 8).toString("hex");
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  expect(signature === "89504e470d0a1a0a", "Social preview is a PNG");
  expect(width === 1200 && height === 630, `Social preview is 1200x630 (found ${width}x${height})`);
}

const site = read("lib/content/site.ts");
const siteUrl = "https://alshahriarsayon.vercel.app";
expect(
  site.includes('publicPath: "/Al_Shahriar_Sowan_Resume.pdf"'),
  "Resume link points at the PDF served from public/",
);
expect(site.includes(siteUrl), `Content uses the production origin ${siteUrl}`);
expect(!/alshahriarsowan\.vercel\.app/i.test(site), "Content does not reference the old domain");

const productNames = [
  "SeedCode CLI",
  "SeedCode Chat",
  "SeedCode Chat Android",
  "Mr Mesoff",
  "IntLLM",
  "SeedMail",
  "Dorkey",
];
productNames.forEach((name) => expect(site.includes(name), `Product data includes ${name}`));

const llms = read("app/llms.txt/route.ts");
expect(llms.includes("products") && llms.includes(".map("), "llms.txt is generated from the product data");
expect(llms.includes("product.website") && llms.includes("product.description"), "llms.txt includes project links and descriptions");
expect(llms.includes("${siteUrl}/products"), "llms.txt links the products page");
expect(llms.includes("${siteUrl}/contact"), "llms.txt links the contact page");
expect(llms.includes("## Products") && llms.includes("## Website Pages"), "llms.txt has products and pages sections");
expect(llms.includes("profile.email"), "llms.txt includes the public contact email");
expect(llms.includes("does not guarantee indexing"), "llms.txt does not promise indexing or ranking");
expect(!llms.includes("process.env"), "llms.txt does not expose environment variables");

const verificationPath = "public/google21a248609224cf2d.html";
const verificationAssetPath = "public/assets/google21a248609224cf2d.html";
const verificationFile = readFileSync(join(root, verificationPath));
const verificationAsset = readFileSync(join(root, verificationAssetPath));
expect(verificationFile.equals(verificationAsset), "Root Google verification file is an exact copy of the preserved original");
expect(verificationFile.toString("utf8").trim() === "google-site-verification: google21a248609224cf2d.html", "Google verification file contains the original HTML-file token format");

const robots = read("app/robots.ts");
expect(robots.includes("${siteUrl}/sitemap.xml"), "robots.txt references the production sitemap");
expect(robots.includes('allow: "/"'), "robots.txt allows public crawling");

const sitemap = read("app/sitemap.ts");
expect(sitemap.includes("url: siteUrl"), "sitemap homepage URL matches the canonical form");
expect(sitemap.includes("${siteUrl}/products") && sitemap.includes("${siteUrl}/contact"), "sitemap includes every public route");
expect(sitemap.includes("${siteUrl}/products"), "sitemap includes /products");
expect(sitemap.includes("${siteUrl}/contact"), "sitemap includes /contact");
expect(!sitemap.includes("lastModified"), "sitemap does not invent last-modified dates");
expect(!sitemap.includes("http://"), "sitemap does not use insecure URLs");

const layout = read("app/layout.tsx");
expect(layout.includes("metadataBase: new URL(siteUrl)"), "Metadata base uses the production origin");
expect(layout.includes("socialImage"), "Root metadata uses the social preview image");
expect(layout.includes("/favicon.ico"), "Root metadata references the favicon");

const pages = {
  "app/page.tsx": 'path: "/"',
  "app/products/page.tsx": 'path: "/products"',
  "app/contact/page.tsx": 'path: "/contact"',
};
for (const [file, needle] of Object.entries(pages)) {
  expect(read(file).includes(needle), `${file} defines its canonical path (${needle})`);
}

const notFound = read("app/not-found.tsx");
expect(notFound.includes("not-found-title"), "404 page has a heading");
expect(notFound.includes('href="/products"'), "404 page links to products");
expect(notFound.includes("robots: { index: false, follow: false }"), "404 page is marked noindex");

const errorPage = read("app/error.tsx");
expect(errorPage.includes('"use client"'), "Route error boundary is a client component");
expect(errorPage.includes("onClick={reset}"), "Route error boundary exposes a retry action");
expect(!errorPage.includes("error.message"), "Route error boundary does not render raw error messages");

const globalError = read("app/global-error.tsx");
expect(globalError.includes('"use client"'), "Global error boundary is a client component");
expect(globalError.includes("<html") && globalError.includes("<body"), "Global error defines html and body");
expect(globalError.includes("onClick={reset}"), "Global error boundary exposes a retry action");

const nextConfig = read("next.config.ts");
expect(nextConfig.includes("X-Content-Type-Options"), "Security headers include nosniff");
expect(nextConfig.includes("Referrer-Policy"), "Security headers include a referrer policy");
expect(nextConfig.includes('source: "/me.png"') && nextConfig.includes('destination: "/assets/me.png"'), "Legacy image URLs redirect to their Next.js equivalents");

if (baseUrl) {
  const routes = [
    ["/", 200],
    ["/products", 200],
    ["/contact", 200],
    ["/sitemap.xml", 200],
    ["/robots.txt", 200],
    ["/llms.txt", 200],
    ["/google21a248609224cf2d.html", 200],
    ["/assets/google21a248609224cf2d.html", 200],
    ["/favicon.ico", 200],
    ["/icons/favicon-32x32.png", 200],
    ["/apple-icon.png", 200],
    ["/Al_Shahriar_Sowan_Resume.pdf", 200],
    ["/this-route-should-not-exist", 404],
  ];

  for (const [route, expectedStatus] of routes) {
    try {
      const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
      const body = await response.text();
      expect(response.status === expectedStatus, `${route} returned ${response.status} (expected ${expectedStatus})`);
      if (route === "/") {
        expect(body.includes('rel="canonical"'), "Homepage has a canonical URL");
        expect(body.includes('href="/icons/favicon-32x32.png"'), "Homepage references the existing PNG favicon");
        expect(body.includes('name="description"'), "Homepage has a description");
        expect(body.includes(`${siteUrl}/`), "Homepage canonical uses the production origin");
        expect(body.includes("application/ld+json"), "Homepage includes structured data");
      }
      if (route === "/products" || route === "/contact") {
        expect(body.includes('rel="canonical"'), `${route} has a canonical URL`);
        expect(body.includes('property="og:title"'), `${route} has Open Graph title metadata`);
      }
      if (route === "/contact") {
        expect(body.includes("https://wa.me/8801893134718"), "Contact page has the specified WhatsApp URL");
      }
      if (route === "/products") {
        productNames.slice(0, 3).forEach((name) => {
          expect(body.includes(name), `Products page renders ${name}`);
        });
      }
      if (route === "/sitemap.xml") {
        expect(body.includes(`${siteUrl}/products`), "Sitemap XML includes /products");
        expect(body.includes(`${siteUrl}/contact`), "Sitemap XML includes /contact");
      }
      if (route === "/robots.txt") {
        expect(body.includes(`${siteUrl}/sitemap.xml`), "Robots response references the sitemap");
      }
      if (route === "/llms.txt") {
        productNames.forEach((name) => {
          expect(body.includes(name), `llms.txt response includes ${name}`);
        });
      }
      if (route.includes("google21a248609224cf2d.html")) {
        expect(body.trim() === "google-site-verification: google21a248609224cf2d.html", `${route} serves the verification token without page HTML`);
      }
      if (route === "/robots.txt") {
        expect((response.headers.get("content-type") ?? "").includes("text/plain"), "robots response has a text/plain content type");
      }
      if (expectedStatus === 404) {
        expect(body.includes("not-found-title"), "404 response renders the custom not-found page");
      }
    } catch (error) {
      failures.push(`${route} request failed: ${error.message}`);
    }
  }

  for (const [from, to] of [
    ["/me.png", "/assets/me.png"],
    ["/site.webmanifest", "/manifest.webmanifest"],
    ["/apple-touch-icon.png", "/apple-icon.png"],
  ]) {
    try {
      const response = await fetch(`${baseUrl}${from}`, { redirect: "manual" });
      const location = response.headers.get("location") ?? "";
      expect([301, 308].includes(response.status), `${from} redirects permanently (${response.status})`);
      expect(location.endsWith(to), `${from} redirects to ${to}`);
    } catch (error) {
      failures.push(`${from} redirect check failed: ${error.message}`);
    }
  }
} else {
  passes.push("Static checks only (set SITE_URL to run live HTTP checks)");
}

for (const message of passes) console.log(`PASS  ${message}`);
for (const message of failures) console.error(`FAIL  ${message}`);
console.log(`\n${passes.length} checks passed, ${failures.length} failed.`);

if (failures.length > 0) process.exit(1);
