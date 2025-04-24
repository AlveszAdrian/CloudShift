'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UsersIcon, UserGroupIcon, ShieldCheckIcon, DocumentTextIcon, KeyIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Usuários', href: '/dashboard/iam/advanced/users', icon: UsersIcon },
  { name: 'Grupos', href: '/dashboard/iam/advanced/groups', icon: UserGroupIcon },
  { name: 'Funções', href: '/dashboard/iam/advanced/roles', icon: ShieldCheckIcon },
  { name: 'Políticas', href: '/dashboard/iam/advanced/policies', icon: DocumentTextIcon },
  { name: 'Rotação de Chaves', href: '/dashboard/iam/advanced/credential-rotation', icon: ArrowPathIcon },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="mb-6 flex items-center">
        <KeyIcon className="h-7 w-7 text-indigo-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento IAM</h1>
          <p className="mt-2 text-gray-600">
            Monitore e gerencie usuários, grupos, funções e políticas IAM na sua conta AWS.
          </p>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {navItems.map((item) => {
            const isActive = item.href === '/' 
              ? pathname === item.href 
              : pathname?.startsWith(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  ${isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                  flex items-center px-1 pt-1 pb-2 text-sm font-medium border-b-2 transition-colors
                `}
              >
                <item.icon className={`h-5 w-5 mr-1.5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
} 