"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IAMAlertsRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/dashboard/security?category=iam");
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Redirecionando...</h2>
        <p className="text-gray-600">A página de alertas IAM foi movida para a seção de segurança.</p>
      </div>
    </div>
  );
} 