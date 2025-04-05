'use client';

import React from "react";
import { useChat, type Message } from 'ai/react';
import { formatTime } from "@/lib/utils";

export function ChatInterface({ onCodeGeneration }: { onCodeGeneration?: (code: string) => void }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      // Check if the response is ok before processing
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
    onFinish: (message) => {
      if (onCodeGeneration) {
        const cleanCode = extractCodeFromMarkdown(message.content);
        onCodeGeneration(cleanCode);
      }
    },
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  // Helper function to extract code from markdown code blocks
  const extractCodeFromMarkdown = (text: string): string => {
    const codeBlockRegex = /```(?:jsx?|tsx?|javascript|typescript)?\n([\s\S]*?)```/;
    const match = text.match(codeBlockRegex);
    
    if (match && match[1]) {
      return match[1].trim();
    }
    
    return text;
  };

  // Generate example prompts
  const examplePrompts = [
    "Create a responsive navbar with a logo, navigation links and a mobile menu",
    "Build a card component for displaying product information with image, title, price and buy button",
    "Design a form with validation for user registration with name, email and password fields"
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <h2 className="text-lg font-medium">AI Component Builder</h2>
        <div className="flex items-center gap-2">
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            aria-label="Clear conversation"
            onClick={() => window.location.reload()}
          >
            <EraseIcon className="h-4 w-4 mr-2" />
            Clear
          </button>
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0"
            aria-label="Settings"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-2xl">
          {messages.map((message) => (
            <div
              key={message.id}
              className="mb-4 flex flex-col"
            >
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-md ${
                  message.role === "user" 
                    ? "bg-secondary" 
                    : message.role === "system"
                    ? "bg-purple-500" 
                    : "bg-primary"
                  } flex items-center justify-center text-sm font-medium`}
                >
                  {message.role === "user" ? "You" : message.role === "system" ? "SYS" : "AI"}
                </div>
                <div className="ml-2 text-sm">
                  <span className="font-semibold">
                    {message.role === "user" ? "You" : message.role === "system" ? "System" : "CohereBuilder"}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatTime(new Date())}
                  </span>
                </div>
              </div>
              <div className={`mt-1 rounded-md p-3 ${
                message.role === "system"
                ? "bg-purple-500/10"
                : "bg-muted/40"
              }`}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {message.content.split("\n").map((line, i) => (
                    <p key={i} className="mb-4 whitespace-pre-wrap">{line}</p>
                  ))}
                </div>
              </div>
              {error && message.role === "assistant" && message.id === messages[messages.length - 1].id && (
                <div className="mt-2 flex items-center gap-2 text-destructive text-sm">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <span>Failed to generate response.</span>
                  <button
                    onClick={() => reload()}
                    className="text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="mb-4 flex flex-col">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-sm font-medium">
                  AI
                </div>
                <div className="ml-2 text-sm">
                  <span className="font-semibold">CohereBuilder</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatTime(new Date())}
                  </span>
                </div>
              </div>
              <div className="mt-1 rounded-md bg-muted/40 p-3">
                <div className="flex flex-col gap-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>Generating component</span>
                    <ThinkingDots />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-border p-4">
        {messages.length === 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Example prompts:</h3>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="text-xs bg-secondary/50 hover:bg-secondary px-2 py-1 rounded-md text-secondary-foreground transition-colors"
                  onClick={() => handleInputChange({ target: { value: prompt } } as any)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Describe the component you want to create..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-20"
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {isLoading ? (
              <div className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                <LoaderIcon className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Powered by Vercel AI SDK and Cohere
          </div>
        </form>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground"></div>
      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground animation-delay-200"></div>
      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground animation-delay-500"></div>
    </div>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EraseIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
      <path d="M22 21H7" />
      <path d="m5 11 9 9" />
    </svg>
  );
}

function LoaderIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}