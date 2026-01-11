
import { Checklist, InspectionRecord } from '../types';

const KEYS = {
  CHECKLISTS: 'cm_checklists',
  RECORDS: 'cm_records',
};

// Initial data for first time users
const INITIAL_CHECKLISTS: Checklist[] = [
  {
    id: '1',
    name: 'Inspeção Básica',
    price: 50,
    fields: [
      { id: 'f1', label: 'Nível de Óleo', type: 'boolean', required: true },
      { id: 'f2', label: 'Condição Pneus', type: 'select', required: true, options: ['Bom', 'Regular', 'Crítico'] },
      { id: 'f3', label: 'Kilometragem', type: 'number', required: true },
    ]
  },
  {
    id: '2',
    name: 'Inspeção Premium',
    price: 150,
    fields: [
      { id: 'p1', label: 'Freios', type: 'boolean', required: true },
      { id: 'p2', label: 'Suspensão', type: 'boolean', required: true },
      { id: 'p3', label: 'Observações Gerais', type: 'text', required: false },
    ]
  }
];

export const Storage = {
  getChecklists: (): Checklist[] => {
    const data = localStorage.getItem(KEYS.CHECKLISTS);
    if (!data) {
      localStorage.setItem(KEYS.CHECKLISTS, JSON.stringify(INITIAL_CHECKLISTS));
      return INITIAL_CHECKLISTS;
    }
    return JSON.parse(data);
  },

  saveChecklist: (checklist: Checklist) => {
    const lists = Storage.getChecklists();
    const index = lists.findIndex(l => l.id === checklist.id);
    if (index > -1) {
      lists[index] = checklist;
    } else {
      lists.push(checklist);
    }
    localStorage.setItem(KEYS.CHECKLISTS, JSON.stringify(lists));
  },

  getRecords: (): InspectionRecord[] => {
    const data = localStorage.getItem(KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },

  saveRecord: (record: InspectionRecord) => {
    const records = Storage.getRecords();
    records.push(record);
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
  }
};
