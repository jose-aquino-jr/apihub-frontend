'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from './AuthProvider'
import Image from 'next/image'
import { Menu, X, PlusCircle } from 'lucide-react' // Adicionei PlusCircle para o botão

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Image 
                src="/Logo.png" 
                alt="APIHub Logo"
                width={64}
                height={64}
                className="w-10 h-10 md:w-16 md:h-16 object-contain"
              />
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              APIHub
            </span>
          </Link>

          {/* Navigation - Desktop (Removido 'Adicionar API' daqui) */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Início
            </Link>
            <Link href="/apis" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Catálogo
            </Link>
            <Link href="/academy" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
              Academy
            </Link>
            <Link href="/suporte" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Suporte
            </Link>
            <Link href="/ranking" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Ranking
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Auth Section & Action Button - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* BOTÃO ADICIONAR API - Visível apenas logado */}
                <Link 
                  href="/criacao" 
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition-all border border-blue-100"
                >
                  <PlusCircle size={18} />
                  <span>Adicionar API</span>
                </Link>

                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute top-12 right-0 bg-white rounded-xl p-4 min-w-48 shadow-xl border border-gray-200 animate-in fade-in zoom-in duration-200">
                      <div className="text-sm font-bold text-gray-800">{user.name}</div>
                      <div className="text-xs text-gray-500 mb-4 truncate">{user.email}</div>
                      
                      <div className="space-y-1">
                        <Link href="/favoritos" className="block py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded px-2 transition-colors">
                          ⭐ Favoritos
                        </Link>
                        <Link href="/academy/dashboard" className="block py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded px-2 transition-colors">
                          📚 Meus Cursos
                        </Link>
                        <Link href="/minhas_apis" className="block py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded px-2 transition-colors">
                          🛠️ Minhas APIs
                        </Link>
                        <Link href="/configuracoes" className="block py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded px-2 transition-colors">
                          ⚙️ Configurações
                        </Link>
                      </div>
                      
                      <button 
                        onClick={logout}
                        className="w-full text-left py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded px-2 mt-2 border-t border-gray-100 pt-3 flex items-center gap-2"
                      >
                        🚪 Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link 
                href="/login" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4 px-2">
              <Link href="/" className="text-gray-700 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Início</Link>
              <Link href="/apis" className="text-gray-700 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
              
              {/* No Mobile, mostramos o Adicionar API na lista se logado */}
              {user && (
                <Link href="/criacao" className="text-blue-600 font-bold py-2 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <PlusCircle size={20} /> Adicionar API
                </Link>
              )}

              <Link href="/academy" className="text-gray-700 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Academy</Link>
              <Link href="/suporte" className="text-gray-700 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Suporte</Link>
              <Link href="/ranking" className="text-gray-700 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Ranking</Link>
              
              {/* Mobile Auth */}
              {user ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-bold text-gray-900 px-2">{user.name}</div>
                  <Link href="/minhas_apis" className="block py-2 text-gray-700 px-2" onClick={() => setIsMenuOpen(false)}>🛠️ Minhas APIs</Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left py-2 text-red-600 px-2">🚪 Sair</button>
                </div>
              ) : (
                <Link href="/login" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium text-center" onClick={() => setIsMenuOpen(false)}>
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}