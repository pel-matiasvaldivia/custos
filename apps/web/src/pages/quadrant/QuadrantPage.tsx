import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export const QuadrantPage = () => {
  const [currentMonth] = useState(new Date());
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6 overflow-hidden flex flex-col h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold text-navy">Cuadrante Operativo</h2>
          <p className="text-muted">Distribución de servicios y asignaciones.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-surface border border-line rounded-md hover:bg-canvas transition-colors flex items-center gap-2 text-sm font-medium">
            <Download size={16} /> Exportar
          </button>
          <button className="btn-primary flex items-center gap-2">
            <CalendarIcon size={18} /> Generar Mes
          </button>
        </div>
      </div>

      <div className="card flex-1 flex flex-col p-0 overflow-hidden">
        <div className="p-4 border-b border-line flex items-center justify-between bg-canvas/30">
          <div className="flex items-center gap-4">
            <button className="p-1 hover:bg-canvas rounded transition-colors text-muted hover:text-navy">
              <ChevronLeft size={20} />
            </button>
            <span className="font-display font-bold text-navy uppercase tracking-widest text-sm">
              Junio 2026
            </span>
            <button className="p-1 hover:bg-canvas rounded transition-colors text-muted hover:text-navy">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1 h-[600px]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-surface z-10">
              <tr className="border-b border-line bg-canvas/50 text-[10px] font-bold text-muted uppercase tracking-tighter">
                <th className="p-3 border-r border-line min-w-[200px] bg-surface">Objetivo / Puesto</th>
                {daysArray.map(day => (
                  <th key={day} className={`p-1 border-r border-line text-center min-w-[40px] ${[6, 7].includes(new Date(2026, 5, day).getDay()) ? 'bg-amber/5' : ''}`}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[10px]">
              <tr className="border-b border-line hover:bg-canvas/30 transition-colors">
                <td className="p-2 border-r border-line font-bold text-navy truncate max-w-[200px]">
                  Objetivo Centro - Acceso A
                </td>
                {daysArray.map(day => (
                  <td key={day} className={`p-1 border-r border-line text-center ${day % 5 === 0 ? 'bg-brand-blue/10 text-brand-blue font-bold' : ''}`}>
                    {day % 5 === 0 ? 'PÉREZ' : '-'}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-line hover:bg-canvas/30 transition-colors">
                <td className="p-2 border-r border-line font-bold text-navy truncate max-w-[200px]">
                   Fábrica Sur - Portón 2
                </td>
                {daysArray.map(day => (
                  <td key={day} className={`p-1 border-r border-line text-center ${day % 7 === 0 ? 'bg-brand-blue/10 text-brand-blue font-bold' : ''}`}>
                    {day % 7 === 0 ? 'GONZÁLEZ' : '-'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
