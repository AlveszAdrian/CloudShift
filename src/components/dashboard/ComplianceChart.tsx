import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface ComplianceChartProps {
  compliance: {
    pci: number;
    hipaa: number;
    gdpr: number;
    nist: number;
  };
}

const ComplianceChart: React.FC<ComplianceChartProps> = ({ compliance }) => {
  // Transformar os dados em formato compatível com o gráfico
  const data = [
    {
      subject: 'PCI DSS',
      A: compliance.pci,
      fullMark: 100
    },
    {
      subject: 'HIPAA',
      A: compliance.hipaa,
      fullMark: 100
    },
    {
      subject: 'GDPR',
      A: compliance.gdpr,
      fullMark: 100
    },
    {
      subject: 'NIST',
      A: compliance.nist,
      fullMark: 100
    }
  ];

  // Customizando o tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="font-semibold">{payload[0].payload.subject}</p>
          <p className="text-sm text-indigo-600">
            Conformidade: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Conformidade"
            dataKey="A"
            stroke="#4F46E5"
            fill="#4F46E5"
            fillOpacity={0.4}
            animationDuration={1000}
            animationBegin={0}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComplianceChart; 