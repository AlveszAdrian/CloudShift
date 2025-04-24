import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ResourcesChartProps {
  resources: {
    ec2: number;
    s3: number;
    rds: number;
    lambda: number;
    cloudfront: number;
  };
}

const ResourcesChart: React.FC<ResourcesChartProps> = ({ resources }) => {
  // Transformar os dados em formato compatível com o gráfico
  const data = [
    {
      name: 'EC2',
      value: resources.ec2,
      color: '#3B82F6'  // blue
    },
    {
      name: 'S3',
      value: resources.s3,
      color: '#10B981'  // green
    },
    {
      name: 'RDS',
      value: resources.rds,
      color: '#8B5CF6'  // purple
    },
    {
      name: 'Lambda',
      value: resources.lambda,
      color: '#F59E0B'  // yellow
    },
    {
      name: 'CloudFront',
      value: resources.cloudfront,
      color: '#6366F1'  // indigo
    }
  ];

  // Customizando o tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-sm">{`Quantidade: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="value" 
            name="Quantidade" 
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResourcesChart; 