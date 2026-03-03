'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Shield, Mail, Camera, User, Loader2, Check, Save } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { toast, Toaster } from 'sonner'

const BACKEND_TECHS = [
  'Node.js', 'Python', 'Go (Golang)', 'Java', 'C# (.NET)', 
  'PHP', 'Ruby on Rails', 'Rust', 'Elixir', 'C++', 
  'TypeScript', 'Kotlin', 'Scala', 'Dart (Shelf)', 'Perl'
]

export default function Configuracoes() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // States inicializados com os dados do usuário
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Sincroniza estados quando o user carrega
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setDescription(user.description || '')
      setPreviewUrl(user.avatar_url || null)
      if (user.tecnologies) {
        setSelectedTechs(user.tecnologies.split(',').filter(t => t !== ''))
      }
    }
  }, [user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Imagem muito grande", { description: "O limite é de 2MB." })
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
    const token = localStorage.getItem('authToken')

    if (!token) {
      toast.error("Sessão expirada", { description: "Faça login novamente." })
      setIsSaving(false)
      return
    }

    try {
      const payload = {
        name,
        description,
        tecnologies: selectedTechs.join(','),
        // IMPORTANTE: Só enviamos o avatar_url se ele for uma nova imagem (base64) 
        // ou se já for uma URL existente.
        avatar_url: previewUrl 
      }

      const res = await fetch('https://apihub-br.duckdns.org/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const data = await res.json()
        toast.success("Perfil sincronizado!", {
          description: "Suas alterações já estão visíveis no APIHub."
        })
        
        // Dica: Se o seu useAuth tiver uma função 'refreshUser', chame-a aqui.
      } else {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Erro ao salvar dados")
      }
    } catch (error: any) {
      toast.error("Falha na atualização", { description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gray-50 text-black px-4">
      <Toaster richColors position="top-right" />
      <div className="max-w-5xl mx-auto">
        
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Configurações</h1>
          <p className="text-gray-500 mt-1">Sincronize seu perfil com o Catálogo de APIs.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Avatar Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center sticky top-28 transition-all hover:shadow-md">
              <div className="relative inline-block group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-xl mx-auto">
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
                  className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-full text-white shadow-lg hover:scale-110 transition-all z-10"
                >
                  <Camera size={18} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-xl text-gray-900 truncate">{name || user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-600" /> Informações da Conta
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Nome de Exibição</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Bio Profissional</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 h-28 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Conte um pouco sobre suas experiências com APIs..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 ml-1">Stack de Backend</label>
                  <div className="flex flex-wrap gap-2 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    {BACKEND_TECHS.map((tech) => {
                      const isSelected = selectedTechs.includes(tech)
                      return (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => toggleTech(tech)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                              : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                          }`}
                        >
                          {isSelected && <Check size={12} />}
                          {tech}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {isSaving ? "Sincronizando..." : "Salvar Alterações"}
                </button>
              </div>
            </section>

            {/* Preferências (Simulado) */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 opacity-80">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Bell size={20} className="text-blue-600" /> Notificações
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2">
                  <div className="text-sm font-medium text-gray-700">Avisar quando minha API for favoritada</div>
                  <div className="w-10 h-5 bg-blue-600 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-2 border-t border-gray-50 pt-4">
                  <div className="text-sm font-medium text-gray-700">Receber newsletter da Academy</div>
                  <div className="w-10 h-5 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}