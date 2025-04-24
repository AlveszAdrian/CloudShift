import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

interface SecurityScoreChartProps {
  score: number;
}

const SecurityScoreChart: React.FC<SecurityScoreChartProps> = ({ score }) => {
  // Calculando o valor restante para completar o círculo
  const remaining = 100 - score;
  
  // Dados para o gráfico
  const data = [
    { name: 'Score', value: score },
    { name: 'Restante', value: remaining }
  ];
  
  // Definindo as cores do gráfico
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981'; // green
    if (score >= 70) return '#3B82F6'; // blue
    if (score >= 50) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };
  
  const COLORS = [getScoreColor(score), '#E5E7EB'];
  
  // Customizando o tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && payload[0].name === 'Score') {
      return (
        <div className="bg-white p-2 shadow-md rounded border border-gray-200 text-sm">
          <p className="font-semibold">Pontuação de segurança: <span className="text-indigo-600">{payload[0].value}</span>/100</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className="text-sm font-medium text-gray-600">/100</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            animationDuration={800}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SecurityScoreChart; 