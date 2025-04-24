"use client";

export default function AdvancedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      {children}
    </div>
  );
} 