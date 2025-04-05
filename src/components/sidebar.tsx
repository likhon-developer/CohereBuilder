import Link from "next/link";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

type Project = {
  id: string;
  name: string;
  updatedAt: Date;
};

const projects: Project[] = [
  {
    id: "1",
    name: "Dashboard Components",
    updatedAt: new Date("2023-11-15"),
  },
  {
    id: "2",
    name: "E-commerce UI",
    updatedAt: new Date("2023-11-10"),
  },
  {
    id: "3",
    name: "Landing Page",
    updatedAt: new Date("2023-11-05"),
  },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center px-4 border-b border-border">
        <h1 className="font-bold text-xl">CohereBuilder</h1>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <div className="px-3 py-2">
          <button className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <PlusIcon className="h-4 w-4" />
            New Chat
          </button>
        </div>
        
        <nav className="grid gap-1 px-2 py-2">
          <NavLink href="/" active>
            <MessageSquareIcon className="h-4 w-4 mr-2" />
            Chats
          </NavLink>
          <NavLink href="/library">
            <LibraryIcon className="h-4 w-4 mr-2" />
            Library
          </NavLink>
          <NavLink href="/community">
            <UsersIcon className="h-4 w-4 mr-2" />
            Community
          </NavLink>
          <NavLink href="/projects">
            <FolderIcon className="h-4 w-4 mr-2" />
            Projects
          </NavLink>
          <NavLink href="/feedback">
            <MessageCircleIcon className="h-4 w-4 mr-2" />
            Feedback
          </NavLink>
        </nav>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Recent Projects</h2>
          <div className="grid gap-1">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              >
                <FolderIcon className="h-4 w-4" />
                {project.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-auto border-t border-border p-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-muted" />
          <div>
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({ 
  href, 
  children, 
  active 
}: { 
  href: string; 
  children: React.ReactNode; 
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md px-2 py-1.5 text-sm font-medium",
        active 
          ? "bg-secondary text-secondary-foreground" 
          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
      )}
    >
      {children}
    </Link>
  );
}

function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}

function LibraryIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  );
}

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
} 