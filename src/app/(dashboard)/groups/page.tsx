"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { 
  FiSearch, 
  FiPlus, 
  FiMoreHorizontal, 
  FiLoader, 
  FiAlertCircle, 
  FiUsers,
  FiCalendar,
  FiUser
} from 'react-icons/fi';

interface Group {
  _id: string;
  name: string;
  teacher?: {
    first_name: string;
    last_name: string;
  };
  students?: any[];
  start_date?: string;
  end_date?: string;
}

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get('token');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: groups = [], isPending, isError, refetch } = useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/api/group/get-all-group`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data?.data || [];
    },
    enabled: !!token
  });

  const filteredGroups = groups.filter((group) => {
    const groupName = (group.name || "").toLowerCase();
    const teacherName = `${group.teacher?.first_name || ""} ${group.teacher?.last_name || ""}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return groupName.includes(search) || teacherName.includes(search);
  });

  if (!isMounted) return null;

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-black dark:text-white">
        <FiLoader className="text-6xl animate-spin text-black dark:text-white" />
        <p className="font-black uppercase tracking-[5px] text-xs">Guruhlar yuklanmoqda...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-10 border-4 border-black dark:border-white p-8 bg-white dark:bg-zinc-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_white] text-center text-black dark:text-white">
        <FiAlertCircle size={48} className="mx-auto text-red-600 mb-4" />
        <h2 className="text-xl font-black uppercase italic">Xatolik yuz berdi</h2>
        <button onClick={() => refetch()} className="mt-4 px-6 py-2 border-2 border-black dark:border-white font-black uppercase text-xs">Qayta urinish</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 text-black dark:text-white transition-colors duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="bg-yellow-400 border-4 border-black px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block text-black">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic font-sans">
              Guruhlar
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 font-bold text-sm tracking-wide uppercase mt-2 ml-1">
            O'quv markazidagi barcha faol guruhlar nazorati
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-[280px]">
            <input 
              type="text"
              placeholder="Guruh yoki ustoz nomi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white font-bold text-sm text-black dark:text-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_white] outline-none transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white" size={18} />
          </div>

          <button className="flex items-center justify-center gap-3 px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white font-black uppercase text-xs tracking-[2px] hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_white] active:translate-y-1 active:shadow-none">
            <FiPlus size={18} /> Guruh Qo'shish
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border-[4px] border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_white] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-black dark:text-white font-sans">
            <thead>
              <tr className="bg-black dark:bg-white text-white dark:text-black uppercase text-[11px] tracking-[2px] font-black">
                <th className="py-5 px-4 text-center border-r border-white/20 dark:border-black/10 w-16">No</th>
                <th className="py-5 px-6 border-r border-white/20 dark:border-black/10">Guruh nomi</th>
                <th className="py-5 px-6 border-r border-white/20 dark:border-black/10">Ustoz</th>
                <th className="py-5 px-6 border-r border-white/20 dark:border-black/10 text-center">Studentlar</th>
                <th className="py-5 px-6 border-r border-white/20 dark:border-black/10 hidden md:table-cell">Davomiyligi</th>
                <th className="py-5 px-6 text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black dark:divide-white">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, index) => (
                  <tr key={group._id} className="hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                    <td className="py-5 px-4 text-center font-black text-slate-400 dark:text-zinc-500">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-5 px-6">
                      <p className="font-black uppercase text-sm tracking-tight leading-none group-hover:text-yellow-600 transition-colors">
                        {group.name}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                        ID: {group._id?.slice(-8)}
                      </p>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-widest">
                        <FiUser className="text-slate-400 dark:text-zinc-500" />
                        <span>{group.teacher?.first_name} {group.teacher?.last_name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-zinc-800 border-2 border-black dark:border-white font-black text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white]">
                        <FiUsers size={14} />
                        {group.students?.length || 0}
                      </div>
                    </td>
                    <td className="py-5 px-6 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          <FiCalendar />
                          <span>{group.start_date ? new Date(group.start_date).toLocaleDateString() : '—'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase italic">
                          <span>To: {group.end_date ? new Date(group.end_date).toLocaleDateString() : '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <button className="p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-90 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_white]">
                        <FiMoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center font-black uppercase tracking-[10px] text-slate-300 italic bg-white dark:bg-zinc-900">
                    Guruhlar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Groups;