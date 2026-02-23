'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

interface Props {
  slug: string;
  primeiraAulaId: string;
}

export default function BotaoContinuar({ slug, primeiraAulaId }: Props) {
  const [aulaDestino, setAulaDestino] = useState(primeiraAulaId);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const progresso = localStorage.getItem('apihub_progresso');
    if (progresso) {
      const dados = JSON.parse(progresso);
      if (dados[slug]) {
        setAulaDestino(dados[slug]);
      }
    }
    setCarregando(false);
  }, [slug]);

  if (carregando) return <div className="h-[52px] w-full bg-gray-100 animate-pulse rounded-2xl" />;

  return (
    <Link 
      href={`/academy/courses/${slug}/aula/${aulaDestino}`}
      className="w-full bg-blue-500 text-white font-black py-4 rounded-2xl hover:bg-blue-400 transition-all shadow-lg active:scale-95 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
    >
      <Play size={14} fill="white" />
      {aulaDestino === primeiraAulaId ? 'Começar Curso' : 'Continuar de onde parou'}
    </Link>
  );
}