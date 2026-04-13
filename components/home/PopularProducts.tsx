"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/ui/Container";
import { Product } from "@/data/storefront";
import { fadeInUp, staggerChildren } from "@/lib/animations";
import { motion } from "framer-motion";

type PopularProductsProps = {
  products: Product[];
};

export function PopularProducts({ products }: PopularProductsProps) {
  return (
    <section id="products" className="py-16 sm:py-24">
      <Container>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-6 flex flex-col gap-3 sm:mb-8 sm:gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/68 sm:text-sm sm:tracking-[0.24em]">Populaire</p>
            <h2 className="section-title mt-2 text-2xl font-black uppercase text-white sm:mt-3 sm:text-4xl">
              Equipement et essentials du moment
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
            Une selection construite comme une vraie homepage retail: heroes, accessoires premium et bundles conversion-first.
          </p>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
          className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
        >
          {products.map((product) => (
            <motion.div key={product.name} variants={fadeInUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}