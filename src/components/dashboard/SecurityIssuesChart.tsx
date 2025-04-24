import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SecurityIssuesChartProps {
  issues: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const SecurityIssuesChart: React.FC<SecurityIssuesChartProps> = ({ issues }) => {
  // Transformar os dados em formato compatível com o gráfico
  const data = [
    {
      name: 'Crítica',
      value: issues.critical,
      color: '#EF4444'
    },
    {
      name: 'Alta',
      value: issues.high,
      color: '#F97316'
    },
    {
      name: 'Média',
      value: issues.medium,
      color: '#EAB308'
    },
    {
      name: 'Baixa',
      value: issues.low,
      color: '#3B82F6'
    }
  ];

  // Customizando o tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="font-semibold">Severidade: {label}</p>
          <p className="text-sm">Quantidade: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10
          }}
          barSize={40}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="value" 
            name="Issues de Segurança"
            radius={[0, 4, 4, 0]}
          >
            {data.map((entry, index) => (
              <rect key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SecurityIssuesChart; 