"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { 
  FiSearch, 
  FiUserPlus, 
  FiMoreHorizontal, 
  FiLoader, 
  FiAlertCircle, 
  FiFilter,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiLayers
} from 'react-icons/fi';

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  group_count?: number;
}

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isMounted, setIsMounted] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get('token');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: students = [], isPending, isError, refetch } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/api/student/get-all-students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data?.data || [];
    },
    enabled: !!token
  });

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const phone = (student.phone || "").toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                         phone.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-10 text-black dark:text-white transition-colors duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="bg-yellow-400 border-4 border-black px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">
              Studentlar
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 font-bold text-sm uppercase tracking-[2px] mt-2 ml-1">
            O'quv markazi talabalari nazorati
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-[260px]">
            <input 
              type="text"
              placeholder="Ism yoki telefon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white font-bold text-sm text-black dark:text-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_white] outline-none transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white" size={18} />
          </div>

          <div className="relative">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-10 pr-8 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white font-black uppercase text-[10px] tracking-widest focus:outline-none cursor-pointer text-black dark:text-white"
            >
              <option value="All">Barchasi</option>
              <option value="faol">Faol</option>
              <option value="nofaol">Nofaol</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white" size={16} />
          </div>

          <button className="flex items-center justify-center gap-3 px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white font-black uppercase text-xs tracking-[2px] hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_white] active:translate-y-1 active:shadow-none">
            <FiUserPlus size={18} /> Qo'shish
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border-[4px] border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_white] overflow-hidden">
        <div className="overflow-x-auto">
          {isPending ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <FiLoader className="text-6xl animate-spin text-black dark:text-white" />
              <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Yuklanmoqda...</p>
            </div>
          ) : isError ? (
            <div className="py-20 text-center flex flex-col items-center">
              <FiAlertCircle size={40} className="text-red-600 mb-2" />
              <p className="font-black uppercase">Ma'lumot olishda xato</p>
              <button onClick={() => refetch()} className="mt-4 border-2 border-black dark:border-white px-4 py-1 font-bold text-xs uppercase">Qayta urinish</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black dark:bg-white text-white dark:text-black uppercase text-[11px] tracking-[2px] font-black">
                  <th className="py-5 px-6 border-r border-white/20 dark:border-black/10">Talaba ma'lumoti</th>
                  <th className="py-5 px-6 border-r border-white/20 dark:border-black/10 hidden md:table-cell">Telefon / Aloqa</th>
                  <th className="py-5 px-6 border-r border-white/20 dark:border-black/10 text-center">Guruhlar</th>
                  <th className="py-5 px-6 border-r border-white/20 dark:border-black/10">Holat</th>
                  <th className="py-5 px-6 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-black dark:divide-white">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-yellow-50 dark:hover:bg-zinc-800 transition-colors group text-black dark:text-white">
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 border-2 border-black dark:border-white bg-yellow-400 flex items-center justify-center text-black font-black text-lg shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                            {student.first_name?.[0]}{student.last_name?.[0]}
                          </div>
                          <div>
                            <p className="font-black uppercase text-sm tracking-tight leading-none">
                              {student.first_name} {student.last_name}
                            </p>
                            <p className="text-slate-400 text-[9px] font-bold mt-1 uppercase tracking-tighter">
                              ID: {student._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 hidden md:table-cell font-bold text-xs italic text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-2">
                          <FiPhone className="text-black dark:text-white" />
                          <span>{student.phone || "+998 (00) 000-00-00"}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-zinc-800 border-2 border-black dark:border-white font-black text-[10px]">
                          <FiLayers size={14} />
                          {student.group_count || 0}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-2">
                          {student.status === 'faol' ? (
                            <FiCheckCircle className="text-green-600" size={18} />
                          ) : (
                            <FiXCircle className="text-red-600" size={18} />
                          )}
                          <span className={`font-black uppercase text-[10px] tracking-widest ${student.status === 'faol' ? 'text-black dark:text-white' : 'text-red-600'}`}>
                            {student.status}
                          </span>
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
                    <td colSpan={5} className="py-20 text-center font-black uppercase tracking-widest text-slate-300 italic bg-white dark:bg-zinc-900">
                      Ma'lumot topilmadi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;