"use client";

import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { 
  FiClock, 
  FiUsers, 
  FiEdit3, 
  FiTrash2, 
  FiPlus, 
  FiLoader, 
  FiAlertCircle 
} from 'react-icons/fi';
import { FaSnowflake } from 'react-icons/fa6';

interface Course {
  _id: string;
  title?: string;
  name?: string;
  category?: any;
  price: number;
  duration?: any;
  students_count?: number;
}

const Courses = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get('token');

  const { data: courses = [], isPending, isError, error } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/api/course/get-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data?.data || [];
    },
    enabled: !!token,
  });

  const renderSafeValue = (value: any, fallback = "Noma'lum") => {
    if (!value) return fallback;
    if (typeof value === 'object') {
      return value.name || value.title || fallback;
    }
    return value;
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-black">
        <FiLoader className="text-5xl animate-spin text-black" />
        <p className="font-black uppercase tracking-[3px] text-xs text-slate-400">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-10 border-4 border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center text-black">
        <FiAlertCircle size={40} className="mx-auto text-red-600 mb-4" />
        <h2 className="text-lg font-black uppercase">Xatolik!</h2>
        <p className="text-slate-500 text-sm mt-2">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-black">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic font-sans">Kurslar</h1>
          <p className="text-slate-400 font-bold text-sm tracking-wide uppercase">Barcha mavjud yo'nalishlar boshqaruvi</p>
        </div>
        
        <button className="flex items-center justify-center gap-3 px-8 py-4 bg-black text-white border-2 border-black font-black uppercase text-xs tracking-[2px] hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
          <FiPlus size={20} /> Kurs Qo'shish
        </button>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-black">
          {courses.map((course) => (
            <div 
              key={course._id} 
              className="bg-white border-[4px] border-black p-6 flex flex-col justify-between space-y-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all group"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight group-hover:underline">
                      {renderSafeValue(course.title || course.name, "Backend")}
                    </h2>
                    <p className="text-slate-400 font-bold text-xs italic uppercase tracking-[2px]">
                      {renderSafeValue(course.category, "Dasturlash")}
                    </p>
                  </div>
                  <div className="bg-slate-100 border-2 border-black px-3 py-1.5 font-black text-xs whitespace-nowrap shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    {course.price?.toLocaleString() || "0"} UZS
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6 border-y-2 border-black border-dashed py-6">
                  <div className="flex items-center gap-3 text-black font-black text-[10px] uppercase tracking-widest">
                    <FiClock className="text-slate-400" size={18} />
                    <span>{renderSafeValue(course.duration, "8 oy")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-black font-black text-[10px] uppercase tracking-widest">
                    <FiUsers className="text-slate-400" size={18} />
                    <span>{course.students_count || 0} Students</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-black text-black font-black uppercase text-[10px] tracking-wider hover:bg-slate-100 active:translate-y-1 transition-all">
                  <FiEdit3 size={14} /> Edit
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#ff3b3b] border-2 border-black text-white font-black uppercase text-[10px] tracking-wider hover:bg-red-700 active:translate-y-1 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <FiTrash2 size={14} /> O'chirish
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2563eb] border-2 border-black text-white font-black uppercase text-[10px] tracking-wider hover:bg-blue-700 active:translate-y-1 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <FaSnowflake size={14} /> Muzlatish
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-4 border-black border-dashed bg-white">
          <FiAlertCircle size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-black uppercase tracking-widest italic">Hozircha kurslar mavjud emas</p>
        </div>
      )}
    </div>
  );
};

export default Courses;