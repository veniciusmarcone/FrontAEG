"use client";

import { useEffect, useState, useRef } from "react";

const LOGIN_VENDEDOR_MAP_KEY = "aeg_login_vendedor_map";
const PANEL_SESSION_KEY = "aeg_panel_session";

type PanelSession = { role: string; userName: string };

type Lead = {
  id: string;
  nome: string;
  telefone: string;
  cidade: string;
  estado: string;
  status: string;
  classificacao: string;
  created_at: string;
  atribuicoes: Array<{
    vendedor?: { id: string; nome: string; email: string };
  }>;
};

function readSession(): PanelSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PANEL_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PanelSession;
  } catch {
    return null;
  }
}

function vendedorIdForLogin(login: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const map = JSON.parse(localStorage.getItem(LOGIN_VENDEDOR_MAP_KEY) || "{}") as Record<string, string>;
    return map[login] || null;
  } catch {
    return null;
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const previousLeadIds = useRef<string[]>([]);
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchLeads = async (isPolling = false) => {
      const base = process.env.NEXT_PUBLIC_API_URL;
      if (!base) {
        if (!isPolling) setError("NEXT_PUBLIC_API_URL não configurada.");
        setLoading(false);
        return;
      }

      const session = readSession();

      if (!session) {
        if (!isPolling) setError(
          "Faça login no painel em /painel.html neste mesmo site. Usuários vendedores só veem os próprios leads após o vínculo CONECTAR V."
        );
        setLoading(false);
        return;
      }

      try {
        if (session.role === "USER") {
          const vid = vendedorIdForLogin(session.userName);
          if (!vid) {
            if (!isPolling) setError(
              "Seu login ainda não está conectado a um vendedor. No painel (admin), use CONECTAR V em Credenciais dos Vendedores."
            );
            setLoading(false);
            return;
          }
          const url = `${base}/leads?vendedor_id=${encodeURIComponent(vid)}&limit=500&page=1`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Erro ${res.status}`);
          const data = await res.json();
          const listUser = data.leads || [];
          const filteredLeads = listUser.filter((l: Lead) => l.status !== 'convertido');
          setLeads(filteredLeads);

          if (isPolling) {
            const currentIds = filteredLeads.map((l: Lead) => l.id);
            const newIds = currentIds.filter((id: string) => !previousLeadIds.current.includes(id));
            if (newIds.length > 0 && isInitialized.current) {
              setNotification(`Você acabou de receber ${newIds.length} novo(s) lead(s) para atendimento.`);
              try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play();
              } catch (e) { }
            }
          }
          previousLeadIds.current = filteredLeads.map((l: Lead) => l.id);
          isInitialized.current = true;
          return;
        }

        if (session.role === "ADMIN") {
          const res = await fetch(`${base}/leads/all`);
          if (!res.ok) throw new Error(`Erro ${res.status}`);
          const data = await res.json();
          const listAdmin = data.leads || [];
          const filteredLeads = listAdmin.filter((l: Lead) => l.status !== 'convertido');
          setLeads(filteredLeads);
          previousLeadIds.current = filteredLeads.map((l: Lead) => l.id);
          return;
        }

        if (!isPolling) setError("Sessão inválida. Entre novamente em /painel.html.");
      } catch (err) {
        console.error(err);
        if (!isPolling) setError("Não foi possível carregar os leads.");
      } finally {
        if (!isPolling) setLoading(false);
      }
    };

    fetchLeads();

    intervalId = setInterval(() => {
      fetchLeads(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 relative">
      {/* Pop-up de notificação (Modal Full Screen) */}
      {notification && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-8 max-w-md w-[90%] text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white mb-5 shadow-[0_4px_14px_rgba(245,158,11,0.4)]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-100 mb-3">Novo Lead Recebido!</h2>
            <p className="text-slate-400 mb-8">{notification}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setNotification(null)}
                className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Fechar aviso
              </button>
              <button
                onClick={() => setNotification(null)}
                className="px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-semibold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
              >
                Ver Leads Agora
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">Leads recebidos</h1>
          <p className="mt-2 text-slate-400">
            Lista conforme seu perfil no painel (vendedores: apenas leads atribuídos a você).
          </p>
        </header>

        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-200">
            Carregando leads...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-500 bg-rose-950/20 p-6 text-rose-300">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-lg shadow-slate-950/20">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead className="bg-slate-950/90 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">Cidade</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Classificação</th>
                  <th className="px-4 py-3">Vendedor</th>
                  <th className="px-4 py-3">Recebido em</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-400" colSpan={8}>
                      Nenhum lead encontrado.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-t border-slate-800/80">
                      <td className="px-4 py-4 text-slate-100">{lead.nome}</td>
                      <td className="px-4 py-4 text-slate-200">{lead.telefone}</td>
                      <td className="px-4 py-4 text-slate-200">{lead.cidade}</td>
                      <td className="px-4 py-4 text-slate-200">{lead.estado}</td>
                      <td className="px-4 py-4 text-slate-200 capitalize">{lead.status.replace('_', ' ')}</td>
                      <td className="px-4 py-4 text-slate-200 capitalize">{lead.classificacao}</td>
                      <td className="px-4 py-4 text-slate-200">
                        {lead.atribuicoes.length > 0
                          ? lead.atribuicoes.map((atr, index) => (
                            <span key={index} className="block">
                              {atr.vendedor?.nome || 'Sem vendedor'}
                            </span>
                          ))
                          : 'Sem vendedor'}
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {new Date(lead.created_at).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
