"use client";

import React, { useState } from 'react';
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get('token');

  const { data: students = [], isPending, isError } = useQuery<Student[]>({
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

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <FiLoader className="text-5xl animate-spin text-black" />
        <p className="font-black uppercase tracking-[3px] text-xs text-slate-400">Talabalar yuklanmoqda...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-10 border-4 border-black p-8 bg-white shadow-[10px_10px_0_0_rgba(0,0,0,1)] text-center">
        <FiAlertCircle size={40} className="mx-auto text-red-600 mb-4" />
        <h2 className="text-lg font-black uppercase text-black">Xatolik yuz berdi</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black font-sans">
            Studentlar
          </h1>
          <p className="text-slate-400 font-bold text-sm tracking-wide uppercase">
            O'quv markazining barcha faol talabalari nazorati
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group flex-1 min-w-[200px]">
            <input 
              type="text"
              placeholder="Ism yoki telefon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black font-bold text-sm text-black focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all placeholder:text-slate-300"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />
          </div>

          <div className="relative flex-1 min-w-[150px]">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none bg-white border-2 border-black pl-10 pr-10 py-3 font-black uppercase text-[10px] text-black tracking-widest focus:outline-none focus:bg-slate-50 cursor-pointer"
            >
              <option value="All">Barchasi</option>
              <option value="faol">Faol</option>
              <option value="nofaol">Nofaol</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
          </div>

          <button className="flex items-center justify-center gap-3 px-6 py-3.5 bg-black text-white border-2 border-black font-black uppercase text-xs tracking-[2px] hover:bg-white hover:text-black transition-all shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
            <FiUserPlus size={18} /> Qo'shish
          </button>
        </div>
      </div>

      <div className="bg-white border-[4px] border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white uppercase text-[11px] tracking-[2px] font-black">
                <th className="py-5 px-6 border-r border-white/20">Talaba ma'lumoti</th>
                <th className="py-5 px-6 border-r border-white/20 hidden md:table-cell">Telefon / Aloqa</th>
                <th className="py-5 px-6 border-r border-white/20 text-center">Guruhlar</th>
                <th className="py-5 px-6 border-r border-white/20">Holat</th>
                <th className="py-5 px-6 text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black text-black">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 border-2 border-black bg-white flex items-center justify-center text-black font-black text-lg shadow-[3px_3px_0_0_rgba(0,0,0,1)] group-hover:bg-black group-hover:text-white transition-all uppercase">
                          {student.first_name?.[0]}{student.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-black font-black uppercase text-sm tracking-tight leading-none">
                            {student.first_name} {student.last_name}
                          </p>
                          <p className="text-slate-400 text-[9px] font-bold mt-1 uppercase tracking-tighter">
                            ID: {student._id?.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 hidden md:table-cell">
                      <div className="flex items-center space-x-2 font-bold text-black text-xs italic">
                        <FiPhone className="text-black" />
                        <span>{student.phone || "+998 (00) 000-00-00"}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border-2 border-black font-black text-[10px]">
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
                        <span className={`font-black uppercase text-[10px] tracking-widest ${student.status === 'faol' ? 'text-black' : 'text-red-600'}`}>
                          {student.status}
                        </span>
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
                  <td colSpan={5} className="py-20 text-center font-black uppercase tracking-widest text-slate-300 italic">
                    Ma'lumot topilmadi
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

export default Students;