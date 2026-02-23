"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Settings2, 
  ExternalLink, 
  Trash2, 
  Search,
  Code,
  Calendar,
  Loader2,
  Pencil
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { fetchAPIs } from '@/lib/api';
import { generateSlug } from '@/lib/utils';
import type { API } from '@/types';
import { toast, Toaster } from 'sonner';

export default function MinhasAPIs() {
  // Dados de simulação iniciais
  const [userApis, setUserApis] = useState<API[]>([
    { 
      id: '1', 
      name: 'API de Exemplo (Simulada)', 
      tags: 'Desenvolvimento', 
      created_at: new Date().toISOString(),
      created_by: 'simulacao' 
    } as API,
    { 
      id: '2', 
      name: 'Sistema de IA (Simulado)', 
      tags: 'IA', 
      created_at: new Date().toISOString(),
      created_by: 'simulacao'
    } as API,
  ]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    async function loadMyAPIs() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const allData = await fetchAPIs();
        // Filtra as APIs reais do banco vinculadas ao usuário
        const myData = allData.filter((api: API) => 
          api.created_by === user.email || api.created_by === user.id
        );
        
        if (myData && myData.length > 0) {
          // Se houver dados reais, substitui a simulação
          setUserApis(myData);
        } else if (process.env.NODE_ENV === 'production') {
          // Em produção, se não houver dados reais, limpa a simulação
          setUserApis([]);
        }
        // Em desenvolvimento (localhost), se myData for vazio, 
        // ele simplesmente não chama o setUserApis e mantém o estado inicial.
        
      } catch (error) {
        console.error("Erro ao carregar APIs:", error);
        if (process.env.NODE_ENV === 'production') {
          setUserApis([]);
          toast.error("Erro ao carregar suas APIs.");
        }
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

  // Função para deletar API no backend
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir a API "${name}"?`)) return;

    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`https://apihub-br.duckdns.org/api-delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("API removida!");
        setUserApis(prev => prev.filter(api => api.id !== id));
      } else {
        toast.error("Não foi possível excluir.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    }
  };

  const filteredApis = userApis.filter(api => 
    api.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 pt-24 bg-gray-50">
        <p>Faça login para gerenciar suas APIs.</p>
        <Link href="/login" className="text-blue-600 font-bold mt-4">Ir para Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 text-black">
      <Toaster richColors position="top-right" />
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas APIs</h1>
            <p className="text-gray-500">
                {isLoading ? "Buscando dados..." : `Você gerencia ${userApis.length} publicações.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <label htmlFor="search-input" className="sr-only">Filtrar APIs</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                id="search-input"
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 shadow-sm"
              />
            </div>
            <Link 
              href="/criacao" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-md transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nova API</span>
            </Link>
          </div>
        </div>

        {/* Listagem */}
        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-gray-400 animate-pulse">Carregando catálogo pessoal...</p>
            </div>
          ) : filteredApis.length > 0 ? (
            <div className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {filteredApis.map((api) => (
                  <motion.div 
                    key={api.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Code className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{api.name}</h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                            {api.tags || 'Geral'}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(api.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl">
                      <Link 
                        href={`/apis/${generateSlug(api.name)}`}
                        className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
                        title="Visualizar"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                      
                      <Link
                        href={`/minhas_apis/edicao/${generateSlug(api.name)}`}
                        className="p-2.5 text-gray-500 hover:text-amber-600 hover:bg-white rounded-xl transition-all"
                        title="Editar"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>

                        <Link
                        href={`/minhas_apis/dashboard/${generateSlug(api.name)}`}
                        className="p-2.5 text-gray-500 hover:text-amber-600 hover:bg-white rounded-xl transition-all"
                        title="Detalhes"
                      >
                        <Settings2 className="w-5 h-5" />
                      </Link>

                      <button 
                        onClick={() => handleDelete(api.id, api.name)}
                        className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-white rounded-xl transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="p-20 text-center">
              <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Nada por aqui</h3>
              <p className="text-gray-500 mb-6">Você ainda não possui APIs cadastradas.</p>
              <Link href="/criacao" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
                Criar minha primeira API
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}