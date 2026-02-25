"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiLayers, 
  FiDollarSign, 
  FiActivity, 
  FiStar, 
  FiClock,
  FiZap,
  FiCheck
} from 'react-icons/fi';

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-10 pb-10 text-black dark:text-white transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="bg-yellow-400 border-4 border-black px-6 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-black">
              Xush Kelibsiz, {user?.first_name || "Admin"}!
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 font-bold text-sm uppercase tracking-[3px] mt-3 ml-1 flex items-center gap-2">
            <FiZap className="text-yellow-500" /> Tizim faol holatda
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_white]">
          <p className="text-[10px] font-black uppercase text-slate-400">Terminal Vaqti</p>
          <p className="font-black text-sm uppercase leading-none mt-1">
            {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString().slice(0,5)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-green-400 border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_white] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black uppercase text-black/60 tracking-widest">Talabalar</p>
              <p className="text-6xl font-black mt-2 text-black tracking-tighter">1,250</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <FiUsers size={28} className="text-black" />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center gap-2 text-[10px] font-black uppercase text-black">
            <FiActivity /> Oylik ko'rsatkich +12%
          </div>
        </div>

        <div className="bg-blue-400 border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_white] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black uppercase text-black/60 tracking-widest">Guruhlar</p>
              <p className="text-6xl font-black mt-2 text-black tracking-tighter">48</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <FiLayers size={28} className="text-black" />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center gap-2 text-[10px] font-black uppercase text-black">
            <FiStar /> 8 ta yangi ochiq guruh
          </div>
        </div>

        <div className="bg-purple-400 border-4 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_white] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-black uppercase text-black/60 tracking-widest">Tushum</p>
              <p className="text-6xl font-black mt-2 text-black tracking-tighter">45M</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <FiDollarSign size={28} className="text-black" />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center gap-2 text-[10px] font-black uppercase text-black">
            <FiCheck /> To'lovlar 95% yakunlandi
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black dark:text-white">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_white]">
          <h3 className="text-2xl font-black uppercase italic border-b-4 border-black dark:border-white pb-2 inline-block mb-8">
            Foydalanuvchi Profili
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-100 dark:bg-zinc-800 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white]">
                <p className="text-[9px] font-black uppercase text-slate-400">Tizimdagi ism</p>
                <p className="font-black text-lg uppercase tracking-tight">{user?.first_name} {user?.last_name || "Admin"}</p>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-zinc-800 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white]">
                <p className="text-[9px] font-black uppercase text-slate-400">Aloqa kanali</p>
                <p className="font-bold text-sm italic break-all">{user?.email || "admin@crm.pro"}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white]">
                <p className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400">Lavozim</p>
                <p className="font-black text-lg uppercase tracking-widest">{user?.role || "Manager"}</p>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white]">
                <p className="text-[9px] font-black uppercase text-green-600 dark:text-green-400">Holat</p>
                <p className="font-black text-lg uppercase tracking-widest italic">{user?.status || "Faol"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_white] flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black uppercase italic mb-6 border-b-2 border-black dark:border-white pb-2">Tizim holati</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 font-bold text-[10px] uppercase border-b border-black/10 dark:border-white/10 pb-2">
                <FiClock className="text-blue-500" /> Baza: Online (Sync)
              </li>
              <li className="flex items-center gap-3 font-bold text-[10px] uppercase border-b border-black/10 dark:border-white/10 pb-2">
                <FiActivity className="text-green-500" /> Xavfsizlik: SSL/JWT
              </li>
              <li className="flex items-center gap-3 font-bold text-[10px] uppercase">
                <FiZap className="text-yellow-500" /> Versiya: 2.0.5
              </li>
            </ul>
          </div>
          
          <button className="mt-8 w-full py-4 bg-black dark:bg-white text-white dark:text-black border-2 border-black font-black uppercase text-xs tracking-[3px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] active:translate-y-1 transition-all">
            Yangilash
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;