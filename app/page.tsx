import { P } from "@/components/ui/Typography";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="max-w-3xl space-y-6 text-center">
        <h1 className="text-brand text-4xl font-bold dark:text-gray-100">
          Welcome to Project Planner
        </h1>

        <P className="border-accent text-accent text-lg text-gray-600 dark:text-gray-400">
          Project Planner is a web-based tool built to help developers and
          creators visually map and manage their project ideas—from concept to
          full-stack implementation.
        </P>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="mb-2 text-2xl font-semibold ">✨ Core Features</h2>
          <ul className="text-accent list-inside list-disc space-y-2 text-left">
            <li>Create, edit, and manage multiple projects</li>
            <li>
              Define features, UI components, APIs, and database tables for each
              project
            </li>
            <li>Visualize project workflows with built-in diagram support</li>
            <li>
              Authenticate securely with email/password or OAuth (Google,
              GitHub)
            </li>
            <li>
              Plan frontend/backend integration from a feature-first perspective
            </li>
            <li>Track project complexity and interdependencies visually</li>
          </ul>
        </div>

        <div className="mt-8">
          <P className="text-gray-600 dark:text-gray-400">
            {`Whether you're working solo or with a team, Project Planner helps
            you bring structure and clarity to your app ideas before you ever
            write a line of code.`}
          </P>
        </div>

        <div className="mt-10">
          <a
            href="/login"
            className="inline-block rounded bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}
