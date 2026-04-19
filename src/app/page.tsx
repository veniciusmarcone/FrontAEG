"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Funções para UTMs e envio de lead
function getUTMs() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get('utm_source') || '',
    utm_medium: p.get('utm_medium') || '',
    utm_campaign: p.get('utm_campaign') || '',
    utm_content: p.get('utm_content') || '',
  };
}

async function enviarLead(formData: any) {
  const payload = { ...formData, ...getUTMs() };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    // @ts-ignore
    gtag('event', 'generate_lead', {
      currency: 'BRL',
      value: 1
    });
  }
  return res.json();
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .aeg-root {
    display: flex;
    min-height: 100vh;
    background: #07070E;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── LEFT BRAND PANEL ── */
  .aeg-left {
    position: relative;
    width: 44%;
    min-height: 100vh;
    background: #07070E;
    padding: 3rem 3.5rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid rgba(255,255,255,0.06);
  }

  .aeg-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,160,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,160,0,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .aeg-glow-orb { position: absolute; border-radius: 50%; pointer-events: none; }
  .aeg-glow-orb-1 {
    bottom: -120px; left: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255,160,0,0.1) 0%, transparent 62%);
  }
  .aeg-glow-orb-2 {
    top: -80px; right: -80px;
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(255,60,0,0.07) 0%, transparent 65%);
  }

  .aeg-shield-bg {
    position: absolute;
    bottom: 1.5rem; right: -2rem;
    width: 220px; height: 220px;
    opacity: 0.04;
    pointer-events: none;
  }

  .aeg-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.2rem;
    letter-spacing: 0.12em;
    color: #fff;
    z-index: 1;
    text-transform: uppercase;
    margin-bottom: auto;
  }

  .aeg-logo-icon {
    width: 38px; height: 38px;
    background: #FFA000;
    color: #07070E;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 1.15rem;
    flex-shrink: 0;
  }

  .aeg-hero {
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.5rem 0 2rem;
  }

  .aeg-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.7rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #FFA000;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }
  .aeg-eyebrow::before {
    content: '';
    display: block;
    width: 24px; height: 1px;
    background: #FFA000;
  }

  .aeg-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.1rem, 3vw, 3.2rem);
    font-weight: 800;
    line-height: 1.05;
    color: #fff;
    letter-spacing: -0.03em;
    margin-bottom: 1.5rem;
  }
  .aeg-headline em { font-style: normal; color: #FFA000; }

  .aeg-subtitle {
    font-size: 1rem;
    line-height: 1.65;
    color: rgba(255,255,255,0.42);
    max-width: 360px;
  }

  .aeg-trust {
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 2rem;
  }
  .aeg-trust-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.55);
  }
  .aeg-trust-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #FFA000;
    flex-shrink: 0;
  }

  .aeg-stats {
    z-index: 1;
    display: flex;
    gap: 2.2rem;
    padding-top: 1.8rem;
    border-top: 1px solid rgba(255,255,255,0.07);
    margin-bottom: 2rem;
  }
  .aeg-stat { display: flex; flex-direction: column; gap: 3px; }
  .aeg-stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
  }
  .aeg-stat-label {
    font-size: 0.68rem;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .aeg-tags {
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .aeg-tag {
    display: inline-flex;
    align-items: center;
    padding: 5px 13px;
    border: 1px solid rgba(255,160,0,0.22);
    border-radius: 100px;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: rgba(255,160,0,0.75);
    text-transform: uppercase;
    background: rgba(255,160,0,0.05);
  }

  /* ── RIGHT FORM PANEL ── */
  .aeg-right {
    flex: 1;
    background: #0A0A13;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3.5rem 3rem;
  }

  .aeg-form-container { width: 100%; max-width: 500px; }
  .aeg-form-header { margin-bottom: 2.5rem; }

  .aeg-form-tag {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #FFA000;
    margin-bottom: 1rem;
  }
  .aeg-form-tag::before {
    content: '';
    display: block;
    width: 18px; height: 1px;
    background: #FFA000;
  }

  .aeg-form-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.5rem, 2.2vw, 2rem);
    font-weight: 700;
    line-height: 1.2;
    color: #fff;
    margin-bottom: 0.75rem;
    letter-spacing: -0.02em;
  }

  .aeg-form-desc {
    font-size: 0.88rem;
    color: rgba(255,255,255,0.38);
    line-height: 1.6;
  }

  .aeg-form { display: flex; flex-direction: column; gap: 1.1rem; }
  .aeg-row { display: flex; gap: 1rem; }
  .aeg-field { display: flex; flex-direction: column; gap: 7px; flex: 1; }

  .aeg-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.02em;
  }
  .aeg-label span { opacity: 0.45; }

  .aeg-input, .aeg-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 11px 15px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.93rem;
    color: #fff;
    outline: none;
    transition: border-color 0.18s, background 0.18s;
  }
  .aeg-input::placeholder, .aeg-textarea::placeholder { color: rgba(255,255,255,0.18); }
  .aeg-input:focus, .aeg-textarea:focus {
    border-color: rgba(255,160,0,0.55);
    background: rgba(255,160,0,0.03);
  }
  .aeg-textarea { resize: vertical; min-height: 105px; }

  .aeg-btn {
    width: 100%;
    padding: 14px 24px;
    background: #FFA000;
    color: #07070E;
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: opacity 0.18s, transform 0.15s;
    margin-top: 0.4rem;
  }
  .aeg-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .aeg-btn:active { transform: translateY(0); }
  .aeg-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* ── SUCCESS STATE ── */
  .aeg-success {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem 0;
  }
  .aeg-success-ring {
    width: 72px; height: 72px;
    border-radius: 50%;
    border: 2px solid rgba(255,160,0,0.35);
    background: rgba(255,160,0,0.08);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.5rem;
  }
  .aeg-success-check {
    width: 28px; height: 20px;
    border-left: 2.5px solid #FFA000;
    border-bottom: 2.5px solid #FFA000;
    transform: rotate(-45deg) translateY(-3px);
  }
  .aeg-success h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #fff;
  }
  .aeg-success p { color: rgba(255,255,255,0.4); font-size: 0.95rem; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .aeg-root { flex-direction: column; }
    .aeg-left { width: 100%; min-height: auto; padding: 2.5rem 2rem; }
    .aeg-logo { margin-bottom: 0; }
    .aeg-hero { padding: 2.5rem 0 1.5rem; }
    .aeg-right { padding: 2.5rem 2rem; }
  }
  @media (max-width: 520px) {
    .aeg-row { flex-direction: column; }
    .aeg-stats { gap: 1.5rem; }
  }
`;

export default function Home() {
  const [formData, setFormData] = useState({
    nome: "", telefone: "", cidade: "",
    estado: "", veiculo: "", origem: "", observacoes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await enviarLead(formData);
      if (res.lead) {
        setSubmitted(true);
        setFormData({ nome: "", telefone: "", cidade: "", estado: "", veiculo: "", origem: "", observacoes: "" });
      } else {
        alert("Erro ao enviar dados.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="aeg-root">

        {/* ── BRAND PANEL ── */}
        <div className="aeg-left">
          <div className="aeg-grid-bg" />
          <div className="aeg-glow-orb aeg-glow-orb-1" />
          <div className="aeg-glow-orb aeg-glow-orb-2" />

          <svg className="aeg-shield-bg" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 10L180 45V105C180 152 145 193 100 210C55 193 20 152 20 105V45L100 10Z" fill="white"/>
          </svg>

          <header className="aeg-logo">
            <div className="aeg-logo-icon">A</div>
            <span>AEG</span>
          </header>

          <div className="aeg-hero">
            <div className="aeg-eyebrow">Proteção Veicular</div>
            <h1 className="aeg-headline">
              Seu veículo<br />
              protegido com<br />
              <em>quem você<br />pode confiar.</em>
            </h1>
            <p className="aeg-subtitle">
              Cobertura completa, assistência 24 horas e atendimento humanizado para você rodar com total tranquilidade.
            </p>
          </div>

          <div className="aeg-trust">
            <div className="aeg-trust-item">
              <div className="aeg-trust-dot" />
              Rastreamento em tempo real incluso
            </div>
            <div className="aeg-trust-item">
              <div className="aeg-trust-dot" />
              Cobertura em todo o território nacional
            </div>
            <div className="aeg-trust-item">
              <div className="aeg-trust-dot" />
              Assistência mecânica, elétrica e guincho 24h
            </div>
          </div>

          <div className="aeg-stats">
            <div className="aeg-stat">
              <span className="aeg-stat-num">60k+</span>
              <span className="aeg-stat-label">Veículos protegidos</span>
            </div>
            <div className="aeg-stat">
              <span className="aeg-stat-num">99%</span>
              <span className="aeg-stat-label">Satisfação</span>
            </div>
            <div className="aeg-stat">
              <span className="aeg-stat-num">24h</span>
              <span className="aeg-stat-label">Atendimento</span>
            </div>
          </div>

          <div className="aeg-tags">
            <span className="aeg-tag">Proteção Total</span>
            <span className="aeg-tag">Rastreamento</span>
            <span className="aeg-tag">Assistência 24h</span>
            <span className="aeg-tag">Guincho</span>
          </div>
        </div>

        {/* ── FORM PANEL ── */}
        <div className="aeg-right">
          <div className="aeg-form-container">
            {submitted ? (
              <div className="aeg-success">
                <div className="aeg-success-ring">
                  <div className="aeg-success-check" />
                </div>
                <h2>Contato recebido!</h2>
                <p>Um consultor especializado entrará em contato em breve.</p>
                <button
                  className="aeg-btn"
                  style={{ marginTop: "1.5rem", maxWidth: 260 }}
                  onClick={() => setSubmitted(false)}
                >
                  Novo contato
                </button>
              </div>
            ) : (
              <>
                <div className="aeg-form-header">
                  <div className="aeg-form-tag">Solicite uma Proposta</div>
                  <h2 className="aeg-form-title">
                    Proteja seu veículo<br />hoje mesmo
                  </h2>
                  <p className="aeg-form-desc">
                    Preencha os dados abaixo e um consultor especializado entrará em contato com a melhor oferta para você.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="aeg-form">
                  <div className="aeg-row">
                    <div className="aeg-field">
                      <label className="aeg-label">Nome completo</label>
                      <input
                        className="aeg-input"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        placeholder="João Silva"
                      />
                    </div>
                    <div className="aeg-field">
                      <label className="aeg-label">Telefone / WhatsApp</label>
                      <input
                        className="aeg-input"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                        placeholder="(81) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="aeg-row">
                    <div className="aeg-field">
                      <label className="aeg-label">Cidade</label>
                      <input
                        className="aeg-input"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        required
                        placeholder="Caruaru"
                      />
                    </div>
                    <div className="aeg-field">
                      <label className="aeg-label">Estado</label>
                      <input
                        className="aeg-input"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        required
                        placeholder="PE"
                      />
                    </div>
                  </div>

                  <div className="aeg-row">
                    <div className="aeg-field">
                      <label className="aeg-label">Tipo de veículo</label>
                      <Select onValueChange={(v) => handleSelect("veiculo", v)}>
                        <SelectTrigger className="w-full bg-white/[0.04] border border-white/10 rounded-[10px] text-white h-auto py-[11px] px-[15px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Carro">Carro</SelectItem>
                          <SelectItem value="Moto">Moto</SelectItem>
                          <SelectItem value="Caminhão">Caminhão</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="aeg-field">
                      <label className="aeg-label">Como nos encontrou?</label>
                      <Select onValueChange={(v) => handleSelect("origem", v)}>
                        <SelectTrigger className="w-full bg-white/[0.04] border border-white/10 rounded-[10px] text-white h-auto py-[11px] px-[15px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Site">Site</SelectItem>
                          <SelectItem value="Redes Sociais">Redes Sociais</SelectItem>
                          <SelectItem value="Indicação">Indicação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="aeg-field">
                    <label className="aeg-label">
                      Observações <span>(opcional)</span>
                    </label>
                    <textarea
                      className="aeg-textarea"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleChange}
                      placeholder="Descreva seu veículo, ano, modelo ou dúvidas..."
                      rows={4}
                    />
                  </div>

                  <button type="submit" className="aeg-btn" disabled={loading}>
                    {loading ? "Enviando..." : "Quero proteger meu veículo →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
