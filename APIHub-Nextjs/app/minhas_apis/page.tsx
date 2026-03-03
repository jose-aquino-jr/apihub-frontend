"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Settings2, ExternalLink, Trash2, Search,
  Code, Calendar, Loader2, Pencil
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { generateSlug } from '@/lib/utils';
import type { API } from '@/types';
import { toast, Toaster } from 'sonner';

export default function MinhasAPIs() {
  // Inicializamos vazio para evitar dados falsos na tela
  const [userApis, setUserApis] = useState<API[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    async function loadMyAPIs() {
      if (!user) return;
      
      const token = localStorage.getItem('authToken');

      try {
        // ENDPOINT: Busca todas as APIs
        // Se o backend permitir, use: /apis/?owner_id=${user.id}
        const res = await fetch('https://apihub-br.duckdns.org/apis/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const allData: API[] = await res.json();
          
          // FILTRO: Garante que só vemos as APIs que pertencem ao usuário logado
          const myData = allData.filter((api) => 
            api.created_by === user.id || api.created_by_id === user.id
          );
          
          setUserApis(myData);
        }
      } catch (error) {
        console.error("Erro ao carregar APIs:", error);
        toast.error("Erro ao sincronizar com o catálogo.");
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      loadMyAPIs();
    } else {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir a API "${name}"?`)) return;

    const token = localStorage.getItem('authToken');
    const loadingToast = toast.loading("Excluindo API...");

    try {
      const res = await fetch(`https://apihub-br.duckdns.org/api-delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("API removida do catálogo!", { id: loadingToast });
        setUserApis(prev => prev.filter(api => api.id !== id));
      } else {
        toast.error("Erro: Você não tem permissão ou a API não existe.", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Erro de conexão com o servidor.", { id: loadingToast });
    }
  };

  const filteredApis = userApis.filter(api => 
    api.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 pt-24 bg-gray-50">
        <Code className="w-16 h-16 text-gray-200 mb-4" />
        <p className="text-lg font-medium">Acesso Restrito</p>
        <p className="text-sm">Faça login para gerenciar suas publicações.</p>
        <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold mt-6 shadow-lg shadow-blue-100 transition-all hover:scale-105">
          Entrar na Conta
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 text-black">
      <Toaster richColors position="top-right" />
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Minhas APIs</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {userApis.length} APIs
                </span>
              )}
              {isLoading ? "Sincronizando..." : "Gerencie suas publicações e estatísticas."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Filtrar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 shadow-sm transition-all"
              />
            </div>
            <Link 
              href="/criacao" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Nova API</span>
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-32 flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-gray-400 font-medium">Buscando seu catálogo pessoal...</p>
            </div>
          ) : filteredApis.length > 0 ? (
            <div className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredApis.map((api) => (
                  <motion.div 
                    key={api.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Code className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl tracking-tight leading-tight">{api.name}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] uppercase tracking-widest font-black px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg">
                            {api.tags || 'Geral'}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(api.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100/50 p-2 rounded-[1.5rem]">
                      <Link 
                        href={`/apis/${generateSlug(api.name)}`}
                        className="p-3 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all hover:shadow-sm"
                        title="Ver no Catálogo"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                      
                      <Link
                        href={`/minhas_apis/edicao/${api.id}`} // Usando ID para a edição ser precisa
                        className="p-3 text-gray-500 hover:text-amber-600 hover:bg-white rounded-xl transition-all hover:shadow-sm"
                        title="Editar Informações"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>

                      <Link
                        href={`/minhas_apis/dashboard/${generateSlug(api.name)}`}
                        className="p-3 text-gray-500 hover:text-purple-600 hover:bg-white rounded-xl transition-all hover:shadow-sm"
                        title="Estatísticas e Dashboard"
                      >
                        <Settings2 className="w-5 h-5" />
                      </Link>

                      <button 
                        onClick={() => handleDelete(api.id, api.name)}
                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all hover:shadow-sm"
                        title="Deletar permanentemente"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Nenhuma API encontrada</h3>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">Comece agora a povoar seu catálogo e compartilhar com a comunidade.</p>
              <Link href="/criacao" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200">
                Criar minha primeira API
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}