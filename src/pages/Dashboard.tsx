
import React, { useEffect, useState } from 'react';
import { Storage } from '../services/storage';
import { InspectionRecord } from '../types';
import { TrendingUp, CheckCircle, Clock, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<InspectionRecord[]>([]);

  useEffect(() => {
    setRecords(Storage.getRecords().reverse());
  }, []);

  const stats = {
    total: records.length,
    completed: records.filter(r => r.status === 'completed').length,
    revenue: records.reduce((acc, r) => acc + r.totalPrice, 0),
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Olá, Inspetor! 👋</h2>
          <p className="text-slate-500">Aqui está o resumo da sua operação hoje.</p>
        </div>
        <button 
          onClick={() => navigate('/register')}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-3xl font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
        >
          <PlusCircle size={20} />
          Nova Inspeção
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total de Inspeções" 
          value={stats.total.toString()} 
          icon={<CheckCircle className="text-indigo-600" />}
          color="bg-indigo-50"
        />
        <StatCard 
          label="Ganhos Acumulados" 
          value={`R$ ${stats.revenue.toLocaleString()}`} 
          icon={<TrendingUp className="text-emerald-500" />}
          color="bg-emerald-50"
        />
        <StatCard 
          label="Inspeções Pendentes" 
          value={records.filter(r => r.status === 'pending').length.toString()} 
          icon={<Clock className="text-amber-500" />}
          color="bg-amber-50"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-lg">Histórico Recente</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Veículo</th>
                <th className="px-6 py-4">Checklist</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Nenhuma inspeção realizada ainda.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 uppercase">{record.vehicle.placa}</div>
                      <div className="text-xs text-slate-400">{record.vehicle.marca} {record.vehicle.modelo}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{record.checklistName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(record.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        record.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {record.status === 'completed' ? 'Concluído' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-500">
                      R$ {record.totalPrice}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-3xl ${color} flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;
