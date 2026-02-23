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
    `${t.first_name} ${t.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-10 text-black font-sans">
      <TeacherFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Ustozlar</h1>
          <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 mt-2">Baza boshqaruvi</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <input 
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black font-bold text-sm focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-black text-white border-2 border-black font-black uppercase text-xs shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all hover:bg-white hover:text-black"
          >
            <FiUserPlus size={18} /> Qo'shish
          </button>
        </div>
      </div>

      <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          {isPending ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <FiLoader className="text-5xl animate-spin" />
              <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Yuklanmoqda...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white uppercase text-[11px] font-black tracking-widest">
                  <th className="py-5 px-6 border-r border-white/20">Foydalanuvchi</th>
                  <th className="py-5 px-6 border-r border-white/20 hidden md:table-cell">Yo'nalish / Email</th>
                  <th className="py-5 px-6 border-r border-white/20 text-center">Holat</th>
                  <th className="py-5 px-6 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-black font-bold">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-yellow-50 transition-colors">
                    <td className="py-5 px-6 uppercase text-sm">
                      {teacher.first_name} {teacher.last_name}
                    </td>
                    <td className="py-5 px-6 hidden md:table-cell text-xs text-slate-500">
                      <p className="text-black font-black uppercase text-[10px] mb-1">{teacher.field}</p>
                      <p>{teacher.email}</p>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className={`px-3 py-1 border-2 border-black text-[10px] uppercase font-black ${teacher.status === 'faol' ? 'bg-green-400' : 'bg-red-400'}`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <button className="p-3 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <FiMoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
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
        ...data,
        // Backendga aynan siz bergan curl dagi formatda boradi
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/teacher/create-teacher`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
      const msg = err.response?.data?.message || "Ma'lumotlar xato (400)";
      toast.error(msg);
      console.log("Xato tafsiloti:", err.response?.data);
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white border-[4px] border-black w-full max-w-lg p-8 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 border-2 border-black hover:bg-black hover:text-white transition-all text-black"><FiX size={20} /></button>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter border-b-8 border-black inline-block mb-8 text-black">Yangi Ustoz</h2>
        
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4 font-bold text-black text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400">Ism</label>
              <input 
                {...register("first_name", { required: "Ism shart" })} 
                className={`w-full p-3 border-2 border-black outline-none focus:bg-yellow-50 ${errors.first_name ? 'border-red-500 bg-red-50' : ''}`}
                placeholder="Davron01"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400">Familiya</label>
              <input 
                {...register("last_name", { required: "Familiya shart" })} 
                className={`w-full p-3 border-2 border-black outline-none focus:bg-yellow-50 ${errors.last_name ? 'border-red-500 bg-red-50' : ''}`}
                placeholder="Raimjonov"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400">Email</label>
              <input 
                type="email" 
                {...register("email", { required: "Email shart" })} 
                className={`w-full p-3 border-2 border-black outline-none focus:bg-yellow-50 ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
                placeholder="raimjonov05@mail.ru"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400">Telefon</label>
              <input 
                {...register("phone", { required: "Telefon shart" })} 
                className={`w-full p-3 border-2 border-black outline-none focus:bg-yellow-50 ${errors.phone ? 'border-red-500 bg-red-50' : ''}`}
                placeholder="+998770444444"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-400">Yo'nalish (Field)</label>
            <input 
              {...register("field", { required: "Yo'nalish shart" })} 
              className={`w-full p-3 border-2 border-black outline-none focus:bg-yellow-50 ${errors.field ? 'border-red-500 bg-red-50' : ''}`}
              placeholder="Backend dasturlash"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-400">Parol</label>
            <input 
              type="password" 
              {...register("password", { required: "Parol shart", minLength: 8 })} 
              className={`w-full p-3 border-2 border-black outline-none focus:bg-yellow-50 ${errors.password ? 'border-red-500 bg-red-50' : ''}`}
              placeholder="12345678"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-400 font-black text-red-600 underline">Course ID (Juda muhim)</label>
            <input 
              {...register("course_id", { required: "Course ID shart" })} 
              className={`w-full p-3 border-2 border-black outline-none focus:bg-yellow-50 text-[10px] ${errors.course_id ? 'border-red-500 bg-red-50' : ''}`}
              placeholder="681dcb7444fa70421ae9fb9d"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full bg-black text-white border-[3px] border-black p-5 font-black uppercase text-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 flex justify-center items-center gap-3 disabled:opacity-50"
          >
            {mutation.isPending ? <FiLoader className="animate-spin" /> : <><FiCheck size={20} /> Saqlash va Yaratish</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Teachers;