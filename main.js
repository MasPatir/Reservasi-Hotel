// ============================================================
// MAIN.JS - Mengatur tampilan dan menjalankan halaman
// ============================================================

function segarkan() {
  const user = userAktif();
  const admin = !!user && user.role === "admin";
  $("btnAuth").textContent = user ? "Keluar (" + user.nama.split(" ")[0] + ")" : "Masuk";
  $("navAdmin").hidden = !admin;
  $("admin").hidden = !admin;
  $("riwayat").hidden = admin;   // admin tidak punya reservasi pribadi
  tampilKamar();
  tampilRiwayat();
  tampilUlasan();
  if (admin) tampilAdmin();
}

fMasuk.addEventListener("change", function () { sinkron(fMasuk, fKeluar); tampilKamar(); });
[fKeluar, fTipe, fHarga].forEach(function (el) { el.addEventListener("change", tampilKamar); });

fMasuk.min = hariIni;
masuk.min = hariIni;
sinkron(fMasuk, fKeluar);

simpan();      // pastikan akun admin awal tersimpan
segarkan();
