import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors">
            My Movies
          </Link>

          <nav className="flex gap-6">
            <Link
              href="/"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/search"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Arama
            </Link>
            <Link
              href="/watchlist"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              İzleme Listem
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
