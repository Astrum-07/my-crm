"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiMoreHorizontal, 
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiLayers,
  FiPieChart,
  FiTrendingUp,
  FiCreditCard
} from 'react-icons/fi';

interface Payment {
  _id: string;
  student_id: { first_name: string; last_name: string };
  group_id: { name: string };
  payment_price: number;
  month: string;
  method: string;
  paidAt: string;
}

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const localData = localStorage.getItem('local_payments');
    
    if (localData) {
      setPayments(JSON.parse(localData));
    } else {
      const dummyPayments: Payment[] = [
        {
          _id: "1",
          student_id: { first_name: "Olimbek", last_name: "Olimov" },
          group_id: { name: "Backend Node.js" },
          payment_price: 1400000,
          month: "2025-05",
          method: "naqd",
          paidAt: "2025-05-12"
        },
        {
          _id: "2",
          student_id: { first_name: "Davron", last_name: "Raimjonov" },
          group_id: { name: "Frontend React" },
          payment_price: 1200000,
          month: "2025-05",
          method: "karta",
          paidAt: "2025-05-15"
        },
        {
          _id: "3",
          student_id: { first_name: "Aziz", last_name: "Karimov" },
          group_id: { name: "Ingliz tili" },
          payment_price: 800000,
          month: "2025-06",
          method: "naqd",
          paidAt: "2025-06-01"
        }
      ];
      setPayments(dummyPayments);
      localStorage.setItem('local_payments', JSON.stringify(dummyPayments));
    }
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const studentName = `${payment.student_id?.first_name} ${payment.student_id?.last_name}`.toLowerCase();
    const groupName = (payment.group_id?.name || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return studentName.includes(search) || groupName.includes(search);
  });

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-10 text-black">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
            To'lovlar
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[3px] text-slate-400 bg-white border-2 border-black px-2 py-1 inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Moliyaviy Terminal
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-[300px]">
            <input 
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-[3px] border-black font-bold text-black focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
          </div>

          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-yellow-400 text-black border-[3px] border-black font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
            <FiPlus size={22} /> Qo'shish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-400 border-[3px] border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <FiPieChart size={20} />
            <p className="text-[10px] font-black uppercase">Jami Tushum</p>
          </div>
          <p className="text-3xl font-black">3,400,000 UZS</p>
        </div>
        <div className="bg-green-400 border-[3px] border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <FiTrendingUp size={20} />
            <p className="text-[10px] font-black uppercase">Oylik o'sish</p>
          </div>
          <p className="text-3xl font-black">+12.5%</p>
        </div>
        <div className="bg-white border-[3px] border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <FiCreditCard size={20} />
            <p className="text-[10px] font-black uppercase">Karta orqali</p>
          </div>
          <p className="text-3xl font-black text-blue-600">35%</p>
        </div>
      </div>

      <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white uppercase text-[12px] tracking-widest font-black">
                <th className="py-6 px-6 text-center border-r border-white/20 w-16">ID</th>
                <th className="py-6 px-6 border-r border-white/20">Talaba</th>
                <th className="py-6 px-6 border-r border-white/20">Guruh</th>
                <th className="py-6 px-6 border-r border-white/20 text-center">Summa</th>
                <th className="py-6 px-6 border-r border-white/20 text-center">Sana / Oy</th>
                <th className="py-6 px-6 border-r border-white/20 text-center">Usul</th>
                <th className="py-6 px-6 text-center">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y-[3px] divide-black bg-white">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment, index) => (
                  <tr key={payment._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-6 px-6 text-center font-black text-slate-300 border-r-[3px] border-black/10">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-6 px-6 border-r-[3px] border-black/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                           <FiUser size={20} />
                        </div>
                        <span className="font-black text-sm uppercase">
                          {payment.student_id?.first_name} {payment.student_id?.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6 border-r-[3px] border-black/10">
                      <div className="flex items-center space-x-2 text-[11px] font-black uppercase">
                        <FiLayers size={16} className="text-blue-500" />
                        <span>{payment.group_id?.name}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center border-r-[3px] border-black/10">
                      <div className="inline-flex items-center gap-1 px-4 py-2 bg-yellow-100 border-2 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <FiDollarSign />
                        {payment.payment_price?.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center border-r-[3px] border-black/10">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-black bg-blue-100 border-2 border-black px-2 py-0.5 inline-block uppercase">
                          {payment.month}
                        </div>
                        <div className="flex items-center justify-center space-x-1 text-[9px] font-bold text-slate-400 uppercase italic">
                          <FiCalendar />
                          <span>{payment.paidAt}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center border-r-[3px] border-black/10">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${payment.method === 'naqd' ? 'bg-green-400' : 'bg-orange-400'}`}>
                         {payment.method}
                       </span>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <button className="p-3 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1">
                        <FiMoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-32 text-center font-black uppercase tracking-[10px] text-slate-200 italic">
                    Ma'lumot topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;