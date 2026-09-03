# Minuteform

Minuteform is a Next.js workspace that turns pasted meeting notes, images, and visual records into structured Minutes of the Meeting (MOTM). It includes inline review, manual editing, copy/export tools, and an optional GDG-style meeting-format PDF export.

## Features

- Paste a guidance template into the source notes field.
- Upload image files or PDFs for visual analysis.
- Generate structured meeting details, discussions, decisions, action items, and review flags.
- Edit generated output live or clear only the output while preserving source notes.
- Copy minutes as text, export plain text, or apply the meeting-format PDF layout.
- Responsive deep-navy operations workspace with accessible motion preferences.

## Tech stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Vercel AI SDK with AI Gateway model routing
- jsPDF and html2canvas for browser PDF export
- Lucide React icons

## Local development

Use Node.js 20 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## AI configuration

Text notes use a local deterministic fallback so the interface can be explored without AI credentials. Image/PDF analysis uses the server route at `app/api/format-motm/route.ts` and requires the project’s Vercel AI Gateway configuration when deployed. Do not commit environment files or provider keys.

## Upload notes

Uploads are validated in the browser and sent to the server as visual data. For production-scale usage, move large files to private object storage and rasterize PDF pages before multimodal analysis. Treat generated minutes as a draft and review flagged or unreadable details before sharing.

## Project structure

```text
app/
  api/format-motm/route.ts  # visual analysis endpoint
  globals.css               # design tokens and workspace styling
  layout.tsx                # metadata and fonts
  page.tsx                  # interactive MOTM workspace
```

## Deployment

The project can be deployed to Vercel. Configure the AI Gateway integration in the project environment before using visual analysis in production.

## License

Add the license selected by the project owner before publishing this repository.
