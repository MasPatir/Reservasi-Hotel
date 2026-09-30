// ============================================================
// PEMESANAN.JS - Popup pemesanan dan pembayaran
// ============================================================

function bukaPopup(id) {
  const user = userAktif();
  if (!user) { bukaAuth(false); return; }   // wajib masuk dulu
  if (user.role === "admin") { alert("Akun admin tidak bisa memesan. Masuk dengan akun pelanggan."); return; }

  kamarDipilih = kamar.find(function (k) { return k.id === id; });
  $("formPesan").reset();
  $("judulKamar").textContent = "Kamar " + kamarDipilih.no + " (" + kamarDipilih.tipe + ")";
  $("dataPelanggan").textContent = "Atas nama " + user.nama + " - " + user.hp;
  masuk.value = fMasuk.value;
  keluar.value = fKeluar.value;
  sinkron(masuk, keluar);
  $("pesanError").textContent = "";
  $("isiForm").hidden = false;
  $("isiBukti").hidden = true;
  hitungTotal();
  popup.showModal();
}

function hitungTotal() {
  const malam = hitungMalam(masuk.value, keluar.value);
  const total = malam > 0 ? malam * kamarDipilih.harga : 0;
  $("total").textContent = rupiah(total) + (malam > 0 ? " (" + malam + " malam)" : "");
  return total;
}

masuk.addEventListener("change", function () { sinkron(masuk, keluar); hitungTotal(); });
keluar.addEventListener("change", hitungTotal);

$("formPesan").addEventListener("submit", function (e) {
  e.preventDefault();
  const error = $("pesanError");
  const user = userAktif();
  const malam = hitungMalam(masuk.value, keluar.value);

  if (malam <= 0) { error.textContent = "Tanggal check-out harus setelah check-in."; return; }
  if (penuh(kamarDipilih, masuk.value, keluar.value)) {
    error.textContent = "Kamar tidak tersedia di tanggal itu. Pilih tanggal lain."; return;
  }

  const data = {
    id: "RSV-" + Date.now().toString().slice(-6),
    idKamar: kamarDipilih.id,
    kamar: kamarDipilih.no + " (" + kamarDipilih.tipe + ")",
    email: user.email,
    nama: user.nama,
    masuk: masuk.value,
    keluar: keluar.value,
    malam: malam,
    metode: $("metode").value,
    total: hitungTotal(),
    status: "Dipesan"
  };
  reservasi.push(data);
  simpan();
  tampilBukti(data);
  segarkan();
});

$("tutup").addEventListener("click", function () { popup.close(); });
$("selesai").addEventListener("click", function () { popup.close(); });
$("cetak").addEventListener("click", function () { window.print(); });
