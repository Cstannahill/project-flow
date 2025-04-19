import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import ClientProvider from "../components/wrappers/ClientProvider";

import "../app/globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProvider session={session}>{children}</ClientProvider>
      </body>
    </html>
  );
}
