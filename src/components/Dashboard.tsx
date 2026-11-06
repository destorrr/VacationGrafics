import React from 'react';
import { Campaign, Organization, VacationPeriod, Employee } from '../types';

interface DashboardProps {
  campaigns: Campaign[];
  organizations: Organization[];
  employees: Employee[];
  vacationPeriods: VacationPeriod[];
  selectedCampaign: Campaign | null;
  onSelectCampaign: (campaign: Campaign) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  campaigns,
  organizations,
  employees,
  vacationPeriods,
  selectedCampaign,
  onSelectCampaign,
}) => {
  const currentCampaign = selectedCampaign || campaigns.find(c => c.status === 'active') || campaigns[0];
  const campaignPeriods = vacationPeriods.filter(vp => vp.campaignId === currentCampaign?.id);
  const approvedCount = campaignPeriods.filter(vp => vp.status === 'approved').length;
  const plannedCount = campaignPeriods.filter(vp => vp.status === 'planned').length;
  const employeesWithVacation = new Set(campaignPeriods.map(vp => vp.employeeId)).size;
  const totalDays = campaignPeriods.reduce((sum, vp) => sum + vp.days, 0);

  return (
    <div className="space-y-6">
      {/* Campaign selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
          Активная кампания
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaigns.map(campaign => (
            <button
              key={campaign.id}
              onClick={() => onSelectCampaign(campaign)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                currentCampaign?.id === campaign.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">{campaign.year}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                  campaign.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {campaign.status === 'active' ? 'Активна' :
                   campaign.status === 'draft' ? 'Черновик' : 'Завершена'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{campaign.name}</p>
              <p className="text-xs text-gray-400 mt-1">
                {campaign.organizations.length} организаций
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
              <i className="fas fa-users text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
              <p className="text-sm text-gray-500">Сотрудников</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
              <i className="fas fa-check-circle text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{approvedCount}</p>
              <p className="text-sm text-gray-500">Утверждено</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
              <i className="fas fa-clock text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{plannedCount}</p>
              <p className="text-sm text-gray-500">Запланировано</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
              <i className="fas fa-umbrella-beach text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalDays}</p>
              <p className="text-sm text-gray-500">Всего дней</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Прогресс заполнения</h3>
        <div className="space-y-4">
          {organizations.map(org => {
            const orgEmployees = employees.filter(e => e.organizationId === org.id);
            const orgPeriods = campaignPeriods.filter(vp =>
              orgEmployees.some(e => e.id === vp.employeeId)
            );
            const coveredEmployees = new Set(orgPeriods.map(vp => vp.employeeId)).size;
            const progress = orgEmployees.length > 0
              ? Math.round((coveredEmployees / orgEmployees.length) * 100)
              : 0;

            return (
              <div key={org.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{org.name}</span>
                  <span className="text-sm text-gray-500">
                    {coveredEmployees}/{orgEmployees.length} сотрудников ({progress}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="fas fa-history mr-2 text-gray-400"></i>
          Последние записи графика
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-500">Сотрудник</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Период</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Дней</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Статус</th>
              </tr>
            </thead>
            <tbody>
              {campaignPeriods.slice(0, 5).map(vp => {
                const emp = employees.find(e => e.id === vp.employeeId);
                return (
                  <tr key={vp.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-gray-800">{emp?.fullName || '—'}</td>
                    <td className="py-3 px-2 text-gray-600">
                      {new Date(vp.startDate).toLocaleDateString('ru-RU')} — {new Date(vp.endDate).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="py-3 px-2 text-gray-800 font-medium">{vp.days}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        vp.status === 'approved' ? 'bg-green-100 text-green-700' :
                        vp.status === 'planned' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {vp.status === 'approved' ? 'Утверждён' :
                         vp.status === 'planned' ? 'Запланирован' : 'Отменён'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
