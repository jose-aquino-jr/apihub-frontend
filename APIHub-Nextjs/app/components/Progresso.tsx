'use client';

import { useEffect } from 'react';

interface Props {
  slug: string;
  aulaId: string;
}

export default function GerenciadorProgresso({ slug, aulaId }: Props) {
  useEffect(() => {
    // Salva um objeto com a última aula acessada para cada curso
    const progressoLocal = localStorage.getItem('apihub_progresso');
    const dados = progressoLocal ? JSON.parse(progressoLocal) : {};

    dados[slug] = aulaId;

    localStorage.setItem('apihub_progresso', JSON.stringify(dados));
  }, [slug, aulaId]);

  return null; // Não renderiza nada visualmente
}