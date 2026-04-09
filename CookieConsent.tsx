"use client";

import React, { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "consent" | "details" | "about";

interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "cookie_consent_v1";

// ─── Helper: read persisted preferences ──────────────────────────────────────
function loadPreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ToggleProps {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const Toggle: React.FC<ToggleProps> = ({ id, checked, disabled = false, onChange, label }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a192f]
      ${disabled
        ? "cursor-not-allowed border-[#d4af37]/60 bg-[#d4af37]/30"
        : checked
          ? "cursor-pointer border-[#d4af37] bg-[#d4af37]/20"
          : "cursor-pointer border-white/20 bg-white/5"
      }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 rounded-full transition-all duration-300 shadow-md
        ${checked
          ? "translate-x-5 bg-[#d4af37] shadow-[0_0_8px_rgba(212,205,55,0.6)]"
          : "translate-x-0.5 bg-white/40"
        }`}
    />
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("consent");
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false,
  });

  // Only render after hydration to avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
    const saved = loadPreferences();
    if (!saved) {
      // Show with a small delay for a smoother entry
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
    // preferences already saved – apply them silently
    if (saved) setPrefs(saved);
  }, []);

  const save = (selectedPrefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPrefs));
    setVisible(false);
  };

  const handleNecessaryOnly = () =>
    save({ necessary: true, preferences: false, statistics: false, marketing: false });

  const handleAllowSelection = () => save(prefs);

  const handleAllowAll = () =>
    save({ necessary: true, preferences: true, statistics: true, marketing: true });

  const togglePref = (key: keyof Omit<CookiePreferences, "necessary">) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  if (!mounted || !visible) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "consent", label: "Consent" },
    { id: "details", label: "Details" },
    { id: "about", label: "About" },
  ];

  const categories = [
    {
      key: "necessary" as const,
      label: "Necessary",
      description:
        "Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas. The website cannot function properly without these cookies.",
      disabled: true,
    },
    {
      key: "preferences" as const,
      label: "Preferences",
      description:
        "Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.",
      disabled: false,
    },
    {
      key: "statistics" as const,
      label: "Statistics",
      description:
        "Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.",
      disabled: false,
    },
    {
      key: "marketing" as const,
      label: "Marketing",
      description:
        "Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.",
      disabled: false,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm animate-[fadeIn_0.4s_ease]"
      />

      {/* Popup */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-dialog-title"
        className="fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:items-center sm:p-6 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-[#0a192f] shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(212,205,55,0.08)] text-white">

          {/* ── Top accent line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60" />

          {/* ── Tabs */}
          <div className="flex border-b border-white/10 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-4 px-3 text-[13px] font-semibold tracking-wide transition-colors duration-200 focus:outline-none
                  ${activeTab === tab.id
                    ? "text-[#d4af37]"
                    : "text-white/40 hover:text-white/70"
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[#d4af37] shadow-[0_0_8px_rgba(212,205,55,0.7)]" />
                )}
              </button>
            ))}
          </div>

          {/* ── Body */}
          <div className="overflow-y-auto max-h-[60vh] px-6 py-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

            {/* CONSENT TAB */}
            {activeTab === "consent" && (
              <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
                <h2 id="cookie-dialog-title" className="text-[17px] font-bold text-white leading-snug">
                  This website uses cookies
                </h2>
                <p className="text-[13px] text-white/55 leading-relaxed">
                  We use cookies to personalise content and ads, to provide social media features and to
                  analyse our traffic. We also share information about your use of our site with our social
                  media, advertising and analytics partners who may combine it with other information
                  that you&apos;ve provided to them or that they&apos;ve collected from your use of their services.
                </p>

                {/* Toggles */}
                <div className="space-y-3 pt-1">
                  {categories.map(({ key, label, disabled }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 hover:bg-white/[0.05] transition-colors duration-200"
                    >
                      <span className="text-[13px] font-medium text-white/80">{label}</span>
                      <Toggle
                        id={`toggle-${key}`}
                        checked={prefs[key]}
                        disabled={disabled}
                        onChange={() => key !== "necessary" && togglePref(key as keyof Omit<CookiePreferences, "necessary">)}
                        label={`Toggle ${label} cookies`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
                <h2 className="text-[15px] font-bold text-white">Cookie Details</h2>
                <div className="space-y-3">
                  {categories.map(({ key, label, description, disabled }) => (
                    <details
                      key={key}
                      className="group rounded-xl border border-white/[0.07] bg-white/[0.03] overflow-hidden"
                    >
                      <summary className="flex cursor-pointer items-center justify-between px-4 py-3 list-none select-none">
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${prefs[key] ? "bg-[#d4af37] shadow-[0_0_6px_rgba(212,205,55,0.7)]" : "bg-white/20"}`}
                          />
                          <span className="text-[13px] font-semibold text-white/80">{label}</span>
                          {disabled && (
                            <span className="rounded-full bg-[#d4af37]/15 px-2 py-0.5 text-[10px] font-bold text-[#d4af37] uppercase tracking-wide">
                              Always on
                            </span>
                          )}
                        </div>
                        <Toggle
                          id={`detail-toggle-${key}`}
                          checked={prefs[key]}
                          disabled={disabled}
                          onChange={() => key !== "necessary" && togglePref(key as keyof Omit<CookiePreferences, "necessary">)}
                          label={`Toggle ${label} cookies`}
                        />
                      </summary>
                      <p className="border-t border-white/[0.06] px-4 py-3 text-[12px] text-white/50 leading-relaxed">
                        {description}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === "about" && (
              <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
                <h2 className="text-[15px] font-bold text-white">About Cookies</h2>
                <p className="text-[13px] text-white/55 leading-relaxed">
                  Cookies are small text files that can be used by websites to make a user&apos;s experience
                  more efficient. The law states that we can store cookies on your device if they are
                  strictly necessary for the operation of this site. For all other types of cookies we
                  need your permission.
                </p>
                <p className="text-[13px] text-white/55 leading-relaxed">
                  This site uses different types of cookies. Some cookies are placed by third party
                  services that appear on our pages. You can at any time change or withdraw your consent
                  from the Cookie Declaration on our website.
                </p>
                <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-4">
                  <p className="text-[12px] text-[#d4af37]/80 leading-relaxed">
                    Your consent applies to the following domains:{" "}
                    <span className="font-semibold text-[#d4af37]">taw10.ma</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer buttons */}
          <div className="flex flex-col gap-2 border-t border-white/[0.07] bg-[#06101d] px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={handleNecessaryOnly}
              className="rounded-lg border border-white/15 bg-transparent px-4 py-2.5 text-[12px] font-semibold text-white/60 transition-all duration-200 hover:border-white/30 hover:text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Use necessary cookies only
            </button>
            <button
              onClick={handleAllowSelection}
              className="rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2.5 text-[12px] font-semibold text-[#d4af37] transition-all duration-200 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50"
            >
              Allow selection
            </button>
            <button
              onClick={handleAllowAll}
              className="rounded-lg bg-[#d4af37] px-4 py-2.5 text-[12px] font-bold text-[#0a192f] transition-all duration-200 hover:bg-[#ebd380] hover:shadow-[0_0_20px_rgba(212,205,55,0.35)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
            >
              Allow all cookies
            </button>
          </div>
        </div>
      </div>

      {/* ── Keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      ` }} />
    </>
  );
};

export default CookieConsent;
