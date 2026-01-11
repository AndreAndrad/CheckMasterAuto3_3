
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, Wallet, PlayCircle, Settings } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Início', icon: LayoutDashboard },
    { path: '/services', label: 'Modelos', icon: ClipboardCheck },
    { path: '/register', label: 'Executar', icon: PlayCircle },
    { path: '/finance', label: 'Financeiro', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 md:pb-0 md:pl-64">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-50">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-indigo-600">CheckMaster</h1>
          <p className="text-xs text-slate-400 font-medium">Auto Solutions</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
                ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Header - Mobile */}
      <header className="md:hidden flex items-center justify-between p-6 bg-white border-b border-slate-100 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-indigo-600">CheckMaster</h1>
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
           <Settings size={20} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl ultra-rounded flex justify-around items-center p-2 z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-300
              ${isActive ? 'bg-indigo-600 text-white shadow-lg scale-110 -translate-y-4' : 'text-slate-400'}
            `}
          >
            {/* Fix: Use render prop to access isActive in children scope */}
            {({ isActive }) => (
              <>
                <item.icon size={24} />
                {!isActive && <span className="text-[10px] mt-1 font-medium">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
