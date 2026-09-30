// ============================================================
// DATA.JS - Data kamar, akun, dan penyimpanan (localStorage)
// ============================================================

const kamarAwal = [
  { id: 1, no: "101", tipe: "Standard", harga: 350000,  status: "Tersedia" },
  { id: 2, no: "102", tipe: "Standard", harga: 380000,  status: "Tersedia" },
  { id: 3, no: "201", tipe: "Deluxe",   harga: 600000,  status: "Tersedia" },
  { id: 4, no: "202", tipe: "Deluxe",   harga: 650000,  status: "Terisi"   },
  { id: 5, no: "301", tipe: "Suite",    harga: 950000,  status: "Tersedia" },
  { id: 6, no: "302", tipe: "Suite",    harga: 1200000, status: "Tersedia" }
];
const adminAwal = { email: "admin@hotel.com", password: "admin123", nama: "Admin Hotel", role: "admin" };

function ambil(kunci, cadangan) {
  try { return JSON.parse(localStorage.getItem(kunci)) || cadangan; }
  catch (e) { return cadangan; }   // data rusak -> pakai data awal
}

let kamar = ambil("kamar", kamarAwal);
let reservasi = ambil("reservasi", []);
let pengguna = ambil("pengguna", [adminAwal]);
let sesi = localStorage.getItem("sesi");   // email yang sedang login
let kamarDipilih = null;
let modeDaftar = false;

// Rapikan data dari versi lama (yang masih memakai username)
pengguna.forEach(function (u) { if (!u.email) u.email = (u.username || "user") + "@hotel.com"; });
reservasi.forEach(function (r) {
  if (!r.status) r.status = "Dipesan";
  if (!r.email) r.email = r.username;
});
if (sesi && !pengguna.some(function (u) { return u.email === sesi; })) sesi = null;

function simpan() {
  localStorage.setItem("kamar", JSON.stringify(kamar));
  localStorage.setItem("reservasi", JSON.stringify(reservasi));
  localStorage.setItem("pengguna", JSON.stringify(pengguna));
}
