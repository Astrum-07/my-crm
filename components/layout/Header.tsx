"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { FiChevronRight, FiUser, FiMenu, FiBell } from 'react-icons/fi';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const pathname = usePathname();
  const params = useParams();

  const [userData, setUserData] = useState({
    name: "Yuklanmoqda...",
    role: "User",
    image: "", 
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        
        const firstName = parsed?.first_name || "";
        const lastName = parsed?.last_name || "";
        const fullName = parsed?.name || parsed?.fullName || parsed?.username;

        const finalName = (firstName || lastName) 
          ? `${firstName} ${lastName}`.trim() 
          : (fullName || "Foydalanuvchi");

        const finalRole = parsed?.role || "Manager";
        

        const finalImage = parsed?.image || parsed?.img || "";

        setUserData({
          name: finalName,
          role: finalRole,
          image: finalImage
        });
      } catch (error) {
        setUserData({ name: "Admin", role: "Manager", image: "" });
      }
    } else {
      setUserData({ name: "Kirilmagan", role: "Mehmon", image: "" });
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

  return (
    <header className="h-16 md:h-20 bg-white border-b-2 border-black px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 text-black font-sans">
      

      <div className="flex items-center space-x-3 md:space-x-6">
        <button 
          onClick={toggleSidebar}
          className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all active:scale-90 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
        >
          <FiMenu size={20} />
        </button>

        <nav className="flex items-center space-x-1 md:space-x-2">
          <span className="hidden sm:block text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">Tizim</span>
          <FiChevronRight className="hidden sm:block text-slate-300" size={14} />
          <span className="text-black font-black text-[10px] md:text-xs uppercase tracking-widest bg-slate-100 px-2 py-1 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
            {getPathName()}
          </span>
        </nav>
      </div>


      <div className="flex items-center space-x-2 md:space-x-6">
        <button className="p-2 border-2 border-transparent hover:border-black transition-all relative">
          <FiBell size={18} className="md:size-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border border-black rounded-full"></span>
        </button>

        <div className="flex items-center space-x-2 md:space-x-4 border-l-2 border-black pl-3 md:pl-6 group cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-black uppercase tracking-tight leading-none">
              {userData.name}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {userData.role}
            </p>
          </div>


          <div className="w-9 h-9 md:w-11 md:h-11 border-2 border-black bg-yellow-400 overflow-hidden transition-all group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {userData.image ? (
              <img 
                src={userData.image} 
                alt="User Avatar" 
                className="w-full h-full object-cover"
                onError={(e) => {

                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-yellow-400">
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