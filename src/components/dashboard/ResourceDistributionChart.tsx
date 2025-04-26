import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { Server, Cloud, Database, Code, Activity } from 'lucide-react';

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
  // Preparar os dados para o gráfico
  const data = [
    { name: 'EC2', value: resources.ec2, color: '#3B82F6', icon: <Server size={14} /> },
    { name: 'S3', value: resources.s3, color: '#F59E0B', icon: <Cloud size={14} /> },
    { name: 'RDS', value: resources.rds, color: '#8B5CF6', icon: <Database size={14} /> },
    { name: 'Lambda', value: resources.lambda, color: '#10B981', icon: <Code size={14} /> },
    { name: 'CloudFront', value: resources.cloudfront, color: '#EC4899', icon: <Activity size={14} /> }
  ].filter(item => item.value > 0); // Filtrar itens com valor zero
  
  // Se não houver dados, mostrar mensagem
  if (data.length === 0 || data.every(item => item.value === 0)) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">Nenhum recurso encontrado</p>
      </div>
    );
  }
  
  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 shadow-lg rounded-lg border border-gray-100"
        >
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.payload.color }}
            ></div>
            <span className="font-medium">{item.name}</span>
          </div>
          <p className="text-gray-700 mt-1">
            <span className="font-semibold">{item.value}</span> recursos
            {item.payload.percentage && (
              <span className="ml-1 text-sm text-gray-500">
                ({item.payload.percentage}%)
              </span>
            )}
          </p>
        </motion.div>
      );
    }
    return null;
  };
  
  // Calcular total e porcentagens
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: Math.round((item.value / total) * 100)
  }));
  
  // Renderizar legenda personalizada
  const CustomLegend = () => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
      {dataWithPercentage.map((entry, index) => (
        <motion.div 
          key={`legend-${index}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center"
        >
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          ></div>
          <div className="flex items-center text-xs text-gray-600">
            {entry.icon}
            <span className="ml-1">{entry.name}</span>
            <span className="ml-1 text-gray-500">({entry.percentage}%)</span>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Definição de gradientes */}
            <defs>
              {dataWithPercentage.map((entry, index) => (
                <linearGradient 
                  key={`gradient-${index}`} 
                  id={`gradient-${entry.name}`} 
                  x1="0" 
                  y1="0" 
                  x2="0" 
                  y2="1"
                >
                  <stop 
                    offset="0%" 
                    stopColor={entry.color} 
                    stopOpacity={0.8}
                  />
                  <stop 
                    offset="100%" 
                    stopColor={entry.color} 
                    stopOpacity={1}
                  />
                </linearGradient>
              ))}
            </defs>
            
            <Pie
              data={dataWithPercentage}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              animationDuration={1500}
              animationBegin={300}
              labelLine={false}
              strokeWidth={0}
            >
              {dataWithPercentage.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#gradient-${entry.name})`}
                  stroke={entry.color}
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
      
      <CustomLegend />
    </div>
  );
};

export default ResourceDistributionChart; 