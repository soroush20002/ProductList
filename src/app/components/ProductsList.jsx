"use client";
import React, { useEffect, useRef, useState } from "react";
import useProducts from "@/hooks/useProducts";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductModal from "./ProductDetail";
import { useFilters } from "@/context/FiltersContext";
import Filters from "./Filters";
import ImageWithLoader from "./ImageWithLoader";

gsap.registerPlugin(ScrollTrigger);

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, isLoading, error } = useProducts();
  const { filters } = useFilters();
  useEffect(() => {
    setPage(1);
  }, [filters]);
  const limit = 9;

  const filteredProducts = products.filter((product) => {
    const matchCategory = filters.category.length === 0 || filters.category.includes(product.category);
    const matchBrand = filters.brand.length === 0 || filters.brand.includes(product.brand);
    const matchStock = !filters.inStockOnly || product.stock > 0;
    const matchPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
    const matchSearch = product.title.toLowerCase().includes(filters.search.toLowerCase());
    return (
      matchBrand && matchStock && matchPrice && matchSearch && matchCategory
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const paginatedProducts = filteredProducts.slice((page - 1) * limit,page * limit);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (cardsRef.current.length) {
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.85, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [products]);

  if (isLoading)
    return (
      <p className="fixed inset-0 flex items-center justify-center scale-200 ">
        Loading ...
      </p>
    );
  if (error)
    return (
      <p className="text-red-500 fixed inset-0 flex items-center justify-center scale-200   ">
        Something went wrong!
      </p>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
      <div className="md:col-span-3">
        <Filters allProducts={products} />
      </div>
      <div className="md:col-span-9">
        {filteredProducts.length == 0 ? (
          <div className="flex justify-center items-center min-h-[300px] p-4">
            <h2 className="text-center text-gray-500 text-lg sm:text-xl md:text-2xl font-semibold">
              No products found matching your filters
            </h2>
          </div>
        ) : (
          <main className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProducts.map((product, index) => (
              <div
                key={product.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="rounded-xl shadow-[0_4px_12px_rgba(255,255,255,0.2)] p-4 flex flex-col gap-0 group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <ImageWithLoader
                  width={100}
                  height={100}
                  src={product.thumbnail}
                  alt={product.title}
                  className="object-contain  flex justify-center rounded group-hover:scale-120 transition-transform duration-300 ease-in-out"
                />
                <h2 className="font-bold text-lg">{product.title}</h2>
                <p className="text-sm text-gray-600">{product.brand}</p>
                <p className="text-sm text-gray-800">{product.category}</p>
                <p className="text-sm">{product.price} $</p>
                <p className="text-xs text-gray-400">stock: {product.stock}</p>
                <p className="text-xs">rating: {product.rating} ⭐</p>
              </div>
            ))}
          </main>
        )}
        {filteredProducts.length !== 0 ? (
          <div className="flex justify-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded  hover:scale-125"
            >
              ⬅
            </button>
            <span className="self-center">
              page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-1 rounded  hover:scale-125"
            >
              ➡
            </button>
          </div>
        ) : null}

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
}
