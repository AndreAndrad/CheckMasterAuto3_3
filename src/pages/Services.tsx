
import React, { useState, useEffect } from 'react';
import { Storage } from '../services/storage';
import { Checklist, ChecklistField } from '../types';
import { Plus, Trash2, GripVertical, Settings2, Save } from 'lucide-react';

const Services: React.FC = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [editingList, setEditingList] = useState<Checklist | null>(null);

  useEffect(() => {
    setChecklists(Storage.getChecklists());
  }, []);

  const handleAddNew = () => {
    const newList: Checklist = {
      id: Date.now().toString(),
      name: 'Novo Checklist',
      price: 0,
      fields: []
    };
    setEditingList(newList);
  };

  const addField = () => {
    if (!editingList) return;
    const newField: ChecklistField = {
      id: Date.now().toString(),
      label: 'Novo Campo',
      type: 'text',
      required: false
    };
    setEditingList({ ...editingList, fields: [...editingList.fields, newField] });
  };

  const removeField = (id: string) => {
    if (!editingList) return;
    setEditingList({
      ...editingList,
      fields: editingList.fields.filter(f => f.id !== id)
    });
  };

  const handleSave = () => {
    if (editingList) {
      Storage.saveChecklist(editingList);
      setChecklists(Storage.getChecklists());
      setEditingList(null);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Modelos de Serviço</h2>
          <p className="text-slate-500">Gerencie seus formulários de inspeção e valores.</p>
        </div>
        {!editingList && (
          <button 
            onClick={handleAddNew}
            className="bg-indigo-600 text-white p-4 rounded-3xl hover:bg-indigo-700 transition-all shadow-lg"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* List of Checklists */}
        <div className="space-y-4">
          {checklists.map(list => (
            <div 
              key={list.id} 
              className={`p-6 bg-white rounded-[2rem] border-2 transition-all cursor-pointer ${
                editingList?.id === list.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-50'
              }`}
              onClick={() => setEditingList(list)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{list.name}</h4>
                  <p className="text-sm text-slate-400">{list.fields.length} campos definidos</p>
                </div>
                <span className="text-emerald-500 font-bold">R$ {list.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Builder Area */}
        {editingList ? (
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl space-y-6 sticky top-24">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <Settings2 className="text-indigo-600" /> Editor
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingList(null)}
                  className="px-4 py-2 text-slate-400 font-medium hover:text-slate-600"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
                >
                  <Save size={18} /> Salvar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">Nome do Serviço</label>
                <input 
                  type="text" 
                  value={editingList.name}
                  onChange={e => setEditingList({...editingList, name: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-1 font-semibold focus:ring-2 ring-indigo-500/20 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">Preço (R$)</label>
                <input 
                  type="number" 
                  value={editingList.price}
                  onChange={e => setEditingList({...editingList, price: Number(e.target.value)})}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-1 font-semibold focus:ring-2 ring-indigo-500/20 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">Campos do Checklist</label>
                <button 
                  onClick={addField}
                  className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline"
                >
                  <Plus size={14} /> Adicionar Campo
                </button>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {editingList.fields.map((field, idx) => (
                  <div key={field.id} className="group flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                    <GripVertical className="text-slate-300 group-hover:text-indigo-300 transition-colors" size={20} />
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input 
                        type="text"
                        placeholder="Nome do campo"
                        value={field.label}
                        onChange={e => {
                          const newFields = [...editingList.fields];
                          newFields[idx].label = e.target.value;
                          setEditingList({...editingList, fields: newFields});
                        }}
                        className="bg-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 ring-indigo-500"
                      />
                      <select 
                        value={field.type}
                        onChange={e => {
                          const newFields = [...editingList.fields];
                          newFields[idx].type = e.target.value as any;
                          setEditingList({...editingList, fields: newFields});
                        }}
                        className="bg-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 ring-indigo-500"
                      >
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                        <option value="boolean">Check (Sim/Não)</option>
                        <option value="select">Lista de Opções</option>
                        <option value="photo">Foto</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => removeField(field.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-100 rounded-[3rem] text-slate-300">
            <Settings2 size={64} className="mb-4 opacity-50" />
            <p className="font-bold text-xl">Selecione um checklist para editar</p>
            <p className="text-sm">Ou crie um novo no botão superior.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
