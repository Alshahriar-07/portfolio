# Al Shahriar Sowan — Portfolio

A monochrome editorial portfolio for **Al Shahriar Sowan**, focused on websites and software.
Built with Next.js (App Router), TypeScript, and Tailwind CSS v4. The hero is typography-led;
contact submissions use Web3Forms when configured.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run start
```

Checks:

```bash
npm run lint
npm run typecheck
```

## Content

`lib/content/site.ts` is the single source of truth for personal content. It was extracted
from `assets/Al_Shahriar_Sowan_Resume_Professional...pdf` and checked against the live project
sites and public repositories in October 2026.

- Name, professional title, availability, email
- GitHub, LinkedIn, portfolio links
- Professional summary and biography
- Skills groups, work experience, education
- Project showcase: Seed Code CLI, Seed Code Chat, IntLLM, Dorkey
- Secondary projects: OneClickMC, Hmouse
- Eagox Studio

### Source conflicts recorded

- The resume title is **Junior AI Tools & Software Developer**. The hero leads with
  **Websites & Software**, while the profile reflects broader project experience accurately.
- The resume notes the alternate spelling **Al Shahriar Sayon**; the site uses **Al Shahriar
  Sowan**.
- The resume lists Seed Code CLI **v8.2.5**, while the public repository and installer page
  currently show **v9.1.1**. No version number is printed for that project.
- The resume describes Seed Code Chat as **Next.js / TypeScript / Tailwind**, while the public
  repository describes a **vanilla JavaScript** frontend. The site therefore makes no
  framework claim for that project.
- The resume's 987-test figure is not printed, since it refers to an older CLI version.

The phone number and personal address in the PDF are intentionally not published.

## Assets

| Asset | Path | Notes |
| --- | --- | --- |
| Original resume | `assets/Al_Shahriar_Sowan_Resume_Professional...pdf` | Untouched |
| Downloadable resume | `public/Al_Shahriar_Sowan_Resume.pdf` | Current resume, served as-is |
| Portrait | `assets/me.png` | Original preserved; served copy at `public/assets/me.png` |
| Project previews | `public/projects/*.webp` | Captured from the live project interfaces, Oct 2026 |
| Browser favicon | `app/favicon.ico` | Supplied multi-size ICO, served by Next.js |
| PNG favicons | `public/icons/favicon-*.png` | Supplied 16, 32, and 48 px assets, referenced in metadata |
| App icons | `public/icons/icon-192.png`, `public/icons/icon-512.png` | Supplied assets |
| Apple touch icon | `app/apple-icon.png` | Supplied 180 px asset, served by Next.js |
| App icon | `app/icon.png` | Supplied 192 px icon, served by Next.js |

The hero download action points at `/Al_Shahriar_Sowan_Resume.pdf` with the
`download="Al_Shahriar_Sowan_Resume.pdf"` attribute. Every resume link on the
site reads `profile.resume` from `lib/content/site.ts`.

## Sections

1. **Hero** — oversized two-line Websites & Software headline and resume download; no 3D/WebGL scene.
2. **Selected products** — three concise homepage previews leading to `/products`.
3. **Products** — four featured projects with real interface captures, verified status, facts,
   live links and repository links, plus Eagox Studio and secondary projects.
4. **About** — the supplied transparent B&W portrait on white, biography, facts and actions.
5. **Expertise** — four evidence-based categories from the resume, no scores or skill bars.
6. **Experience** — contract deployment role, independent practice, and education.
7. **Eagox Studio** — independent studio statement, studio-site link, published products.
8. **Contact** — email, GitHub, LinkedIn, resume and availability.
9. **Footer** — site index and secondary links.
10. **Contact page** — accessible validated Web3Forms contact form and verified contact destinations.

Project links verified October 2026:

- https://seedcode-cli.vercel.app · https://github.com/Alshahriar-07/seedcode-cli
- https://seedcode-chat.vercel.app · https://github.com/Alshahriar-07/seedcode-chat
- https://intllm.vercel.app · https://github.com/Alshahriar-07/INTLLM
- https://dorkey.vercel.app · https://github.com/Alshahriar-07/Dorkey
- https://github.com/Alshahriar-07/OneClickMC
- https://github.com/Alshahriar-07/Hmouse
- https://eagoxstudio.vercel.app

The project previews are real screenshots of the live sites, converted to WebP.
They appear grayscale by default and reveal colour on hover or keyboard focus; mobile users
see the full grayscale preview without needing hover.

## Motion

- Hero uses typography and negative space instead of a 3D scene or WebGL.
- Animations respect `prefers-reduced-motion`.
- Section enter reveals use CSS scroll-driven animations, wrapped in
  `@supports (animation-timeline: view())`; content is static and visible where unsupported.
- No animation library was added.

The homepage, Products page, and Contact page include page-specific metadata and canonical URLs. Supplied ICO and PNG assets use Next.js icon routes plus metadata links for the small PNG variants. The portrait and downloadable resume are byte-identical copies of their originals.

### Contact form configuration

The Contact page posts `FormData` to the Web3Forms endpoint. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in the deployment environment (see `.env.example`) with an access key created for the intended inbox at https://web3forms.com/. Without it, the form shows a configuration error and does not report success. No recipient or key is hardcoded.
