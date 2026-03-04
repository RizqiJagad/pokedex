# Pokédex App

A full-stack Pokédex application built with Next.js, Express.js, MongoDB, Jotai, and Tailwind CSS. The app features an infinite scrolling Pokémon list, dynamic search, a detailed Pokémon view page, and a robust backend designed to fetch cache data from PokéAPI into MongoDB.

##  App Features
- **Pokémon List Page**: 2-column grid layout displaying Pokémon with their IDs and Sprites.
- **Infinite Scrolling**: A custom native JavaScript hook (`useIntersectionObserver`) manages dynamic loading of 8 items per scroll batch.
- **Search System**: Global state-managed search by `Jotai` using a 500ms native debounce to query the database efficiently.
- **Detailed Pokémon Page**: Dynamic routes (`/pokemon/[name]`) that display shiny/front/back sprites, height, weight, max 10 parsed moves, and the parsed evolutionary chain.
- **Skeleton Loading**: Gracefully loads data with beautifully designed CSS pulse skeletons.
- **Data Archiving**: Express backend caches missing Pokemon details to a local MongoDB when queried initially from the PokéAPI.

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router, Typescript)
- **Styling**: Tailwind CSS
- **State Management**: Jotai
- **Backend API**: Express.js (Typescript)
- **Database**: MongoDB (with Mongoose)
- **Testing**: Jest & React Testing Library

---

## Step-by-Step Development Progress

### Phase 1: Inisialisasi Project (Setup Structure)
- **Objective:** Membuat repositori dan fondasi `frontend` dengan Next.js serta `backend` dengan Express.js.
- **Actions:** Mengkonfigurasi TailwindCSS, TypeScript, dan Git untuk commit terstruktur (`feat: initialize project structure`).

### Phase 2: Pembuatan API Backend (Express + MongoDB)
- **Objective:** Menjalankan alur *PokeAPI -> Express -> MongoDB -> Frontend*. Tidak ada client calls langsung ke PokeAPI.
- **Actions:**
  - Membuat skema `mongoose` untuk menyimpan atribut pokemon.
  - Setup Service *Penyemaian Awal (Seeding)* untuk fetch list id dan penamaan >1300 entri pokemon ke basis data lokal MongoDB.
  - Setup controller `/api/pokemon` dan `/api/pokemon/:name`. Endpoint Detail secara pintar akan mengecek apakah data *Evolution Chain*, *Sprites*, dan *Moves* sudah lengkap di MongoDB, jika belum otomatis mengambil info detail dan melakukan tree-parsing untuk chain evolusi dari PokeAPI lalu disiram ke MongoDB.

### Phase 3: Persiapan State Frontend
- **Objective:** Mengintegrasikan dependensi penting.
- **Actions:** 
  - Install dan setup global search atom dengan `Jotai`.
  - Merancang type definitions `interfaces`.
  - Meracik helper *fetch apiService* menuju API endpoint lokal Express.

### Phase 4: Pokédex List Page (Infinite Scroll)
- **Objective:** Pembuatan UI utama dan scroll otomatis.
- **Actions:**
  - Membuat helper hook murni native Vanilla JS `useIntersectionObserver` tanpa *utility library* tambahan.
  - Mengimplementasikan 2 grid column Pokemon card dengan *Skeleton Loading state*.
  - Pembuatan *Debounce input search* manual 500ms untuk input tanpa perlu *use-lodash*. 
  - Limit pagination fetch dibatasi hingga 8 list data per request dari database.

### Phase 5: Halaman Detail
- **Objective:** Merancang Data Tampilan Penuh spesifik 1 Pokemon.
- **Actions:** 
  - Membuat UI Dark-theme App berisikan `Sprites` (Shiny, Front, Back).
  - List Evolution Chain diparsing hingga menjadi interaktif *(Contoh: Bulbasaur -> Ivysaur -> Venusaur)* dimana masing-masing evolution name terhubung layaknya sistem routing (misal diklik mengalihkan ke stats jenis evolusi barunya!).
  - Menyediakan limit 10 moves di tampilan.

### Phase 6: Polish & Unit Testing
- **Objective:** Memanfaatkan optimalisasi memori dan testing sesuai assessment bonus.
- **Actions:**
  - Implementasi *Dynamic Imports* di Next.js untuk Lazy Loading. 
  - Penggunaan `React.memo` / `useCallback` mencegah rerender yang berlebihan dari fitur event infinite-scrolling Jotai *listener*.
  - Integrasi Unit testing Jest untuk hook IntersectionObserver *(3/3 passed!)*.

---

## Instalasi dan Cara Menjalankan Aplikasi

Aplikasi ini dipisah menjadi dua direktori terpisah: `frontend` dan `backend`. Keduanya harus dijalankan secara bersamaan.

### Prasyarat
- Node.js versi 18+ terinstall
- MongoDB lokal beroperasi (standar `127.0.0.1:27017` / `localhost:27017`)

### Menjalankan Backend
1. Buka terminal lalu arahkan direktori menuju `backend/`
2. Jalankan `npm install`
3. Konfigurasi URL database Anda pada file `.env` jika mongodb anda tidak di localhost port standart.
4. Jalankan server backend:
   ```bash
   npm run dev
   ```
   *Terminal akan memunculkan console log bahwa DB Terkoneksi dan menyemai data awal jika belum ada isinya (1300+ item pokemon awal).*
   Backend beroperasi di **`http://localhost:5000`**

### Menjalankan Frontend
1. Buka terminal terpisah *(split terminal)* lalu arahkan direktori ke `frontend/`
2. Jalankan `npm install`
3. Jalankan server client:
   ```bash
   npm run dev
   ```
4. Buka Browser pada link: **`http://localhost:3000`**

---

## Kendala yang Dihadapi & Solusinya

1. **Kendala Typechecker / ESNext Compilation Backend Express**
   - **Masalah:** Saat menjalankan kompilasi TypeScript untuk Express menggunakan ts-node/nodemon terbaru, muncul TSError terkait `ECMAScript / ESNext Module` config yang default-nya strict terhadap standar frontend framework baru.
   - **Solusi:** Melakukan adjustment manual yang presisi pada berkas `backend/tsconfig.json` dengan merubah penargetan pada `CommonJS` module rules set (`"module": "commonjs", "target": "es2016"`), sehingga node engine bisa membaca modul import ts-node tanpa error kompilasi.

2. **Parsing Data Evolution Chain yang Bersarang Jauh (Nested Data)**
   - **Masalah:** API resmi PokeAPI memiliki URL `Evolution Chain` yang disimpan secara tepisah di endpoint url `pokemon-species`, ditambah dengan stuktur JSON tree hierarchy yang bersarang dalam-dalam secara rekursif `evolves_to: [{evolves_to: [...]}]`, mempersulit frontend jika di parse client-side.
   - **Solusi:** Beban kerja tersebut dipindahkan sepenuhnya ke Controller REST API Express backend! Menggunakan fungsi parser rekursif manual (`traverse(node)`) di backend dan meratakannya menjadi array rata yang bersih `[pichu, pikachu, raichu]` agar respon endpoint detail Express siap saji dan langsung bisa divisualisasikan frontend Next.js menuju MongoDB cache-nya dengan mulus.

3. **Infinite Rendering akibat Intersection Observer & React Lifecycle**
   - **Masalah:** Hooks Native observer `useIntersectionObserver` seringkali me-*trigger* pergerakan load page berkali-kali (`entry.isIntersecting` firing multiple times) karena state array item pokemons yang belum re-render sepenuhnya.
   - **Solusi:** Diberikan proteksi flag boolean `hasMore`, `loading` state, lalu membungkus instance object state fetcher (`fetchPokemons`) ke dalam `React.useCallback` dengan dependency list yang direduksi sedemikian rupa. Dan terakhir menggunakan React `memo` pada UI list cards.

4. **Testing Library Hook Intersection Observer Error**
   - **Masalah:** Unit test hook `useIntersectionObserver.ts` menggunakan Jest gagal karena API `IntersectionObserver` tidak dimiliki/disupport di `JSdom` milik Node.js Testing Environment (hanya eksklusif di Window Web browser engine asli).
   - **Solusi:** Membuat mock implementation custom yang mendefinisikan dummy class dari `IntersectionObserver` di file Setup `jest.setup.ts`.
