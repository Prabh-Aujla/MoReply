# MoReply – AI-Style Auto Replies for Small Businesses

## 1. What this integration does

MoReply is a small Next.js app that helps a local business manage customer replies across reviews and social media.

The app focuses on **auto-reply templates** instead of live AI calls.  
A business user can:

- Create reply templates based on **platform** (Google, Yelp, Instagram, Facebook, X, TikTok)
- Choose a **reply tone** (Friendly, Professional, Playful, Apologetic, Custom)
- Paste an example review or comment (what the customer said)
- Generate a **hardcoded reply** based on tone (simulating AI behavior)
- Save templates and then view, edit, and delete them in a separate interface

Under the hood, the templates are stored in `localStorage` and can also be exported as JSON (downloaded as a `.txt` file). A sample database schema and placeholder rows are provided in `db/schema_and_placeholders.sql` to show how this data could live in a real backend.

---

## 2. How to set it up and run it

### Prerequisites

- Node.js (LTS version recommended, e.g. 18+)
- npm or pnpm or yarn

### Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn

#run app
npm run dev

#where to see the result
http://localhost:3000/moreply
