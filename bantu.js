// ============================================================
// BANTU.JS - Elemen HTML dan fungsi kecil yang dipakai bersama
// ============================================================

const $ = function (id) { return document.getElementById(id); };
const popup = $("popup"), authPopup = $("authPopup");
const fMasuk = $("fMasuk"), fKeluar = $("fKeluar"), fTipe = $("fTipe"), fHarga = $("fHarga");
const masuk = $("masuk"), keluar = $("keluar");

// Tanggal hari ini memakai jam lokal (bukan UTC) agar tidak mundur sehari
const hariIni = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

function rupiah(angka) { return "Rp " + angka.toLocaleString("id-ID"); }

function aman(teks) {   // mencegah teks user dibaca sebagai kode HTML
  return String(teks).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function hitungMalam(a, b) {
  if (!a || !b) return 0;
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function besok(tanggal) {
  const d = new Date(tanggal);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// Check-out minimal sehari setelah check-in
function sinkron(inputMasuk, inputKeluar) {
  inputKeluar.min = inputMasuk.value ? besok(inputMasuk.value) : hariIni;
  if (inputKeluar.value && inputKeluar.value < inputKeluar.min) inputKeluar.value = "";
}

function bentrok(idKamar, a, b) {
  return reservasi.some(function (r) {
    return r.idKamar === idKamar && r.status !== "Dibatalkan" && r.status !== "Selesai"
      && a < r.keluar && b > r.masuk;
  });
}

// Apakah kamar tidak bisa dipesan? (dengan atau tanpa tanggal)
function penuh(k, a, b) {
  if (a && b && b > a) return bentrok(k.id, a, b) || (k.status === "Terisi" && a <= hariIni);
  return k.status === "Terisi";
}

function userAktif() {
  return pengguna.find(function (u) { return u.email === sesi; });
}
