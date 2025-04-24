'use client';

import Link from 'next/link';
import { ArrowRightIcon, UsersIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AdvancedIamPage() {
  const sections = [
    {
      title: 'Roles',
      description: 'Gerencie roles de IAM para serviços e aplicações',
      icon: <KeyIcon className="h-12 w-12 text-blue-500" />,
      link: '/dashboard/iam/advanced/roles'
    },
    {
      title: 'Groups',
      description: 'Gerencie grupos de IAM e permissões associadas',
      icon: <UsersIcon className="h-12 w-12 text-green-500" />,
      link: '/dashboard/iam/advanced/groups'
    },
    {
      title: 'Policies',
      description: 'Gerencie políticas de IAM para controle de acesso',
      icon: <ShieldCheckIcon className="h-12 w-12 text-purple-500" />,
      link: '/dashboard/iam/advanced/policies'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento Avançado de IAM</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <Link 
            href={section.link} 
            key={index}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex flex-col"
          >
            <div className="mb-4">
              {section.icon}
            </div>
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-600 mb-4 flex-grow">{section.description}</p>
            <div className="flex items-center text-blue-600 font-medium">
              <span>Acessar</span>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 