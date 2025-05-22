## nodal - ai-powered knowledge graphs
Visualize questions as expandable knowledge graphs using Sonar, with summaries, explanations, reasoning, and source links in each node.

🔗 Try it out [here](https://nodal.michahl.com)

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

## 🤖 How Perplexity Sonar Powers the App
The app uses the **Perplexity Sonar** to generate structure, AI-powered knowledge graphs. It's used in three key ways:

1. **Question Validation**: Ensures the user input is a valid, research-worthy question before generating a graph.
2. **Initial Graph Generation**: Converts a user question into a central node with detailed explanation, reasoning, description, and sources.
3. **Node Expansion**: Allows users to expand a selected node to generate 1–2 new, connected nodes with the same structured content.

## 🌍 Designed for Learning & Discovery
This tool helps users — from students to researchers to curious thinkers — break down complex questions into clear, visual insights. By combining Perplexity’s AI with an interactive graph exploration, it makes learning more dynamic and personalized.

It's designed to make learning easier by helping users:
- Visualize how ideas connect
- Decide what to explore next
- Quickly access trustworthy sources

## 🔍 How It Works
1. **Create an Exploration**: Start with a question or topic you want to explore
2. **Initial Node Generation**: The first node presenting an overview of your topic is created
3. **Explore Deeper**: Click on any node to view its details and sources
4. **Expand Nodes**: Choose aspects you want to explore further and create new connected nodes
5. **Build Your Knowledge Graph**: Continue expanding nodes to create a personalized knowledge map
6. **Navigate and Learn**: Use the interactive graph to navigate between connected concepts

## 🧪 Testing & Known Limitations

- **API Limits**: Users are restricted to 4 saved graphs to manage API usage.
- **Mobile UX**: Fully responsive, but deep graphs may feel cramped on smaller screens.
- **Graph Depth**: Expansions are limited to keep content quality high and prevent overwhelming the user.
- **Sonar Latency**: Responses take a few seconds depending on prompt complexity.

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
│   │   ├── auth/       # Auth components
│   │   ├── dashboard/  # Dashboard components
│   │   ├── explore/    # Knowledge graph components
│   │   ├── main/       # Home page components
│   │   └── ui/         # Reusable UI components
│   ├── context/        # React context providers
│   └── utils/          # Utility functions and helpers
└── package.json        # Project dependencies and scripts
```

## 🧑‍💻 Built By
- [@michahl](https://michahl.com)