Sen deneyimli bir full-stack geliştiricisin. Benim için sadece KENDİ KULLANIMIM için (public deploy olmayacak) bir film sitesi projesi geliştireceksin.

## TEKNOLOJİ & GENEL GEREKSİNİMLER

- Framework: Next.js (App Router, TypeScript kullan)
- Stil: Tailwind CSS ile modern, sade, responsive ve dark theme ağırlıklı bir arayüz tasarla.
- Paket yönetici: npm veya pnpm sen seçebilirsin.
- Proje, local ortamda `npm install` + `npm run dev` ile çalışacak hale gelsin.
- Auth, multi-user vs. gerekmiyor. Sadece tek kullanıcı, kişisel kullanım.

## TMDb ENTEGRASYONU

- Film verilerini The Movie Database (TMDb) API üzerinden al.
- Türkiye hedefli kullanım için mümkün olduğunda:
  - `language=tr-TR`
  - `region=TR`
  parametrelerini TMDb isteklerine ekle.
- Popüler filmler, trend olan filmler, arama, film detayları gibi temel akışları TMDb üzerinden kur.

## GÜVENLİK – API KEY KULLANIMI (BU KISMA ÖZELLİKLE UY!)

API Key güvenliği konusunda aşağıdaki kurallara KESİNLİKLE uy:

1. `.env.local` kullan:
   - Örnek:
     - `TMDB_API_KEY=BURAYA_KEY_GELECEK`
     - `TMDB_BASE_URL=https://api.themoviedb.org/3`

2. TMDb API key'i için asla `NEXT_PUBLIC_` ile başlayan environment variable kullanma.
   - `NEXT_PUBLIC_` ile başlayan değişkenler client bundle içine gömülür, bu da API key’in açığa çıkmasına neden olur.
   - TMDb key sadece server tarafında kalmalı.

3. Tüm TMDb istekleri sadece server tarafında yapılmalı:
   - `app/api/.../route.ts` (Route Handlers) üzerinden bir backend/proxy katmanı oluştur.
   - Alternatif olarak server components içinde veya gerekli yerlerde sadece server-side fetch kullan.
   - Client component’ler asla direkt TMDb endpoint’ine gitmesin.

4. API key’in geçtiği tam URL’leri loglama:
   - `console.log` vb. ile `api_key` query parametresini içeren tam URL’leri loglama.
   - Loglama gerekiyorsa, key içermeyen sade mesajlar kullan.

5. Özet: Frontend → kendi Next.js API route'un → TMDb
   - Yani client asla TMDb'ye direkt gitmesin, hep kendi `/api/...` endpoint’lerini kullansın.

## UYGULAMA ÖZELLİKLERİ

Aşağıdaki sayfa ve özellikleri içeren şık bir film sitesi tasarla:

### 1) Ana sayfa (`/`)
- Hero bölümünde:
  - Arkaplanda büyük bir film görseli (örneğin popüler filmlerden rastgele bir tanesinin backdrop’u).
  - Önde başlık, kısa açıklama ve bir arama barı (“Film, dizi veya kişi ara…”).
- Bölümler:
  - “Popüler Filmler” (TMDb `/movie/popular`)
  - “Şu an Gösterimde” / “Now Playing” (TMDb `/movie/now_playing`)
  - “En Çok Oy Alanlar” (TMDb `/movie/top_rated`)
- Her bölümde:
  - Yatay scroll veya grid halinde film kartları
  - Poster, başlık, puan (vote_average), yıl vb. bilgiler
  - Kart tıklanınca film detay sayfasına gitsin.

### 2) Arama sayfası (`/search`)
- Üstte bir arama input’u ve arama butonu.
- Kullanıcı yazdıkça veya enter’a bastıkça TMDb `search/movie` endpoint’ine istek at.
- Sonuçları grid layout içinde film kartları olarak göster.
- Arama boşken bilgilendirici bir mesaj göster (“Arama yapmak için bir kelime yazın” gibi).
- Sonuç yoksa “Sonuç bulunamadı” mesajı göster.

### 3) Film detay sayfası (`/movie/[id]`)
- Dinamik route kullan (`[id]`).
- TMDb `/movie/{id}` endpoint’inden detay çek:
  - Başlık, orijinal başlık
  - Poster ve backdrop
  - Özet (overview)
  - Çıkış tarihi, süre, türler (genres)
  - Oy ortalaması, oy sayısı
- Ek olarak:
  - Oyuncu listesi (cast) – `/movie/{id}/credits` endpoint’i
  - Benzer filmler veya önerilen filmler – `/movie/{id}/similar` veya `/movie/{id}/recommendations`
- Tasarım:
  - Üstte geniş bir hero alanı (backdrop üzerine gradient overlay + film bilgileri).
  - Aşağıda özet, türler, oyuncular, önerilen filmler bölümleri.

### 4) “İzleme Listem” (Watchlist) – client-side özellik
- Sadece local kullanım için basit bir Watchlist özelliği ekle.
- Kullanıcı bir film detay sayfasında “İzleme Listeme Ekle / Çıkar” butonuna tıklayabilsin.
- Watchlist verilerini server’a kaydetmene gerek yok:
  - LocalStorage veya benzeri client-side bir mekanizma kullan (bu veride API key olmayacak, sadece film id’leri ve basit metadata olabilir).
- `/watchlist` sayfası:
  - Kullanıcının eklediği filmleri kartlar halinde göster.
  - Kartlardan kaldırma butonu olsun.

### 5) Navigasyon & Layout
- En üstte bir header/nav bar:
  - Site logosu veya metin (ör. “My Movies”)
  - Linkler: Ana Sayfa, Arama, İzleme Listem
- Altta veya uygun bir yerde küçük bir footer:
  - TMDb attribution yazısı:
    - “This product uses the TMDb API but is not endorsed or certified by TMDb.”
  - TMDb’nin resmi logosuna da yer ver.

## GÖRSEL OPTİMİZASYON

- Next.js `Image` component’ini kullan.
- `next.config.js` içinde `image.tmdb.org` domainini tanımla.
- Poster/Backdrop URL’lerini TMDb imaj CDN’inden çek:
  - Örneğin: `https://image.tmdb.org/t/p/w500{poster_path}` gibi.
- Responsive tasarım:
  - Mobil, tablet ve desktop için kart grid’leri ve layout’u ayarla.

## SEO & TEKNİK DETAYLAR

- App Router’da her film detay sayfası için dinamik `generateMetadata` fonksiyonu tanımla:
  - Sayfa title’ını film başlığı ile doldur.
  - Description için film overview kullan.
- Hata durumları:
  - TMDb isteği hata verirse kullanıcıya basit, anlaşılır bir hata mesajı göster.
  - Film bulunamazsa 404 benzeri bir ekran göster.
- Gerekli yerlerde async/await ve düzgün error handling kullan.

## PROJE ÇIKTISI

Lütfen:

1. Projenin klasör yapısını açıkça göster.
2. `package.json`, `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json` gibi temel dosyaların TAM içeriklerini yaz.
3. `app` klasörü altındaki:
   - `layout.tsx`
   - `page.tsx` (Ana sayfa)
   - `search/page.tsx`
   - `watchlist/page.tsx`
   - `movie/[id]/page.tsx`
   - `api/tmdb/.../route.ts` dosyaları
   dahil olmak üzere TÜM gerekli dosyaların kodunu eksiksiz yaz.
4. Gerekliyse yardımcı util fonksiyonları (`lib/tmdb.ts` gibi) oluştur ve kodlarını yaz.
5. Tailwind ile tasarımı olabildiğince modern ve şık yap; çok aşırı karmaşık UI olmasın ama göze hoş görünsün.
6. TMDb API key güvenliği ile ilgili yazdığım kurallara mutlaka uy, client tarafına hiçbir şekilde API key sızdırma.

Bu talimatlara uygun, çalışabilir bir Next.js (App Router + TypeScript + Tailwind) projesi üret.
