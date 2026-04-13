"use client";

import { Container } from "@/components/ui/Container";
import { createRevealVariants, createScaleInVariants, createStaggerChildren, snappyEase } from "@/lib/animations";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { Gamepad2, Gift, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const bannerImages = ["/image.png", "/image%20copy.png"];
const mobileIconClickDuration = 0.4;

const iconItems = [
	{
		label: "Gaming",
		mobileLabel: "Top up",
		href: "/games",
		Icon: Gamepad2,
		accent: "from-cyan-500/24 via-sky-400/14 to-transparent",
		border: "border-cyan-300/28",
		glow: "shadow-[0_0_28px_rgba(76,201,255,0.18)]",
		glowAura: "bg-[rgba(244,63,94,0.28)] shadow-[0_0_15px_rgba(244,63,94,0.25)]",
		mobileButtonGlow: "shadow-[0_0_15px_rgba(244,63,94,0.25)]",
		iconClassName: "fill-transparent stroke-current stroke-[2.1] text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.28)]",
		mobileIconClassName: "fill-transparent stroke-current stroke-[2.1] text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.18)]",
		iconSurface: "bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(8,12,24,0.18))] shadow-[inset_0_0_18px_rgba(255,255,255,0.04)]",
	},
	{
		label: "Boutique",
		mobileLabel: "Boutique",
		href: "/shop",
		Icon: ShoppingBag,
		accent: "from-blue-500/30 via-sky-400/18 to-transparent",
		border: "border-blue-300/28",
		glow: "shadow-[0_0_32px_rgba(76,201,255,0.2)]",
		glowAura: "bg-[rgba(250,204,21,0.24)] shadow-[0_0_15px_rgba(250,204,21,0.25)]",
		mobileButtonGlow: "shadow-[0_0_15px_rgba(250,204,21,0.25)]",
		iconClassName: "fill-transparent stroke-current stroke-[2.1] text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.38)]",
		mobileIconClassName: "fill-transparent stroke-current stroke-[2.1] text-amber-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.18)]",
		iconSurface: "bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(8,12,24,0.18))] shadow-[inset_0_0_18px_rgba(255,255,255,0.04)]",
	},
	{
		label: "Cartes cadeaux",
		mobileLabel: "Carte cadeau",
		href: "/gift-cards",
		Icon: Gift,
		accent: "from-violet-500/26 via-fuchsia-400/16 to-transparent",
		border: "border-violet-300/28",
		glow: "shadow-[0_0_30px_rgba(76,201,255,0.18)]",
		glowAura: "bg-[rgba(168,85,247,0.4)] shadow-[0_0_20px_rgba(168,85,247,0.4)]",
		mobileButtonGlow: "shadow-[0_0_18px_rgba(168,85,247,0.24)]",
		iconClassName: "fill-transparent stroke-current stroke-[2.1] text-violet-200 drop-shadow-[0_0_8px_rgba(124,108,249,0.28)]",
		mobileIconClassName: "fill-transparent stroke-current stroke-[2.1] text-violet-200 drop-shadow-[0_0_8px_rgba(124,108,249,0.28)]",
		iconSurface: "bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(8,12,24,0.18))] shadow-[inset_0_0_18px_rgba(255,255,255,0.04)]",
	},
];

export function PremiumBanner() {
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [pendingMobileHref, setPendingMobileHref] = useState<string | null>(null);
	const { hoverDuration, hoverLift, isMobile, prefersReducedMotion } = useMotionProfile();
	const revealVariants = createRevealVariants(isMobile);
	const staggerChildren = createStaggerChildren(isMobile);
	const router = useRouter();
	const navigationTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setActiveImageIndex((currentIndex) => (currentIndex + 1) % bannerImages.length);
		}, 5000);

		return () => window.clearInterval(intervalId);
	}, []);

	useEffect(() => {
		return () => {
			if (navigationTimeoutRef.current !== null) {
				window.clearTimeout(navigationTimeoutRef.current);
			}
		};
	}, []);

	const handleMobileIconNavigation = (href: string) => {
		if (pendingMobileHref) {
			return;
		}

		setPendingMobileHref(href);

		navigationTimeoutRef.current = window.setTimeout(() => {
			router.push(href);
			setPendingMobileHref(null);
			navigationTimeoutRef.current = null;
		}, prefersReducedMotion ? 10 : mobileIconClickDuration * 1000);
	};

	return (
		<motion.section
			id="top"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.2 }}
			variants={revealVariants}
			className="relative pb-5 pt-6 sm:pb-8 sm:pt-28"
		>
			<Container className="px-4 sm:px-6 lg:px-8">
					<div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_18%_16%,rgba(76,201,255,0.22),transparent_26%),radial-gradient(circle_at_82%_10%,rgba(124,108,249,0.16),transparent_28%),radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.14),transparent_34%)] blur-2xl" />
					<div className="banner-animated-border relative mt-1 rounded-2xl p-[1px] shadow-[0_0_0_1px_rgba(76,201,255,0.08),0_18px_44px_rgba(5,8,18,0.28),0_0_34px_rgba(76,201,255,0.08)] sm:mt-2 sm:rounded-3xl">
					<motion.div
						variants={revealVariants}
							className="banner-surface group relative h-[12.75rem] overflow-hidden rounded-[calc(1rem-1px)] border border-cyan-300/12 bg-[linear-gradient(135deg,rgba(6,16,30,0.98)_0%,rgba(8,18,38,0.96)_30%,rgba(12,28,52,0.95)_58%,rgba(11,22,44,0.98)_100%)] shadow-[0_18px_56px_rgba(4,8,20,0.42),0_0_48px_rgba(76,201,255,0.08)] sm:h-[15.5rem] sm:rounded-[calc(1.5rem-1px)] md:h-64 lg:h-72"
					>
						<div className="banner-animated-surface absolute inset-0 opacity-70" />
						<motion.div
							animate={{ x: `-${activeImageIndex * 100}%` }}
							transition={{ duration: isMobile ? 0.5 : 0.85, ease: [0.42, 0, 0.58, 1] }}
							className="flex h-full w-full"
						>
							{bannerImages.map((image, index) => (
								<div key={image} className="relative h-full min-w-full shrink-0 overflow-hidden">
									<Image
										src={image}
										alt={`Gaming banner visual ${index + 1}`}
										fill
										priority={index === 0}
										className="object-cover object-center"
										sizes="100vw"
									/>
								</div>
							))}
						</motion.div>

						<div className="pointer-events-none absolute inset-y-0 left-[12%] w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)] blur-3xl" />
						<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,18,0.08),rgba(5,10,18,0.42)),radial-gradient(circle_at_14%_18%,rgba(76,201,255,0.24),transparent_24%),radial-gradient(circle_at_78%_14%,rgba(124,108,249,0.16),transparent_24%),radial-gradient(circle_at_56%_100%,rgba(59,130,246,0.18),transparent_30%),linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]" />
						<div className="absolute right-6 top-5 h-12 w-12 rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(255,255,255,0.3),rgba(255,255,255,0))] shadow-[0_0_30px_rgba(76,201,255,0.2)] blur-[2px] sm:right-8 sm:top-8 sm:h-16 sm:w-16" />
						<div className="absolute -right-14 top-6 h-32 w-32 rounded-full bg-violet-500/22 blur-3xl sm:top-8 sm:h-40 sm:w-40 md:h-48 md:w-48" />
						<div className="absolute left-4 top-4 h-20 w-20 rounded-full bg-cyan-400/18 blur-3xl sm:h-24 sm:w-24 md:left-8 md:top-8 md:h-36 md:w-36" />
						<div className="absolute bottom-0 left-1/3 h-16 w-32 -translate-x-1/2 rounded-full bg-blue-500/12 blur-3xl sm:h-24 sm:w-44" />
					</motion.div>
				</div>

				<motion.div
					variants={staggerChildren}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.55 }}
					className="mt-2 flex items-start justify-center gap-2 px-2 md:hidden"
				>
						{iconItems.map(({ label, mobileLabel, href, Icon, glowAura, mobileButtonGlow, mobileIconClassName, iconClassName, iconSurface }, index) => (
						<motion.div key={`${label}-mobile`} variants={createScaleInVariants(index, true)}>
									<motion.div
											animate={{ scale: 1, rotateY: 0, y: 0 }}
											transition={{ duration: prefersReducedMotion ? 0.01 : 0.12, ease: snappyEase }}
										style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
										className="relative flex w-[4.6rem] flex-col items-center justify-start"
									>
										<div className={`absolute left-1/2 top-5 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl opacity-45 ${glowAura}`} />
										<motion.button
											animate={pendingMobileHref === href ? {
												rotateY: prefersReducedMotion ? 0 : [0, 1560, 3120, 4680],
											} : {
													rotateY: 0,
											}}
												transition={{ duration: prefersReducedMotion ? 0.01 : mobileIconClickDuration, ease: [0.22, 0.61, 0.36, 1] }}
											whileTap={{ scale: 0.94 }}
											type="button"
											aria-label={label}
											onClick={() => handleMobileIconNavigation(href)}
											disabled={pendingMobileHref !== null}
												style={{ transformPerspective: 1200, transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
											className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/16 bg-[linear-gradient(180deg,rgba(14,20,38,0.92),rgba(8,12,24,0.98))] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:outline-none ${mobileButtonGlow} transition duration-150 disabled:opacity-100`}
										>
												<span className="relative flex h-9 w-9 items-center justify-center [transform-style:preserve-3d]">
													<span
														className={`absolute inset-0 flex items-center justify-center rounded-full border border-white/8 ${iconSurface}`}
														style={{ backfaceVisibility: "hidden" }}
													>
														<Icon className={`h-4.5 w-4.5 ${mobileIconClassName ?? iconClassName}`} />
													</span>
													<span
														className={`absolute inset-0 flex items-center justify-center rounded-full border border-white/8 ${iconSurface}`}
														style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
													>
														<Icon className={`h-4.5 w-4.5 ${mobileIconClassName ?? iconClassName}`} />
													</span>
												</span>
										</motion.button>
										<motion.p
											initial={{ opacity: 0, y: 4 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: prefersReducedMotion ? 0.1 : 0.18, delay: prefersReducedMotion ? 0 : 0.03 + index * 0.02, ease: snappyEase }}
											className="mt-2 text-center text-[10px] font-medium tracking-[0.04em] text-white/76"
										>
											{mobileLabel}
										</motion.p>
									</motion.div>
						</motion.div>
					))}
				</motion.div>

				<motion.div
					variants={staggerChildren}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.4 }}
					className="mt-4 hidden sm:grid sm:grid-cols-3 sm:gap-3 lg:mt-5"
				>
						{iconItems.map(({ label, href, Icon, accent, border, glow, iconClassName, iconSurface }, index) => (
						<motion.div key={label} variants={createScaleInVariants(index, false)} className="min-w-[148px] shrink-0 sm:min-w-0">
							{href ? (
								<motion.div
										whileHover={{ y: hoverLift, scale: 1.05, boxShadow: "0 24px 44px rgba(3,6,16,0.32), 0 0 34px rgba(76,201,255,0.22)" }}
									whileTap={{ scale: 0.96 }}
									transition={{ duration: hoverDuration, ease: snappyEase }}
								>
									<Link
										href={href}
										className={`group card-premium relative flex w-full items-center gap-3 overflow-hidden rounded-[1.4rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-3 py-3 text-left backdrop-blur-sm transition sm:gap-4 sm:rounded-[1.7rem] sm:border-white/14 sm:bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] sm:px-4 sm:py-4 sm:backdrop-blur-xl sm:shadow-[0_22px_48px_rgba(3,6,18,0.3),inset_0_1px_0_rgba(255,255,255,0.07)] ${border} ${glow}`}
									>
										<div className={`absolute inset-0 bg-linear-to-r ${accent} opacity-90 transition duration-300 sm:opacity-100`} />
										<div className="absolute inset-0 hidden rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_34%,rgba(255,255,255,0.02))] sm:block" />
										<div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)] opacity-70" />
										<div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/12 ${iconSurface} transition duration-300 group-active:scale-95 sm:h-16 sm:w-16 sm:group-hover:scale-105 sm:group-hover:shadow-[0_0_36px_rgba(255,255,255,0.16)]`}>
											<Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconClassName}`} />
										</div>
										<div className="relative">
											<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/62 sm:text-xs sm:tracking-[0.24em]">
												Acces direct
											</p>
											<p className="mt-1 bg-linear-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-sm font-bold uppercase tracking-[0.08em] text-transparent sm:text-xl">
												{label}
											</p>
										</div>
									</Link>
								</motion.div>
							) : (
								<motion.button
									whileHover={{ y: hoverLift, scale: 1.05, boxShadow: "0 24px 44px rgba(3,6,16,0.32), 0 0 34px rgba(76,201,255,0.22)" }}
									whileTap={{ scale: 0.96 }}
									transition={{ duration: hoverDuration, ease: snappyEase }}
									type="button"
									className={`group card-premium relative flex w-full items-center gap-3 overflow-hidden rounded-[1.4rem] border bg-white/[0.03] px-3 py-3 text-left backdrop-blur-sm transition sm:gap-4 sm:rounded-[1.7rem] sm:border-white/14 sm:bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] sm:px-4 sm:py-4 sm:backdrop-blur-xl sm:shadow-[0_22px_48px_rgba(3,6,18,0.3),inset_0_1px_0_rgba(255,255,255,0.07)] ${border} ${glow}`}
								>
									<div className={`absolute inset-0 bg-linear-to-r ${accent} opacity-90 transition duration-300 sm:opacity-100`} />
									<div className="absolute inset-0 hidden rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_34%,rgba(255,255,255,0.02))] sm:block" />
									<div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)] opacity-70" />
									<div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/12 ${iconSurface} transition duration-300 group-active:scale-95 sm:h-16 sm:w-16 sm:group-hover:scale-105 sm:group-hover:shadow-[0_0_36px_rgba(255,255,255,0.16)]`}>
										<Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconClassName}`} />
									</div>
									<div className="relative">
										<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/62 sm:text-xs sm:tracking-[0.24em]">
											Acces direct
										</p>
										<p className="mt-1 bg-linear-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-sm font-bold uppercase tracking-[0.08em] text-transparent sm:text-xl">
											{label}
										</p>
									</div>
								</motion.button>
							)}
						</motion.div>
					))}
				</motion.div>

				<div className="pointer-events-none relative mt-4 h-[2px] overflow-visible sm:mt-5">
					<div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.68)_18%,rgba(168,85,247,0.72)_52%,rgba(244,63,94,0.62)_82%,transparent)]" />
					<div className="absolute left-1/2 top-1/2 h-4 w-44 -translate-x-1/2 -translate-y-1/2 bg-cyan-400/18 blur-xl" />
					<div className="absolute left-1/2 top-1/2 h-4 w-36 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-500/14 blur-xl" />
				</div>
			</Container>
		</motion.section>
	);
}
