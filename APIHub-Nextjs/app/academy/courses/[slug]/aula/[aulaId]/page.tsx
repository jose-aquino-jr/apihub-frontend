import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import BotaoConcluir from '@/components/BotaoConcluir';
import Progresso from '@/components/Progresso';

export const dynamic = 'force-dynamic';

// --- CONFIGURAÇÃO ---
const API_BASE = 'https://apihub-br.duckdns.org';

// --- INTERFACES ---
interface Bloco {
  id: string;
  tipo: 'texto' | 'video';
  ordem: number;
  titulo: string;
  conteudo?: string;
  modulo_id: string;
  moduloTitulo: string;
}

// --- FUNÇÕES DE BUSCA CORRIGIDAS (CONFORME DOC) ---

async function getFullCourseData(slug: string) {
  try {
    // 1. Busca ID pelo Slug - Endpoint Oficial 6.2: GET /cursos/slug/{slug}
    const resSlug = await fetch(`${API_BASE}/cursos/slug/${slug}`, { 
      next: { revalidate: 30 } 
    });
    const slugData = await resSlug.json();
    
    if (!slugData.success || !slugData.data) return null;

    // 2. Busca Conteúdo Completo - Endpoint Oficial 6.3: GET /cursos/{id}/details
    const resFull = await fetch(`${API_BASE}/cursos/${slugData.data.id}/details`, { 
      next: { revalidate: 30 } 
    });
    const fullData = await resFull.json();
    
    return fullData.success ? fullData.data : null;
  } catch (error) { 
    console.error("Erro ao buscar dados do curso:", error);
    return null; 
  }
}

async function getUserProgress(cursoId: string) {
  try {
    // Endpoint Oficial 7.1: GET /progresso/{cursoId}
    // Nota: Em produção, deves passar o Cookie de autenticação aqui
    const res = await fetch(`${API_BASE}/progresso/${cursoId}`, { 
      cache: 'no-store' 
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) { 
    console.error("Erro ao buscar progresso:", error);
    return null; 
  }
}

export default async function AulaPage({ params }: { params: Promise<{ slug: string, aulaId: string }> }) {
  // No Next.js 15, params é uma Promise
  const { slug, aulaId } = await params;

  // 1. Carregar dados do curso (Módulos -> Blocos)
  const course = await getFullCourseData(slug);
  if (!course || !course.modulos) notFound();

  // 2. Organizar a Linha do Tempo (Ajustado para o campo 'modulos' da doc)
  const linhaDoTempo: Bloco[] = course.modulos
    .sort((a: any, b: any) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0))
    .flatMap((mod: any) =>
      (mod.blocos || []) // Ajustado de curso_blocos para blocos conforme padrão
        .sort((a: any, b: any) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0))
        .map((bloco: any) => ({
          ...bloco,
          modulo_id: mod.id,
          moduloTitulo: mod.titulo
        }))
    );

  // 3. Localizar aula atual
  const indiceGlobal = linhaDoTempo.findIndex(b => String(b.id) === String(aulaId));
  if (indiceGlobal === -1) notFound();

  const aulaAtual = linhaDoTempo[indiceGlobal];
  const proximaAula = linhaDoTempo[indiceGlobal + 1];

  // 4. Validar Acesso e Progresso
  const progresso = await getUserProgress(course.id);
  // O backend retorna os blocos concluídos em 'concluidos' ou 'detalhes'
  const aulasConcluidasIds = progresso?.concluidos?.map((c: any) => String(c.bloco_id)) || [];

  const podeAcessar = indiceGlobal === 0 || aulasConcluidasIds.includes(String(linhaDoTempo[indiceGlobal - 1].id));
  
  if (!podeAcessar) {
    redirect(`/academy/courses/${slug}?error=aula-bloqueada`);
  }

  const progressoPorcentagem = Math.round(((indiceGlobal + 1) / linhaDoTempo.length) * 100);
  const jaConcluida = aulasConcluidasIds.includes(String(aulaAtual.id));

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Progresso slug={slug} aulaId={aulaId} />
      
      {/* Barra de Progresso Superior */}
      <div className="fixed top-0 left-0 w-full h-3 bg-gray-100 z-[100]">
        <div 
          className="h-full bg-blue-600 transition-all duration-700" 
          style={{ width: `${progressoPorcentagem}%` }} 
        />
      </div>

      {/* Navegação */}
      <nav className="border-b bg-white/90 backdrop-blur-md px-6 py-4 sticky top-3 z-50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href={`/academy/courses/${slug}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{progressoPorcentagem}% CONCLUÍDO</span>
            <h2 className="text-sm font-bold text-gray-900 truncate max-w-xs uppercase">{aulaAtual.titulo}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {indiceGlobal > 0 && (
            <Link 
              href={`/academy/courses/${slug}/aula/${linhaDoTempo[indiceGlobal - 1].id}`} 
              className="p-2 text-gray-400 hover:text-blue-600"
            >
              <ChevronLeft size={24} />
            </Link>
          )}
          {proximaAula && (jaConcluida || podeAcessar) && (
            <Link 
              href={`/academy/courses/${slug}/aula/${proximaAula.id}`} 
              className="p-2 text-gray-400 hover:text-blue-600"
            >
              <ChevronRight size={24} />
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-6">
        {/* Renderização do Conteúdo */}
        <div className="mb-12">
          {aulaAtual.tipo === 'video' ? (
            <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <iframe 
                title={aulaAtual.titulo}
                src={aulaAtual.conteudo} 
                className="w-full h-full" 
                allowFullScreen 
              />
            </div>
          ) : (
            <div className="py-20 bg-gradient-to-br from-blue-50 to-white rounded-[2.5rem] border-2 border-dashed border-blue-100 flex flex-col items-center text-center">
              <FileText size={56} className="text-blue-500/40 mb-4" />
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Material de Leitura</p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Módulo: {aulaAtual.moduloTitulo}</p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">{aulaAtual.titulo}</h1>
        </div>

        <article 
          className="prose prose-blue prose-lg max-w-none" 
          dangerouslySetInnerHTML={{ __html: aulaAtual.conteudo || '' }} 
        />

        {/* Rodapé de Conclusão */}
        <div className="mt-24 pt-10 border-t border-gray-100 flex flex-col items-center">
          {proximaAula ? (
             jaConcluida ? (
               <Link 
                 href={`/academy/courses/${slug}/aula/${proximaAula.id}`}
                 className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg"
               >
                 AVANÇAR PARA PRÓXIMA
               </Link>
             ) : (
               <BotaoConcluir
                 cursoId={course.id}
                 moduloId={aulaAtual.modulo_id}
                 blocoId={aulaAtual.id}
                 proximaAulaUrl={`/academy/courses/${slug}/aula/${proximaAula.id}`}
               />
             )
          ) : (
            <div className="text-center">
              <div className="text-green-600 font-black text-2xl mb-4">🏆 CURSO FINALIZADO!</div>
              <Link href="/academy" className="text-blue-600 font-bold hover:underline">Voltar para a biblioteca</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}