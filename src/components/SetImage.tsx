import Image from "next/image";

interface SetImageProps {
  src: string | null;
  alt: string;
}

export default function SetImage({ src, alt }: SetImageProps) {
  if (!src) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        No image available
      </div>
    );
  }

  return (
    <div className="w-full aspect-square relative bg-white rounded-lg overflow-hidden border border-gray-200">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-2"
        sizes="(max-width: 768px) 100vw, 300px"
      />
    </div>
  );
}
