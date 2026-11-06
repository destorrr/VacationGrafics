import React from 'react';
import { Campaign, Organization } from '../types';

interface ExportViewProps {
  campaigns: Campaign[];
  organizations: Organization[];
  selectedCampaign: Campaign | null;
}

export const ExportView: React.FC<ExportViewProps> = ({
  campaigns,
  organizations,
  selectedCampaign,
}) => {
  const currentCampaign = selectedCampaign || campaigns[0];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          <i className="fas fa-file-excel mr-2 text-green-600"></i>
          Экспорт в формат Т-7
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Формирование файлов графика отпусков по форме Т-7 для каждой организации
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Параметры экспорта</h3>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <i className="fas fa-calendar mr-1"></i> Кампания:
              </p>
              <p className="font-medium text-gray-800">{currentCampaign?.name}</p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Сохранить форматирование шаблона</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Включить блок подписей</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Экспортировать только утверждённые</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Объединить записи для совместителей</span>
              </label>
            </div>
          </div>

          {/* Organizations to export */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Организации для экспорта</h3>
            <div className="space-y-2">
              {organizations.map(org => (
                <label key={org.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{org.name}</p>
                    <p className="text-xs text-gray-500">{org.employeesCount} сотрудников</p>
                  </div>
                  <i className="fas fa-file-excel text-green-500"></i>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Export button */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <i className="fas fa-info-circle mr-1"></i>
            Файлы будут сформированы в формате .xlsx с использованием библиотеки openpyxl
          </div>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm">
            <i className="fas fa-download mr-2"></i>
            Сформировать файлы Т-7
          </button>
        </div>
      </div>

      {/* Template info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-medium text-gray-700 mb-4">
          <i className="fas fa-upload mr-2 text-blue-600"></i>
          Загрузка шаблонов Т-7
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Загрузите исходные Excel-шаблоны формы Т-7 для каждой организации. Система использует их как основу для заполнения данных.
        </p>

        <div className="space-y-3">
          {organizations.map(org => (
            <div key={org.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <i className="fas fa-file-excel text-green-600"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{org.name}</p>
                  <p className="text-xs text-gray-500">Шаблон Т-7 загружен</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600 font-medium">
                  <i className="fas fa-check-circle mr-1"></i> Загружен
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1">
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
          <p className="text-sm text-gray-500">Перетащите файлы сюда или нажмите для выбора</p>
          <p className="text-xs text-gray-400 mt-1">Поддерживаются файлы .xlsx</p>
        </div>
      </div>

      {/* Algorithm description */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-medium text-gray-700 mb-4">
          <i className="fas fa-cogs mr-2 text-purple-600"></i>
          Алгоритм формирования
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
            <p className="text-sm text-gray-600">Система находит нужные строки в шаблоне по табельному номеру или ФИО сотрудника</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
            <p className="text-sm text-gray-600">Аккуратно вписывает данные о периодах отпуска, не ломая исходную структуру и формулы листа</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
            <p className="text-sm text-gray-600">Для совместителей — автоматически заполняет строки во всех соответствующих организациях</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">4</span>
            <p className="text-sm text-gray-600">Сохраняет объединённые ячейки, форматирование и блок подписей в исходном виде</p>
          </div>
        </div>
      </div>
    </div>
  );
};
