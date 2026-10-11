# Arsitektur

Satu aplikasi Next.js App Router, tanpa backend terpisah atau database.

`layout.jsx` membungkus halaman. `page.jsx` adalah Client Component karena tugas melatih state, effect, pencarian, dan event tombol. Fetch dilakukan melalui `useEffect` ke DummyJSON; validasi dan konversi harga terjadi sebelum data disimpan.

State keranjang hanya menyimpan ID dan jumlah. Detail produk berasal dari state produk. Hasil pencarian, jumlah barang, dan subtotal dihitung saat render agar tidak ada state salinan yang bisa berbeda.

`AbortController` membatalkan fetch ketika effect dibersihkan. HTTP gagal atau format data tidak valid menampilkan pesan dan tombol coba lagi. Dialog native menangani fokus modal dan Escape; effect mengunci scroll halaman selama keranjang terbuka.

Komponen tombol yang sudah tersedia dipakai bersama. Belum perlu store global, custom hook, service layer, route API proxy, atau library fetch untuk satu halaman ini. Pisahkan komponen ketika benar-benar dipakai ulang atau halaman bertambah.
