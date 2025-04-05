"use client";

import React, { useState, useEffect } from "react";
import { ChatInterface } from "@/components/chat-interface";
import { CodePanel } from "@/components/code-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { extractFiles } from "@/lib/utils";

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Handle code generation from the chat interface
  const handleCodeGeneration = (code: string) => {
    setGeneratedCode(code);
    
    // If code is generated, extract files and show the code tab on mobile
    if (code) {
      setFiles(extractFiles(code));
      if (isMobile) {
        setActiveTab("code");
      }
      setShowIntro(false);
    }
  };

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <main className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Sidebar (could be implemented later) */}
      <div className="w-full md:w-1/4 lg:w-1/5 border-r border-border hidden md:block">
        <div className="h-full p-4">
          <div className="flex items-center gap-2 mb-8">
            <LogoIcon className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">CohereBuilder</h1>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground mb-2">PROJECTS</h2>
            <div className="rounded-md bg-muted/40 p-2 cursor-pointer">
              <div className="font-medium">My First Component</div>
              <div className="text-xs text-muted-foreground">Last edited: Today</div>
            </div>
            
            <button className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 p-2">
              <PlusIcon className="h-4 w-4" />
              New Project
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {isMobile ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-border">
              <TabsList className="w-full justify-start p-0 h-14 bg-transparent">
                <TabsTrigger value="chat" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-14 px-4">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-14 px-4">
                  Code
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="flex-1 data-[state=active]:flex flex-col m-0 p-0 border-none">
              <ChatInterface onCodeGeneration={handleCodeGeneration} />
            </TabsContent>
            
            <TabsContent value="code" className="flex-1 data-[state=active]:flex flex-col m-0 p-0 border-none">
              <CodePanel code={generatedCode} />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {/* Chat interface - left panel on desktop */}
            <div className="flex-1 border-r border-border relative">
              <ChatInterface onCodeGeneration={handleCodeGeneration} />
            </div>
            
            {/* Code panel - right panel on desktop */}
            <div className="flex-1 relative">
              {showIntro && !generatedCode ? (
                <IntroScreen />
              ) : (
                <CodePanel code={generatedCode} />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function IntroScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-6">
        <LogoIcon className="h-16 w-16 text-primary mx-auto" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Welcome to CohereBuilder</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Describe the React component you want to build in natural language, and I'll generate it for you. The generated code will appear in this panel.
      </p>
      <div className="space-y-4 max-w-md text-left">
        <Feature 
          icon={<ChatIcon className="h-4 w-4" />} 
          title="Describe Your Component" 
          description="Use natural language to explain what you want to build."
        />
        <Feature 
          icon={<CodeIcon className="h-4 w-4" />} 
          title="View Generated Code" 
          description="See the React & Tailwind CSS code instantly."
        />
        <Feature 
          icon={<EyeIcon className="h-4 w-4" />} 
          title="Preview Your Component" 
          description="See a real-time preview of your component."
        />
        <Feature 
          icon={<DownloadIcon className="h-4 w-4" />} 
          title="Export & Use" 
          description="Download the code and use it in your project."
        />
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function LogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function ChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
    </svg>
  );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
} 