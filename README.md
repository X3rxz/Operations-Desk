# Minuteform

Minuteform is a Next.js application that turns pasted meeting notes, images, and visual records into structured Minutes of the Meeting (MOTM). It includes live review and editing, copy/export tools, and an optional GDG-style meeting-format PDF export.

> Generated minutes are drafts. Always review names, dates, decisions, and action items before sharing.

## Contents

- [What it does](#what-it-does)
- [Technology](#technology)
- [Run it locally](#run-it-locally)
- [Configure AI image and PDF analysis](#configure-ai-image-and-pdf-analysis)
- [Use the application](#use-the-application)
- [Export meeting minutes](#export-meeting-minutes)
- [Run checks](#run-checks)
- [Project structure](#project-structure)
- [How the request flow works](#how-the-request-flow-works)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)
- [Deploy to Vercel](#deploy-to-vercel)

## What it does

- Paste meeting notes directly into the Source notes field.
- Paste a guidance template to see the expected note structure.
- Upload images or PDFs for visual analysis.
- Generate meeting title, date, time, location, attendees, discussion points, decisions, and action items.
- Edit the generated output live.
- Clear only the output while keeping the source notes.
- Copy minutes as plain text.
- Export plain text or an optional meeting-format PDF.
- Use the responsive workspace on desktop or mobile.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel AI SDK and AI Gateway model routing
- jsPDF and html2canvas for browser PDF export
- Lucide React icons

## Run it locally

Follow these steps from a terminal on your computer.

### 1. Install prerequisites

Install the following tools first:

- **Node.js 20 or newer**: https://nodejs.org/
- **Git**: https://git-scm.com/downloads
- **pnpm**: included with modern Node through Corepack

Verify the installations:

```bash
node --version
git --version
```

Enable pnpm:

```bash
corepack enable
pnpm --version
```

If your system does not support Corepack, install pnpm from https://pnpm.io/installation.

### 2. Clone the GitHub repository

Replace the URL with your repository URL if you are using a fork:

```bash
git clone https://github.com/X3rxz/Operations-Desk.git
cd Operations-Desk
```

### 3. Install dependencies

```bash
pnpm install
```

If you prefer npm:

```bash
npm install
```

### 4. Create the local environment file

macOS or Linux:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

The `.env.local` file is intentionally ignored by Git. Never commit it.

### 5. Start the development server

With pnpm:

```bash
pnpm dev
```

With npm:

```bash
npm run dev
```

Open the URL shown in the terminal, normally:

```text
http://localhost:3000
```

Keep the terminal window open while using the application. Press `Ctrl+C` to stop the development server.

### 6. Start on another port

If port 3000 is already being used:

```bash
pnpm dev -- --port 3001
```

Then open:

```text
http://localhost:3001
```

## Configure AI image and PDF analysis

Pasted notes can be tested without an AI key because the application includes a local fallback formatter.

Image and PDF analysis requires a server-side AI Gateway key. Open `.env.local` and add:

```env
AI_GATEWAY_API_KEY=your_key_here
```

Save the file, then stop and restart the development server:

```bash
Ctrl+C
pnpm dev
```

Important security rules:

- Do not use `NEXT_PUBLIC_AI_GATEWAY_API_KEY`.
- Do not place the key in `app/page.tsx` or any browser code.
- Do not commit `.env.local`.
- Do not paste the key into an issue, pull request, screenshot, or chat.

## Use the application

### 1. Add source material

You can use either method:

- Type or paste notes into **Source notes**.
- Choose **Upload images or PDFs** and select visual meeting records.

You can combine pasted notes with uploaded files.

### 2. Use the template

Press **Paste template** above the Source notes field. The application inserts a note-taking outline. Replace the guidance text with your meeting details before formatting.

### 3. Format the minutes

Press **Format minutes**. The button shows a loading animation while the application processes the source material.

The generated draft appears in the output panel.

### 4. Review and edit

Press **Edit** in the output panel to enable live editing. You can adjust:

- Meeting title
- Attendees
- Discussion points
- Decisions
- Action items

Press **Done** when finished editing.

If you want to regenerate the result, press **Clear** in the output panel. This removes the generated output but keeps your source notes and uploads available.

## Export meeting minutes

The output panel provides two export modes:

### Plain-text export

Leave **Apply meeting format** unchecked and press **Export**. A `.txt` file is downloaded.

### Meeting-format PDF export

Check **Apply meeting format**, then press **Export PDF**. The application creates an A4 PDF with:

- GDG-style branding
- Meeting details table
- Discussion section
- Action items table
- Status checkboxes
- Meeting adjournment row

The PDF is generated in the browser using jsPDF and html2canvas. If export fails, check that the source and output are loaded and that the branding asset is reachable.

## Run checks

Run TypeScript validation:

```bash
pnpm typecheck
```

Run the production build:

```bash
pnpm build
```

Run the combined validation command:

```bash
pnpm validate
```

Start the production build locally:

```bash
pnpm build
pnpm start
```

Run Git whitespace checks before opening a pull request:

```bash
git diff --check
```

## Project structure

```text
app/
  api/format-motm/route.ts  # server-side visual formatting endpoint
  globals.css               # design tokens, background, animations, and component styles
  layout.tsx                # fonts and page metadata
  page.tsx                  # interactive MOTM workspace

public/                      # static project assets
.env.example                 # safe environment-variable template
.gitignore                   # ignored local files and build output
next.config.mjs              # Next.js configuration
package.json                 # scripts and dependencies
```

## How the request flow works

### Pasted notes

1. The browser stores the notes in React state.
2. The local formatter creates a predictable MOTM object.
3. The output is rendered as editable sections.
4. Copy and export functions convert the object into a downloadable format.

### Images and PDFs

1. The browser validates the selected file type.
2. The file is converted to data for the formatting request.
3. The browser sends the request to `/api/format-motm`.
4. The server calls the configured vision-capable AI model.
5. The model returns structured meeting-minute data.
6. The browser renders the response for human review.

The API route is server-side so credentials are not placed in browser code.

## Troubleshooting

### `pnpm: command not found`

Run:

```bash
corepack enable
```

Then open a new terminal and verify:

```bash
pnpm --version
```

You can also use npm commands instead.

### `node: command not found`

Install Node.js 20 or newer from https://nodejs.org/, then restart your terminal.

### The page does not open

Confirm that the dev server is still running. Check the terminal for the actual URL and port. If port 3000 is unavailable, use:

```bash
pnpm dev -- --port 3001
```

### Image or PDF analysis is unavailable

Check that:

1. `AI_GATEWAY_API_KEY` exists in `.env.local`.
2. The key is not prefixed with `NEXT_PUBLIC_`.
3. You restarted the dev server after changing `.env.local`.
4. The uploaded file is a supported image or PDF.
5. The file is not unusually large.

Pasted notes can still use the local fallback without AI configuration.

### The build fails after pulling changes

Refresh dependencies and rerun validation:

```bash
pnpm install
pnpm typecheck
pnpm build
```

### How do I update the repository?

```bash
git pull origin main
pnpm install
pnpm dev
```

If you are working on a feature branch, replace `main` with that branch name.

## Security notes

This project is suitable for local prototyping, but review the API protections before exposing it publicly. In particular, production deployments should add authentication, rate limiting, server-side request-size limits, strict file validation, schema validation for AI responses, and reliable PDF rasterization.

Treat meeting notes and uploaded documents as potentially confidential. Do not upload sensitive information to an environment unless the configured AI provider and deployment satisfy your organization’s privacy requirements.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Configure the AI Gateway integration or server-side `AI_GATEWAY_API_KEY` in the Vercel project environment.
4. Deploy the project.
5. Test pasted notes first, then test an image and a PDF.
6. Review the security notes before sharing the public URL.

## License

Add the license selected by the project owner before publishing this repository.

## Contributing

Create a feature branch, make focused changes, run `pnpm validate`, and open a pull request with a description of the user-facing behavior and verification performed.
