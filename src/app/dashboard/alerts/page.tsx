"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AlertsRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/dashboard/security");
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Redirecionando...</h2>
        <p className="text-gray-600">A página de alertas foi movida para a seção de segurança.</p>
      </div>
    </div>
  );
} 