"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import {
  FiSearch,
  FiPlus,
  FiLoader,
  FiAlertCircle,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiLayers,
  FiX,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface PaymentForm {
  student_id: string;
  group_id: string;
  payment_price: number;
  month: string;
  method: string;
  paidAt: string;
}

const Payments = () => {
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const token = Cookies.get("token");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: debtors = [], isPending: isDebtorsLoading } = useQuery({
    queryKey: ["debtors", selectedMonth],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/get-debtors-student`,
        {
          params: { month: selectedMonth },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data?.data || [];
    },
    enabled: !!token && !searchTerm,
  });

  const { data: searchResults = [], isPending: isSearching } = useQuery({
    queryKey: ["search-students", searchTerm],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/search-student`,
        {
          params: { name: searchTerm },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data?.data || [];
    },
    enabled: !!token && searchTerm.length > 2,
  });

  const displayData = searchTerm ? searchResults : debtors;

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-10 text-black font-sans">
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 text-black">
          <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
            To'lovlar
          </h1>
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest">
              Finans Nazorati
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <input
              type="text"
              placeholder="Qidiruv..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-[3px] border-black font-bold text-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all"
            />
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
              size={20}
            />
          </div>

          <div className="relative">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-12 pr-4 py-4 bg-white border-[3px] border-black font-bold uppercase text-xs text-black focus:bg-yellow-50 outline-none transition-all cursor-pointer"
            />
            <FiCalendar
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
              size={20}
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-yellow-400 text-black border-[3px] border-black font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <FiPlus size={22} strokeWidth={3} /> Qo'shish
          </button>
        </div>
      </div>

      <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          {isDebtorsLoading || isSearching ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <FiLoader className="text-6xl animate-spin text-black" />
              <p className="font-black uppercase tracking-[4px] text-xs text-slate-400">
                Ma'lumotlar yuklanmoqda...
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-black">
              <thead>
                <tr className="bg-black text-white uppercase text-[12px] font-black tracking-widest">
                  <th className="py-6 px-6 border-r border-white/20 w-16 text-center">
                    №
                  </th>
                  <th className="py-6 px-6 border-r border-white/20">Talaba</th>
                  <th className="py-6 px-6 border-r border-white/20">Guruh</th>
                  <th className="py-6 px-6 border-r border-white/20 text-center">
                    Summa
                  </th>
                  <th className="py-6 px-6 border-r border-white/20 text-center">
                    Holat
                  </th>
                  <th className="py-6 px-6 text-center">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y-[3px] divide-black bg-white">
                {displayData.length > 0 ? (
                  displayData.map((item: any, index: number) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="py-6 px-6 text-center font-black text-slate-300 border-r-[3px] border-black/10">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="py-6 px-6 border-r-[3px] border-black/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-500 border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <FiUser size={20} />
                          </div>
                          <span className="font-black text-sm uppercase">
                            {item.student_id?.first_name || item.first_name}{" "}
                            {item.student_id?.last_name || item.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6 border-r-[3px] border-black/10 font-bold text-xs uppercase text-slate-600">
                        <div className="flex items-center gap-2">
                          <FiLayers className="text-blue-600" />
                          {item.group_id?.name || "Noma'lum"}
                        </div>
                      </td>
                      <td className="py-6 px-6 text-center border-r-[3px] border-black/10">
                        <div className="inline-flex items-center gap-1 px-4 py-2 bg-yellow-100 border-2 border-black font-black text-sm text-black">
                          <FiDollarSign />
                          {item.payment_price?.toLocaleString() || "0"}
                        </div>
                      </td>
                      <td className="py-6 px-6 text-center border-r-[3px] border-black/10">
                        <span
                          className={`text-[10px] font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${item.paidAt ? "bg-green-400 text-black" : "bg-red-400 text-white"}`}
                        >
                          {item.paidAt ? "To'langan" : "Qarzdor"}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-center font-bold text-xs">
                        {item.paidAt
                          ? new Date(item.paidAt).toLocaleDateString()
                          : selectedMonth}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-32 text-center font-black uppercase tracking-[10px] text-slate-200 italic bg-slate-50"
                    >
                      Ro'yxat bo'sh
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const PaymentModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const token = Cookies.get("token");

  const { register, handleSubmit, reset } = useForm<PaymentForm>();

  const mutation = useMutation({
    mutationFn: async (data: PaymentForm) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/payment-student`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debtors"] });
      toast.success("To'lov qabul qilindi!");
      reset();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-[4px] border-black w-full max-w-xl p-10 shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] relative text-black">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 border-2 border-black hover:bg-black hover:text-white transition-all"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-4xl font-black uppercase italic tracking-tighter border-b-8 border-black inline-block mb-10">
          Yangi To'lov
        </h2>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-6 font-bold text-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 tracking-widest font-black">
                Student ID
              </label>
              <input
                {...register("student_id", { required: true })}
                className="w-full p-4 border-2 border-black focus:bg-yellow-50 outline-none text-black text-[12px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 tracking-widest font-black">
                Guruh ID
              </label>
              <input
                {...register("group_id", { required: true })}
                className="w-full p-4 border-2 border-black focus:bg-yellow-50 outline-none text-black text-[12px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 tracking-widest font-black">
                Summa
              </label>
              <input
                type="number"
                {...register("payment_price", { required: true })}
                className="w-full p-4 border-2 border-black focus:bg-yellow-50 outline-none text-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 tracking-widest font-black">
                Usul
              </label>
              <select
                {...register("method", { required: true })}
                className="w-full p-4 border-2 border-black bg-white outline-none appearance-none text-black"
              >
                <option value="naqd">Naqd Pul</option>
                <option value="karta">Plastik Karta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 tracking-widest font-black">
                Oy
              </label>
              <input
                type="month"
                {...register("month", { required: true })}
                className="w-full p-4 border-2 border-black focus:bg-yellow-50 outline-none text-black"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-400 tracking-widest font-black">
                Sana
              </label>
              <input
                type="date"
                {...register("paidAt", { required: true })}
                className="w-full p-4 border-2 border-black focus:bg-yellow-50 outline-none text-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-black text-white border-[4px] border-black p-6 font-black uppercase text-lg shadow-[12px_12px_0px_0px_rgba(34,197,94,0.4)] active:shadow-none active:translate-x-2 active:translate-y-2 flex justify-center items-center gap-4 transition-all disabled:opacity-50"
          >
            {mutation.isPending ? (
              <FiLoader className="animate-spin text-2xl" />
            ) : (
              <>
                <FiCheck size={28} strokeWidth={3} /> Saqlash
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payments;
