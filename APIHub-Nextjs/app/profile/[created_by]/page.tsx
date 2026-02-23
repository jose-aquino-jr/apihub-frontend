"use client";

import { User, Code, Globe, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PerfilUsuario() {
  // Dados baseados nos seus registros
  const usuario = {
    nome: "Vinicius Gabriel Pereira Cruz",
    created_by:"bocozice",
    bio: "Estudante de Desenvolvimento de Sistemas na Etec de Praia Grande.",
    localizacao: "Praia Grande, SP",
    email: "vicabornato@gmail.com",
    // Simulando a lista de APIs que seriam carregadas do seu banco de dados
    apis: [
      { id: 1, nome: "API de Clima Real", slug: "api-clima-real", categoria: "Ferramentas", status: "Online" },
      { id: 2, nome: "ETECS API", slug: "etecs-api", categoria: "Produtividade", status: "Online" },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* HEADER DO PERFIL */}
        <header className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {usuario.nome.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{usuario.nome}</h1>
            <p className="text-gray-600 leading-relaxed mb-4 max-w-2xl">{usuario.bio}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin size={16}/> {usuario.localizacao}</span>
              <span className="flex items-center gap-1"><Mail size={16}/> {usuario.email}</span>
            </div>
          </div>
        </header>

        {/* SEÇÃO DE APIS */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Code className="text-blue-600" /> Minhas APIs Criadas
            </h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {usuario.apis.length} Ativas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {usuario.apis.map((api) => (
              <motion.div 
                key={api.id}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <Globe size={24} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    api.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {api.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{api.nome}</h3>
                <p className="text-gray-500 text-sm mb-4">/apis/{api.slug}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{api.categoria}</span>
                  <button className="text-blue-600 font-bold text-sm hover:underline">Ver Detalhes</button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}