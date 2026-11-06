import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { EmployeeSchedule } from './components/EmployeeSchedule';

import { ExportView } from './components/ExportView';
import {
  organizations,
  campaigns,
  employees,
  vacationPeriods as initialPeriods,
} from './data';
import { Campaign, VacationPeriod } from './types';

type TabId = 'dashboard' | 'schedule' | 'export';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Панель управления', icon: 'fas fa-tachometer-alt' },
  { id: 'schedule', label: 'Планирование', icon: 'fas fa-user-clock' },
  { id: 'export', label: 'Экспорт Т-7', icon: 'fas fa-file-excel' },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    campaigns.find(c => c.status === 'active') || campaigns[0]
  );
  const [periods, setPeriods] = useState<VacationPeriod[]>(initialPeriods);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleAddPeriod = (period: Omit<VacationPeriod, 'id'>) => {
    const newPeriod: VacationPeriod = {
      ...period,
      id: `vp-${Date.now()}`,
    };
    setPeriods([...periods, newPeriod]);
  };

  const handleDeletePeriod = (id: string) => {
    setPeriods(periods.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col flex-shrink-0`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-umbrella-beach text-white text-sm"></i>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-sm leading-tight">График</h1>
                <p className="text-xs text-slate-400">отпусков</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title={tab.label}
            >
              <i className={`${tab.icon} w-5 text-center`}></i>
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* Campaign indicator */}
        {sidebarOpen && selectedCampaign && (
          <div className="p-3 border-t border-slate-700">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-xs text-slate-400">Текущая кампания</p>
              <p className="text-sm font-medium text-white">{selectedCampaign.name}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                selectedCampaign.status === 'active' ? 'bg-green-500/20 text-green-400' :
                selectedCampaign.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {selectedCampaign.status === 'active' ? '● Активна' :
                 selectedCampaign.status === 'draft' ? '● Черновик' : '● Завершена'}
              </span>
            </div>
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 border-t border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} mx-auto`}></i>
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-500">
                Холдинг • Автоматизация графика отпусков
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                <i className="fas fa-building text-gray-400"></i>
                <span>{organizations.length} организаций</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                <i className="fas fa-users text-gray-400"></i>
                <span>{employees.length} сотрудников</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                КА
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              campaigns={campaigns}
              organizations={organizations}
              employees={employees}
              vacationPeriods={periods}
              selectedCampaign={selectedCampaign}
              onSelectCampaign={setSelectedCampaign}
            />
          )}
          {activeTab === 'schedule' && (
            <EmployeeSchedule
              employees={employees}
              vacationPeriods={periods}
              selectedCampaign={selectedCampaign}
              organizations={organizations}
              onAddPeriod={handleAddPeriod}
              onDeletePeriod={handleDeletePeriod}
            />
          )}

          {activeTab === 'export' && (
            <ExportView
              campaigns={campaigns}
              organizations={organizations}
              selectedCampaign={selectedCampaign}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
