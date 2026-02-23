"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  User,
  Shield,
  Globe,
  Bell,
  Trash2,
  Lock,
  Moon,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
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

  const handleClearCache = () => {
    if (window.confirm("Barcha ma'lumotlarni o'chirib, tizimdan chiqmoqchimisiz?")) {
      Cookies.remove('token', { path: '/' });
      Cookies.remove('role', { path: '/' });
      localStorage.clear();
      router.push('/login');
      router.refresh();
    }
  };

  const handleSave = () => {
    toast.success("Sozlamalar saqlandi", {
      style: {
        border: '4px solid black',
        borderRadius: '0px',
        padding: '16px',
        fontWeight: '900',
        textTransform: 'uppercase',
        fontSize: '12px'
      }
    });
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-6xl mx-auto pb-20 text-black font-sans">
      <div className="mb-12">
        <h1 className="text-6xl font-black uppercase tracking-tighter italic">
          Sozlamalar<span className="text-blue-600">.</span>
        </h1>
        <div className="bg-black text-white inline-block px-4 py-1 font-black uppercase text-[10px] tracking-[4px] mt-2">
          System Configuration v2.0
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
          <div className="absolute top-0 right-0 bg-yellow-400 border-l-4 border-b-4 border-black p-3 text-black">
            <User size={28} strokeWidth={3} />
          </div>
          <h3 className="text-2xl font-black uppercase mb-8 underline decoration-yellow-400 decoration-8 underline-offset-8 italic">
            Profil paneli
          </h3>
          <div className="space-y-6">
            <div className="p-5 bg-slate-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Admin F.I.SH</p>
              <p className="text-xl font-black uppercase tracking-tight">
                {user?.first_name} {user?.last_name || "Administrator"}
              </p>
            </div>
            <div className="p-5 bg-slate-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Email Manzil</p>
              <p className="text-lg font-bold italic break-all">{user?.email || "admin@crm.pro"}</p>
            </div>
            <div className="p-5 bg-indigo-100 border-2 border-black flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <p className="text-[9px] font-black uppercase text-indigo-600 mb-1">Kirish Huquqi</p>
                <p className="text-lg font-black uppercase tracking-widest italic">{user?.role || "Developer"}</p>
              </div>
              <Shield className="text-indigo-600" size={36} strokeWidth={3} />
            </div>
          </div>
          <button className="mt-10 w-full py-5 bg-white border-4 border-black font-black uppercase text-xs tracking-[3px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3">
            <Lock size={18} strokeWidth={3} /> Parolni o'zgartirish
          </button>
        </section>

        <section className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div className="space-y-10">
            <h3 className="text-2xl font-black uppercase underline decoration-blue-500 decoration-8 underline-offset-8 italic">
              Tizim boshqaruvi
            </h3>
            <div className="flex items-center justify-between border-b-4 border-black pb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                   <Moon size={22} />
                </div>
                <span className="font-black uppercase text-sm tracking-widest leading-none">Tungi Rejim</span>
              </div>
              <div className="w-16 h-9 border-[4px] border-black bg-slate-200 p-1 cursor-pointer relative">
                <div className="w-6 h-full bg-black border-2 border-black shadow-[2px_0px_0px_0px_rgba(0,0,0,1)]"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[4px] text-slate-400">
                <Globe size={14} /> Global til
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['UZ', 'EN', 'RU'].map((lang) => (
                  <button key={lang} className={`py-4 border-[3px] border-black font-black text-sm tracking-widest transition-all ${lang === 'UZ' ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-slate-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1'}`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                   <Bell size={22} />
                </div>
                <span className="font-black uppercase text-sm tracking-widest leading-none">Bildirishnomalar</span>
              </div>
              <div className="w-16 h-9 border-[4px] border-black bg-green-400 p-1 cursor-pointer flex justify-end shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="w-6 h-full bg-white border-2 border-black"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-green-50 border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
           <h3 className="text-2xl font-black uppercase mb-10 flex items-center gap-4 italic underline decoration-green-500 decoration-8 underline-offset-8">
            <Shield className="text-green-600" size={32} strokeWidth={3} /> Xavfsizlik darajasi
          </h3>
          <div className="space-y-8">
            <div className="flex items-center justify-between p-6 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div>
                <p className="font-black uppercase text-[11px] tracking-widest">Sessiya holati</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Cookie-based Auth</p>
              </div>
              <div className="bg-green-500 text-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle2 size={20} strokeWidth={3} />
              </div>
            </div>
            <div className="flex items-center justify-between p-6 bg-white border-2 border-black opacity-60 cursor-not-allowed">
              <p className="font-black uppercase text-[11px] tracking-widest">2-Bosqichli Himoya</p>
              <span className="text-[9px] font-black bg-black text-white px-3 py-1 border border-black italic tracking-widest uppercase">Disabled</span>
            </div>
          </div>
        </section>

        <section className="bg-red-50 border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 mb-10 text-red-600 italic">
            <AlertTriangle size={36} strokeWidth={3} />
            <h3 className="text-2xl font-black uppercase tracking-tighter">Xavfli Hudud</h3>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase text-red-900 leading-relaxed bg-red-100 p-5 border-[3px] border-red-600 border-dashed">
              Diqqat! Keshni tozalash amali barcha sessiya ma'lumotlarini o'chiradi va terminaldan chiqarib yuboradi.
            </p>
            <button 
              onClick={handleClearCache} 
              className="w-full py-6 bg-red-600 text-white border-4 border-black font-black uppercase text-sm tracking-[4px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all active:scale-95"
            >
              <Trash2 size={20} className="inline mr-3 mb-1" strokeWidth={3} /> Keshni Tozalash
            </button>
          </div>
        </section>
      </div>

      <div className="mt-20 flex justify-end">
        <button 
          onClick={handleSave} 
          className="group relative flex items-center gap-6 px-24 py-8 bg-black text-white border-[5px] border-black font-black uppercase text-2xl shadow-[16px_16px_0px_0px_rgba(59,130,246,0.5)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all"
        >
          <CheckCircle2 size={32} className="text-green-400 group-hover:scale-125 transition-transform" strokeWidth={3} />
          Saqlash
        </button>
      </div>
    </div>
  );
}