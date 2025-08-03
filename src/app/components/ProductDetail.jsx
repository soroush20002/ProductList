'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ImageWithLoader from './ImageWithLoader';

export default function ProductModal({ product, onClose }) {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(!!product);

  useEffect(() => {
    if (product) {
      setShouldRender(true);
      requestAnimationFrame(() => setVisible(true)); 
    }
  }, [product]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300);
  };

  if (!shouldRender || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center mx-2  justify-center">
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      <div
        className={`bg-white dark:bg-zinc-900 rounded-xl shadow-lg max-w-2xl w-full p-6 z-60 transform transition-all duration-300 ${
          visible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-8'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-600 hover:text-red-500"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
                <ImageWithLoader
                  width={100}
                  height={100}
                  src={product.thumbnail}
                  alt={product.title}
                  className="object-contain scale-150  flex justify-center items-center w-full h-full rounded group-hover:scale-120 transition-transform duration-300 ease-in-out"
                />
          </div>
          <div className="flex flex-col gap-2 text-sm w-full md:w-1/2">
            <h2 className="text-xl font-bold">{product.title}</h2>
            <p className="text-gray-500">
              {product.brand} | {product.category}
            </p>
            <p className="text-sm">{product.description}</p>
            <p className="font-semibold text-4xl mt-2 text-green-600">
              ${product.price}
            </p>
            <p>⭐ {product.rating}</p>
            <p>stock: {product.stock}</p>
            <p className="text-xs text-gray-400">SKU: {product.sku}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
