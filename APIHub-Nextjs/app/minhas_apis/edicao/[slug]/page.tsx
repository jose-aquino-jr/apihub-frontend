"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Globe, ChevronDown, Save, ArrowLeft,
  PawPrint, Languages, Database, GraduationCap, Book, 
  ShoppingCart, Cloud, Smile, Image, DollarSign, Users, 
  MapPin, Camera, MessageCircle, Music, Gamepad2, Brain, 
  Code, Mail, Calendar, BarChart3, Smartphone, LucideIcon, Loader2
} from 'lucide-react';

const CATEGORY_MAP: Record<string, { color: string; icon: LucideIcon }> = {
  'Animais': { color: 'from-orange-500 to-pink-500', icon: PawPrint },
  'Palavras': { color: 'from-blue-500 to-cyan-500', icon: Languages },
  'Dados': { color: 'from-purple-500 to-indigo-500', icon: Database },
  'Educação': { color: 'from-green-500 to-emerald-500', icon: GraduationCap },
  'Livros': { color: 'from-amber-500 to-orange-500', icon: Book },
  'Produtos': { color: 'from-red-500 to-rose-500', icon: ShoppingCart },
  'Clima': { color: 'from-cyan-500 to-blue-500', icon: Cloud },
  'Diversão': { color: 'from-pink-500 to-rose-500', icon: Smile },
  'Imagens': { color: 'from-violet-500 to-purple-500', icon: Image },
  'Financeiro': { color: 'from-emerald-500 to-green-500', icon: DollarSign },
  'Tradução': { color: 'from-sky-500 to-blue-500', icon: Languages },
  'Nomes': { color: 'from-indigo-500 to-purple-500', icon: Users },
  'Localização': { color: 'from-red-500 to-orange-500', icon: MapPin },
  'Fotos': { color: 'from-purple-500 to-pink-500', icon: Camera },
  'Redes Sociais': { color: 'from-blue-500 to-indigo-500', icon: MessageCircle },
  'Música': { color: 'from-green-500 to-teal-500', icon: Music },
  'Jogos': { color: 'from-yellow-500 to-orange-500', icon: Gamepad2 },
  'IA': { color: 'from-purple-500 to-blue-500', icon: Brain },
  'Desenvolvimento': { color: 'from-gray-600 to-gray-800', icon: Code },
  'Email': { color: 'from-blue-500 to-cyan-500', icon: Mail },
  'Calendário': { color: 'from-green-500 to-emerald-500', icon: Calendar },
  'Análises': { color: 'from-indigo-500 to-purple-500', icon: BarChart3 },
  'Mobile': { color: 'from-blue-500 to-purple-500', icon: Smartphone }
};

export default function EdicaoAPI() {
  const params = useParams();
  const router = useRouter();
  const apiId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // States do Formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [parameters, setParameters] = useState('');
  const [category, setCategory] = useState('');
  const [isHttps, setIsHttps] = useState(true);
  const [isCors, setIsCors] = useState(true);

  useEffect(() => {
    async function loadApiData() {
      // 1. Verificar se é um ID de simulação (1 ou 2) em desenvolvimento
      if ((apiId === '1' || apiId === '2') && process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          setName(apiId === '1' ? 'API de Exemplo (Simulada)' : 'Sistema de IA (Simulado)');
          setDescription('Esta é uma descrição de teste para validar o layout da tela de edição.');
          setEndpoint('https://api.exemplo.com/v1');
          setCategory(apiId === '1' ? 'Desenvolvimento' : 'IA');
          setParameters('key, limit, offset');
          setLoading(false);
        }, 500); // Simula um delay de rede
        return;
      }

      try {
        const res = await fetch(`https://apihub-br.duckdns.org/api-detalhes/${apiId}`);
        const data = await res.json();
        
        if (data.success) {
          const api = data.data;
          setName(api.name || '');
          setDescription(api.description || '');
          setEndpoint(api.base_url || '');
          setCategory(api.tags || '');
          setIsHttps(!!api.https);
          setIsCors(!!api.cors);
          setParameters(api.parameters || '');
        } else {
          toast.error("API não encontrada.");
          router.push('/minhas_apis');
        }
      } catch (error) {
        console.error("Erro ao carregar:", error);
        // Fallback para dev se a API falhar
        if (process.env.NODE_ENV === 'development') {
           setName('Fallback Dev');
           setCategory('Dados');
           setLoading(false);
        } else {
          toast.error("Erro de conexão.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadApiData();
  }, [apiId, router]);

  const categoryData = CATEGORY_MAP[category] || { color: 'from-blue-600 to-indigo-600', icon: Database };
  const SelectedIcon = categoryData.icon;
  const selectedGradient = categoryData.color;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (apiId === '1' || apiId === '2') {
      toast.info("Simulação: Os dados não foram salvos no banco real.");
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('authToken');

    try {
      const res = await fetch(`https://apihub-br.duckdns.org/api-update/${apiId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name, description, base_url: endpoint,
          tags: category, https: isHttps, cors: isCors, parameters
        })
      });

      if (res.ok) {
        toast.success('API atualizada!');
        router.push('/minhas_apis');
      } else {
        toast.error('Erro ao salvar.');
      }
    } catch (err) {
      toast.error('Erro de conexão.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-4 text-black">
      <Toaster richColors position="top-right" />
      
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.push('/minhas_apis')} 
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Voltar para Minhas APIs
        </button>

        <div className="text-center mb-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={category} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-sm border border-gray-100"
            >
              <SelectedIcon className="w-4 h-4 text-blue-600" />
              {category || 'Selecione a Categoria'}
            </motion.div>
          </AnimatePresence>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Editar API</h1>
          {apiId?.length === 1 && (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">MODO SIMULAÇÃO</span>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-6 bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-200 shadow-xl shadow-blue-900/5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-bold text-gray-700 ml-1">Nome da API</label>
              <input id="edit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: API de Clima" className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-category" className="text-sm font-bold text-gray-700 ml-1">Categoria</label>
              <div className="relative">
                <select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)} title="Categoria da API" className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-gray-50/50 cursor-pointer" required>
                  <option value="" disabled>Escolha uma opção...</option>
                  {Object.keys(CATEGORY_MAP).sort().map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-desc" className="text-sm font-bold text-gray-700 ml-1">Descrição</label>
            <textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva as funcionalidades..." className="w-full p-4 h-28 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 resize-none" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="edit-url" className="text-sm font-bold text-gray-700 ml-1">URL Base</label>
              <input id="edit-url" type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="https://api.exemplo.com" className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-params" className="text-sm font-bold text-gray-700 ml-1">Parâmetros</label>
              <input id="edit-params" type="text" value={parameters} onChange={(e) => setParameters(e.target.value)} placeholder="Ex: key, lang" className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 py-2">
            <button type="button" title={isHttps ? "Desativar HTTPS" : "Ativar HTTPS"} onClick={() => setIsHttps(!isHttps)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all ${isHttps ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
              <Shield className="w-4 h-4" />
              <span className="text-xs font-black uppercase">HTTPS {isHttps ? 'Ativo' : 'Inativo'}</span>
            </button>

            <button type="button" title={isCors ? "Desativar CORS" : "Ativar CORS"} onClick={() => setIsCors(!isCors)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all ${isCors ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
              <Globe className="w-4 h-4" />
              <span className="text-xs font-black uppercase">CORS {isCors ? 'Ativo' : 'Inativo'}</span>
            </button>
          </div>

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={saving} className={`w-full py-5 rounded-[1.5rem] text-white font-bold text-lg shadow-xl flex items-center justify-center gap-3 bg-gradient-to-r ${selectedGradient} ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </motion.button>
        </form>
      </div>
    </div>
  );
}