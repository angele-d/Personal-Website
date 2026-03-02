<h1> Personal Website </h1>

<h2> Summary </h2>

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup Steps](#setup-steps)
- [Testing](#testing)
- [Database Schema](#database-schema)
  - [Users Table](#users-table)
  - [Media Table](#media-table)
  - [Sleep Logs Table](#sleep-logs-table)
- [Deployment](#deployment)
  - [Deploy to Vercel](#deploy-to-vercel)
- [API Documentation](#api-documentation)
  - [Media Endpoints](#media-endpoints)
- [Styling](#styling)
- [Security](#security)
- [Resources](#resources)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

A Next.js-based personal dashboard application for tracking sleep logs and media consumption (movies, series, books, manga, anime).

## Features

- **Authentication**: OAuth login with Google and GitHub via NextAuth.js
- **Responsive Design**: Mobile-first approach with SCSS modules
- **Database**: PostgreSQL via Neon serverless with optimized queries

Dashboard features:
- **Sleep Tracking**: Log and view sleep patterns with detailed statistics
- **Media Library**: Track movies, series, books, manga, and anime with ratings, status, and notes

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── ...
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── medias/
│   │   ├── sleepLog/
│   │   └── layout.tsx
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   └── media/
│   ├── components/          # React components
│   │   ├── ...
│   ├── styles/              # Global styles
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── globals.scss
├── lib/
│   ├── auth/                # Authentication utilities
│   │   ├── ...
│   ├── db/                  # Database layer
│   │   ├── client.ts        # Neon connection
│   │   ├── media.ts         # Media CRUD operations
│   │   ├── sleeplog.ts      # Sleep log operations
│   │   ├── user.ts          # User operations
│   │   └── index.ts
│   └── utils/               # Utility functions
│       ├── date.ts
│       ├── format.ts
│       └── index.ts
├── types/
│   ├── index.ts             # TypeScript types
│   └── next-auth.d.ts       # NextAuth type extensions
├── tests/                   # Test files
│   ├── db.test.js
│   ├── verification.test.js
│   └── run_tests.sh
├── auth.ts                  # NextAuth configuration
├── next.config.js
├── tsconfig.json
└── package.json
```

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Neon PostgreSQL](https://neon.tech/) (Serverless)
- **Authentication**: [NextAuth.js 5 (beta)](https://authjs.dev/)
- **Styling**: SCSS Modules with CSS Variables
- **Deployment**: [Vercel](https://vercel.com/)

## Installation

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- A Neon PostgreSQL database
- Google OAuth credentials
- GitHub OAuth credentials

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/angele-d/Personal-Website.git
   cd personal-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Fill in your credentials in `.env.local`:
   ```env
   # Database
   DATABASE_URL=postgres://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

   # NextAuth
   AUTH_SECRET=your-super-secret-key-here
   AUTH_TRUST_HOST=true

   # Google OAuth
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret

   # GitHub OAuth
   AUTH_GITHUB_ID=your-github-client-id
   AUTH_GITHUB_SECRET=your-github-client-secret
   ```

4. **Set up the database**
   
   See [SETUP-NEON.md](SETUP-NEON.md) for detailed database setup instructions.

5. **Run database tests**
   ```bash
   node tests/db.test.js
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Run the full test suite:
```bash
bash tests/run_tests.sh
```

Individual tests:
```bash
# Database connection test
node tests/db.test.js

# Build and structure verification
node tests/verification.test.js
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  email_verified TIMESTAMP,
  image TEXT
);
```

### Media Table
```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) CHECK (type IN ('film', 'serie', 'livre', 'manga', 'anime')),
  title VARCHAR(500) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('a_voir', 'en_cours', 'termine')),
  rating INTEGER CHECK (rating >= 0 AND rating <= 10),
  rank INTEGER,
  notes TEXT,
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Sleep Logs Table
```sql
CREATE TABLE sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sleep_date DATE NOT NULL,
  bedtime TIME NOT NULL,
  wake_time TIME NOT NULL,
  duration_hours DECIMAL(4,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`

3. **Deploy**
   ```bash
   vercel --prod
   ```

## API Documentation

### Media Endpoints

- **POST** `/api/media` - Add a new media entry
  ```json
  {
    "title": "Movie Title",
    "type": "film",
    "status": "termine",
    "rating": 8,
    "notes": "Great movie!"
  }
  ```

## Styling

The project uses SCSS modules with global variables:

- **Variables**: [`app/styles/_variables.scss`](app/styles/_variables.scss)
- **Global styles**: [`app/globals.scss`](app/globals.scss)
- **Component styles**: Co-located `.module.scss` files

Color scheme supports both light and dark modes via CSS variables.

## Security

- Server-only imports protected with `'server-only'` package
- SQL injection prevention via Neon tagged templates
- User data isolation (all queries require `userId`)
- HTTP-only session cookies
- OAuth 2.0 for authentication

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Neon Documentation](https://neon.tech/docs)
- [NextAuth.js Documentation](https://authjs.dev/)
- [Database Setup Guide](SETUP-NEON.md)

## Contributing

This is a personal project, but suggestions are welcome via issues.

## License

Private project - All rights reserved.

## Author

Angèle Denys

---

**Note**: This project uses Next.js 16 App Router with React Server Components. Make sure to follow the `'use client'` and `'server-only'` directives appropriately.