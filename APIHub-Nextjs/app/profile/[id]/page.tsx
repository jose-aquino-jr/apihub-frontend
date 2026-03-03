"use client";

import { useEffect, useState } from 'react';
import { 
  User, Code, Globe, Mail, MapPin, Github, 
  Link as LinkIcon, Star, BookOpen, Package, 
  ExternalLink, Cpu 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Interfaces
interface API {
  id: string;
  name: string;
  description: string;
  status: 'community' | 'verified' | 'deprecated';
  rating: number;
  tags?: string;
}

interface Usuario {
  id: string;
  name: string;
  bio: string;
  location: string;
  email: string;
  avatar_url?: string;
  github?: string;
  website?: string;
  technologies?: string[];
  apis: API[];
}

const BACKEND_URL = "https://apihub-br.duckdns.org";

export default function PerfilUsuario({ params }: { params: { userId: string } }) {
  const [dados, setDados] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const response = await fetch(`${BACKEND_URL}/users/profile/${params.userId}/with-apis`);
        const data = await response.json();
        
        // Mock de tecnologias caso o backend não retorne
        const tecnologiasMock = ["React", "Node.js", "TypeScript", "Python", "Next.js"];
        setDados({ ...data, technologies: data.technologies || tecnologiasMock });
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarPerfil();
  }, [params.userId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!dados) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400 uppercase tracking-tighter">Usuário 404</div>;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* SIDEBAR */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-6">
            <div className="relative">
              {dados.avatar_url ? (
                <img src={dados.avatar_url} alt={dados.name} className="w-full aspect-square rounded-full border border-gray-200 shadow-sm" />
              ) : (
                <div className="w-full aspect-square bg-slate-900 rounded-full flex items-center justify-center text-white text-6xl font-black">
                  {dados.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{dados.name}</h1>
              <p className="text-xl text-gray-400 font-light lowercase">@{dados.name.replace(/\s/g, '').toLowerCase()}</p>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed border-b border-gray-100 pb-6">
              {dados.bio || "Full-stack developer building awesome APIs."}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} /> {dados.location || "Earth"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} /> {dados.email}
              </div>
            </div>

            {/* TECH STACK */}
            <div className="pt-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Top Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {dados.technologies?.map(tech => (
                  <span key={tech} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="md:col-span-8 lg:col-span-9 space-y-8">
            <div className="flex items-center gap-6 border-b border-gray-100 pb-4">
               <button className="text-sm font-bold border-b-2 border-orange-500 pb-4 -mb-[18px] flex items-center gap-2">
                  <BookOpen size={16} /> Overview
               </button>
               <button className="text-sm text-gray-400 hover:text-gray-900 pb-4 -mb-[18px] flex items-center gap-2 transition-colors">
                  <Package size={16} /> APIs <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px]">{dados.apis?.length || 0}</span>
               </button>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {dados.apis?.map((api) => (
                <Link key={api.id} href={`/api-detalhes/${api.id}`}>
                  <motion.div 
                    whileHover={{ scale: 1.01, borderColor: '#3b82f6' }}
                    className="h-full p-5 border border-gray-200 rounded-xl bg-white flex flex-col justify-between hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-600 font-bold group-hover:underline flex items-center gap-2">
                          <Code size={16} className="text-gray-400" />
                          {api.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          api.status === 'verified' ? 'border-green-200 text-green-600 bg-green-50' : 'border-gray-200 text-gray-400'
                        }`}>
                          {api.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mb-6 line-clamp-2">
                        {api.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-auto">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        {api.tags?.split(',')[0] || 'Web API'}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        {api.rating.toFixed(1)}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </section>

            {/* CONTRIBUTION GRAPH MOCK */}
            <section className="pt-4">
               <h2 className="text-sm font-bold text-gray-900 mb-4">Activity Heatmap</h2>
               <div className="border border-gray-100 rounded-xl p-6 bg-slate-50 overflow-hidden">
                  <div className="flex gap-1.5 justify-center">
                    {Array.from({ length: 45 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-3.5 h-3.5 rounded-sm ${i % 8 === 0 ? 'bg-green-600' : i % 3 === 0 ? 'bg-green-200' : 'bg-gray-200'}`} 
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                    <span>Less Active</span>
                    <span>More Active</span>
                  </div>
               </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}