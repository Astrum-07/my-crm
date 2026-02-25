"use client";

import React, { useState, useEffect } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get('token');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: courses = [], isPending, isError, error, refetch } = useQuery<Course[]>({
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

  if (!isMounted) return null;

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-black dark:text-white transition-colors">
        <FiLoader className="text-6xl animate-spin text-black dark:text-white" />
        <p className="font-black uppercase tracking-[3px] text-xs">Kurslar yuklanmoqda...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-10 border-4 border-black dark:border-white p-8 bg-white dark:bg-zinc-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_white] text-center text-black dark:text-white transition-all">
        <FiAlertCircle size={48} className="mx-auto text-red-600 mb-4" />
        <h2 className="text-xl font-black uppercase italic tracking-tighter">Xatolik yuz berdi</h2>
        <p className="text-slate-500 dark:text-zinc-400 font-bold text-sm mt-2">{(error as any).message}</p>
        <button onClick={() => refetch()} className="mt-6 px-6 py-2 border-2 border-black dark:border-white font-black uppercase text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">Qayta urinish</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 text-black dark:text-white transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="bg-yellow-400 border-4 border-black px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block text-black">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic font-sans">Kurslar</h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 font-bold text-sm tracking-wide uppercase mt-1">Barcha mavjud yo'nalishlar boshqaruvi</p>
        </div>
        
        <button className="flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black border-4 border-black dark:border-white font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-1 transition-all hover:bg-yellow-400 hover:text-black dark:hover:bg-yellow-400">
          <FiPlus size={22} strokeWidth={3} /> Kurs Qo'shish
        </button>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <div 
              key={course._id} 
              className="bg-white dark:bg-zinc-900 border-[4px] border-black dark:border-white p-6 flex flex-col justify-between space-y-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all group"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-none group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                      {renderSafeValue(course.title || course.name, "Backend")}
                    </h2>
                    <p className="text-slate-400 dark:text-zinc-500 font-black text-[10px] italic uppercase tracking-[3px]">
                      {renderSafeValue(course.category, "Dasturlash")}
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-zinc-800 border-2 border-black dark:border-white px-3 py-1.5 font-black text-xs whitespace-nowrap shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_white]">
                    {course.price?.toLocaleString() || "0"} UZS
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6 border-y-4 border-black dark:border-white border-dashed py-6">
                  <div className="flex items-center gap-3 text-black dark:text-zinc-300 font-black text-[10px] uppercase tracking-widest">
                    <FiClock className="text-slate-400 dark:text-zinc-500" size={20} />
                    <span>{renderSafeValue(course.duration, "8 oy")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-black dark:text-zinc-300 font-black text-[10px] uppercase tracking-widest">
                    <FiUsers className="text-slate-400 dark:text-zinc-500" size={20} />
                    <span>{course.students_count || 0} Talabalar</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-zinc-800 border-2 border-black dark:border-white text-black dark:text-white font-black uppercase text-[10px] tracking-wider hover:bg-slate-100 dark:hover:bg-zinc-700 active:translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_white]">
                  <FiEdit3 size={14} /> Tahrirlash
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white border-2 border-black dark:border-white font-black uppercase text-[10px] tracking-wider hover:bg-red-700 active:translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_white]">
                  <FiTrash2 size={14} /> O'chirish
                </button>

                <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white border-2 border-black dark:border-white font-black uppercase text-[10px] tracking-wider hover:bg-blue-800 active:translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_white]">
                  <FaSnowflake size={14} /> Muzlatish
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border-4 border-black dark:border-white border-dashed bg-white dark:bg-zinc-950 transition-colors">
          <FiAlertCircle size={64} className="mx-auto text-slate-200 dark:text-zinc-800 mb-4" />
          <p className="text-slate-400 dark:text-zinc-600 font-black uppercase tracking-[5px] italic">Hozircha kurslar mavjud emas</p>
        </div>
      )}
    </div>
  );
};

export default Courses;