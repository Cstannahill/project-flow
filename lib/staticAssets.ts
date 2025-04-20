"use client";
import { use } from "react";
import Image from "next/image";

export const techFields = [
  { label: "Frontend", key: "frontend" },
  { label: "Backend", key: "backend" },
  { label: "Database", key: "database" },
  { label: "CSS Framework", key: "css" },
  { label: "Auth Provider", key: "auth" },
  { label: "Hosting", key: "hosting" },
  { label: "API Style", key: "api" },
  { label: "State Management", key: "state" },
];

export const sqlTypes = [
  "INT",
  "VARCHAR",
  "TEXT",
  "BOOLEAN",
  "DATE",
  "TIMESTAMP",
  "DECIMAL",
  "FLOAT",
  "UUID",
];

export const techOptions: Record<
  string,
  {
    tool: string;
    language: string;
    docs: string;
    icon: string;
    iconImg?: React.ReactNode;
  }[]
> = {
  frontend: [
    {
      tool: "React",
      language: "JavaScript/TypeScript",
      docs: "https://reactjs.org",
      icon: "/icons/react.svg",
    },
    {
      tool: "Vue",
      language: "JavaScript",
      docs: "https://vuejs.org",
      icon: "/icons/vue.svg",
    },
    {
      tool: "Svelte",
      language: "JavaScript",
      docs: "https://svelte.dev",
      icon: "/icons/svelte.svg",
    },
    {
      tool: "Angular",
      language: "TypeScript",
      docs: "https://angular.io",
      icon: "/icons/angular.svg",
    },
    { tool: "None", language: "", docs: "", icon: "/icons/none.png" },
  ],
  backend: [
    {
      tool: "Node.js (Express)",
      language: "JavaScript",
      docs: "https://expressjs.com",
      icon: "/icons/node.svg",
    },
    {
      tool: "Django",
      language: "Python",
      docs: "https://docs.djangoproject.com",
      icon: "/icons/django.svg",
    },
    {
      tool: "Laravel",
      language: "PHP",
      docs: "https://laravel.com/docs",
      icon: "/icons/laravel.svg",
    },
    {
      tool: "Go (Fiber)",
      language: "Go",
      docs: "https://docs.gofiber.io",
      icon: "/icons/go.png",
    },
    {
      tool: "Ruby on Rails",
      language: "Ruby",
      docs: "https://rubyonrails.org",
      icon: "/icons/rails.svg",
    },
    {
      tool: ".NET",
      language: "C#",
      docs: "https://learn.microsoft.com/en-us/dotnet/core/introduction",
      icon: "/icons/dotnet.svg",
    },
    { tool: "None", language: "", docs: "", icon: "/icons/none.png" },
  ],
  database: [
    {
      tool: "PostgreSQL",
      language: "SQL",
      docs: "https://www.postgresql.org/docs/",
      icon: "/icons/postgres.svg",
    },
    {
      tool: "MongoDB",
      language: "JavaScript/JSON",
      docs: "https://www.mongodb.com/docs/",
      icon: "/icons/mongodb.svg",
    },
    {
      tool: "MySQL",
      language: "SQL",
      docs: "https://dev.mysql.com/doc/",
      icon: "/icons/mysql.svg",
    },
    {
      tool: "MSSQL",
      language: "SQL",
      docs: "https://learn.microsoft.com/sql/",
      icon: "/icons/mssql.png",
    },
    {
      tool: "SQLite",
      language: "SQL",
      docs: "https://sqlite.org/docs.html",
      icon: "/icons/sqlite.svg",
    },
    { tool: "None", language: "", docs: "", icon: "/icons/none.png" },
  ],
  css: [
    {
      tool: "Tailwind CSS",
      language: "CSS",
      docs: "https://tailwindcss.com/docs",
      icon: "/icons/tailwind.svg",
    },
    {
      tool: "Bootstrap",
      language: "CSS",
      docs: "https://getbootstrap.com/docs",
      icon: "/icons/bootstrap.svg",
    },
    {
      tool: "MUI",
      language: "React/JS",
      docs: "https://mui.com/material-ui/",
      icon: "/icons/mui.svg",
    },
    {
      tool: "Chakra UI",
      language: "React/JS",
      docs: "https://chakra-ui.com/docs",
      icon: "/icons/chakra.png",
    },
    { tool: "None", language: "", docs: "", icon: "/icons/none.png" },
  ],
  auth: [
    {
      tool: "NextAuth",
      language: "JavaScript/TS",
      docs: "https://next-auth.js.org/getting-started/introduction",
      icon: "/icons/nextauth.png",
    },
    {
      tool: "Firebase",
      language: "JavaScript",
      docs: "https://firebase.google.com/docs/auth",
      icon: "/icons/firebase.svg",
    },
    {
      tool: "Auth0",
      language: "Various",
      docs: "https://auth0.com/docs",
      icon: "/icons/auth0.png",
    },
    {
      tool: "Supabase",
      language: "JavaScript",
      docs: "https://supabase.com/docs/guides/auth",
      icon: "/icons/supabase.png",
    },
    { tool: "None", language: "", docs: "", icon: "/icons/none.png" },
  ],
  hosting: [
    {
      tool: "Vercel",
      language: "Any",
      docs: "https://vercel.com/docs",
      icon: "/icons/vercel.svg",
    },
    {
      tool: "Netlify",
      language: "Any",
      docs: "https://docs.netlify.com",
      icon: "/icons/netlify.svg",
    },
    {
      tool: "AWS",
      language: "Various",
      docs: "https://aws.amazon.com/documentation/",
      icon: "/icons/aws.svg",
    },
    {
      tool: "Railway",
      language: "Any",
      docs: "https://docs.railway.app",
      icon: "/icons/railway.svg",
    },
    {
      tool: "Heroku",
      language: "Various",
      docs: "https://devcenter.heroku.com",
      icon: "/icons/heroku.svg",
    },
    { tool: "None", language: "", docs: "", icon: "/icons/none.png" },
  ],
  api: [
    {
      tool: "REST",
      language: "Any",
      docs: "https://restfulapi.net",
      icon: "/icons/rest.png",
    },
    {
      tool: "GraphQL",
      language: "Any",
      docs: "https://graphql.org/learn/",
      icon: "/icons/graphql.svg",
    },
    {
      tool: "gRPC",
      language: "Any",
      docs: "https://grpc.io/docs/",
      icon: "/icons/grpc.png",
    },
    {
      tool: "RPC",
      language: "Various",
      docs: "https://en.wikipedia.org/wiki/Remote_procedure_call",
      icon: "/icons/rpc.png",
    },
    { tool: "None", language: "", docs: "", icon: "/icons/none.png" },
  ],
  state: [
    {
      tool: "Redux Toolkit",
      language: "JavaScript",
      docs: "https://redux-toolkit.js.org",
      icon: "/icons/redux.svg",
    },
    {
      tool: "Zustand",
      language: "JavaScript",
      docs: "https://docs.pmnd.rs/zustand/getting-started/introduction",
      icon: "/icons/zustand.png",
    },
    {
      tool: "Context API",
      language: "JavaScript",
      docs: "https://react.dev/learn/passing-data-deeply-with-context",
      icon: "/icons/context.png",
    },
    {
      tool: "MobX",
      language: "JavaScript",
      docs: "https://mobx.js.org/README.html",
      icon: "/icons/mobx.svg",
    },
    { tool: "None", language: "", docs: "", icon: "/icons/none.png" },
  ],
};

export const typeOptions = [
  "Frontend",
  "Backend",
  "API",
  "Database",
  "Auth",
  "DevOps",
  "Testing",
  "Design",
  "Security",
  "Integration",
];

// Status workflow options
export const statusOptions = ["Planned", "In Progress", "Complete"];

// Expanded predefined tags for feature categorization
export const predefinedTags = [
  "MVP",
  "Bug",
  "UI",
  "UX",
  "Enhancement",
  "Performance",
  "Research",
  "Spike",
  "Maintenance",
  "Chore",
];
export const typeColors: Record<string, string> = {
  Frontend: "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300",
  Backend:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
  API: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
  Database:
    "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300",
  Auth: "bg-indigo-100 text-indigo-800 dark:bg-indigo-800/20 dark:text-indigo-300",
  DevOps:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-300",
  Testing: "bg-pink-100 text-pink-800 dark:bg-pink-800/20 dark:text-pink-300",
  Design: "bg-teal-100 text-teal-800 dark:bg-teal-800/20 dark:text-teal-300",
  Security: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
  Integration:
    "bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-300",
};

// Tag colors mapping (Tailwind classes)
export const tagColors: Record<string, string> = {
  MVP: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
  Bug: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
  UI: "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300",
  UX: "bg-indigo-100 text-indigo-800 dark:bg-indigo-800/20 dark:text-indigo-300",
  Enhancement:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
  Performance:
    "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300",
  Research: "bg-pink-100 text-pink-800 dark:bg-pink-800/20 dark:text-pink-300",
  Spike:
    "bg-violet-100 text-violet-800 dark:bg-violet-800/20 dark:text-violet-300",
  Maintenance: "bg-gray-100 text-brand dark:bg-gray-800/20 dark:text-gray-300",
  Chore:
    "bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-300",
};

// Status badges colors mapping
export const statusColors: Record<string, string> = {
  Planned: "bg-gray-100 text-brand00 dark:bg-gray-700 dark:text-gray-100",
  "In Progress":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
  Complete:
    "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
};
