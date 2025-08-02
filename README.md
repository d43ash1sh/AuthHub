[![CI Build Status](https://github.com/d43ash1sh/AuthHub/actions/workflows/ci.yml/badge.svg)](https://github.com/d43ash1sh/AuthHub/actions)  

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)  

[![Made with Next.js & TypeScript](https://img.shields.io/badge/tech-Next.js%20%26%20TypeScript-0052CC?logo=nextdotjs&logoColor=white)](https://nextjs.org/)  

[![Tailwind 4.0 Styled](https://img.shields.io/badge/styled%20with-Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)  

**Live Demo:** https://<your-vercel-or-netlify-subdomain>.vercel.app  

---  

## 📖 Table of Contents  

- [About AuthHub](#-about-authhub)  
- [Features](#-features)  
- [Tech Stack](#️-tech-stack)  
- [Screenshots](#-screenshots)  
- [Getting Started](#️-getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Environment Variables](#environment-variables)  
- [Usage](#-usage)  
- [API Endpoints](#-api-endpoints)  
- [PDF / Portfolio Export](#️-pdf--portfolio-export)  
- [Contributing](#-contributing)  
- [Code of Conduct](#-code-of-conduct)  
- [License](#-license)  
- [Acknowledgments](#-acknowledgments)  

---  

## ℹ️ About AuthHub  

AuthHub lets anyone sign in via **GitHub OAuth**, fetches their GitHub repositories, and presents them as a neat dashboard:  

- Public repos sorted from **most to least starred**  
- **Total stars**, **top languages** chart, and **contribution stats**  
- Ability to **pin up to 5 repos** for highlighting  
- Auto‑generate a **PDF portfolio/resume** from profile data  

Built as a modern tech demonstration of **React + Express + TypeScript**, AuthHub is ideal for securely showcasing your GitHub work—just like **gitforme.tech** but customized and extensible.  

---  

## ✨ Features  

1. **GitHub OAuth login** to securely authenticate users  
2. **Repo list** includes repo name, description, star count, primary language, and last updated  
3. **Star‑based sorting** ensures high‑impact repos appear first  
4. **Top Languages chart** (pie/bar) showing your most-used languages  
5. **Contribution summary**: commits, PRs, issues over the past year  
6. **Repo pinning**: select your personal favorites to highlight  
7. **Downloadable PDF** version of your public profile  
8. **Mobile‑friendly**, **dark mode ready**, and accessible UI  

---  

## 🧰 Tech Stack  

- **React 18** with **TypeScript** – Modern, type-safe frontend  
- **Express.js** with **TypeScript** – Fast, scalable backend  
- **Tailwind CSS** with **Radix UI** for modern styling  
- **Vite** for fast development and optimized builds  
- **Passport.js** for GitHub OAuth session management  
- **GitHub GraphQL API v4** for real-time data fetching  
- **Recharts** for beautiful charts and data visualization  
- **Puppeteer** for PDF generation from styled HTML  
- **Drizzle ORM** with **PostgreSQL** (or in-memory for development)  

---  

## 🖼 Screenshots  

| Login Screen | Dashboard View | PDF Export |
|---|---|---|
| `![Login Screen](assets/images/login.png)` | `![Dashboard](assets/images/dashboard.png)` | `![Export PDF](assets/images/export.png)` |  

---  

## 🚀 Getting Started  

### Prerequisites  

Make sure you have:  
- Node.js **≥18 LTS**  
- A GitHub Developer App (for OAuth credentials)  
- (Optional) A PostgreSQL / Supabase / Neon database  

### Installation  

```bash  
git clone https://github.com/d43ash1sh/AuthHub.git  
cd AuthHub  
npm install  
```  

### Environment Variables  

Create a `.env` file at root (do not commit this):  

```ini  
GITHUB_CLIENT_ID=abc123  
GITHUB_CLIENT_SECRET=xyz789  
SESSION_SECRET=long_random_string  
DATABASE_URL=postgres://user:pass@host:5432/dbname   # optional  
```  

### Development  

```bash  
npm run dev  
# → Visit http://localhost:3000  
```  

### Build  

```bash  
npm run build  
npm run start  
```  

## 🧪 Usage  

1. Click **Sign in with GitHub**  
2. Authorize the OAuth app  
3. View your repos sorted by star count  
4. Pin any 1–5 repos to the top  
5. Click **Download PDF** to generate a résumé-style PDF  

## 🧠 API Endpoints  

This app uses Express.js API routes:  

```bash  
GET /api/auth/user          → Profile info (avatar, bio, followers)  
GET /api/github/repositories → Sorted repo list via GraphQL  
GET /api/github/profile     → GitHub profile data  
GET /api/github/pinned      → Get pinned repositories  
POST /api/github/repositories/:id/pin → Pin or unpin a repo  
GET /api/generate-pdf       → Generate profile PDF via Puppeteer  
```  

## 📄 PDF / Portfolio Export  

Click **Export PDF** to generate a PDF via server-side rendering using Puppeteer. The output includes:  

- Profile avatar + bio  
- Contribution totals  
- Pinned repos (with stars & languages)  
- Top Languages chart  
- Download button  

## 🤝 Contributing  

Want to improve AuthHub? Contributions are welcome!  

1. Fork the project  
2. Create your feature branch: `git checkout -b feature/awesome-feature`  
3. Commit your changes: `git commit -m 'Add awesome-feature'`  
4. Push: `git push origin feature/awesome-feature`  
5. Open a pull request  

Check out CONTRIBUTING.md for code style rules, issue templates, and CI requirements.  

## 🧾 Code of Conduct  

This project follows the Contributor Covenant. Please see CODE_OF_CONDUCT.md in the repo for details.  

## 📜 License  

Distributed under the MIT License. See LICENSE for more details.  

## 🙏 Acknowledgments  

- Inspired by [gitforme.tech]  
- Based on React + Express + TypeScript Starter  
- README structure follows best practices from Othneildrew's template  
- Badge usage via [Shields.io] (build, license, technology)  
- Thanks to all open‑source developers and platforms that made this possible. 🙌  

## 📬 Contact  

**AuthHub** by Debashish Bordoloi  
- LinkedIn: [linkedin.com/in/debashishbordoloi](https://linkedin.com/in/debashishbordoloi)  
- GitHub: [@d43ash1sh](https://github.com/d43ash1sh)   