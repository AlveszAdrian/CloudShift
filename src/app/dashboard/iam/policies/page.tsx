'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PoliciesRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/dashboard/iam/advanced/policies');
  }, [router]);
  
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <p className="text-gray-500">Redirecionando para o gerenciamento de policies IAM...</p>
    </div>
  );
} 