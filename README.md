# AuthHub - GitHub Portfolio Dashboard

A beautiful, full-stack GitHub portfolio dashboard that allows users to authenticate with GitHub OAuth, view their repositories and statistics, pin favorite projects, analyze programming language usage with charts, and generate PDF resumes from their GitHub data.

## 🚀 Features

- **GitHub OAuth Authentication** - Secure login with GitHub
- **Repository Management** - View and pin your favorite repositories
- **GitHub Profile Analytics** - Detailed statistics and insights
- **Programming Language Analysis** - Visual charts of language usage
- **PDF Resume Generation** - Create professional resumes from GitHub data
- **Modern UI/UX** - Beautiful, responsive design with dark mode support
- **Real-time Data** - Live GitHub data fetching and caching

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Recharts** for data visualization
- **TanStack React Query** for state management
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **Passport.js** for GitHub OAuth
- **Drizzle ORM** for database operations
- **Puppeteer** for PDF generation
- **GitHub GraphQL API** integration

### Database
- **PostgreSQL** (with Neon serverless support)
- **In-memory storage** for development

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AuthHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # GitHub OAuth (Required)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   
   # Session (Required)
   SESSION_SECRET=your_session_secret
   
   # Database (Optional for development)
   DATABASE_URL=your_postgresql_url
   
   # Server (Optional)
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up GitHub OAuth App**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to: `http://localhost:3000/api/github/callback`
   - Copy the Client ID and Client Secret to your `.env` file

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
AuthHub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── types/         # TypeScript type definitions
│   └── index.html
├── server/                # Express backend
│   ├── services/          # Business logic services
│   ├── routes.ts          # API route definitions
│   ├── githubAuth.ts      # GitHub OAuth setup
│   ├── storage.ts         # Data storage layer
│   └── index.ts           # Server entry point
├── shared/                # Shared code between client/server
│   └── schema.ts          # Database schema definitions
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🌟 Key Features Explained

### GitHub OAuth Flow
1. User clicks "Sign in with GitHub"
2. Redirected to GitHub for authorization
3. GitHub redirects back with authorization code
4. Server exchanges code for access token
5. User is authenticated and can access GitHub data

### Repository Management
- View all user repositories with details
- Pin/unpin favorite repositories
- Sort and filter repositories
- View repository statistics

### PDF Generation
- Generate professional resumes from GitHub data
- Include profile information, repositories, and statistics
- Customizable templates

### Data Caching
- GitHub data is cached to reduce API calls
- Automatic refresh of stale data
- Efficient data management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using modern web technologies 