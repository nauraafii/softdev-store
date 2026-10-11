<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Aturan proyek latihan

- Baca `architecture.md` dan `design.md`; pertahankan materi tugas di `README.md`.
- Gunakan Next.js App Router dan JavaScript. Pertahankan `useState`, `useEffect`, fetch API dummy, conditional rendering, pencarian, dan keranjang dalam state.
- Simpan hanya state yang diperlukan; hitung hasil pencarian dan subtotal dari state sumber.
- Validasi data API, bersihkan effect, dan gunakan functional update untuk perubahan jumlah barang.
- Harga internal adalah rupiah bulat setelah konversi. Jangan mengonversi lagi saat memformat atau menjumlah subtotal.
- Ikuti Ponytail: perubahan terkecil yang lengkap; hindari dependency, abstraksi, atau fitur yang belum diperlukan.
- Jalankan lint/build dan periksa alur yang berubah. Pertahankan akses keyboard dan tampilan ponsel.
