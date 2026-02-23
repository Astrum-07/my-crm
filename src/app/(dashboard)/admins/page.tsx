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
  active: boolean;
  is_deleted: boolean;
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
      const payload = {
        ...newData,
        role: "admin",
        status: "faol",
        active: true,
        is_deleted: false
      };
      return await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/staff/create-admin`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success("Admin muvaffaqiyatli yaratildi");
      setIsAddModalOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Xatolik yuz berdi";
      toast.error(msg);
    }
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
      toast.success("Admin o'chirildi");
      setActiveMenuId(null);
    }
  });

  const returnWorkMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/staff/return-work-staff`, { _id: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success("Xodim ishga qaytarildi");
      setActiveMenuId(null);
    }
  });

  const filteredAdmins = admins.filter(admin => {
    const fullName = `${admin.first_name} ${admin.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || admin.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-10 text-black font-sans">
      {isAddModalOpen && (
        <AdminFormModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={(data: any) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Adminlar</h1>
          <p className="text-slate-400 font-bold text-sm uppercase">Boshqaruv tizimi</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group flex-1 min-w-[250px]">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black font-bold text-sm focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
          </div>

          <div className="relative">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border-2 border-black pl-4 pr-10 py-3 font-black uppercase text-[10px] tracking-widest focus:outline-none cursor-pointer"
            >
              <option value="All">Barchasi</option>
              <option value="faol">Faol</option>
              <option value="ishdan bo'shatilgan">Bo'shatilgan</option>
            </select>
            <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-black text-white border-2 border-black font-black uppercase text-xs shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all hover:bg-white hover:text-black"
          >
            <FiUserPlus size={18} /> Qo'shish
          </button>
        </div>
      </div>

      <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-visible">
        <div className="overflow-x-auto">
          {isPending ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <FiLoader className="text-5xl animate-spin" />
              <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Yuklanmoqda...</p>
            </div>
          ) : isError ? (
            <div className="py-20 text-center flex flex-col items-center">
              <FiAlertCircle size={40} className="text-red-600 mb-2" />
              <p className="font-black uppercase">Ma'lumot olishda xato</p>
              <button onClick={() => refetch()} className="mt-4 border-2 border-black px-4 py-1 font-bold text-xs uppercase">Qayta urinish</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white uppercase text-[11px] font-black tracking-widest">
                  <th className="py-5 px-6 border-r border-white/20 text-black bg-slate-200">Foydalanuvchi</th>
                  <th className="py-5 px-6 border-r border-white/20 hidden md:table-cell text-black bg-slate-100">Email</th>
                  <th className="py-5 px-6 border-r border-white/20 text-center text-black bg-slate-200">Holat</th>
                  <th className="py-5 px-6 text-center text-black bg-slate-100">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-black">
                {filteredAdmins.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center font-bold text-slate-400 uppercase">Ma'lumot topilmadi</td></tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-yellow-50 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 border-2 border-black bg-yellow-400 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black font-black uppercase text-lg">
                            {admin.first_name?.[0]}{admin.last_name?.[0]}
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase leading-none">{admin.first_name} {admin.last_name}</p>
                            <p className="text-slate-400 text-[9px] font-bold mt-1 uppercase tracking-tighter">ID: {admin._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 hidden md:table-cell font-bold text-xs italic text-slate-600">
                        {admin.email}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2 font-black text-[10px] uppercase">
                          {admin.status === 'faol' ? <FiCheckCircle className="text-green-600" size={18} /> : <FiXCircle className="text-red-600" size={18} />}
                          <span className={admin.status !== 'faol' ? 'text-red-600' : 'text-black'}>{admin.status}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === admin._id ? null : admin._id)}
                          className="p-3 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <FiMoreHorizontal size={20} />
                        </button>
                        {activeMenuId === admin._id && (
                          <div className="absolute right-6 top-16 z-50 bg-white border-4 border-black w-48 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-2">
                            {admin.status === "ishdan bo'shatilgan" ? (
                              <button 
                                onClick={() => returnWorkMutation.mutate(admin._id)}
                                disabled={returnWorkMutation.isPending}
                                className="w-full flex items-center gap-3 px-4 py-3 text-green-600 font-black uppercase text-[10px] hover:bg-green-50 border-b-2 border-black"
                              >
                                <FiRefreshCw /> {returnWorkMutation.isPending ? "..." : "Ishga qaytarish"}
                              </button>
                            ) : (
                              <button 
                                onClick={() => { if(window.confirm("Admin o'chirilsinmi?")) deleteMutation.mutate(admin._id); }}
                                disabled={deleteMutation.isPending}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-black uppercase text-[10px] hover:bg-red-50 border-b-2 border-black"
                              >
                                <FiTrash2 /> {deleteMutation.isPending ? "..." : "O'chirish"}
                              </button>
                            )}
                            <button onClick={() => setActiveMenuId(null)} className="w-full flex items-center gap-3 px-4 py-3 font-black uppercase text-[10px] hover:bg-slate-100">
                              <FiX /> Yopish
                            </button>
                          </div>
                        )}
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

const AdminFormModal = ({ onClose, onSubmit, isLoading }: any) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    work_date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white border-[4px] border-black w-full max-w-lg p-8 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 border-2 border-black hover:bg-black hover:text-white transition-all"><FiX size={20} /></button>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter border-b-8 border-black inline-block mb-8">Yangi Admin</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5 font-bold">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-400">Ism</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="first_name" value={form.first_name} onChange={handleChange} className="w-full pl-10 p-3 border-2 border-black outline-none focus:bg-yellow-50 text-black" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-400">Familiya</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} className="w-full p-3 border-2 border-black outline-none focus:bg-yellow-50 text-black" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-400">Email Manzil</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full pl-10 p-3 border-2 border-black outline-none focus:bg-yellow-50 text-black" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-400">Maxfiy Parol</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full pl-10 p-3 border-2 border-black outline-none focus:bg-yellow-50 text-black" required minLength={8} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-400">Ish boshlagan sana</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="work_date" type="date" value={form.work_date} onChange={handleChange} className="w-full pl-10 p-3 border-2 border-black outline-none focus:bg-yellow-50 text-black uppercase text-xs" required />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-black text-white border-[3px] border-black p-5 font-black uppercase text-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 flex justify-center items-center gap-3 disabled:opacity-50">
            {isLoading ? <FiLoader className="animate-spin" /> : <><FiCheck size={20} /> Saqlash va Yaratish</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admins;