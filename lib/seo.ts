import type { Metadata } from "next";
import { products, profile } from "@/lib/content/site";

export const siteUrl = profile.links.portfolio.replace(/\/$/, "");

export const socialImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${profile.name} — ${profile.role}`,
} as const;

type PageMetadataInput = {
  title: string;
  description: string;
  path: "/" | "/products" | "/contact";
};

export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const url = path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: `${profile.name} — Portfolio`,
      title,
      description,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

const personId = `${siteUrl}/#person`;
const websiteId = `${siteUrl}/#website`;
const siteName = `${profile.name} — ${profile.role}`;

export function homeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteName,
        alternateName: "Al Shahriar Sowan Portfolio",
        description: profile.metaDescription,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        alternateName: profile.alternateName,
        url: siteUrl,
        image: `${siteUrl}/assets/me.png`,
        email: `mailto:${profile.email}`,
        jobTitle: "Software Developer",
        description: profile.summary,
        // Discord is carried over from the previous site's Person markup so the
        // existing identity links are not dropped during the migration.
        sameAs: [profile.links.github, profile.links.linkedin, "https://discord.com/users/al_shahriar007"],
        knowsAbout: [
          "AI tools",
          "LLM integration",
          "Web development",
          "Software development",
          "Python",
          "Next.js",
          "TypeScript",
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: siteName,
        description: profile.metaDescription,
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        inLanguage: "en",
      },
    ],
  };
}

export function productsStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteName,
        inLanguage: "en",
      },
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/products#webpage`,
        url: `${siteUrl}/products`,
        name: `Products — ${profile.name}`,
        description:
          "Seven independent projects across AI development tools, AI chat, Android, web development, email technology, and browser-based tools.",
        isPartOf: { "@id": websiteId },
        inLanguage: "en",
        mainEntity: { "@id": `${siteUrl}/products#products` },
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/products#products`,
        name: `${profile.name} — Selected products`,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareApplication",
            name: product.name,
            applicationCategory: product.category,
            description: product.description,
            url: product.website,
            author: { "@type": "Person", name: profile.name, url: siteUrl },
          },
        })),
      },
    ],
  };
}

export function contactStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteName,
        inLanguage: "en",
      },
      {
        "@type": "ContactPage",
        "@id": `${siteUrl}/contact#webpage`,
        url: `${siteUrl}/contact`,
        name: `Contact — ${profile.name}`,
        description: `Contact ${profile.name} about websites, software, AI tools, and independent product work.`,
        isPartOf: { "@id": websiteId },
        inLanguage: "en",
        about: {
          "@type": "Person",
          name: profile.name,
          url: `${siteUrl}/`,
          sameAs: [profile.links.github, profile.links.linkedin],
        },
      },
    ],
  };
}
