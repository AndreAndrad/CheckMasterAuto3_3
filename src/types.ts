
export interface VehicleInfo {
  placa: string;
  marca: string;
  modelo: string;
  imei: string[];
}

export interface ChecklistField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'photo';
  required: boolean;
  options?: string[];
  value?: any;
}

export interface Checklist {
  id: string;
  name: string;
  fields: ChecklistField[];
  price: number;
}

export interface InspectionRecord {
  id: string;
  date: string;
  checklistId: string;
  checklistName: string;
  vehicle: VehicleInfo;
  fieldValues: Record<string, any>;
  totalPrice: number;
  status: 'pending' | 'completed';
}

export interface FinanceSummary {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
}
