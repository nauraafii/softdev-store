"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRODUCTS_URL = "https://dummyjson.com/products?limit=0";
const USD_TO_IDR = 17_884; // shortcut: kurs tetap JISDOR 9 Okt 2026; pakai API kurs jika perlu diperbarui otomatis.
const priceFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
const formatPrice = (price) => priceFormatter.format(price);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const cartDialog = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch(PRODUCTS_URL, { signal: controller.signal });
        if (!response.ok) throw new Error("Gagal mengambil produk");
        const data = await response.json();
        const items = data?.products;
        if (!Array.isArray(items) || !items.every((product) =>
          product && Number.isSafeInteger(product.id) && product.id > 0 &&
          typeof product.title === "string" && product.title.trim() &&
          typeof product.category === "string" &&
          Number.isFinite(product.price) && product.price >= 0 &&
          typeof product.thumbnail === "string" &&
          URL.canParse(product.thumbnail) && /^https?:\/\//.test(product.thumbnail)
        ) || new Set(items.map((product) => product.id)).size !== items.length) {
          throw new Error("Format data produk tidak sesuai");
        }
        if (!controller.signal.aborted) {
          setProducts(items.map((product) => ({
            ...product,
            price: Math.round(product.price * USD_TO_IDR),
          })));
        }
      } catch {
        if (!controller.signal.aborted) setError("Katalog belum bisa dimuat. Coba lagi sebentar.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchProducts();
    return () => controller.abort();
  }, [retry]);

  useEffect(() => {
    if (!cartOpen) return;
    const dialog = cartDialog.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [cartOpen]);

  const query = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    `${product.title} ${product.category.replaceAll("-", " ")}`.toLowerCase().includes(query),
  );
  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const subtotal = cartItems.reduce((total, product) => total + product.price * cart[product.id], 0);

  function changeQuantity(productId, amount) {
    setCart((current) => {
      const quantity = (current[productId] ?? 0) + amount;
      const next = { ...current };
      if (quantity <= 0) delete next[productId];
      else next[productId] = quantity;
      return next;
    });
  }

  function reloadProducts() {
    setError("");
    setLoading(true);
    setRetry((attempt) => attempt + 1);
  }

  return (
    <main className="store-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Softdev Store, beranda">
            SOFTDEV<br />STORE
          </a>
          <nav className="main-nav" aria-label="Navigasi utama">
            <a href="#catalog">Katalog</a>
          </nav>
          <Button
            className="cart-trigger"
            variant="ghost"
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Buka keranjang, ${cartCount} barang`}
          >
            <ShoppingBag size={18} aria-hidden="true" />
            <span>Keranjang</span>
            <span className="cart-count" aria-live="polite">{cartCount}</span>
          </Button>
        </div>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">KATALOG</h1>
          <p>Cari barang. Pilih. Masuk keranjang.<br /><span>SOFTDEV STORE</span></p>
        </div>
      </section>

      <section className="catalog" id="catalog" aria-labelledby="catalog-title">
        <div className="catalog-toolbar">
          <label className="search-box">
            <Search size={19} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari produk..."
              aria-label="Cari produk"
            />
          </label>
          <span className="result-count" aria-live="polite">
            {loading ? "Memuat produk" : error ? "Gagal dimuat" : `${filteredProducts.length} produk`}
          </span>
        </div>

        <div className="section-heading">
          <h2 id="catalog-title">Semua produk</h2>
          <span>Harga dalam IDR</span>
        </div>

        {loading ? (
          <div className="product-grid" aria-label="Memuat katalog" aria-busy="true">
            {Array.from({ length: 8 }, (_, index) => (
              <div className="product-skeleton" key={index}>
                <div className="skeleton-image" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="empty-state" role="alert">
            <p>{error}</p>
            <Button className="button-primary" type="button" onClick={reloadProducts}>
              Coba lagi <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        ) : filteredProducts.length ? (
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <article className="product-card" key={product.id}>
                <div className="product-category">{product.category.replaceAll("-", " ")}</div>
                <div className="product-image">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    loading={index < 4 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 50vw, (max-width: 1000px) 33vw, 25vw"
                    unoptimized
                  />
                </div>
                <div className="product-details">
                  <h3>{product.title}</h3>
                  <p className="product-price">{formatPrice(product.price)}</p>
                  <Button
                    className="button-primary add-button"
                    type="button"
                    onClick={() => {
                      changeQuantity(product.id, 1);
                      setCartOpen(true);
                    }}
                    aria-label={`Tambah ${product.title} ke keranjang`}
                  >
                    <Plus size={22} aria-hidden="true" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Produk tidak ditemukan.</p>
            <Button className="text-button" variant="ghost" type="button" onClick={() => setSearch("")}>
              Hapus pencarian
            </Button>
          </div>
        )}
      </section>

        <dialog ref={cartDialog} className="cart-layer" aria-labelledby="cart-title" onCancel={() => setCartOpen(false)}>
          <button
            className="cart-backdrop"
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Tutup keranjang"
          />
          <div className="cart-drawer">
            <div className="cart-header">
              <div>
                <h2 id="cart-title">Keranjang</h2>
                <span>{cartCount} barang</span>
              </div>
              <Button
                className="icon-button"
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Tutup keranjang"
              >
                <X size={20} aria-hidden="true" />
              </Button>
            </div>

            {cartItems.length ? (
              <ul className="cart-list">
                {cartItems.map((product) => (
                  <li className="cart-item" key={product.id}>
                    <div className="cart-item-image">
                      <Image src={product.thumbnail} alt="" fill sizes="84px" unoptimized />
                    </div>
                    <div className="cart-item-copy">
                      <h3>{product.title}</h3>
                      <strong>{formatPrice(product.price)}</strong>
                      <div className="quantity-control" aria-label={`Jumlah ${product.title}`}>
                        <Button
                          className="quantity-button"
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => changeQuantity(product.id, -1)}
                          aria-label={cart[product.id] === 1 ? `Hapus ${product.title}` : `Kurangi ${product.title}`}
                        >
                          <Minus size={14} aria-hidden="true" />
                        </Button>
                        <span aria-live="polite">{cart[product.id]}</span>
                        <Button
                          className="quantity-button"
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => changeQuantity(product.id, 1)}
                          aria-label={`Tambah ${product.title}`}
                        >
                          <Plus size={14} aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="cart-empty">
                <ShoppingBag size={28} strokeWidth={1.5} aria-hidden="true" />
                <h3>Keranjang masih kosong</h3>
                <p>Yuk, temukan sesuatu yang kamu suka.</p>
              </div>
            )}

            <div className="cart-footer">
              <div className="subtotal-row">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <Button
                className="button-primary continue-button"
                type="button"
                onClick={() => setCartOpen(false)}
              >
                Lanjut belanja <ArrowRight size={17} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </dialog>
    </main>
  );
}
