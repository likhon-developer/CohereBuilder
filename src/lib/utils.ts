import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date to a readable time string
 */
export function formatTime(date: Date): string {
  // For today, just show the time
  if (isToday(date)) {
    return formatTimeOnly(date);
  }
  
  // For yesterday, show "Yesterday" + time
  if (isYesterday(date)) {
    return `Yesterday, ${formatTimeOnly(date)}`;
  }
  
  // For within the last week, show day name + time
  if (isWithinLastWeek(date)) {
    return `${getDayName(date)}, ${formatTimeOnly(date)}`;
  }
  
  // For older dates, show full date
  return `${date.toLocaleDateString(undefined, { 
    month: 'short',
    day: 'numeric'
  })}, ${formatTimeOnly(date)}`;
}

/**
 * Format a date to just the time (HH:MM AM/PM)
 */
function formatTimeOnly(date: Date): string {
  return date.toLocaleTimeString(undefined, { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });
}

/**
 * Check if a date is today
 */
function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * Check if a date is yesterday
 */
function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
}

/**
 * Check if a date is within the last week
 */
function isWithinLastWeek(date: Date): boolean {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return date >= oneWeekAgo;
}

/**
 * Get the name of the day for a date
 */
function getDayName(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'long' });
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

/**
 * Download a file with the given content
 */
export function downloadFile(content: string, filename: string, mimeType = 'text/plain') {
  // Create blob
  const blob = new Blob([content], { type: mimeType });
  
  // Create a temporary URL to the blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to the document
  document.body.appendChild(link);
  
  // Trigger click
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

/**
 * Extract file names and their respective content from component code
 */
export function extractFiles(code: string): { name: string; content: string }[] {
  // Default file if no file structure is specified
  if (!code.includes('// File:')) {
    return [
      {
        name: 'src/components/GeneratedComponent.tsx',
        content: code
      }
    ];
  }
  
  const files: { name: string; content: string }[] = [];
  const fileRegex = /\/\/ File: (.+?)\n([\s\S]*?)(?=\/\/ File: |$)/g;
  
  let match;
  while ((match = fileRegex.exec(code)) !== null) {
    const fileName = match[1].trim();
    const fileContent = match[2].trim();
    files.push({
      name: fileName,
      content: fileContent
    });
  }
  
  return files;
}

/**
 * Create a ZIP file from multiple files
 */
export async function createZipFromFiles(files: { name: string; content: string }[]): Promise<Blob> {
  try {
    // Dynamic import JSZip to reduce initial load time
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    // Add each file to the zip
    files.forEach(file => {
      const path = file.name;
      zip.file(path, file.content);
    });
    
    // Generate the zip file
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6 // Standard compression level
      }
    });
    
    return zipBlob;
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    // Fallback to simple concatenation if JSZip fails
    const content = files.map(file => `// File: ${file.name}\n\n${file.content}`).join('\n\n');
    return new Blob([content], { type: 'text/plain' });
  }
}

/**
 * Format file size in a human-readable way
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Get a suggested filename for a component based on its description or code
 */
export function getSuggestedFilename(description: string, code: string): string {
  // First try to extract component name from code
  const componentNameMatch = code.match(/(?:function|class)\s+([A-Z][a-zA-Z0-9]*)/);
  if (componentNameMatch && componentNameMatch[1]) {
    return `${componentNameMatch[1]}.tsx`;
  }
  
  // If no component name found, try to generate one from the description
  if (description) {
    // Extract keywords from description
    const keywords = description
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .filter(word => word.length > 3)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .slice(0, 2)
      .join('');
      
    if (keywords) {
      return `${keywords}Component.tsx`;
    }
  }
  
  // Fallback
  return 'GeneratedComponent.tsx';
} 