import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Expertise } from "@/components/sections/Expertise";
import { Hero } from "@/components/sections/Hero";
import { SelectedProducts } from "@/components/sections/SelectedProducts";
import { Studio } from "@/components/sections/Studio";
import { profile } from "@/lib/content/site";
import { homeStructuredData, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  // Keeps the role keyword coverage the previous HTML site had in its title
  // ("Frontend Developer & AI Tool Builder") without changing visible copy.
  title: `${profile.name} — Software Developer`,
  description: profile.metaDescription,
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={homeStructuredData()} />
      <main id="main">
        <Hero />
        <SelectedProducts />
        <About />
        <Expertise />
        <Experience />
        <Studio />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
