import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { getCurrentUser } from "@/lib/actions/auth.action"; 
import ProfileCard from "@/components/ProfileCard"; 

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WisePrep",
  description: "Ai powered platform for preparing for interview",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch user data server-side
  const user = await getCurrentUser();

  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased pattern`}>
        {children}

        {/* 2. Render ProfileCard if user exists */}
        {user && (
          <ProfileCard
            user={{
              id: user.id,
              name: user.name || "User",
              email: user.email || "",
              socials: user.socials || {},
            }}
          />
        )}

        <Toaster />
      </body>
    </html>
  );
}