"use client";

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { FiMoreVertical, FiTrash2, FiRefreshCw, FiInfo, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ManagerTable = ({ data }: { data: any[] }) => {
  const queryClient = useQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get('token');

  // MUTATION: O'chirish
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

  // MUTATION: Ishga qaytarish
  const returnToWorkMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await axios.post(`${baseUrl}/api/staff/return-work-staff`, 
        { _id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      toast.success("Ishga qaytarildi!");
    }
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-black text-white uppercase text-[11px] font-black tracking-widest">
            <th className="py-5 px-6 border-r border-white/20">Foydalanuvchi</th>
            <th className="py-5 px-6 border-r border-white/20">Email</th>
            <th className="py-5 px-6 border-r border-white/20">Rol</th>
            <th className="py-5 px-6 border-r border-white/20 text-center">Holat</th>
            <th className="py-5 px-6 text-center">Amallar</th>
          </tr>
        </thead>
        <tbody className="divide-y-4 divide-black">
          {data.length === 0 ? (
            <tr><td colSpan={5} className="py-10 text-center font-bold">Ma'lumot yo'q</td></tr>
          ) : (
            data.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                <td className="py-5 px-6 font-black uppercase text-sm">
                  {user.first_name} {user.last_name}
                </td>
                <td className="py-5 px-6 font-bold text-xs italic text-slate-500">{user.email}</td>
                <td className="py-5 px-6">
                  <span className="bg-white border-2 border-black px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {user.role}
                  </span>
                </td>
                <td className="py-5 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {user.status === 'faol' ? <FiCheckCircle className="text-green-600"/> : <FiXCircle className="text-red-600"/>}
                    <span className="text-[10px] font-black uppercase">{user.status}</span>
                  </div>
                </td>
                <td className="py-5 px-6 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                      <FiMoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase text-xs">
                      {user.status === "ishdan bo'shatilgan" ? (
                        <DropdownMenuItem onClick={() => returnToWorkMutation.mutate(user._id)}>
                          <FiRefreshCw className="mr-2"/> Ishga qaytarish
                        </DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => deleteMutation.mutate(user._id)} className="text-red-600">
                            <FiTrash2 className="mr-2"/> O'chirish
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem><FiInfo className="mr-2"/> Info</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};