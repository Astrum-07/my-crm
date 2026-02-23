"use client";

import React, { useState } from 'react';
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get('token');

  const { data: groups = [], isPending, isError } = useQuery<Group[]>({
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

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <FiLoader className="text-5xl animate-spin text-black" />
        <p className="font-black uppercase tracking-[3px] text-xs text-slate-400">Guruhlar yuklanmoqda...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-10 border-4 border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center text-black">
        <FiAlertCircle size={40} className="mx-auto text-red-600 mb-4" />
        <h2 className="text-lg font-black uppercase">Xatolik yuz berdi</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-black">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic font-sans">
            Guruhlar
          </h1>
          <p className="text-slate-400 font-bold text-sm tracking-wide uppercase">
            O'quv markazidagi barcha faol guruhlar nazorati
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group flex-1 min-w-[250px]">
            <input 
              type="text"
              placeholder="Guruh yoki ustoz nomi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black font-bold text-sm text-black focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-slate-300"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />
          </div>

          <button className="flex items-center justify-center gap-3 px-6 py-3.5 bg-black text-white border-2 border-black font-black uppercase text-xs tracking-[2px] hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
            <FiPlus size={18} /> Guruh Qo'shish
          </button>
        </div>
      </div>

      <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-black">
            <thead>
              <tr className="bg-black text-white uppercase text-[11px] tracking-[2px] font-black">
                <th className="py-5 px-4 text-center border-r border-white/20 w-16">No</th>
                <th className="py-5 px-6 border-r border-white/20">Guruh nomi</th>
                <th className="py-5 px-6 border-r border-white/20">Ustoz</th>
                <th className="py-5 px-6 border-r border-white/20 text-center">Studentlar</th>
                <th className="py-5 px-6 border-r border-white/20 hidden md:table-cell">Davomiyligi</th>
                <th className="py-5 px-6 text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, index) => (
                  <tr key={group._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-4 text-center font-black text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-black font-black uppercase text-sm tracking-tight leading-none group-hover:text-slate-600 transition-colors">
                        {group.name}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                        ID: {group._id?.slice(-8)}
                      </p>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2 font-bold text-black text-xs uppercase tracking-tighter">
                        <FiUser className="text-slate-400" />
                        <span>{group.teacher?.first_name} {group.teacher?.last_name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border-2 border-black font-black text-[10px]">
                        <FiUsers size={14} />
                        {group.students?.length || 0}
                      </div>
                    </td>
                    <td className="py-5 px-6 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-[9px] font-black text-slate-500 uppercase">
                          <FiCalendar />
                          <span>{group.start_date ? new Date(group.start_date).toLocaleDateString() : '—'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase italic">
                          <span>To: {group.end_date ? new Date(group.end_date).toLocaleDateString() : '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <button className="p-3 border-2 border-transparent hover:border-black transition-all active:scale-90">
                        <FiMoreHorizontal size={20} className="text-black" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center font-black uppercase tracking-widest text-slate-300 italic">
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