"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { 
  FiUserPlus, 
  FiMail, 
  FiMoreVertical, 
  FiLoader, 
  FiAlertCircle,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiX,
  FiLock
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Manager {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
}

const Managers = () => {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const [statusParam, setStatusParam] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'manager'
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get('token');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: managers = [], isPending, isError, refetch } = useQuery<Manager[]>({
    queryKey: ['managers', statusParam, searchValue],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusParam !== "all") params.append("status", statusParam);
      if (searchValue.trim()) params.append("search", searchValue.trim());

      const res = await axios.get(`${baseUrl}/api/staff/all-managers?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data?.data || [];
    },
    enabled: !!token,
  });

  const createManagerMutation = useMutation({
    mutationFn: async (newData: typeof formData) => {
      const res = await axios.post(`${baseUrl}/api/auth/sign-up`, newData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      setIsModalOpen(false);
      setFormData({ first_name: '', last_name: '', email: '', password: '', role: 'manager' });
      toast.success("Manager yaratildi");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik");
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createManagerMutation.mutate(formData);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-10 text-black dark:text-white transition-colors duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="bg-yellow-400 border-4 border-black px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black">
              Managerlar
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 font-bold text-sm uppercase tracking-[2px] mt-2">
            Tizim xodimlar ro'yxati
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Qidirish..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white font-bold text-sm focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_white] outline-none transition-all w-64 text-black dark:text-white"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white" size={18} />
          </div>

          <div className="relative">
            <select 
              value={statusParam}
              onChange={(e) => setStatusParam(e.target.value)}
              className="appearance-none pl-10 pr-8 py-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white font-black uppercase text-[10px] tracking-widest focus:outline-none cursor-pointer text-black dark:text-white"
            >
              <option value="all">Barchasi</option>
              <option value="faol">Faol</option>
              <option value="ishdan bo'shatilgan">Bo'shatilgan</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white" size={16} />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white font-black uppercase text-xs tracking-[2px] hover:bg-yellow-400 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_white] active:translate-y-1 active:shadow-none"
          >
            <FiUserPlus size={20} /> Qo'shish
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border-[4px] border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_white] overflow-hidden min-h-[400px] relative">
        <div className="overflow-x-auto">
          {isPending ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm z-10">
              <FiLoader className="text-6xl animate-spin text-black dark:text-white" />
              <p className="font-black uppercase tracking-[5px] text-xs text-black dark:text-white">Yuklanmoqda...</p>
            </div>
          ) : isError ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <FiAlertCircle size={48} className="text-red-600 mb-4" />
              <p className="font-black uppercase text-black dark:text-white">Ma'lumotlarni yuklashda xato</p>
              <button onClick={() => refetch()} className="mt-4 px-6 py-2 border-2 border-black dark:border-white font-black uppercase text-xs">Qayta urinish</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black dark:bg-white text-white dark:text-black uppercase text-[11px] tracking-[2px] font-black">
                  <th className="py-5 px-6 border-r border-white/20 dark:border-black/10">Foydalanuvchi</th>
                  <th className="py-5 px-6 border-r border-white/20 dark:border-black/10 hidden md:table-cell">Email</th>
                  <th className="py-5 px-6 border-r border-white/20 dark:border-black/10 text-center">Rol</th>
                  <th className="py-5 px-6 border-r border-white/20 dark:border-black/10 text-center">Holat</th>
                  <th className="py-5 px-6 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-black dark:divide-white">
                {managers.length > 0 ? (
                  managers.map((manager) => (
                    <tr key={manager._id} className="hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 border-2 border-black dark:border-white bg-yellow-400 flex items-center justify-center text-black font-black text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:bg-black group-hover:text-white transition-all uppercase">
                            {manager.first_name?.[0]}{manager.last_name?.[0]}
                          </div>
                          <div>
                            <p className="text-black dark:text-white font-black uppercase text-sm tracking-tight leading-none">
                              {manager.first_name} {manager.last_name}
                            </p>
                            <p className="text-slate-400 text-[9px] font-bold mt-1 uppercase tracking-tighter italic">
                              ID: {manager._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 hidden md:table-cell font-bold text-xs italic text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <FiMail className="text-black dark:text-white" /> {manager.email}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center uppercase">
                        <span className="inline-block bg-white dark:bg-zinc-800 border-2 border-black dark:border-white px-3 py-1 font-black text-[9px] tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_white]">
                          {manager.role}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center uppercase">
                        <div className="flex items-center justify-center space-x-2">
                          {manager.status === 'faol' ? (
                            <FiCheckCircle className="text-green-600" size={18} />
                          ) : (
                            <FiXCircle className="text-red-600" size={18} />
                          )}
                          <span className={`font-black text-[10px] tracking-widest ${manager.status === 'faol' ? 'text-black dark:text-white' : 'text-red-600'}`}>
                            {manager.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <button className="p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-90 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_white]">
                          <FiMoreVertical />
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border-[4px] border-black dark:border-white w-full max-w-lg p-8 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] dark:shadow-[20px_20px_0px_0px_white] relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] active:translate-x-1 active:translate-y-1"
            >
              <FiX size={20} strokeWidth={3} />
            </button>
            
            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter border-b-8 border-black dark:border-white inline-block text-black dark:text-white">Yangi Manager</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mt-2">Xodimlar bazasiga qo'shish</p>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Ism</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="first_name" type="text" value={formData.first_name} onChange={handleInputChange} className="w-full pl-10 p-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white text-black dark:text-white font-bold focus:bg-yellow-50 dark:focus:bg-zinc-800 outline-none transition-all" required />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Familiya</label>
                  <input name="last_name" type="text" value={formData.last_name} onChange={handleInputChange} className="w-full p-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white text-black dark:text-white font-bold focus:bg-yellow-50 dark:focus:bg-zinc-800 outline-none transition-all" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Email Manzil</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full pl-10 p-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white text-black dark:text-white font-bold focus:bg-yellow-50 dark:focus:bg-zinc-800 outline-none transition-all" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Maxfiy Parol</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="password" type="password" value={formData.password} onChange={handleInputChange} className="w-full pl-10 p-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white text-black dark:text-white font-bold focus:bg-yellow-50 dark:focus:bg-zinc-800 outline-none transition-all" required />
                </div>
              </div>
              
              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={createManagerMutation.isPending}
                  className="w-full bg-black dark:bg-white text-white dark:text-black border-[3px] border-black dark:border-white p-5 font-black uppercase text-sm tracking-[4px] hover:bg-yellow-400 dark:hover:bg-yellow-400 hover:text-black transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_white] active:translate-x-2 active:translate-y-2 disabled:opacity-50 flex justify-center items-center gap-3"
                >
                  {createManagerMutation.isPending ? <FiLoader className="animate-spin" /> : "Saqlash va Yaratish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Managers;