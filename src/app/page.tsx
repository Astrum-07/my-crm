"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LogOut, Mail, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      try {
        setUser(JSON.parse(data));
      } catch (e) {
        console.error(e);
      }
    }
    setIsReady(true);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
    router.refresh();
  };

  if (!isReady) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-black animate-pulse">
      YUKLANMOQDA...
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-4 md:p-10 font-mono text-black">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-white border-[4px] border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
          <h1 className="text-xl font-black uppercase italic tracking-tighter">CRM.ADMIN</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white border-[3px] border-black px-4 py-2 font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <LogOut size={16} className="inline mr-2" /> Chiqish
          </button>
        </header>

        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-yellow-400 border-b-[4px] border-black p-8 flex items-center gap-6">
            <img 
              src={user.image || "https://via.placeholder.com/150"} 
              className="w-24 h-24 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] object-cover bg-white"
              alt="Avatar"
            />
            <div>
              <h2 className="text-4xl font-black uppercase leading-tight">
                {user.first_name} {user.last_name}
              </h2>
              <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest italic">
                {user.role} | {user.status}
              </span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-black p-4 bg-blue-50 flex items-center gap-4">
              <Mail size={20} /> <span className="font-bold">{user.email}</span>
            </div>
            <div className="border-2 border-black p-4 bg-green-50 flex items-center gap-4">
              <ShieldCheck size={20} /> <span className="font-bold uppercase tracking-tighter">Active System Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}