"use client";

import { createRevealVariants } from "@/lib/animations";
import { useMotionProfile } from "@/lib/useMotionProfile";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type ProductGalleryProps = {
  title: string;
  image: string;
  images: string[];
  accent: string;
};

export function ProductGallery({ title, image, images, accent }: ProductGalleryProps) {
  const gallery = useMemo(() => (images.length > 0 ? images : [image]), [image, images]);
  const [selectedImage, setSelectedImage] = useState(gallery[0]);
  const { isMobile } = useMotionProfile();
  const revealVariants = createRevealVariants(isMobile);
  const isUploadedImage = selectedImage.startsWith("data:");

  useEffect(() => {
    setSelectedImage(gallery[0]);
  }, [gallery]);

  return (
    <motion.section variants={revealVariants} className="rounded-2xl border border-white/10 bg-[#0f172a] p-3 shadow-sm sm:p-4">
      <div className="mx-auto max-w-[320px] sm:max-w-[360px] lg:max-w-[380px]">
        <div className="relative overflow-hidden rounded-[1.05rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,31,0.98),rgba(5,10,20,0.98))] shadow-sm">
          <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${accent} opacity-15`} />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(56,189,248,0.05),transparent_30%,rgba(255,255,255,0.02))]" />
          <div className="relative aspect-square">
            <Image
              src={selectedImage}
              alt={title}
              fill
              priority
              quality={100}
              unoptimized={isUploadedImage}
              sizes="(max-width: 768px) 320px, (max-width: 1280px) 360px, 380px"
              className="object-contain p-4 transition duration-200 hover:scale-[1.02] sm:p-6"
            />
          </div>
        </div>

        <div className="mt-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2.5 sm:gap-3">
            {gallery.map((galleryImage, index) => {
              const isActive = selectedImage === galleryImage;

              return (
                <button
                  key={`${galleryImage.slice(0, 24)}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(galleryImage)}
                  className={`relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border transition duration-200 sm:h-20 sm:w-20 ${isActive ? "border-white/20 bg-white/[0.04] shadow-sm" : "border-white/10 bg-[#111c31] hover:border-white/20"}`}
                >
                  <Image
                    src={galleryImage}
                    alt={`${title} visuel ${index + 1}`}
                    fill
                    quality={100}
                    unoptimized={galleryImage.startsWith("data:")}
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}