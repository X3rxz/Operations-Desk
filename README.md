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

## Run locally from GitHub

Prerequisites: Node.js 20 or newer, pnpm, and Git.

```bash
git clone <your-repository-url>
cd minuteform
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). On Windows, copy `.env.example` to `.env.local` using File Explorer or PowerShell instead of `cp`.

## Checks

```bash
pnpm typecheck
pnpm build
# or run both together
pnpm validate
```

## AI configuration

The app can be explored locally without credentials: pasted notes use a deterministic fallback. To enable image/PDF analysis, add your server-side `AI_GATEWAY_API_KEY` to `.env.local`, then restart the dev server. Never commit `.env.local`, place the key in a `NEXT_PUBLIC_*` variable, or paste it into client-side code.

For Vercel deployment, configure the AI Gateway integration or the same server-side variable in the project environment before using visual analysis. If the visual request is unavailable, the app reports the fallback behavior rather than blocking the local text workflow.

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
