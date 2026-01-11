
import React, { useState, useRef, useEffect } from 'react';
import { performVehicleOCR } from '../services/aiService';
import { Storage } from '../services/storage';
import { Checklist, InspectionRecord, VehicleInfo } from '../types';
import { Camera, RefreshCcw, Check, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [selectedList, setSelectedList] = useState<Checklist | null>(null);
  
  const [vehicle, setVehicle] = useState<VehicleInfo>({
    placa: '', marca: '', modelo: '', imei: []
  });
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    setChecklists(Storage.getChecklists());
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const captureAndOCR = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    setLoading(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const base64 = dataUrl.split(',')[1];

    try {
      const result = await performVehicleOCR(base64);
      setVehicle(result);
      // Stop stream after successful capture
      stream?.getTracks().forEach(t => t.stop());
      setStep(2);
    } catch (err) {
      alert("Falha no OCR. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const saveInspection = () => {
    if (!selectedList) return;
    
    const record: InspectionRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      checklistId: selectedList.id,
      checklistName: selectedList.name,
      vehicle,
      fieldValues,
      totalPrice: selectedList.price,
      status: 'completed'
    };

    Storage.saveRecord(record);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Stepper */}
      <div className="flex justify-between items-center px-4">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
            }`}>
              {step > s ? <Check size={18} /> : s}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              step === s ? 'text-indigo-600' : 'text-slate-400'
            }`}>
              {s === 1 ? 'Scanner' : s === 2 ? 'Veículo' : 'Checklist'}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800">Scanner Inteligente</h3>
              <p className="text-slate-400">Aponte para a placa ou chassi do veículo.</p>
            </div>
            
            <div className="relative w-full aspect-square md:aspect-video rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl">
              {!stream ? (
                <button 
                  onClick={startCamera}
                  className="absolute inset-0 flex flex-col items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <Camera size={64} strokeWidth={1} className="mb-4" />
                  <span className="font-bold">Ativar Câmera</span>
                </button>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                     <div className="w-full h-full border-2 border-indigo-400/50 rounded-xl relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
                     </div>
                  </div>
                </>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <button 
              disabled={!stream || loading}
              onClick={captureAndOCR}
              className={`w-full max-w-xs py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                loading ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Analisando...
                </>
              ) : (
                <>
                  <Camera size={24} /> Escanear Agora
                </>
              )}
            </button>
            <button 
              onClick={() => setStep(2)}
              className="text-slate-400 text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              Pular Scanner & Inserir Manualmente
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-indigo-600" /> Confirmação Veicular
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup 
                label="Placa" 
                value={vehicle.placa} 
                onChange={v => setVehicle({...vehicle, placa: v})} 
                placeholder="AAA0A00"
              />
              <InputGroup 
                label="Marca" 
                value={vehicle.marca} 
                onChange={v => setVehicle({...vehicle, marca: v})} 
                placeholder="Ex: Ford"
              />
              <InputGroup 
                label="Modelo" 
                value={vehicle.modelo} 
                onChange={v => setVehicle({...vehicle, modelo: v})} 
                placeholder="Ex: Ranger"
              />
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">IMEI / Identificadores</label>
                <div className="mt-1 p-4 bg-slate-50 rounded-2xl min-h-[60px] text-sm text-slate-600">
                  {vehicle.imei.length > 0 ? vehicle.imei.join(', ') : 'Nenhum identificado'}
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Selecione o Serviço</label>
              <div className="grid grid-cols-1 gap-2">
                {checklists.map(list => (
                  <button
                    key={list.id}
                    onClick={() => setSelectedList(list)}
                    className={`p-5 rounded-3xl border-2 text-left transition-all ${
                      selectedList?.id === list.id ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-slate-50 bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{list.name}</span>
                      <span className="text-emerald-500 font-bold text-sm">R$ {list.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-3xl border-2 border-slate-100 font-bold text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
              >
                <RefreshCcw size={18} /> Recapturar
              </button>
              <button 
                disabled={!selectedList}
                onClick={() => setStep(3)}
                className="flex-[2] py-4 rounded-3xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
              >
                Continuar <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedList && (
          <div className="flex-1 space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{selectedList.name}</h3>
              <div className="text-emerald-500 font-bold">Total: R$ {selectedList.price}</div>
            </div>
            
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedList.fields.map(field => (
                <div key={field.id} className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'text' && (
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 rounded-2xl p-4 outline-none focus:ring-2 ring-indigo-500/20"
                      onChange={e => setFieldValues({...fieldValues, [field.id]: e.target.value})}
                    />
                  )}
                  {field.type === 'number' && (
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 rounded-2xl p-4 outline-none focus:ring-2 ring-indigo-500/20"
                      onChange={e => setFieldValues({...fieldValues, [field.id]: e.target.value})}
                    />
                  )}
                  {field.type === 'boolean' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setFieldValues({...fieldValues, [field.id]: true})}
                        className={`flex-1 py-4 rounded-2xl font-bold transition-all ${fieldValues[field.id] === true ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}`}
                      >Sim</button>
                      <button 
                        onClick={() => setFieldValues({...fieldValues, [field.id]: false})}
                        className={`flex-1 py-4 rounded-2xl font-bold transition-all ${fieldValues[field.id] === false ? 'bg-red-500 text-white' : 'bg-slate-50 text-slate-400'}`}
                      >Não</button>
                    </div>
                  )}
                  {field.type === 'select' && field.options && (
                    <div className="flex flex-wrap gap-2">
                      {field.options.map(opt => (
                        <button 
                          key={opt}
                          onClick={() => setFieldValues({...fieldValues, [field.id]: opt})}
                          className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${fieldValues[field.id] === opt ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                        >{opt}</button>
                      ))}
                    </div>
                  )}
                  {field.type === 'photo' && (
                    <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                      <Camera className="mr-2" /> Tirar Foto
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={saveInspection}
              className="w-full py-5 rounded-[2rem] bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 flex items-center justify-center gap-2"
            >
              Finalizar Inspeção <Check size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const InputGroup: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-1 font-bold text-slate-800 focus:ring-2 ring-indigo-500/20 outline-none"
    />
  </div>
);

export default Register;
