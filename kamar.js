// ============================================================
// KAMAR.JS - Daftar kamar dan filter pencarian
// ============================================================

function tampilKamar() {
  const tipe = fTipe.value, maks = Number(fHarga.value);
  const hasil = kamar.filter(function (k) {
    return (!tipe || k.tipe === tipe) && (!maks || k.harga <= maks);
  });

  $("daftarKamar").innerHTML = hasil.map(function (k) {
    const p = penuh(k, fMasuk.value, fKeluar.value);
    return `
      <article class="kamar ${k.tipe} ${p ? "penuh" : ""}">
        <div class="kamar-atas">${k.tipe}</div>
        <div class="kamar-isi">
          <strong>Kamar ${aman(k.no)}</strong>
          <span class="harga">${rupiah(k.harga)} / malam</span>
          <span>${p ? "Tidak tersedia" : "Tersedia"}</span>
          <button class="tombol" ${p ? "disabled" : ""} onclick="bukaPopup(${k.id})">${p ? "Penuh" : "Pesan"}</button>
        </div>
      </article>`;
  }).join("");

  $("info").textContent = hasil.length
    ? hasil.length + " kamar ditemukan."
    : "Tidak ada kamar yang cocok. Coba ubah filter.";
}
