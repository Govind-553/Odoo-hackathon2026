import React from 'react';
import { ChevronRight } from 'lucide-react';

const DataTable = ({ columns, data, onRowClick, loading = false }) => {
  return (
    <div className="white card p-0 overflow-hidden border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`p-4 text-[10px] font-bold text-muted uppercase tracking-widest ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
              {onRowClick && <th className="p-4 w-10"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="p-4">
                      <div className="h-4 bg-slate-100 rounded-md w-full"></div>
                    </td>
                  ))}
                  {onRowClick && <td className="p-4"><div className="w-5 h-5 bg-slate-100 rounded-full"></div></td>}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onRowClick ? 1 : 0)} className="p-10 text-center text-muted italic">
                  No records to display.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr 
                  key={i}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : ''}`}
                >
                  {columns.map((col, j) => (
                    <td key={j} className={`p-4 text-sm text-secondary font-medium ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {onRowClick && (
                    <td className="p-4 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
