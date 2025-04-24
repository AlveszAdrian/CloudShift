import React from 'react';

interface SecuritySummaryCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

/**
 * Security Summary Card Component
 * 
 * Displays a summary card with title, count, and an icon.
 * Used to show security-related metrics across the platform.
 */
export default function SecuritySummaryCard({ title, count, icon, color }: SecuritySummaryCardProps) {
  return (
    <div className={`p-4 border rounded-lg ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
} 