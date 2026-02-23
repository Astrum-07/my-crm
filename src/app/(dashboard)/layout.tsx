"use client";

import React, { useState } from "react";

import Sidebar from "../../../components/layout/Sidebar";
import Header from "../../../components/layout/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex font-sans text-black overflow-hidden">

      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r-2 border-black transition-transform duration-300 ease-in-out ${
          isCollapsed ? "-translate-x-full" : "translate-x-0 w-64"
        }`}
      >
        <Sidebar />
      </aside>


      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? "ml-0" : "ml-64"
        }`}
      >

        <Header toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        

        <main className="p-6 md:p-10 overflow-y-auto h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
    </div>
  );
}