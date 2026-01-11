
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-indigo-600 tracking-tight">CheckMaster</h1>
          <p className="text-slate-400 font-medium">Faça login para gerenciar suas inspeções</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-indigo-100/50 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="email" 
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 ring-indigo-500/20 font-medium transition-all border-none"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="password" 
                  placeholder="Sua senha"
                  className="w-full bg-slate-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 ring-indigo-500/20 font-medium transition-all border-none"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 rounded-[2rem] bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Entrar Agora <ChevronRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
             <button className="text-slate-400 text-sm font-medium hover:text-indigo-600 transition-colors">
               Esqueceu sua senha?
             </button>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm">
          Ainda não tem conta? <button className="text-indigo-600 font-bold hover:underline">Solicite acesso</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
