import React, { useState } from 'react';

export const AuditLogsView = ({ logs }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchesFilter =
      filterType === 'all' || log.actionType.toLowerCase() === filterType.toLowerCase();

    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.itemAffected.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#19244E] tracking-tight">
            Security & Audit Logs
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Immutable chronological record of admin modifications, catalog mutations, and system events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
            ● Logging Engine Active
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-2.5 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action, item affected, or user..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#E58422] outline-none"
          />
        </div>

        {/* Action Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Actions' },
            { id: 'update', label: 'Updates' },
            { id: 'create', label: 'Created' },
            { id: 'delete', label: 'Archived' },
            { id: 'security', label: 'Security' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterType(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                filterType === btn.id
                  ? 'bg-[#19244E] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Audit Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/70 text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                <th className="py-4 px-6">Timestamp & User</th>
                <th className="py-4 px-6">Action</th>
                <th className="py-4 px-6">Item Affected</th>
                <th className="py-4 px-6">Previous State</th>
                <th className="py-4 px-6">New State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    No audit records matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Timestamp & User */}
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-[#19244E]">
                        {log.date}
                      </div>
                      <div className="text-[10px] text-gray-400 font-semibold">
                        {log.time} · {log.user}
                      </div>
                    </td>

                    {/* Action & Badge */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            log.actionType === 'create'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.actionType === 'update'
                              ? 'bg-blue-100 text-blue-800'
                              : log.actionType === 'delete'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {log.actionType}
                        </span>
                        <span className="font-bold text-gray-800">{log.action}</span>
                      </div>
                    </td>

                    {/* Item Affected */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{log.itemAffected}</div>
                      <div className="text-[10px] text-gray-400">ID: {log.itemId}</div>
                    </td>

                    {/* Previous State */}
                    <td className="py-4 px-6 text-gray-500 font-mono text-[11px] bg-red-50/20 max-w-xs truncate">
                      {log.previousValue}
                    </td>

                    {/* New State */}
                    <td className="py-4 px-6 text-emerald-700 font-mono text-[11px] bg-emerald-50/30 max-w-xs truncate">
                      {log.newValue}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
