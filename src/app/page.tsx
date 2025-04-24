import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Se já estiver autenticado, redireciona para o dashboard
  if (session) {
    redirect("/dashboard");
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-500 to-purple-600">
      <header className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-2xl">CloudShift</div>
          <div>
            <Link
              href="/login"
              className="inline-block px-4 py-2 text-sm font-medium text-indigo-600 bg-white rounded-md shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:py-24 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Monitore e proteja seus recursos em nuvem
              </h1>
              <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
                Uma plataforma completa para monitoramento, alerta e segurança para seus recursos em nuvem.
                Visualize instâncias EC2, buckets S3 e receba alertas de segurança em tempo real.
              </p>
              <div className="mt-10 flex space-x-4">
                <Link
                  href="/register"
                  className="inline-block px-6 py-3 text-base font-medium text-white bg-indigo-800 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Registre-se gratuitamente
                </Link>
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 text-base font-medium text-indigo-600 bg-white rounded-md shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Entrar
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative bg-white rounded-lg shadow-xl p-6">
                <div className="space-y-6">
                  <div className="h-12 bg-indigo-100 rounded-md flex items-center justify-center">
                    <span className="text-indigo-800 font-medium">Dashboard de Monitoramento</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-indigo-50 rounded-md p-4">
                      <div className="text-sm text-indigo-800 font-medium">Instâncias EC2</div>
                      <div className="mt-2 text-2xl font-bold text-indigo-700">12</div>
                    </div>
                    <div className="h-24 bg-indigo-50 rounded-md p-4">
                      <div className="text-sm text-indigo-800 font-medium">Buckets S3</div>
                      <div className="mt-2 text-2xl font-bold text-indigo-700">8</div>
                    </div>
                    <div className="h-24 bg-red-50 rounded-md p-4">
                      <div className="text-sm text-red-800 font-medium">Alertas Críticos</div>
                      <div className="mt-2 text-2xl font-bold text-red-700">3</div>
                    </div>
                    <div className="h-24 bg-yellow-50 rounded-md p-4">
                      <div className="text-sm text-yellow-800 font-medium">Alertas Médios</div>
                      <div className="mt-2 text-2xl font-bold text-yellow-700">7</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-indigo-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-indigo-100">
            <p>&copy; 2023 CloudShift. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
