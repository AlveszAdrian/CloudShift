import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ResourcesDistributionProps {
  resources: {
    ec2: number;
    s3: number;
    rds: number;
    lambda: number;
    cloudfront: number;
  };
}

const ResourceDistributionChart: React.FC<ResourcesDistributionProps> = ({ resources }) => {
  // Transformar os dados em formato compatível com o gráfico
  const data = [
    {
      name: 'EC2',
      value: resources.ec2,
      color: '#3B82F6' // blue
    },
    {
      name: 'S3',
      value: resources.s3,
      color: '#10B981' // green
    },
    {
      name: 'RDS',
      value: resources.rds,
      color: '#8B5CF6' // purple
    },
    {
      name: 'Lambda',
      value: resources.lambda,
      color: '#F59E0B' // yellow
    },
    {
      name: 'CloudFront',
      value: resources.cloudfront,
      color: '#6366F1' // indigo
    }
  ];

  const COLORS = data.map(item => item.color);
  
  // Customizando o tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((entry.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 shadow-md rounded border border-gray-200">
          <p className="font-semibold" style={{ color: entry.color }}>{entry.name}</p>
          <p className="text-sm">Quantidade: {entry.value}</p>
          <p className="text-sm">Percentual: {percentage}%</p>
        </div>
      );
    }
    return null;
  };
  
  // Customizando a legenda
  const renderCustomizedLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 mr-2 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            content={renderCustomizedLegend}
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResourceDistributionChart; 