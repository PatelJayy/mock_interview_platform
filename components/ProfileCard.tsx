"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  LogOut, 
  Github, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Edit2, 
  MapPin,
  Link as LinkIcon
} from "lucide-react";

import { signOut } from "@/lib/actions/auth.action";
import { Button } from "./ui/button";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    // Optional: Add these to your user object in the future
    bio?: string;
    location?: string;
    socials?: {
      github?: string;
      linkedin?: string;
      instagram?: string;
      twitter?: string;
      portfolio?: string;
    };
  };
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close the card if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="fixed top-6 right-6 z-50" ref={cardRef}>
      
      {/* --- Main Trigger Card --- */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative flex items-center gap-4 p-3 pr-4 
          bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md 
          border border-zinc-200 dark:border-zinc-800 
          rounded-2xl shadow-xl hover:shadow-2xl hover:bg-white dark:hover:bg-zinc-800
          transition-all duration-300 cursor-pointer select-none
          min-w-[260px] z-20
          ${isOpen ? "ring-2 ring-primary-200 dark:ring-primary-900" : ""}
        `}
      >
        {/* Avatar */}
        <div className="relative h-11 w-11 rounded-full overflow-hidden 
          bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900
          border-2 border-white dark:border-zinc-800 shadow-sm
          flex items-center justify-center shrink-0"
        >
          {user.photoURL ? (
            <Image src={user.photoURL} alt={user.name} fill className="object-cover" />
          ) : (
            <span className="text-blue-600 dark:text-blue-300 font-bold text-sm">{initials}</span>
          )}
        </div>

        {/* Info Text */}
        <div className="flex flex-col flex-1 overflow-hidden mr-2">
          <h4 className="font-semibold text-zinc-800 dark:text-zinc-100 truncate text-sm leading-tight">
            {user.name}
          </h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate font-medium mt-0.5">
            {isOpen ? "View Profile" : user.email}
          </p>
        </div>
      </div>

      {/* --- Expanded Details Panel --- */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-[320px] 
          bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 
          rounded-2xl shadow-2xl overflow-hidden
          animate-in slide-in-from-top-5 fade-in-0 zoom-in-95 duration-200 origin-top-right"
        >
          
          {/* Header Cover / Background decoration */}
          <div className="h-20 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90 relative">
             <div className="absolute top-2 right-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8">
                  <Edit2 size={14} />
                </Button>
             </div>
          </div>

          <div className="px-5 pb-5">
            {/* Expanded Avatar (Overlapping header) */}
            <div className="-mt-10 mb-3 relative inline-block">
              <div className="h-20 w-20 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden bg-zinc-100 flex items-center justify-center">
                 {user.photoURL ? (
                    <Image src={user.photoURL} alt={user.name} fill className="object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">{initials}</span>
                  )}
              </div>
            </div>

            {/* Details */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              
              {user.bio && (
                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                   {user.bio}
                 </p>
              )}

              {user.location && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 font-medium">
                  <MapPin size={12} />
                  <span>{user.location}</span>
                </div>
              )}
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <SocialLink href={user.socials?.github} icon={<Github size={18}/>} label="GitHub" />
              <SocialLink href={user.socials?.linkedin} icon={<Linkedin size={18}/>} label="LinkedIn" />
              <SocialLink href={user.socials?.instagram} icon={<Instagram size={18}/>} label="Instagram" />
              <SocialLink href={user.socials?.portfolio} icon={<LinkIcon size={18}/>} label="Website" />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
               <Button 
                onClick={handleSignOut}
                variant="destructive" 
                className="w-full flex items-center gap-2 rounded-xl"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for social icons
const SocialLink = ({ href, icon, label }: { href?: string; icon: React.ReactNode; label: string }) => {
  if (!href) return (
    <div className="h-10 w-full flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-zinc-300 dark:text-zinc-700 cursor-not-allowed" title={`No ${label} link`}>
      {icon}
    </div>
  );

  return (
    <Link 
      href={href} 
      target="_blank" 
      className="h-10 w-full flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 transition-all duration-200"
      title={label}
    >
      {icon}
    </Link>
  );
};

export default ProfileCard;