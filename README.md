# Softdev Store — UKM Softdev PENS

Latihan Next.js App Router: katalog produk, pencarian, dan keranjang dalam state React.

## Menjalankan

```sh
npm ci
npm run dev
```

Buka http://localhost:3000. Pemeriksaan kode: `npm run lint`. Build produksi: `npm run build`.

## Materi tugas dan implementasi

| Materi | Implementasi di `src/app/page.jsx` |
| --- | --- |
| `useState` | Menyimpan produk, pencarian, jumlah tiap produk di keranjang, status dialog, loading, error, dan percobaan ulang. |
| `useEffect` | Fetch produk saat halaman dipasang/diulang; membatalkan request ketika effect dibersihkan. Effect lain membuka/menutup dialog keranjang. |
| Fetch API dummy | `https://dummyjson.com/products?limit=0`; memeriksa status HTTP dan field produk sebelum digunakan. |
| Conditional rendering | Skeleton saat loading, pesan gagal dan tombol coba lagi, daftar produk, hasil pencarian kosong, serta isi/keranjang kosong. |
| Data tampil | `map` membuat kartu dengan gambar, kategori, judul, dan harga IDR. |
| Add to cart dalam state | Objek `{ productId: quantity }`; functional state update menambah/mengurangi jumlah, lalu menghapus item saat jumlah nol. |
| Pencarian | `filter` berdasarkan judul/kategori; mengabaikan kapital dan spasi di awal/akhir. |

Harga contoh API diperlakukan sebagai USD. Nilainya dikonversi memakai konstanta `USD_TO_IDR` dan dibulatkan sekali menjadi rupiah saat diterima. Harga kartu, harga di keranjang, dan subtotal menggunakan nilai IDR yang sama. Subtotal dihitung dari harga satuan × jumlah.

## Susunan file

- `src/app/page.jsx`: tampilan dan logika interaktif katalog/keranjang.
- `src/app/globals.css`: desain brutalist dan tampilan responsif.
- `src/app/layout.jsx`: layout dasar, bahasa halaman, dan metadata.
- `src/components/ui/button.jsx`: tombol bersama dari scaffold shadcn/Base UI.
- `architecture.md`, `design.md`, `AGENTS.md`: keputusan struktur, desain, dan aturan pengerjaan.

