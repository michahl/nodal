## nodal - ai-powered knowledge graphs
Visualize questions as expandable knowledge graphs using Sonar, with summaries, explanations, reasoning, and source links in each node.

![preview](https://nodal.michahl.com/assets/og-image.jpg)

## 🌟 Features
- Interactive Knowledge Graphs: Visualize complex topics as interconnected nodes
- AI-Powered Exploration: Expand any node to discover deeper insights using Perplexity's Sonar API
- Source Attribution: Every insight includes links to reliable sources for further reading
- User Authentication: Secure login to save and manage your knowledge explorations
- Customizable Exploration: Build knowledge graphs by expanding the most interesting paths
- Responsive Design: Seamless experience on both desktop and mobile devices
- Node Management: Add, expand, and delete nodes to shape your knowledge exploration

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **AI**: Perplexity Sonar API
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)

## Getting Started
Prerequisites
- Sonar API key
- Supabase account

Environment Setup
Create a `.env.local` file with the following data:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Sonar API
NEXT_PUBLIC_PERPLEXITY_API_KEY=your_perplexity_api_key
```

Installation:

```bash
# Clone the repository
git clone https://github.com/michahl/nodal.git
cd nodal

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔍 How It Works
1. **Create an Exploration**: Start with a question or topic you want to explore
2. **Initial Node Generation**: The first node presenting an overview of your topic is created
3. **Explore Deeper**: Click on any node to view its details and sources
4. **Expand Nodes**: Choose aspects you want to explore further and create new connected nodes
5. **Build Your Knowledge Graph**: Continue expanding nodes to create a personalized knowledge map
6. **Navigate and Learn**: Use the interactive graph to navigate between connected concepts

## 📦 Project Structure
```
nodal/
├── public/             # Static assets
├── src/
│   ├── app/
│   │   ├── api/        # API routes for Sonar integration
│   │   ├── dashboard/  # Dashboard and explore pages
│   │   ├── layout.tsx  # Root layout with metadata
│   │   └── page.tsx    # Landing page
│   ├── components/     # React components
│   │   ├── dashboard/  # Dashboard components
│   │   ├── explore/    # Knowledge graph components
│   │   └── ui/         # Reusable UI components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utility functions and helpers
└── package.json        # Project dependencies and scripts
```