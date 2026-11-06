import React, { useState } from 'react';
import { Employee, VacationPeriod, Organization } from '../types';

interface VacationCalendarProps {
  employees: Employee[];
  vacationPeriods: VacationPeriod[];
  organizations: Organization[];
  selectedCampaignId: string;
}

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const VacationCalendar: React.FC<VacationCalendarProps> = ({
  employees,
  vacationPeriods,
  organizations,
  selectedCampaignId,
}) => {
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'gantt'>('timeline');

  const campaignPeriods = vacationPeriods.filter(vp => vp.campaignId === selectedCampaignId);
  const filteredEmployees = selectedOrg === 'all'
    ? employees
    : employees.filter(e => e.organizationId === selectedOrg);

  const year = parseInt(selectedCampaignId.replace('camp-', '')) || 2026;

  const isOnVacation = (employeeId: string, month: number, day: number): VacationPeriod | null => {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    return campaignPeriods.find(vp =>
      vp.employeeId === employeeId && vp.startDate <= dateStr && vp.endDate >= dateStr
    ) || null;
  };

  const getDaysInMonth = (month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const colors = [
    'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400',
    'bg-pink-400', 'bg-teal-400', 'bg-indigo-400', 'bg-red-400',
  ];

  const getEmployeeColor = (employeeId: string) => {
    const idx = employees.findIndex(e => e.id === employeeId);
    return colors[idx % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              <i className="fas fa-calendar mr-2 text-green-600"></i>
              Календарь отпусков — {year} год
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Визуальное представление графика отпусков по месяцам
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все организации</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-2 text-sm ${viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <i className="fas fa-list mr-1"></i> Таблица
              </button>
              <button
                onClick={() => setViewMode('gantt')}
                className={`px-3 py-2 text-sm ${viewMode === 'gantt' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <i className="fas fa-chart-gantt mr-1"></i> Диаграмма
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gantt-like view */}
      {viewMode === 'gantt' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Header - months */}
              <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0">
                <div className="w-48 min-w-[12rem] p-3 border-r border-gray-200 font-medium text-sm text-gray-700">
                  Сотрудник
                </div>
                <div className="flex-1 flex">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="flex-1 p-2 text-center text-xs font-medium text-gray-600 border-r border-gray-100">
                      {MONTHS_RU[i].slice(0, 3)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Employee rows */}
              {filteredEmployees.map(emp => {
                const empPeriods = campaignPeriods.filter(vp => vp.employeeId === emp.id);
                return (
                  <div key={emp.id} className="flex border-b border-gray-100 hover:bg-gray-50">
                    <div className="w-48 min-w-[12rem] p-2 border-r border-gray-200">
                      <p className="text-xs font-medium text-gray-800 truncate">{emp.fullName}</p>
                      <p className="text-xs text-gray-400 truncate">{emp.position}</p>
                    </div>
                    <div className="flex-1 flex relative h-10">
                      {Array.from({ length: 12 }, (_, monthIdx) => (
                        <div key={monthIdx} className="flex-1 border-r border-gray-100 relative">
                          {empPeriods.map(period => {
                            const pStart = new Date(period.startDate);
                            const pEnd = new Date(period.endDate);
                            const monthStart = new Date(year, monthIdx, 1);
                            const monthEnd = new Date(year, monthIdx + 1, 0);

                            if (pEnd < monthStart || pStart > monthEnd) return null;

                            const startDay = pStart < monthStart ? 1 : pStart.getDate();
                            const endDay = pEnd > monthEnd ? getDaysInMonth(monthIdx) : pEnd.getDate();
                            const daysInMonth = getDaysInMonth(monthIdx);

                            const left = ((startDay - 1) / daysInMonth) * 100;
                            const width = ((endDay - startDay + 1) / daysInMonth) * 100;

                            return (
                              <div
                                key={period.id}
                                className={`absolute top-1.5 h-7 rounded ${getEmployeeColor(emp.id)} opacity-80 flex items-center justify-center`}
                                style={{ left: `${left}%`, width: `${width}%` }}
                                title={`${period.startDate} — ${period.endDate} (${period.days} дн.)`}
                              >
                                <span className="text-white text-xs font-medium truncate px-1">
                                  {period.days}д
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Timeline / table view */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-2 font-medium text-gray-600 sticky left-0 bg-gray-50 border-r border-gray-200 min-w-[180px]">
                    Сотрудник
                  </th>
                  {Array.from({ length: 12 }, (_, month) => (
                    <th key={month} className="text-center p-1 font-medium text-gray-600 border-r border-gray-100 min-w-[80px]">
                      {MONTHS_RU[month].slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 border-r border-gray-200 sticky left-0 bg-white">
                      <p className="font-medium text-gray-800 truncate">{emp.fullName}</p>
                    </td>
                    {Array.from({ length: 12 }, (_, month) => {
                      const daysInMonth = getDaysInMonth(month);
                      const period = campaignPeriods.find(vp => {
                        const pStart = new Date(vp.startDate);
                        const pEnd = new Date(vp.endDate);
                        const monthStart = new Date(year, month, 1);
                        const monthEnd = new Date(year, month + 1, 0);
                        return vp.employeeId === emp.id && !(pEnd < monthStart || pStart > monthEnd);
                      });

                      return (
                        <td key={month} className="p-1 border-r border-gray-100 text-center">
                          {period ? (
                            <div className={`rounded px-1 py-0.5 ${getEmployeeColor(emp.id)} text-white font-medium`}>
                              {period.days}д
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          <i className="fas fa-info-circle mr-1 text-gray-400"></i> Обозначения
        </h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-400"></div>
            <span className="text-gray-600">Основной отпуск</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-400"></div>
            <span className="text-gray-600">Дополнительный отпуск</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-300"></div>
            <span className="text-gray-600">Без содержания</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-green-400"></div>
            <span className="text-gray-600">Утверждён</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-yellow-400"></div>
            <span className="text-gray-600">Запланирован</span>
          </div>
        </div>
      </div>
    </div>
  );
};
