// Types and utilities for interacting with Cohere API

import { CohereClient } from "cohere-ai";

export type GenerateRequest = {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
};

export type GenerateResponse = {
  id: string;
  generations: {
    id: string;
    text: string;
  }[];
  prompt: string;
};

export interface ComponentStructure {
  name: string;
  props: Record<string, string>;
  state: Record<string, string>;
  dependencies: string[];
  description: string;
}

// Initialize Cohere client with API key and retry logic
export function getCohereClient() {
  const apiKey = process.env.NEXT_PUBLIC_COHERE_API_KEY;
  
  if (!apiKey) {
    console.warn("Cohere API key not found. Using fallback mode.");
    return null;
  }
  
  return new CohereClient({
    token: apiKey,
    options: {
      timeout: 60000,
      maxRetries: 3,
      retry: async (error, retryCount) => {
        // Only retry on specific errors
        if (error.status === 429 || error.status >= 500) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          return true;
        }
        return false;
      }
    }
  });
}

/**
 * Generate a React component using Cohere's Chat API with streaming
 */
export async function generateComponent(
  prompt: string,
  options = {}
): Promise<string> {
  const client = getCohereClient();
  
  if (!client) {
    return generateFallbackComponent(prompt);
  }
  
  try {
    // Enhanced prompt engineering for better component generation
    const enhancedPrompt = `
      Create a React component based on this description: "${prompt}".
      
      Requirements:
      - Use TypeScript with React 18+ hooks
      - Use Tailwind CSS for styling
      - Make it responsive and accessible
      - Include prop types and default values
      - Include comments for complex logic
      - Structure code with clean formatting
      - Handle loading and error states
      - Follow React best practices
      - Use semantic HTML
      
      Return only the component code without explanation.
    `;
    
    const response = await client.chat({
      message: enhancedPrompt,
      model: "command-r",
      preamble: "You are an expert React and TypeScript developer specializing in creating modern, accessible components with Tailwind CSS.",
      temperature: 0.7,
      stream: true,
      ...options
    });

    let generatedCode = '';
    for await (const chunk of response) {
      generatedCode += chunk.text;
    }
    
    const cleanedCode = cleanGeneratedCode(generatedCode);
    return cleanedCode;
  } catch (error) {
    console.error("Error generating component:", error);
    return generateFallbackComponent(prompt);
  }
}

/**
 * Clean the generated code to ensure it's valid React TypeScript
 */
function cleanGeneratedCode(code: string): string {
  // Remove markdown code block syntax if present
  let cleanedCode = code.replace(/```(jsx|tsx|javascript|typescript)?\n/g, "").replace(/```$/g, "");
  
  // Ensure proper import statements
  if (!cleanedCode.includes("import React")) {
    cleanedCode = 'import React from "react";\n' + cleanedCode;
  }
  
  return cleanedCode.trim();
}

/**
 * Generate a fallback component when the API is unavailable
 */
function generateFallbackComponent(description: string): string {
  const componentName = description
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
    .replace(/[^a-zA-Z0-9]/g, "");
  
  return `import React from "react";

interface ${componentName}Props {
  title?: string;
  description?: string;
  theme?: "light" | "dark";
}

export default function ${componentName}({ 
  title = "Component Title", 
  description = "This is a description of the component.", 
  theme = "light" 
}: ${componentName}Props) {
  return (
    <div className={\`p-6 rounded-lg shadow-md \${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}\`}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm opacity-80">{description}</p>
      <div className="mt-4">
        <p className="text-xs opacity-60">This is a fallback component generated based on: "${description}"</p>
      </div>
    </div>
  );
}`;
}

/**
 * Parse the structure of a React component
 */
export function parseComponentStructure(code: string): ComponentStructure {
  // Default structure
  const structure: ComponentStructure = {
    name: "GeneratedComponent",
    props: {},
    state: {},
    dependencies: [],
    description: "React component generated with Cohere API.",
  };
  
  try {
    // Extract component name
    const componentNameMatch = code.match(/(?:function|class|const)\s+([A-Z][a-zA-Z0-9]*)/);
    if (componentNameMatch && componentNameMatch[1]) {
      structure.name = componentNameMatch[1];
    }
    
    // Extract props from interfaces or type definitions
    // Look for TypeScript interfaces that might define props
    const propsTypeMatch = code.match(/interface\s+(\w+Props)\s+\{([^}]+)\}/);
    if (propsTypeMatch && propsTypeMatch[2]) {
      const propsContent = propsTypeMatch[2];
      const propLines = propsContent.split("\n");
      
      propLines.forEach(line => {
        // Match prop name and type: propName?: type;
        const propMatch = line.match(/\s*(\w+)(\??)\s*:\s*([^;]+);/);
        if (propMatch) {
          const [, propName, , propType] = propMatch;
          structure.props[propName] = propType.trim();
        }
      });
    }
    
    // Look for inline props in function parameters
    const inlinePropsMatch = code.match(/function\s+\w+\s*\(\s*\{\s*([^}]+)\s*\}\s*:\s*\w+Props/);
    if (inlinePropsMatch && inlinePropsMatch[1]) {
      const propsContent = inlinePropsMatch[1];
      const propParts = propsContent.split(",");
      
      propParts.forEach(part => {
        // Match destructured props with default values: propName = defaultValue
        const propMatch = part.match(/\s*(\w+)(?:\s*=\s*([^,]+))?/);
        if (propMatch) {
          const [, propName] = propMatch;
          if (!structure.props[propName]) {
            structure.props[propName] = "any";
          }
        }
      });
    }
    
    // Extract state variables
    const stateMatches = [...code.matchAll(/const\s+\[\s*(\w+),\s*set\w+\s*\]\s*=\s*useState(<([^>]+)>)?\(([^)]*)\)/g)];
    stateMatches.forEach(match => {
      const [, stateName, , stateType, initialValue] = match;
      structure.state[stateName] = stateType || typeof eval(initialValue) || "any";
    });
    
    // Extract dependencies (imports)
    const importMatches = [...code.matchAll(/import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]([^'"]+)['"]/g)];
    importMatches.forEach(match => {
      const [, namedImports, , packageName] = match;
      
      if (packageName && !packageName.startsWith(".")) {
        structure.dependencies.push(packageName);
      }
      
      if (namedImports) {
        namedImports.split(",").forEach(imp => {
          const trimmed = imp.trim();
          if (trimmed && trimmed !== "React") {
            structure.dependencies.push(trimmed);
          }
        });
      }
    });
    
    // Make dependencies unique
    structure.dependencies = [...new Set(structure.dependencies)];
    
  } catch (error) {
    console.error("Error parsing component structure:", error);
  }
  
  return structure;
}