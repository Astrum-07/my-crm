"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import { FiChevronRight, FiUser, FiMenu, FiBell } from "react-icons/fi";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const pathname = usePathname();
  const params = useParams();
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [userData, setUserData] = useState({
    name: "Admin",
    role: "Manager",
    image: "",
  });

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const firstName = parsed?.first_name || "";
        const lastName = parsed?.last_name || "";
        const fullName = parsed?.name || parsed?.fullName || parsed?.username;
        const finalName = firstName || lastName ? `${firstName} ${lastName}`.trim() : fullName || "Admin";

        setUserData({
          name: finalName,
          role: parsed?.role || "Manager",
          image: parsed?.image || parsed?.img || "",
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [pathname]);

  const getPathName = () => {
    if (pathname === "/") return "Asosiy";
    if (pathname.includes("/managers")) return "Menajerlar";
    if (pathname.includes("/admins")) return "Adminlar";
    if (pathname.includes("/teachers")) return "Ustozlar";
    if (pathname.includes("/students")) return "Studentlar";
    if (pathname.includes("/groups")) return "Guruhlar";
    if (pathname.includes("/courses")) return "Kurslar";
    if (pathname.includes("/payments")) return "To'lovlar";
    if (pathname.includes("/settings")) return "Sozlamalar";
    if (pathname.includes("/profile")) return "Profil";
    return (params.name as string) || "Sahifa";
  };

  if (!mounted) return null;

  return (
    <header className="h-16 md:h-20 bg-white dark:bg-zinc-950 border-b-2 border-black dark:border-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 text-black dark:text-white font-sans transition-colors">
      <div className="flex items-center space-x-3 md:space-x-6">
        <button
          onClick={toggleSidebar}
          className="p-2 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 hover:bg-yellow-400 dark:hover:bg-yellow-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          <FiMenu size={20} />
        </button>

        <nav className="flex items-center space-x-1 md:space-x-2">
          <span className="hidden sm:block text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest italic">
            Tizim
          </span>
          <FiChevronRight className="hidden sm:block text-slate-300" size={14} />
          <span className="text-black dark:text-white font-black text-[10px] md:text-xs uppercase tracking-widest bg-slate-100 dark:bg-zinc-800 px-3 py-1 border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white] whitespace-nowrap">
            {getPathName()}
          </span>
        </nav>
      </div>

      <div className="flex items-center space-x-2 md:space-x-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="border-2 border-black dark:border-white rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white] hover:bg-slate-100 dark:bg-zinc-900 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-2 border-black dark:border-white rounded-none font-bold uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] bg-white dark:bg-zinc-950">
            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black font-black">Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black font-black">Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black font-black">System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="p-2 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white]">
          <FiBell size={18} className="md:size-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-black rounded-full"></span>
        </button>

        <div className="flex items-center space-x-2 md:space-x-4 border-l-2 border-black dark:border-white pl-3 md:pl-6 group cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black uppercase tracking-tight leading-none">
              {userData.name}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {userData.role}
            </p>
          </div>

          <div className="w-9 h-9 md:w-11 md:h-11 border-2 border-black dark:border-white bg-yellow-400 overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white] transition-all">
            {userData.image ? (
              <img src={userData.image} alt="User" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-yellow-400 text-black">
                <FiUser size={20} className="md:size-6" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;