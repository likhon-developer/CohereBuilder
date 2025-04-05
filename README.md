# CohereBuilder - AI-Powered React Component Generator

<div align="center">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License" />
</div>

<br />

CohereBuilder is a modern web application that enables developers to generate React components using natural language. Similar to V0.dev, this platform allows you to describe the UI components you need in plain English, and our AI will generate the corresponding React code with a live preview.

<p align="center">
  <a href="https://coherebuilder.vercel.app">Try the live demo →</a>
</p>

## ✨ Features

- 🤖 **AI-powered generation** - Create React components with natural language prompts
- 💻 **Modern three-panel UI** - Chat interface, code editor, and live preview in one app
- 🎨 **Live component previews** - See your components as they're built
- 📝 **Code editing** - Syntax highlighting and easy customization
- 📦 **Code export** - Download individual components or entire projects as ZIP files
- 🚀 **Serverless architecture** - Powered by Vercel Edge Functions for fast response times
- 🌐 **Web-based** - No installation required, works in your browser
- 🌓 **Dark theme** - Easy on the eyes for comfortable development
- 📱 **Responsive design** - Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **[Next.js](https://nextjs.org/)** - React framework with serverless capabilities
- **[React](https://reactjs.org/)** - UI component library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Cohere API](https://cohere.ai/)** - AI-powered code generation
- **[Vercel](https://vercel.com/)** - Deployment and serverless functions
- **[Edge Runtime](https://vercel.com/docs/concepts/functions/edge-functions)** - Fast, globally distributed API endpoints
- **[JSZip](https://stuk.github.io/jszip/)** - ZIP file generation for code export

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/likhon-developer/CohereBuilder.git
   cd CohereBuilder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Cohere API key:
   ```
   COHERE_API_KEY=your_api_key_here
   NEXT_PUBLIC_COHERE_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Deployment on Vercel

The easiest way to deploy your CohereBuilder is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Import the project to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

Or deploy directly from the CLI:

```bash
npm run deploy
```

## 📂 Project Structure

```
src/
  ├── app/              # Next.js app router files
  │   ├── api/          # Serverless API routes
  │   ├── page.tsx      # Main application page
  │   └── layout.tsx    # Root layout
  ├── components/       # React components
  │   ├── ui/           # UI primitives
  │   ├── chat-interface.tsx  # Chat interface component
  │   └── code-panel.tsx      # Code editor and preview
  ├── lib/              # Utility functions and API clients
  │   ├── cohere-api.ts # Cohere API integration
  │   └── utils.ts      # Helper functions
public/                 # Static files
```

## 🧩 Usage

1. Enter a description of the component you want to create in the chat interface
2. The AI will generate a React component based on your description
3. Preview the component in real-time in the right panel
4. Edit the code if needed
5. Export the component for use in your project

### Example Prompts

- "Create a responsive navbar with a logo, navigation links and a mobile menu"
- "Build a product card with image, title, price, rating stars and add to cart button"
- "Design a contact form with name, email, message fields, and validation"

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [V0.dev](https://v0.dev)
- Built with [Next.js](https://nextjs.org)
- Powered by [Cohere AI](https://cohere.ai)
- UI components by [shadcn/ui](https://ui.shadcn.com/)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/likhon-developer">likhon-developer</a>
</p>
