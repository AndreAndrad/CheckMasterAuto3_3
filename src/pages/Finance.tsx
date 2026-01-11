
import React, { useEffect, useState } from 'react';
import { Storage } from '../services/storage';
import { InspectionRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, Filter, Wallet2 } from 'lucide-react';

const Finance: React.FC = () => {
  const [records, setRecords] = useState<InspectionRecord[]>([]);

  useEffect(() => {
    setRecords(Storage.getRecords());
  }, []);

  // Prepare data for chart (Grouped by date)
  const chartData = records.reduce((acc: any[], r) => {
    const dateStr = new Date(r.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const existing = acc.find(item => item.date === dateStr);
    if (existing) {
      existing.revenue += r.totalPrice;
    } else {
      acc.push({ date: dateStr, revenue: r.totalPrice });
    }
    return acc;
  }, []).slice(-7); // Last 7 days

  const totalRevenue = records.reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Financeiro</h2>
          <p className="text-slate-500">Acompanhe seus rendimentos e faturamento.</p>
        </div>
        <button className="flex items-center gap-2 text-indigo-600 font-bold bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50">
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-4">
            <Wallet2 size={32} />
          </div>
          <p className="text-slate-400 font-medium">Saldo Total</p>
          <h4 className="text-3xl font-black text-slate-800">R$ {totalRevenue.toLocaleString()}</h4>
          <div className="mt-4 px-4 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold">
            + 12.5% vs mês anterior
          </div>
        </div>

        <div className="md:col-span-3 bg-white p-8 rounded-[3rem] border border-slate-100 min-h-[300px]">
          <h5 className="font-bold mb-6 flex items-center gap-2">Faturamento Diário <span className="text-slate-300 font-normal">(Últimos 7 dias)</span></h5>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4f46e5' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Transações Detalhadas</h3>
          <button className="text-slate-400 hover:text-indigo-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="py-20 text-center text-slate-300">Nenhum dado financeiro disponível.</div>
          ) : (
            records.reverse().map(record => (
              <div key={record.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-bold text-indigo-600 uppercase text-xs">
                    {record.vehicle.placa.slice(-3)}
                  </div>
                  <div>
                    <h6 className="font-bold text-slate-800">{record.checklistName}</h6>
                    <p className="text-xs text-slate-400">{new Date(record.date).toLocaleDateString('pt-BR')} • {record.vehicle.placa}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-500">R$ {record.totalPrice}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pago</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance;
