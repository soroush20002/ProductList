import Image from "next/image";
import { useState } from "react";

export default function ImageWithLoader({ src, alt, className }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <Image
        width={200}
        height={200}
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        className={` object-cover transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
