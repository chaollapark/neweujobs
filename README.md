# 🇪🇺 EU Jobs Brussels

The leading job board for EU institutions, NGOs, think tanks, and public affairs positions in Brussels.

**Competitors:** jobsin.brussels, eurobrussels.com, euractiv.jobs.com, eujobs.co

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel-ready

## 📁 Project Structure

```
eu-jobs-brussels/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/               # Login & Register pages
│   │   ├── categories/         # Category listing & detail
│   │   ├── companies/          # Company listing & detail
│   │   ├── jobs/               # Job listing & detail
│   │   ├── post-job/           # Job posting form
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── jobs/               # Job-related components
│   │   ├── layout/             # Header, Footer
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   └── data.ts             # Mock data (replace with DB)
│   └── types/
│       └── index.ts            # TypeScript types
├── public/                     # Static assets
├── PROJECT_PLAN.md             # Detailed project plan
├── launch-agents.sh            # Multi-agent launcher
└── package.json
```

## ✨ Features

### Implemented (MVP)
- ✅ Homepage with featured jobs and search
- ✅ Job listings with filters (category, contract, experience, remote)
- ✅ Job detail pages with full information
- ✅ Company directory and profiles
- ✅ Category browsing
- ✅ Job posting form
- ✅ User authentication pages (UI)
- ✅ Mobile-responsive design
- ✅ EU-themed branding

### Coming Soon
- 🔄 Database integration (Prisma + Supabase)
- 🔄 User authentication (NextAuth.js)
- 🔄 Job application system
- 🔄 Employer dashboard
- 🔄 Job alerts & notifications
- 🔄 Payment integration
- 🔄 SEO optimization

## 🤖 Multi-Agent Development

This project supports parallel development using multiple Claude agents:

```bash
# Launch the multi-agent script
./launch-agents.sh
```

This will open multiple terminal windows, each with a Claude agent working on:
1. **Agent 1:** Database schema & Prisma setup
2. **Agent 2:** Authentication (NextAuth.js)
3. **Agent 3:** API routes for jobs
4. **Agent 4:** Employer dashboard
5. **Agent 5:** SEO & sitemap
6. **Agent 6:** Email notifications

## 🎨 Design System

### Colors
- **EU Blue:** `#003399` - Primary brand color
- **EU Yellow:** `#FFCC00` - Accent color
- **EU Dark:** `#001a4d` - Dark variant
- **EU Light:** `#e6ecf5` - Light backgrounds

### Components
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary buttons
- `.card` - Content cards
- `.input-field` - Form inputs
- `.badge-*` - Status badges

## 📊 Job Categories

1. EU Institutions
2. EU Agencies
3. Trade Associations
4. NGOs & Civil Society
5. Think Tanks
6. Public Affairs & Lobbying
7. Law Firms
8. Media & Communications
9. International Organizations
10. Traineeships

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Environment Variables (for production)

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.com

# OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

# Email
RESEND_API_KEY=...
```

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ for the EU bubble in Brussels 🇪🇺
