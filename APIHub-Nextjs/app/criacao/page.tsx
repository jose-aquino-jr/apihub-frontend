"use client";

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { useAuth } from '@/components/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Shield, Globe, ChevronDown, 
  PawPrint, Languages, Database, GraduationCap, Book, 
  ShoppingCart, Cloud, Smile, Image, DollarSign, Users, 
  MapPin, Camera, MessageCircle, Music, Gamepad2, Brain, 
  Code, Mail, Calendar, BarChart3, Smartphone, LucideIcon
} from 'lucide-react';

// Tipagem para o Mapa de Categorias
interface CategoryConfig {
  color: string;
  icon: LucideIcon;
}

const CATEGORY_MAP: Record<string, CategoryConfig> = {
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

export default function CriacaoAPI() {
  const { user } = useAuth()

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [parameters, setParameters] = useState('');
  const [category, setCategory] = useState('');
  const [isHttps, setIsHttps] = useState(true);
  const [isCors, setIsCors] = useState(true);

  // Ícone dinâmico baseado na categoria selecionada
  const categoryData = CATEGORY_MAP[category] || { color: 'from-blue-500 to-purple-500', icon: Database };
  const SelectedIcon = categoryData.icon;
  const selectedGradient = categoryData.color;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !description || !endpoint || !category) {
      toast.error('Campos obrigatórios', { 
        description: 'Por favor, preencha nome, categoria, descrição e URL base.' 
      });
      return;
    }

    const novaApi = {
      id: Date.now().toString(),
      name,
      description,
      base_url: endpoint,
      tags: category,
      https: isHttps,
      cors: isCors,
      authentication_type: 'none',
      parameters: parameters,
      rating: 5.0,
      created_at: new Date().toISOString(),
    };

    console.log("Objeto pronto para o Catálogo:", novaApi);
    toast.success('API Criada!', { 
      description: `${name} foi enviada com sucesso para o seu catálogo.` 
    });
    
    // Aqui você poderia usar o useRouter() do Next.js para voltar:
    // router.push('/minhas-apis');
  }

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-4">
      <Toaster richColors position="top-right" />
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={category}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-sm border border-gray-100 text-gray-700"
            >
              <SelectedIcon className={`w-4 h-4 text-blue-600`} />
              {category || 'Nova API'}
            </motion.div>
          </AnimatePresence>
          
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Publicar no <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Catálogo</span>
          </h1>
          <p className="text-gray-500 mt-2">Preencha os dados abaixo para disponibilizar sua API.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-200 shadow-xl shadow-blue-900/5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Nome da API</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: API de Clima Real"
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 text-black placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Categoria</label>
              <div className="relative">
                <select 
                  title='Category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-gray-50/50 transition-all cursor-pointer text-black"
                >
                  <option value="">Selecione uma categoria...</option>
                  {Object.keys(CATEGORY_MAP).sort().map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Descrição</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as funcionalidades e o que ela retorna..."
              className="w-full p-4 h-28 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 text-black placeholder:text-gray-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">URL Base (Endpoint)</label>
              <input 
                type="text" 
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.exemplo.com"
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 text-black placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Parâmetros (opcional)</label>
              <input 
                type="text" 
                value={parameters}
                onChange={(e) => setParameters(e.target.value)}
                placeholder="Ex: key, city, lang"
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 text-black placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 py-2">
            <button
              type="button"
              onClick={() => setIsHttps(!isHttps)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all ${isHttps ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
            >
              <Shield className={`w-4 h-4 ${isHttps ? 'text-green-500' : ''}`} />
              <span className="text-xs font-black uppercase tracking-wider">HTTPS {isHttps ? 'Ativo' : 'Inativo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCors(!isCors)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all ${isCors ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
            >
              <Globe className={`w-4 h-4 ${isCors ? 'text-blue-500' : ''}`} />
              <span className="text-xs font-black uppercase tracking-wider">CORS {isCors ? 'Ativo' : 'Inativo'}</span>
            </button>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full py-5 rounded-[1.5rem] text-white font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 bg-gradient-to-r ${selectedGradient}`}
          >
            Cadastrar no Catálogo
            <Zap className="w-6 h-6 fill-white" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}