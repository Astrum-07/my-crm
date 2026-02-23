"use client";

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { FiTrash2, FiRefreshCw, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

export const ManagerTable = ({ data }: { data: any[] }) => {
  const queryClient = useQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get('token');

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await axios.delete(`${baseUrl}/api/staff/deleted-admin`, {
        data: { _id: userId },
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      toast.success("O'chirildi!");
    }
  });

  const returnMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await axios.post(`${baseUrl}/api/staff/return-work-staff`, { _id: userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      toast.success("Ishga qaytarildi!");
    }
  });

  return (
    <div className="overflow-x-auto text-black font-mono">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-black text-white uppercase text-[11px] font-black tracking-widest">
            <th className="py-5 px-6 border-r border-white/20">Foydalanuvchi</th>
            <th className="py-5 px-6 border-r border-white/20">Email</th>
            <th className="py-5 px-6 border-r border-white/20 text-center">Holat</th>
            <th className="py-5 px-6 text-center">Amallar</th>
          </tr>
        </thead>
        <tbody className="divide-y-4 divide-black">
          {data.length === 0 ? (
            <tr><td colSpan={4} className="py-20 text-center font-black uppercase text-slate-300 italic">Ma'lumot mavjud emas</td></tr>
          ) : (
            data.map((user) => (
              <tr key={user._id} className="hover:bg-yellow-50 transition-colors">
                <td className="py-5 px-6 font-black uppercase text-sm">{user.first_name} {user.last_name}</td>
                <td className="py-5 px-6 font-bold text-xs italic text-slate-500">{user.email}</td>
                <td className="py-5 px-6">
                  <div className="flex items-center justify-center gap-2">
                    {user.status === 'faol' ? <FiCheckCircle className="text-green-600" /> : <FiXCircle className="text-red-600" />}
                    <span className="text-[10px] font-black uppercase">{user.status}</span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex justify-center gap-2">
                    {user.status === "ishdan bo'shatilgan" ? (
                      <button onClick={() => returnMutation.mutate(user._id)} className="p-2 border-2 border-black bg-green-400 hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"><FiRefreshCw /></button>
                    ) : (
                      <button onClick={() => deleteMutation.mutate(user._id)} className="p-2 border-2 border-black bg-red-400 hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"><FiTrash2 /></button>
                    )}
                    <button className="p-2 border-2 border-black bg-blue-400 hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"><FiInfo /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};