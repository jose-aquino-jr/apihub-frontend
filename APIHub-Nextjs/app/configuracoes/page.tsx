'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Shield, Mail, Camera, User, Loader2, Check, Save } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { toast, Toaster } from 'sonner'

// Lista das 15 principais tecnologias/linguagens de Backend
const BACKEND_TECHS = [
  'Node.js', 'Python', 'Go (Golang)', 'Java', 'C# (.NET)', 
  'PHP', 'Ruby on Rails', 'Rust', 'Elixir', 'C++', 
  'TypeScript', 'Kotlin', 'Scala', 'Dart (Shelf)', 'Perl'
]

export default function Configuracoes() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // States
  const [name, setName] = useState(user?.name || '')
  const [description, setDescription] = useState(user?.description || '')
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatar_url || null)
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Inicializa as tecnologias que o usuário já tem salvas
  useEffect(() => {
    if (user?.tecnologies) {
      setSelectedTechs(user.tecnologies.split(',').map(t => t.trim()))
    }
  }, [user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Imagem muito grande. Limite de 2MB.")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulação de salvamento - Aqui entraria seu fetch para o backend
    setTimeout(() => {
      console.log({
        name,
        description,
        tecnologies: selectedTechs.join(','),
        avatar: previewUrl
      })
      toast.success("Configurações salvas com sucesso!")
      setIsSaving(false)
    }, 1500)
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gray-50 text-black px-4">
      <Toaster richColors position="top-right" />
      <div className="max-w-5xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Configurações</h1>
          <p className="text-gray-500 mt-1">Gerencie sua identidade na plataforma ApiHub.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Avatar Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center sticky top-28">
              <div className="relative inline-block group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-50 border-4 border-white shadow-xl">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-full text-white shadow-lg hover:scale-110 transition-all"
                >
                  <Camera size={18} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-xl text-gray-900">{name || user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Perfil */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-600" /> Informações do Perfil
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Nome Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Bio / Resumo Profissional</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Desenvolvedor focado em arquitetura de microsserviços..."
                    className="w-full p-4 h-28 rounded-2xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                {/* Tecnologias de Backend */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1">Tecnologias de Backend</label>
                  <div className="flex flex-wrap gap-2 p-5 rounded-[1.5rem] border-2 border-dashed border-gray-100 bg-gray-50/30">
                    {BACKEND_TECHS.map((tech) => {
                      const isSelected = selectedTechs.includes(tech)
                      return (
                        <button
                          key={tech}
                          onClick={() => toggleTech(tech)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100 scale-105' 
                              : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                          }`}
                        >
                          {isSelected && <Check size={14} />}
                          {tech}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </section>

            {/* Preferências */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Bell size={20} className="text-blue-600" /> Preferências
              </h2>
              <div className="space-y-4">
                {[{ icon: Mail, title: "Newsletter", desc: "Receber atualizações semanais" },
                  { icon: Shield, title: "Segurança", desc: "Alertas de login em novos dispositivos" }].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.desc}</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}