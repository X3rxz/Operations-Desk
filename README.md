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

The quickest path is to clone the repository, install dependencies, and start the local Next.js server from your device’s terminal.

Prerequisites:

- Node.js 20 or newer — verify with `node --version`
- Git — verify with `git --version`
- pnpm — install with `corepack enable`, then verify with `pnpm --version`

### macOS or Linux

```bash
git clone <your-repository-url>
cd minuteform
pnpm install
cp .env.example .env.local
pnpm dev
```

### Windows PowerShell

```powershell
git clone <your-repository-url>
cd minuteform
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

The terminal will show a local address, usually [http://localhost:3000](http://localhost:3000). Open that address in a browser. Keep the terminal running while using the app; press `Ctrl+C` to stop the server.

If pnpm is unavailable, you can use npm instead:

```bash
npm install
npm run dev
```

To run the production build locally:

```bash
pnpm build
pnpm start
```

If port 3000 is already in use, start on another port:

```bash
pnpm dev -- --port 3001
```

Then open [http://localhost:3001](http://localhost:3001). On Windows, use `pnpm dev -- --port 3001` in PowerShell as well.

### Environment file

The `.env.local` file is ignored by Git and is only for your device. You can use the app’s pasted-notes fallback without adding a key. To enable image/PDF AI analysis, add the server-side `AI_GATEWAY_API_KEY` value to `.env.local`, then stop and restart `pnpm dev`. Never commit `.env.local` or expose this key in a `NEXT_PUBLIC_*` variable.

Open [http://localhost:3000](http://localhost:3000) after starting the server.

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
