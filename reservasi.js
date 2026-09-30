// ============================================================
// RESERVASI.JS - Bukti reservasi dan riwayat pelanggan
// ============================================================

function tampilBukti(data) {
  $("bukti").innerHTML = `
    <p><span>No. reservasi</span><strong>${data.id}</strong></p>
    <p><span>Nama</span><strong>${aman(data.nama)}</strong></p>
    <p><span>Kamar</span><strong>${aman(data.kamar)}</strong></p>
    <p><span>Menginap</span><strong>${data.masuk} s/d ${data.keluar}</strong></p>
    <p><span>Metode bayar</span><strong>${data.metode}</strong></p>
    <p><span>Total dibayar</span><strong>${rupiah(data.total)}</strong></p>
    <p><span>Status</span><strong>${data.status}</strong></p>`;
  $("isiForm").hidden = true;
  $("isiBukti").hidden = false;
  if (!popup.open) popup.showModal();
}

function lihatBukti(id) {
  tampilBukti(reservasi.find(function (r) { return r.id === id; }));
}

function tampilRiwayat() {
  const user = userAktif();
  const kotak = $("daftarRiwayat");
  if (!user) { kotak.innerHTML = "<p>Login Terlebih dahulu untuk melihat Reservasi Anda.</p>"; return; }

  const milikku = reservasi.filter(function (r) { return r.email === user.email; }).reverse();
  if (milikku.length === 0) { kotak.innerHTML = "<p>Belum ada reservasi. Pilih kamar di atas untuk mulai.</p>"; return; }

  kotak.innerHTML = milikku.map(function (r) {
    const batal = r.status === "Dipesan"
      ? `<button class="aksi bahaya" onclick="ubahReservasi('${r.id}', 'Dibatalkan')">Batalkan</button>` : "";
    return `<div class="riwayat-item">
      <strong>${r.id}</strong> <span class="badge ${r.status}">${r.status}</span><br>
      Kamar ${aman(r.kamar)} &middot; ${r.masuk} s/d ${r.keluar} (${r.malam} malam) &middot; ${rupiah(r.total)}<br>
      <button class="aksi" onclick="lihatBukti('${r.id}')">Lihat bukti</button>${batal}
    </div>`;
  }).join("");
}
