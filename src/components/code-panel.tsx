import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseComponentStructure } from "@/lib/cohere-api";
import { copyToClipboard, downloadFile, extractFiles, getSuggestedFilename } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Dynamically import to avoid SSR issues with preview
const DynamicComponentPreview = dynamic(
  () => import("@/components/dynamic-preview").then((mod) => mod.DynamicPreview),
  { 
    loading: () => <div className="flex h-full items-center justify-center p-4 text-muted-foreground">Loading preview...</div>,
    ssr: false
  }
);

type Tab = "code" | "preview" | "info";

interface CodePanelProps {
  code: string;
}

interface ComponentStructure {
  name: string;
  props: Record<string, any>;
  state: Record<string, any>;
  dependencies: string[];
  description: string;
}

export function CodePanel({ code }: CodePanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("code");
  const [codeContent, setCodeContent] = useState<string>("");
  const [componentStructure, setComponentStructure] = useState<ComponentStructure | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [activeFile, setActiveFile] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Update code content when the code prop changes
  useEffect(() => {
    if (code) {
      setCodeContent(code);
      setFiles(extractFiles(code));
      analyzeComponentStructure(code);
    }
  }, [code]);

  // Set active file when files change
  useEffect(() => {
    if (files.length > 0) {
      setActiveFile(files[0].name);
    }
  }, [files]);

  // Extract component structure from the code
  const analyzeComponentStructure = (codeStr: string) => {
    try {
      const structure = parseComponentStructure(codeStr);
      setComponentStructure(structure);
      setError(null);
    } catch (err) {
      console.error("Failed to parse component structure:", err);
      setError("Could not analyze component structure. The component might be complex or have syntax issues.");
    }
  };

  // Get the content of the active file
  const getActiveFileContent = () => {
    if (!activeFile || files.length === 0) return codeContent;
    const file = files.find(f => f.name === activeFile);
    return file ? file.content : codeContent;
  };

  // Handle copy to clipboard
  const handleCopyCode = async () => {
    const content = activeFile ? getActiveFileContent() : codeContent;
    const success = await copyToClipboard(content);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (files.length === 1) {
      // Single file download
      const filename = getSuggestedFilename("", codeContent);
      downloadFile(codeContent, filename);
    } else {
      // Multiple files download (future: use JSZip for proper zip)
      const content = files.map(file => `// File: ${file.name}\n\n${file.content}`).join('\n\n');
      downloadFile(content, "component-files.txt");
    }
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  // Generate mock props for preview based on the component structure
  const getMockProps = () => {
    if (!componentStructure) return {};
    
    const mockProps: Record<string, any> = {};
    
    // Create simple mock values for each prop
    Object.entries(componentStructure.props).forEach(([key, type]) => {
      switch (type) {
        case 'string':
          mockProps[key] = `Sample ${key}`;
          break;
        case 'number':
          mockProps[key] = 42;
          break;
        case 'boolean':
          mockProps[key] = true;
          break;
        case 'array':
        case 'string[]':
          mockProps[key] = ['Item 1', 'Item 2', 'Item 3'];
          break;
        case 'object':
          mockProps[key] = { id: 1, name: 'Sample Object' };
          break;
        case 'function':
          mockProps[key] = () => console.log(`${key} called`);
          break;
        default:
          mockProps[key] = `Mock ${key}`;
      }
    });
    
    return mockProps;
  };

  if (!code) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <CodeIcon className="h-12 w-12 mb-4 opacity-50" />
        <h2 className="text-lg font-medium mb-2">No Component Generated Yet</h2>
        <p className="max-w-md text-sm">
          Describe the component you want to build in the chat, and I'll generate the code for you.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)} className="w-full">
          <TabsList className="grid h-8 grid-cols-3 w-[300px]">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            aria-label="Download code"
          >
            {downloaded ? (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Downloaded
              </>
            ) : (
              <>
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <TabsContent value="code" className="m-0 h-full">
          <div className="h-full flex flex-col">
            {files.length > 1 && (
              <div className="border-b border-border p-2 flex gap-2 overflow-x-auto">
                {files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setActiveFile(file.name)}
                    className={`px-3 py-1 text-xs rounded-md ${
                      activeFile === file.name ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {file.name.split('/').pop()}
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex-1 overflow-auto p-0 relative">
              <SyntaxHighlighter
                language="jsx"
                style={oneDark}
                showLineNumbers
                className="h-full text-sm"
                customStyle={{ margin: 0, borderRadius: 0, height: '100%' }}
              >
                {getActiveFileContent()}
              </SyntaxHighlighter>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="m-0 h-full">
          <div className="h-full bg-background p-4 overflow-auto flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium">Component Preview</div>
              <div className="text-xs text-muted-foreground">
                Displaying with mock data
              </div>
            </div>
            
            <div className="flex-1 border border-border rounded-md overflow-hidden bg-white dark:bg-black relative">
              <DynamicComponentPreview
                code={codeContent}
                componentProps={getMockProps()}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="info" className="m-0 h-full overflow-auto p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Component Information</h3>
              {error ? (
                <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                  {error}
                </div>
              ) : !componentStructure ? (
                <div className="text-sm text-muted-foreground">
                  Analyzing component structure...
                </div>
              ) : (
                <div className="text-sm">{componentStructure.description || "React component generated based on your description."}</div>
              )}
            </div>
            
            {componentStructure && (
              <>
                <div>
                  <h4 className="text-sm font-medium mb-2">Component Props</h4>
                  {Object.keys(componentStructure.props).length === 0 ? (
                    <div className="text-sm text-muted-foreground">This component doesn't use any props.</div>
                  ) : (
                    <div className="border border-border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Type</th>
                            <th className="text-left p-2">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(componentStructure.props).map(([name, type]) => (
                            <tr key={name} className="border-t border-border">
                              <td className="p-2 font-mono text-xs">{name}</td>
                              <td className="p-2 text-muted-foreground">{type}</td>
                              <td className="p-2 text-muted-foreground">-</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                {Object.keys(componentStructure.state).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">State Variables</h4>
                    <div className="border border-border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Type</th>
                            <th className="text-left p-2">Initial Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(componentStructure.state).map(([name, type]) => (
                            <tr key={name} className="border-t border-border">
                              <td className="p-2 font-mono text-xs">{name}</td>
                              <td className="p-2 text-muted-foreground">{type}</td>
                              <td className="p-2 text-muted-foreground">-</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {componentStructure.dependencies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Dependencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {componentStructure.dependencies.map((dep) => (
                        <div key={dep} className="px-2 py-1 bg-muted rounded-md text-xs">
                          {dep}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-2">Generated Files</h4>
              <div className="space-y-2">
                {files.map((file) => (
                  <div key={file.name} className="p-2 bg-muted/40 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-xs">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(file.content.length / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
    </div>
  );
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
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

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="20 6 9 17 4 12" />
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