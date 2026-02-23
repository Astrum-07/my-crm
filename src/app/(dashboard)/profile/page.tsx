"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Calendar, 
  Camera, 
  Check, 
  Loader2, 
  ShieldCheck,
  Fingerprint,
  Lock
} from 'lucide-react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get('token');

  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setFormData({
        first_name: parsedUser?.first_name || '',
        last_name: parsedUser?.last_name || '',
        email: parsedUser?.email || ''
      });
    }
  }, []);

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append('image', file);
      const response = await axios.post(`${baseUrl}/api/auth/edit-profile-img`, fd, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onSuccess: (res) => {
      const updatedUser = res?.user || res?.data || res;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("RASM YANGILANDI", {
        style: { border: '4px solid black', borderRadius: '0', fontWeight: '900' }
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "XATOLIK");
    }
  });

  const updateInfoMutation = useMutation({
    mutationFn: async (newData: typeof formData) => {
      const response = await axios.post(`${baseUrl}/api/auth/edit-profile`, newData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    },
    onSuccess: (res) => {
      const updatedUser = res?.user || res?.data || res;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("MA'LUMOTLAR YANGILANDI", {
        style: { border: '4px solid black', borderRadius: '0', fontWeight: '900' }
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "XATOLIK");
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file);
    }
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateInfoMutation.mutate(formData);
  };

  if (!isMounted) return null;
  if (!user) return <div className="p-20 text-center font-black uppercase">YUKLANMOQDA...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 text-black font-sans">
      <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-black text-white p-3 border-l-4 border-b-4 border-black">
          <Fingerprint size={24} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 border-[4px] border-black bg-yellow-400 overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
              {uploadImageMutation.isPending && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-white" size={32} />
                </div>
              )}
              {user?.image ? (
                <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-yellow-400">
                  <User size={64} strokeWidth={3} />
                </div>
              )}
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-all active:translate-x-1"
            >
              <Camera size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-xl font-bold text-slate-500 mt-2 flex items-center justify-center md:justify-start gap-2">
                <Mail size={18} /> {user?.email}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="bg-red-500 text-white px-6 py-1 border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {user?.role || 'manager'}
              </span>
              <span className="bg-green-400 text-black px-6 py-1 border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                <ShieldCheck size={14} /> TIZIMDA FAOL
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-[4px] border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-10 border-b-4 border-black pb-4">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">PROFILNI TAHRIRLASH</h2>
        </div>

        <form onSubmit={handleInfoSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">ISM</label>
              <input 
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className="w-full p-4 border-2 border-black font-bold text-lg focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all outline-none bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">FAMILIYA</label>
              <input 
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className="w-full p-4 border-2 border-black font-bold text-lg focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all outline-none bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">EMAIL MANZILI</label>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-4 border-2 border-black font-bold text-lg focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all outline-none bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">LAVOZIM</label>
              <div className="w-full p-4 border-2 border-black bg-slate-100 text-slate-400 font-black text-lg uppercase italic cursor-not-allowed">
                {user?.role}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-6 pt-10">
            <button 
              type="button"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white border-4 border-black font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <Lock size={20} /> PAROLNI O'ZGARTIRISH
            </button>
            
            <button 
              type="submit"
              disabled={updateInfoMutation.isPending}
              className="flex items-center justify-center gap-3 px-12 py-4 bg-black text-white border-4 border-black font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(59,130,246,0.5)] hover:bg-blue-600 transition-all disabled:opacity-50"
            >
              {updateInfoMutation.isPending ? <Loader2 className="animate-spin" /> : <Check size={20} />}
              O'ZGARISHLARNI SAQLASH
            </button>
          </div>
        </form>
      </div>

      <div className="p-6 bg-yellow-100 border-[4px] border-black flex items-start gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <Calendar size={24} className="mt-1" />
        <div>
          <p className="font-black uppercase text-xs italic tracking-widest">HISOB MA'LUMOTI</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 tracking-widest leading-none">
            OXIRGI YANGILANISH: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;