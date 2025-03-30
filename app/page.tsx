export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          Welcome to Project Planner
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          Project Planner is a web-based tool built to help developers and
          creators visually map and manage their project ideas—from concept to
          full-stack implementation.
        </p>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            ✨ Core Features
          </h2>
          <ul className="text-left list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
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
          <p className="text-gray-600 dark:text-gray-400">
            Whether you're working solo or with a team, Project Planner helps
            you bring structure and clarity to your app ideas before you ever
            write a line of code.
          </p>
        </div>

        <div className="mt-10">
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}
