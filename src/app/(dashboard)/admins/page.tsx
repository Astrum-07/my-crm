"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { 
  FiSearch, FiUserPlus, FiMoreHorizontal, FiLoader, 
  FiAlertCircle, FiFilter, FiMail, FiCheckCircle, 
  FiXCircle, FiX, FiTrash2, FiRefreshCw, FiCheck, FiCalendar, FiLock, FiUser
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Admin {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  work_date?: string;
}

const Admins = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isMounted, setIsMounted] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const token = Cookies.get('token');

  useEffect(() => { setIsMounted(true); }, []);

  const { data: admins = [], isPending, isError, refetch } = useQuery<Admin[]>({
    queryKey: ['admins', filterStatus, searchTerm],
    queryFn: async () => {
      const params: any = {};
      if (filterStatus !== "All") params.status = filterStatus;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/staff/all-admins`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data?.data || [];
    },
    enabled: !!token
  });

  const createMutation = useMutation({
    mutationFn: async (newData: any) => {
      const payload = { ...newData, role: "admin", status: "faol", active: true, is_deleted: false };
      return await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/staff/create-admin`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success("Admin yaratildi");
      setIsAddModalOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Xatolik")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/staff/deleted-admin`, {
        data: { _id: id },
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success("O'chirildi");
      setActiveMenuId(null);
    }
  });

  const filteredAdmins = admins.filter(admin => {
    const fullName = `${admin.first_name} ${admin.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || admin.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-10 font-sans transition-colors duration-300">
      {isAddModalOpen && (
        <AdminFormModal onClose={() => setIsAddModalOpen(false)} onSubmit={(data: any) => createMutation.mutate(data)} isLoading={createMutation.isPending} />
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          {/* Adminlar so'zi har doim qora va sariq fonda bo'ladi (dark modeda ham) */}
          <div className="bg-yellow-400 border-4 border-black px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-black">
              Adminlar
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-[2px] mt-2 ml-1">Tizim Boshqaruvi</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-[260px]">
            <input 
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white font-bold text-sm text-black dark:text-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_white] outline-none transition-all"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black dark:text-white" size={20} />
          </div>

          <div className="relative">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white dark:bg-zinc-900 border-4 border-black dark:border-white pl-4 pr-12 py-4 font-black uppercase text-xs text-black dark:text-white tracking-widest focus:outline-none cursor-pointer"
            >
              <option value="All">Barchasi</option>
              <option value="faol">Faol</option>
              <option value="ishdan bo'shatilgan">Bo'shatilgan</option>
            </select>
            <FiFilter className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black dark:text-white" />
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black border-4 border-black dark:border-white font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_white] active:translate-y-1 hover:bg-yellow-400 hover:text-black transition-all"
          >
            <FiUserPlus size={20} strokeWidth={3} /> Qo'shish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isPending ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <FiLoader className="text-6xl animate-spin text-black dark:text-white" />
            <p className="font-black uppercase tracking-widest text-black dark:text-white">Yuklanmoqda...</p>
          </div>
        ) : filteredAdmins.map((admin) => (
          <div 
            key={admin._id} 
            className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white p-5 flex flex-col md:flex-row items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_white] hover:translate-x-[-2px] transition-all text-black dark:text-white"
          >
            <div className="flex items-center gap-6 w-full md:w-1/3">
              <div className="w-14 h-14 bg-yellow-400 border-2 border-black flex items-center justify-center font-black text-xl text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {admin.first_name?.[0]}{admin.last_name?.[0]}
              </div>
              <div>
                <h3 className="font-black uppercase text-lg leading-none">{admin.first_name} {admin.last_name}</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">ID: {admin._id.slice(-8)}</p>
              </div>
            </div>

            <div className="w-full md:w-1/3 flex items-center justify-center md:justify-start gap-2 py-4 md:py-0">
              <FiMail className="text-slate-400" />
              <span className="font-bold text-sm italic">{admin.email}</span>
            </div>

            <div className="flex items-center justify-between w-full md:w-1/3 md:justify-end gap-8">
              <div className="flex items-center gap-2">
                {admin.status === 'faol' ? <FiCheckCircle className="text-green-500" size={20} /> : <FiXCircle className="text-red-500" size={20} />}
                <span className="font-black uppercase text-xs tracking-widest">{admin.status}</span>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setActiveMenuId(activeMenuId === admin._id ? null : admin._id)}
                  className="p-3 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  <FiMoreHorizontal size={20} strokeWidth={3} />
                </button>

                {activeMenuId === admin._id && (
                  <div className="absolute right-0 top-14 z-50 bg-white dark:bg-zinc-900 border-4 border-black dark:border-white w-48 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_white]">
                    <button 
                      onClick={() => { if(window.confirm("O'chirilsinmi?")) deleteMutation.mutate(admin._id); }}
                      className="w-full flex items-center gap-3 px-4 py-4 text-red-600 font-black uppercase text-xs hover:bg-red-50 dark:hover:bg-red-900/30 border-b-2 border-black dark:border-white"
                    >
                      <FiTrash2 /> O'chirish
                    </button>
                    <button onClick={() => setActiveMenuId(null)} className="w-full flex items-center gap-3 px-4 py-4 text-black dark:text-white font-black uppercase text-xs hover:bg-slate-100 dark:hover:bg-zinc-800">
                      <FiX /> Yopish
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminFormModal = ({ onClose, onSubmit, isLoading }: any) => {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", work_date: new Date().toISOString().split('T')[0] });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white dark:bg-zinc-950 border-[4px] border-black dark:border-white w-full max-w-lg p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] dark:shadow-[20px_20px_0px_0px_white] relative text-black dark:text-white">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 border-2 border-black dark:border-white text-black dark:text-white"><FiX size={24} /></button>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter border-b-8 border-black dark:border-white inline-block mb-10">Yangi Admin</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Ism" onChange={e => setForm({...form, first_name: e.target.value})} className="w-full p-4 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 text-black dark:text-white font-bold outline-none" required />
            <input placeholder="Familiya" onChange={e => setForm({...form, last_name: e.target.value})} className="w-full p-4 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 text-black dark:text-white font-bold outline-none" required />
          </div>
          <input type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} className="w-full p-4 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 text-black dark:text-white font-bold outline-none" required />
          <input type="password" placeholder="Parol" onChange={e => setForm({...form, password: e.target.value})} className="w-full p-4 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 text-black dark:text-white font-bold outline-none" required />
          <input type="date" value={form.work_date} onChange={e => setForm({...form, work_date: e.target.value})} className="w-full p-4 border-2 border-black dark:border-white bg-white dark:bg-zinc-900 text-black dark:text-white font-bold outline-none" required />
          <button type="submit" disabled={isLoading} className="w-full bg-black dark:bg-white text-white dark:text-black border-[4px] border-black dark:border-white p-6 font-black uppercase text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-2 active:translate-y-2 flex justify-center items-center gap-3">
            {isLoading ? <FiLoader className="animate-spin" /> : "Tizimga Qo'shish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admins;