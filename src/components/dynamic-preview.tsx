import React, { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import * as Babel from '@babel/standalone';

interface DynamicPreviewProps {
  code: string;
  componentProps?: Record<string, any>;
}

export function DynamicPreview({ code, componentProps = {} }: DynamicPreviewProps) {
  const [error, setError] = useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!code || !containerRef.current) return;
    
    try {
      // Clear any previous content and errors
      if (containerRef.current) {
        ReactDOM.createRoot(containerRef.current).unmount();
      }
      setError(null);
      
      // Transform code with Babel
      const transformedCode = Babel.transform(code, {
        presets: ['react', 'typescript'],
        filename: 'GeneratedComponent.tsx',
      }).code;
      
      if (!transformedCode) {
        throw new Error('Code transformation failed');
      }
      
      // Add React import if missing
      let fullCode = transformedCode;
      if (!fullCode.includes('import React')) {
        fullCode = 'import React from "react";\n' + fullCode;
      }
      
      // Create module definition with exports tracking
      const moduleExports: Record<string, any> = {};
      const moduleDef = `
        (function(module, exports, React) {
          ${fullCode}
          // Handle both default and named exports
          if (module.exports.default) {
            exports.default = module.exports.default;
          } else if (typeof module.exports === 'function') {
            exports.default = module.exports;
          }
          // Copy all named exports
          for (const key in module.exports) {
            if (key !== 'default') {
              exports[key] = module.exports[key];
            }
          }
        })({ exports: {} }, moduleExports, React);
      `;
      
      // Execute the code in a safe context
      // eslint-disable-next-line no-new-func
      new Function('React', 'moduleExports', moduleDef)(React, moduleExports);
      
      // Get the component from exports
      const Component = moduleExports.default;
      
      if (!Component) {
        throw new Error('No component was exported from the code');
      }
      
      // Render the component
      const root = ReactDOM.createRoot(containerRef.current);
      root.render(
        <React.StrictMode>
          <ErrorBoundary onError={(err) => setError(err.message)}>
            <div className="p-6 w-full">
              <Component {...componentProps} />
            </div>
          </ErrorBoundary>
        </React.StrictMode>
      );
    } catch (err) {
      console.error('Error rendering dynamic component:', err);
      setError(err instanceof Error ? err.message : 'Unknown error rendering component');
    }
  }, [code, componentProps]);
  
  if (error) {
    return (
      <div className="p-6 overflow-auto">
        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-4 text-red-500">
          <h3 className="text-sm font-medium mb-2">Preview Error</h3>
          <pre className="text-xs overflow-auto whitespace-pre-wrap">{error}</pre>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

// Error boundary component to catch runtime errors in the preview
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    this.props.onError(error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null; // Error is handled by the parent component
    }
    return this.props.children;
  }
} 