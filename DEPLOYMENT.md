# Meridian — NYC Job Search App
## Deployment Guide (No prior experience needed)

---

## What you're deploying

A React web app that uses the Anthropic API to search live job boards for NYC roles eligible under J-1 or E-2 visas. One button click searches across Idealist, ReliefWeb, LinkedIn, Devex, and more, filters for eligibility, and returns scored results.

---

## Prerequisites (all already done)

- [x] GitHub account with a repo called `job-board`
- [x] Vercel account linked to GitHub
- [x] Anthropic API key starting with `sk-ant-...`

---

## Step 1 — Upload the code to GitHub

1. Go to **github.com** and log in
2. Click on your **job-board** repository
3. You need to upload these files. The easiest way:

### Option A: Upload via GitHub website (recommended for beginners)

GitHub's web interface lets you upload files one folder at a time.

**Create the folder structure first:**

In your repo, click **Add file → Create new file**

Type the filename as: `src/index.js`

Paste the contents of `src/index.js` from the code you received. Click **Commit new file**.

Repeat for each file, using the exact paths:
- `src/index.js`
- `src/App.js`
- `src/App.css`
- `src/lib/api.js`
- `src/lib/profileData.js`
- `src/lib/storage.js`
- `src/components/Dashboard.js`
- `src/components/JobFeed.js`
- `src/components/Pipeline.js`
- `src/components/ProfilePanel.js`
- `public/index.html`
- `package.json`
- `.gitignore`

**Do NOT upload `.env.example` or any `.env` file — your API key goes in Vercel, not GitHub.**

### Option B: GitHub Desktop (slightly faster)

1. Download **GitHub Desktop** from desktop.github.com
2. Clone your `job-board` repo to your computer
3. Copy all the app files into the cloned folder, maintaining the folder structure
4. In GitHub Desktop, click **Commit to main** then **Push origin**

---

## Step 2 — Add your API key to Vercel

**This is the most important security step. Your API key must NEVER go in GitHub.**

1. Go to **vercel.com** and log in
2. Click **Add New → Project**
3. Find your `job-board` repository and click **Import**
4. On the configuration page, look for **Environment Variables**
5. Add one variable:
   - **Name:** `REACT_APP_ANTHROPIC_API_KEY`
   - **Value:** your API key (paste it here, starts with `sk-ant-...`)
6. Click **Add**
7. Click **Deploy**

Vercel will build and deploy your app. This takes about 2 minutes.

---

## Step 3 — Get your URL

After deployment, Vercel shows you a URL like:
```
https://job-board-abc123.vercel.app
```

That's your app. Send that URL to your friend. Done.

---

## Step 4 — Test it

1. Open the URL in any browser (Chrome, Safari, Firefox — all work)
2. You should see the Meridian app with a dark theme
3. Go to **Profile** tab and optionally upload a resume/CV
4. Go back to **Search** tab
5. Select some interest tags (or leave them all off for a broad search)
6. Click **Find matching roles**
7. Wait 30–60 seconds — the AI is searching live job boards
8. Results appear with J-1/E-2 tags, fit scores, and detail panels

---

## Updating the app later

If you need to change anything:
1. Edit the file in GitHub (click the file → pencil icon → edit → commit)
2. Vercel automatically redeploys within 30 seconds
3. The same URL stays the same — no need to resend it to your friend

---

## Troubleshooting

**"Invalid API key" error in the app:**
→ Go to Vercel → your project → Settings → Environment Variables
→ Check that `REACT_APP_ANTHROPIC_API_KEY` is set correctly
→ Redeploy (Deployments tab → three dots → Redeploy)

**Build failed in Vercel:**
→ Check that all files were uploaded with the exact paths listed above
→ Make sure `package.json` was uploaded to the root (not inside a folder)

**App loads but search returns nothing:**
→ Check your Anthropic console (console.anthropic.com) to confirm the API key has credits
→ Make sure auto-reload is off and you have remaining credits

**Blank white screen:**
→ Open browser developer tools (F12 → Console tab) and look for red error messages
→ Most common cause: a file was uploaded to the wrong path

---

## Monthly cost estimate

- GitHub: Free
- Vercel: Free
- Anthropic API: ~$0.50–$3 per month for typical usage (hard cap set at $10)

---

## Folder structure reference

```
job-board/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── JobFeed.js
│   │   ├── Pipeline.js
│   │   └── ProfilePanel.js
│   └── lib/
│       ├── api.js
│       ├── profileData.js
│       └── storage.js
├── package.json
└── .gitignore
```
