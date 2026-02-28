# Task: Multi-Tenant Niche Job Board System

## Goal
Add dynamic niche routing to EUjobs so we can serve multiple niche job boards from eujobs.co/{niche}

## Requirements

### 1. Dynamic Route
Create `src/app/[niche]/page.tsx` that:
- Reads niche slug from URL (e.g., "berlin-startup-jobs", "climate-jobs")
- Fetches niche config from MongoDB
- Renders a customized landing page for that niche
- Falls back to 404 if niche doesn't exist

### 2. Niche Schema (MongoDB)
Create `src/models/Niche.ts`:
```typescript
{
  slug: string;           // URL slug: "berlin-startup-jobs"
  name: string;           // Display name: "Berlin Startup Jobs"
  description: string;    // SEO meta description
  h1: string;             // Main headline
  tagline: string;        // Subheadline
  competitor: string;     // Competitor URL we're targeting
  keywords: string[];     // SEO keywords
  colors: {
    primary: string;      // Tailwind color class
    accent: string;
  };
  filters: {              // Default job filters
    locations?: string[];
    categories?: string[];
    tags?: string[];
  };
  enabled: boolean;
  createdAt: Date;
}
```

### 3. Niche Landing Page Component
Create `src/components/NicheLanding.tsx`:
- Hero section with niche-specific h1 and tagline
- Job listings filtered by niche criteria
- SEO-optimized meta tags
- "Post a Job" CTA (€99)

### 4. API Endpoint
Create `src/app/api/niches/[slug]/route.ts`:
- GET: Fetch niche config
- POST: Create/update niche (admin only)

### 5. Seed Script
Create `scripts/seed-niches.ts` to populate the 20 niches from competitors.json

## Files to Create/Modify
- src/app/[niche]/page.tsx (NEW)
- src/app/[niche]/layout.tsx (NEW)
- src/models/Niche.ts (NEW)
- src/components/NicheLanding.tsx (NEW)
- src/app/api/niches/[slug]/route.ts (NEW)
- scripts/seed-niches.ts (NEW)

## Do NOT modify
- Existing job posting flow
- Payment integration
- Existing pages

## Test
After creating files, ensure `npm run build` passes.
