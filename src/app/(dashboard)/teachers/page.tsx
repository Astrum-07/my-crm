"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { 
  FiSearch, FiUserPlus, FiMoreHorizontal, FiLoader, 
  FiAlertCircle, FiMail, FiCheckCircle, 
  FiXCircle, FiX, FiCheck, FiPhone, FiLock, FiBookOpen
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Teacher {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  field: string;
  status: string;
}

const Teachers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = Cookies.get('token');

  useEffect(() => { setIsMounted(true); }, []);

  const { data: teachers = [], isPending, isError, refetch } = useQuery<Teacher[]>({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/teacher/get-all-teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data?.data || [];
    },
    enabled: !!token
  });

  const filteredTeachers = teachers.filter((t) => 
    `${t.first_name} ${t.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-10 text-black dark:text-white font-sans transition-colors duration-300">
      <TeacherFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="bg-yellow-400 border-4 border-black px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">
              Ustozlar
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-[2px] mt-2 ml-1">Baza boshqaruvi</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <input 
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white font-bold text-sm focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_white] outline-none transition-all text-black dark:text-white"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white" size={18} />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white font-black uppercase text-xs shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_white] active:translate-y-1 transition-all hover:bg-yellow-400 dark:hover:bg-yellow-400 hover:text-black"
          >
            <FiUserPlus size={18} /> Qo'shish
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border-[4px] border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_white] transition-all">
        <div className="overflow-x-auto">
          {isPending ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <FiLoader className="text-5xl animate-spin text-black dark:text-white" />
              <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Yuklanmoqda...</p>
            </div>
          ) : isError ? (
             <div className="py-20 text-center flex flex-col items-center">
              <FiAlertCircle size={40} className="text-red-600 mb-2" />
              <p className="font-black uppercase text-black dark:text-white">Ma'lumot olishda xato</p>
              <button onClick={() => refetch()} className="mt-4 border-2 border-black dark:border-white px-4 py-1 font-bold text-xs uppercase">Qayta urinish</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black dark:bg-white text-white dark:text-black uppercase text-[11px] font-black tracking-widest">
                  <th className="py-5 px-6 border-r border-white/20 dark:border-black/10">Foydalanuvchi</th>
                  <th className="py-5 px-6 border-r border-white/20 dark:border-black/10 hidden md:table-cell">Yo'nalish / Email</th>
                  <th className="py-5 px-6 border-r border-white/20 dark:border-black/10 text-center">Holat</th>
                  <th className="py-5 px-6 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-black dark:divide-white font-bold">
                {filteredTeachers.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center uppercase text-slate-300 dark:text-zinc-600">Ma'lumot topilmadi</td></tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher._id} className="hover:bg-yellow-50 dark:hover:bg-zinc-800 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-4 uppercase font-black text-sm">
                          <div className="w-12 h-12 border-2 border-black dark:border-white bg-yellow-400 flex items-center justify-center text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                          </div>
                          <span className="text-black dark:text-white">{teacher.first_name} {teacher.last_name}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 hidden md:table-cell text-xs text-slate-500 dark:text-zinc-400">
                        <p className="text-black dark:text-white font-black uppercase text-[10px] mb-1 italic tracking-widest">{teacher.field || "O'qituvchi"}</p>
                        <p className="flex items-center gap-1"><FiMail size={12}/> {teacher.email}</p>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className={`px-3 py-1 border-2 border-black dark:border-white text-[10px] uppercase font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white] ${teacher.status === 'faol' ? 'bg-green-400 text-black' : 'bg-red-400 text-white'}`}>
                          {teacher.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <button className="p-3 border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white]">
                          <FiMoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const TeacherFormModal = ({ isOpen, onClose }: any) => {
  const queryClient = useQueryClient();
  const token = Cookies.get('token');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        course_id: data.course_id,
        email: data.email,
        phone: data.phone,
        password: data.password
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/teacher/create-teacher`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success("Ustoz qo'shildi!");
      reset();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border-[4px] border-black dark:border-white w-full max-w-lg p-8 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] dark:shadow-[20px_20px_0px_0px_white] relative animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 border-2 border-black dark:border-white hover:bg-black hover:text-white text-black dark:text-white transition-all">
          <FiX size={20} />
        </button>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter border-b-8 border-black dark:border-white inline-block mb-8 text-black dark:text-white">Yangi Ustoz</h2>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4 font-bold text-black dark:text-white text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400">Ism</label>
              <input {...register("first_name", { required: true })} className={`w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 outline-none focus:bg-yellow-50 dark:focus:bg-zinc-800 ${errors.first_name ? 'border-red-500' : ''}`} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400">Familiya</label>
              <input {...register("last_name", { required: true })} className={`w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 outline-none focus:bg-yellow-50 dark:focus:bg-zinc-800 ${errors.last_name ? 'border-red-500' : ''}`} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400">Email</label>
              <input type="email" {...register("email", { required: true })} className={`w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 outline-none focus:bg-yellow-50 dark:focus:bg-zinc-800 ${errors.email ? 'border-red-500' : ''}`} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400">Telefon</label>
              <input {...register("phone", { required: true })} className={`w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 outline-none focus:bg-yellow-50 dark:focus:bg-zinc-800 ${errors.phone ? 'border-red-500' : ''}`} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-400">Parol</label>
            <input type="password" {...register("password", { required: true, minLength: 8 })} className={`w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 outline-none focus:bg-yellow-50 dark:focus:bg-zinc-800 ${errors.password ? 'border-red-500' : ''}`} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-red-600 dark:text-red-400 font-black underline">Course ID</label>
            <input {...register("course_id", { required: true })} className={`w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 outline-none focus:bg-yellow-50 dark:focus:bg-zinc-800 text-[10px] ${errors.course_id ? 'border-red-500' : ''}`} />
          </div>
          <button type="submit" disabled={mutation.isPending} className="w-full bg-black dark:bg-white text-white dark:text-black border-[3px] border-black dark:border-white p-5 font-black uppercase text-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_white] active:translate-x-2 active:translate-y-2 flex justify-center items-center gap-3 disabled:opacity-50 hover:bg-yellow-400 dark:hover:bg-yellow-400">
            {mutation.isPending ? <FiLoader className="animate-spin" /> : <><FiCheck size={20} /> Saqlash</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Teachers;