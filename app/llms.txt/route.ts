import { products, profile, siteUpdatedAt, studio } from "@/lib/content/site";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const productLines = products
    .map((product, index) => {
      const source = product.github ? ` Source: ${product.github}` : "";
      return `${index + 1}. [${product.name}](${product.website}) — ${product.description}${source}`;
    })
    .join("\n");

  const body = `# ${profile.name}

> Software developer in Bangladesh building websites, software, and AI tools under ${studio.name}.

## About

${profile.name} is an independent software developer based in Bangladesh. He builds AI tools, web applications, and utility software — from a terminal coding assistant to a multi-provider chat interface and a local-first AI runtime. He studies Computer Science & Technology at Dhaka Polytechnic Institute and has hands-on IT deployment experience.

The portfolio documents seven independent products across AI development tools, chat applications, Android, web development, email technology, and browser-based tools. Work is designed and released under ${studio.name} (${studio.url}).

## Products

${productLines}

Each entry links to the project's live site; a "Source" link points to its public repository.

## Website Pages

- [Home](${siteUrl}/): introduction, selected products, about, expertise, experience, studio, and contact sections.
- [Products](${siteUrl}/products): the full index of all seven products with links to each live project and public repository.
- [About section](${siteUrl}/#about): a professional biography, education, and development focus on the homepage.
- [Contact](${siteUrl}/contact): email, WhatsApp, GitHub, and the contact form.

## Contact

- [Contact page](${siteUrl}/contact)
- Email: ${profile.email}
- [WhatsApp](https://wa.me/8801893134718)
- [GitHub](${profile.links.github})
- [LinkedIn](${profile.links.linkedin})
- [Resume (PDF)](${siteUrl}${profile.resume.publicPath})

## Notes

- Canonical domain: ${siteUrl}
- Sitemap: ${siteUrl}/sitemap.xml
- Robots policy: ${siteUrl}/robots.txt
- Content last reviewed: ${siteUpdatedAt}
- No public About route exists; the professional biography is on the homepage.
- Project and profile links above are the official live sites and public profiles listed on this portfolio.
- This file describes only publicly available portfolio content. It does not guarantee indexing, ranking, or inclusion by any search engine or AI system.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
