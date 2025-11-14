import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <Image
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDb Logo"
              width={60}
              height={60}
              className="opacity-80"
            />
          </div>
          <p className="text-sm text-zinc-400 max-w-2xl">
            This product uses the TMDb API but is not endorsed or certified by TMDb.
          </p>
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} My Movies - Kişisel kullanım için tasarlandı
          </p>
        </div>
      </div>
    </footer>
  );
}
