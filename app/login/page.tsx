"use client";

import { Button } from "@/components/ui/Button";
import { createRevealVariants, createScaleInVariants, createStaggerChildren, snappyEase } from "@/lib/animations";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const formVariants = {
  hidden: { opacity: 0, y: 12, x: 6 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration: 0.24,
      ease: snappyEase,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    x: -6,
    transition: {
      duration: 0.18,
      ease: snappyEase,
    },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hoverDuration, isMobile, revealDuration } = useMotionProfile();
  const revealVariants = createRevealVariants(isMobile);
  const fieldStagger = createStaggerChildren(isMobile);
  const isAdminLogin = searchParams.get("admin") === "1";

  const fieldClasses =
    "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-white/32 focus:border-cyan-300/40 focus:shadow-[0_0_0_1px_rgba(76,201,255,0.22),0_0_26px_rgba(76,201,255,0.12)]";

  const violetFieldClasses =
    "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-white/32 focus:border-violet-300/40 focus:shadow-[0_0_0_1px_rgba(167,139,250,0.22),0_0_26px_rgba(167,139,250,0.12)]";

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Connexion impossible");
      }

      router.replace("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Connexion impossible");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-4 py-8 text-[var(--foreground)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(76,201,255,0.16),transparent_24%),radial-gradient(circle_at_82%_10%,rgba(139,92,246,0.2),transparent_24%),linear-gradient(180deg,#09111f_0%,#0b0f1a_100%)]" />
      <div className="absolute left-[-8%] top-16 h-56 w-56 rounded-full bg-cyan-400/14 blur-3xl" />
      <div className="absolute right-[-10%] top-10 h-72 w-72 rounded-full bg-violet-500/14 blur-3xl" />
      <div className="ambient-orb absolute bottom-[-6rem] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/12 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: revealDuration, ease: snappyEase }}
        className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6"
      >
        <motion.div
          whileHover={{ scale: isMobile ? 1.02 : 1.04, y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: hoverDuration, ease: snappyEase }}
        >
          <Link
            href="/"
            aria-label="Retour a l'accueil"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/18 bg-white/10 text-cyan-100 shadow-[0_0_0_1px_rgba(76,201,255,0.12),0_0_24px_rgba(76,201,255,0.08)] backdrop-blur-md transition duration-300 hover:border-cyan-300/38 hover:shadow-[0_0_0_1px_rgba(76,201,255,0.2),0_0_38px_rgba(76,201,255,0.16)]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.section
        variants={revealVariants}
        initial="hidden"
        animate="visible"
        className="glass-panel auth-panel relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] px-5 py-6 shadow-[0_24px_80px_rgba(4,8,20,0.42)] sm:px-7 sm:py-8"
      >
        <div className="banner-animated-surface absolute inset-0 opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(76,201,255,0.08),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.12),transparent_28%)]" />

        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/6 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/82 sm:text-xs sm:tracking-[0.22em]">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(76,201,255,0.8)]" />
            
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {isRegister ? (
              <motion.div
                key="register"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h1 className="font-[family-name:var(--font-orbitron)] text-3xl font-black uppercase tracking-[0.06em] text-white sm:text-4xl">
                  Inscription
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/68 sm:text-base">
                  Cree ton compte gaming premium
                </p>

                <motion.form
                  variants={fieldStagger}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 space-y-4"
                >
                  <motion.label variants={createScaleInVariants(0, isMobile)} className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/54">
                      Nom
                    </span>
                    <input
                      type="text"
                      placeholder="Ton pseudo"
                      className={fieldClasses}
                    />
                  </motion.label>

                  <motion.label variants={createScaleInVariants(1, isMobile)} className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/54">
                      Email
                    </span>
                    <input
                      type="email"
                      placeholder="ton@email.com"
                      className={fieldClasses}
                    />
                  </motion.label>

                  <motion.label variants={createScaleInVariants(2, isMobile)} className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/54">
                      Mot de passe
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={violetFieldClasses}
                    />
                  </motion.label>

                  <motion.label variants={createScaleInVariants(3, isMobile)} className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/54">
                      Confirmer mot de passe
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={violetFieldClasses}
                    />
                  </motion.label>

                  <motion.div variants={createScaleInVariants(4, isMobile)} className="pt-2">
                    <Button className="w-full justify-center">Creer mon compte</Button>
                  </motion.div>
                </motion.form>

                <div className="mt-5 text-sm text-white/62">
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="transition hover:text-cyan-200"
                  >
                    Deja un compte ? Se connecter
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h1 className="font-[family-name:var(--font-orbitron)] text-3xl font-black uppercase tracking-[0.06em] text-white sm:text-4xl">
                  Connexion
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/68 sm:text-base">
                  {isAdminLogin ? "Acces admin securise pour gerer le catalogue et les publications." : "Accede a ton espace client."}
                </p>
                

                <motion.form
                  onSubmit={handleLogin}
                  variants={fieldStagger}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 space-y-4"
                >
                  <motion.label variants={createScaleInVariants(0, isMobile)} className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/54">
                      Email
                    </span>
                    <input
                      type="email"
                      placeholder="ton@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={fieldClasses}
                    />
                  </motion.label>

                  <motion.label variants={createScaleInVariants(1, isMobile)} className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/54">
                      Mot de passe
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className={violetFieldClasses}
                    />
                  </motion.label>

                  {error ? (
                    <motion.p variants={createScaleInVariants(2, isMobile)} className="text-sm text-rose-200">
                      {error}
                    </motion.p>
                  ) : null}

                  <motion.div variants={createScaleInVariants(3, isMobile)} className="pt-2">
                    <Button type="submit" className="w-full justify-center">
                      {isSubmitting ? "Connexion..." : isAdminLogin ? "Acceder a l'administration" : "Se connecter"}
                    </Button>
                  </motion.div>
                </motion.form>

                <div className="mt-5 flex items-center justify-between gap-3 text-sm text-white/62">
                  <Link href="#" className="transition hover:text-cyan-200">
                    Mot de passe oublie
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="transition hover:text-violet-200"
                  >
                    Creer un compte
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </main>
  );
}