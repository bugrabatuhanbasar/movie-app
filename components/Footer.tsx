import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    discover: [
      { label: 'Filmler', href: '/categories' },
      { label: 'Diziler', href: '/categories' },
      { label: 'Popüler', href: '/' },
      { label: 'Arama', href: '/search' },
    ],
    myList: [
      { label: 'İzleme Listem', href: '/watchlist' },
      { label: 'Kategoriler', href: '/categories' },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-b from-zinc-950 to-black border-t border-zinc-800/50 mt-24">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block group">
              <h3 className="text-3xl font-black bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent group-hover:from-red-500 group-hover:via-orange-500 group-hover:to-red-400 transition-all">
                My Movies
              </h3>
            </Link>
            <p className="text-zinc-400 max-w-md leading-relaxed">
              Binlerce film ve diziyi keşfedin. İzleme listenizi oluşturun ve favori içeriklerinizi takip edin.
            </p>

            {/* TMDb Attribution */}
            <div className="flex items-center gap-3 p-4 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50">
              <Image
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="TMDb Logo"
                width={50}
                height={50}
                className="opacity-80"
              />
              <div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  This product uses the TMDb API but is not endorsed or certified by TMDb
                </p>
              </div>
            </div>
          </div>

          {/* Discover Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Keşfet
            </h4>
            <ul className="space-y-3">
              {footerLinks.discover.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My List Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Listem
            </h4>
            <ul className="space-y-3">
              {footerLinks.myList.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              &copy; {currentYear} My Movies. Kişisel kullanım için tasarlandı.
            </p>

            <div className="flex items-center gap-6">
              <span className="text-xs text-zinc-600">Made with</span>
              <div className="flex items-center gap-4">
                <span className="text-xs px-3 py-1 bg-zinc-900 rounded-full text-zinc-500 border border-zinc-800">
                  Next.js
                </span>
                <span className="text-xs px-3 py-1 bg-zinc-900 rounded-full text-zinc-500 border border-zinc-800">
                  TypeScript
                </span>
                <span className="text-xs px-3 py-1 bg-zinc-900 rounded-full text-zinc-500 border border-zinc-800">
                  Tailwind CSS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
