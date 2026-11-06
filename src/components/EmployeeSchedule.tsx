import React, { useState } from 'react';
import { Employee, VacationPeriod, Campaign, Organization } from '../types';

interface EmployeeScheduleProps {
  employees: Employee[];
  vacationPeriods: VacationPeriod[];
  selectedCampaign: Campaign | null;
  organizations: Organization[];
  onAddPeriod: (period: Omit<VacationPeriod, 'id'>) => void;
  onDeletePeriod: (id: string) => void;
}

export const EmployeeSchedule: React.FC<EmployeeScheduleProps> = ({
  employees,
  vacationPeriods,
  selectedCampaign,
  organizations,
  onAddPeriod,
  onDeletePeriod,
}) => {
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    startDate: '',
    endDate: '',
    type: 'annual' as 'annual' | 'additional' | 'unpaid',
    notes: '',
  });

  const filteredEmployees = selectedOrg === 'all'
    ? employees
    : employees.filter(e => e.organizationId === selectedOrg);

  const campaignPeriods = vacationPeriods.filter(vp => vp.campaignId === selectedCampaign?.id);

  const getEmployeePeriods = (employeeId: string) => {
    return campaignPeriods.filter(vp => vp.employeeId === employeeId);
  };

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, diffDays);
  };

  const handleAddPeriod = () => {
    if (!selectedEmployee || !newPeriod.startDate || !newPeriod.endDate) return;

    const days = calculateDays(newPeriod.startDate, newPeriod.endDate);

    onAddPeriod({
      employeeId: selectedEmployee.id,
      campaignId: selectedCampaign?.id || '',
      startDate: newPeriod.startDate,
      endDate: newPeriod.endDate,
      days,
      type: newPeriod.type,
      status: 'planned',
      notes: newPeriod.notes,
    });

    setShowModal(false);
    setNewPeriod({ startDate: '', endDate: '', type: 'annual', notes: '' });
  };

  const getOrgName = (orgId: string) => {
    return organizations.find(o => o.id === orgId)?.name || orgId;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              <i className="fas fa-user-clock mr-2 text-indigo-600"></i>
              Планирование отпусков сотрудников
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Выберите сотрудника и укажите желаемые даты отпуска
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedOrg}
              onChange={(e) => { setSelectedOrg(e.target.value); setSelectedEmployee(null); }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все организации</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            <button
              onClick={() => {
                if (selectedEmployee) setShowModal(true);
              }}
              disabled={!selectedEmployee}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fas fa-plus mr-1"></i> Добавить отпуск
            </button>
          </div>
        </div>
      </div>

      {/* Employee list and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee list */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-700">
              Сотрудники ({filteredEmployees.length})
            </h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {filteredEmployees.map(emp => {
              const periods = getEmployeePeriods(emp.id);
              const totalDays = periods.reduce((sum, p) => sum + p.days, 0);
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                    selectedEmployee?.id === emp.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{emp.fullName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{emp.position}</p>
                      <p className="text-xs text-gray-400">{emp.department}</p>
                      {emp.positions.length > 1 && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                          Совместитель
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">{totalDays} дн.</p>
                      <p className="text-xs text-gray-400">{periods.length} период(ов)</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Employee details */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {selectedEmployee ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedEmployee.fullName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Табельный №: {selectedEmployee.tabNumber}
                  </p>
                  {selectedEmployee.positions.length > 1 && (
                    <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs font-medium text-purple-700 mb-1">
                        <i className="fas fa-info-circle mr-1"></i>
                        Совмещение должностей — даты будут проставлены во все организации:
                      </p>
                      <ul className="text-xs text-purple-600 space-y-0.5">
                        {selectedEmployee.positions.map((pos, idx) => (
                          <li key={idx}>• {pos.position} — {getOrgName(pos.organizationId)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">
                    {getEmployeePeriods(selectedEmployee.id).reduce((sum, p) => sum + p.days, 0)}
                  </p>
                  <p className="text-xs text-gray-500">дней всего</p>
                </div>
              </div>

              {/* Vacation periods table */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Периоды отпуска</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-500">Начало</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-500">Конец</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-500">Дней</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-500">Тип</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-500">Статус</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-500">Примечание</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-500"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {getEmployeePeriods(selectedEmployee.id).length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-400">
                            <i className="fas fa-calendar-plus text-2xl mb-2 block"></i>
                            Периоды отпуска не добавлены
                          </td>
                        </tr>
                      ) : (
                        getEmployeePeriods(selectedEmployee.id).map(period => (
                          <tr key={period.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-3">{new Date(period.startDate).toLocaleDateString('ru-RU')}</td>
                            <td className="py-2 px-3">{new Date(period.endDate).toLocaleDateString('ru-RU')}</td>
                            <td className="py-2 px-3 font-medium">{period.days}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                period.type === 'annual' ? 'bg-blue-100 text-blue-700' :
                                period.type === 'additional' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {period.type === 'annual' ? 'Основной' :
                                 period.type === 'additional' ? 'Дополнительный' : 'Без содержания'}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                period.status === 'approved' ? 'bg-green-100 text-green-700' :
                                period.status === 'planned' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {period.status === 'approved' ? 'Утверждён' :
                                 period.status === 'planned' ? 'Запланирован' : 'Отменён'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-gray-500 text-xs">{period.notes || '—'}</td>
                            <td className="py-2 px-3">
                              <button
                                onClick={() => onDeletePeriod(period.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Удалить"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <i className="fas fa-user text-4xl mb-3"></i>
              <p className="text-sm">Выберите сотрудника из списка слева</p>
            </div>
          )}
        </div>
      </div>

      {/* Add period modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              <i className="fas fa-plus-circle mr-2 text-blue-600"></i>
              Добавить период отпуска
            </h3>
            {selectedEmployee && (
              <p className="text-sm text-gray-600 mb-4">
                Сотрудник: <strong>{selectedEmployee.fullName}</strong>
              </p>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата начала</label>
                  <input
                    type="date"
                    value={newPeriod.startDate}
                    onChange={(e) => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата окончания</label>
                  <input
                    type="date"
                    value={newPeriod.endDate}
                    onChange={(e) => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {newPeriod.startDate && newPeriod.endDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <i className="fas fa-calculator mr-1"></i>
                    Продолжительность: <strong>{calculateDays(newPeriod.startDate, newPeriod.endDate)} календарных дней</strong>
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    (включая выходные, исключая праздничные дни РФ по ст. 120 ТК РФ)
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип отпуска</label>
                <select
                  value={newPeriod.type}
                  onChange={(e) => setNewPeriod({ ...newPeriod, type: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="annual">Основной (ежегодный)</option>
                  <option value="additional">Дополнительный</option>
                  <option value="unpaid">Без сохранения заработной платы</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Примечание</label>
                <textarea
                  value={newPeriod.notes}
                  onChange={(e) => setNewPeriod({ ...newPeriod, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Необязательно"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleAddPeriod}
                disabled={!newPeriod.startDate || !newPeriod.endDate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-save mr-1"></i> Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
