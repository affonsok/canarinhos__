"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  IconDownload,
  IconX,
  IconDeviceMobile,
  IconShare,
  IconCheck,
} from "@tabler/icons-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Verifica se já está em modo standalone (app já instalado e aberto como PWA)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://");
      if (isStandaloneMode) {
        setIsStandalone(true);
        setDismissed(true);
        return true;
      }
      return false;
    };

    if (checkStandalone()) {
      return;
    }

    // 2. Verifica se o usuário já dispensou nas últimas 24h
    const lastDismissed = localStorage.getItem("canarinhos_pwa_dismissed");
    if (lastDismissed) {
      const dismissedTime = parseInt(lastDismissed, 10);
      // Se dispensou há menos de 24 horas, mantém fechado por cortesia
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        setDismissed(true);
      } else {
        setDismissed(false);
      }
    } else {
      setDismissed(false);
    }

    // 3. Detecta iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari =
      /safari/.test(ua) && !/chrome|crios|fxios|edgios|android/.test(ua);
    setIsIos(isIosDevice && isSafari);

    // 4. Captura o evento nativo beforeinstallprompt (Chrome / Android / Edge / Opera)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setDismissed(false);
    };

    const handleAppInstalled = () => {
      setInstalledSuccess(true);
      setDeferredPrompt(null);
      setTimeout(() => {
        setDismissed(true);
      }, 3000);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Navegador com suporte nativo ao prompt
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setInstalledSuccess(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error("Erro ao solicitar instalação PWA:", err);
      }
    } else if (isIos) {
      // iOS Safari: abre guia com as instruções de adicionar à tela de início
      setShowIosGuide((prev) => !prev);
    } else {
      // Fallback para navegadores que não disparam beforeinstallprompt imediatamente
      alert(
        "Para instalar no seu celular: abra o menu do navegador (três pontos) e selecione 'Instalar aplicativo' ou 'Adicionar à tela inicial'."
      );
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("canarinhos_pwa_dismissed", Date.now().toString());
  };

  // Não exibe se já for standalone ou se o usuário dispensou
  if (isStandalone || dismissed) {
    return null;
  }

  return (
    <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-[#0c1e38] to-[#162f55] text-white border border-[#1e3a5f] shadow-sm relative overflow-hidden transition-all">
      {/* Background sutil */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#fff 1px, transparent 1px), radial-gradient(#fff 1px, #0c1e38 1px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm border border-white/20">
            {/* Logo do app */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-192x192.png"
              alt="Ícone Canarinhos"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                Instalar Aplicativo Canarinhos no Celular
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#c9a227] text-slate-950">
                PWA
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-0.5 leading-snug max-w-xl">
              Acesse suas partituras e gravações de naipe direto da tela inicial, mais rápido e sem a barra do navegador.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#c9a227] hover:bg-[#b58f1f] active:scale-95 text-slate-950 text-xs font-black transition-all shadow-sm min-h-[44px]"
          >
            {installedSuccess ? (
              <>
                <IconCheck size={16} />
                <span>Instalado com Sucesso</span>
              </>
            ) : isIos ? (
              <>
                <IconShare size={16} />
                <span>Como Adicionar à Tela Inicial</span>
              </>
            ) : (
              <>
                <IconDownload size={16} />
                <span>Instalar Agora</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dispensar aviso de instalação"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 border border-white/10"
          >
            <IconX size={16} />
          </button>
        </div>
      </div>

      {/* Instruções passo a passo para iOS Safari */}
      {showIosGuide && (
        <div className="mt-3.5 pt-3.5 border-t border-white/15 text-xs text-slate-200 space-y-2">
          <p className="font-bold text-[#fde047]">
            Instruções para iPhone / iPad (Safari):
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
            <li>
              Toque no botão <strong className="text-white">Compartilhar</strong> (ícone de quadrado com uma seta para cima na barra inferior do Safari).
            </li>
            <li>
              Role a lista de ações para baixo e toque em <strong className="text-white">&quot;Adicionar à Tela de Início&quot;</strong>.
            </li>
            <li>
              Confirme tocando em <strong className="text-white">&quot;Adicionar&quot;</strong> no canto superior direito.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
