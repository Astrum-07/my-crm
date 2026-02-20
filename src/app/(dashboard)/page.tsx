import React from 'react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
          Boshqaruv Paneli
        </h2>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">
          Bugungi xulosa va statistika
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistika kartalari */}
        <div className="bg-green-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black uppercase">Talabalar</p>
          <p className="text-4xl font-black mt-2">1,250</p>
        </div>
        <div className="bg-blue-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black uppercase">Guruhlar</p>
          <p className="text-4xl font-black mt-2">48</p>
        </div>
        <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black uppercase">Tushumlar</p>
          <p className="text-4xl font-black mt-2">45M</p>
        </div>
      </div>
    </div>
  );
}