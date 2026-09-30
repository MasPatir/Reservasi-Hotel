// ============================================================
// ULASAN.JS - Komentar, keluhan, dan saran pelanggan
// ============================================================

let ulasan = ambil("ulasan", []);


function simpanUlasan() {
  localStorage.setItem("ulasan", JSON.stringify(ulasan));
}


// Ubah angka 4 menjadi tulisan bintang: ★★★★☆
function bintang(nilai) {
  return "★".repeat(nilai) + "☆".repeat(5 - nilai);
}


function tampilUlasan() {
  const user = userAktif();
  const admin = !!user && user.role === "admin";
  const bisaMenulis = !!user && !admin;

  // Form hanya untuk pelanggan yang sudah masuk
  $("formUlasan").hidden = !bisaMenulis;

  if (!user) {
    $("catatUlasan").textContent = "Login Terlebih dahulu untuk menulis Ulasan atau Keluhan Anda.";
  } else if (admin) {
    $("catatUlasan").textContent = "Sebagai admin, Anda dapat membalas atau menghapus ulasan.";
  } else {
    $("catatUlasan").textContent = "";
  }

  // Ringkasan nilai rata-rata
  if (ulasan.length === 0) {
    $("ringkasUlasan").textContent = "Belum ada ulasan. Jadilah yang pertama.";
    $("daftarUlasan").innerHTML = "";
    return;
  }

  const jumlah = ulasan.reduce(function (total, u) { return total + u.nilai; }, 0);
  $("ringkasUlasan").textContent =
    "Rata-rata " + (jumlah / ulasan.length).toFixed(1) + " dari 5, dari " + ulasan.length + " ulasan.";

  // Daftar ulasan, yang terbaru di atas
  $("daftarUlasan").innerHTML = ulasan.slice().reverse().map(function (u) {
    const pemilik = !!user && user.email === u.email;
    let tombol = "";

    if (admin) {
      tombol += `<button class="aksi" onclick="balasUlasan('${u.id}')">Balas</button>`;
    }
    if (admin || pemilik) {
      tombol += `<button class="aksi bahaya" onclick="hapusUlasan('${u.id}')">Hapus</button>`;
    }

    const balasan = u.balasan
      ? `<div class="balasan"><strong>Balasan hotel:</strong> ${aman(u.balasan)}</div>`
      : "";

    return `
      <div class="ulasan-item">
        <div class="ulasan-atas">
          <strong>${aman(u.nama)}</strong>
          <span class="badge ${u.jenis}">${u.jenis}</span>
          <span class="bintang-teks" aria-label="Nilai ${u.nilai} dari 5">${bintang(u.nilai)}</span>
        </div>
        <small>${u.tanggal}</small>
        <p>${aman(u.pesan)}</p>
        ${balasan}
        ${tombol}
      </div>`;
  }).join("");
}


function balasUlasan(id) {
  const u = ulasan.find(function (x) { return x.id === id; });
  const teks = prompt("Tulis balasan untuk " + u.nama + ":", u.balasan);

  if (teks === null) return;   // admin menekan Batal

  u.balasan = teks.trim();
  simpanUlasan();
  tampilUlasan();
}


function hapusUlasan(id) {
  if (!confirm("Hapus ulasan ini?")) return;

  ulasan = ulasan.filter(function (x) { return x.id !== id; });
  simpanUlasan();
  tampilUlasan();
}


$("formUlasan").addEventListener("submit", function (e) {
  e.preventDefault();

  const user = userAktif();
  const pesan = $("uPesan").value.trim();

  if (pesan.length < 5) {
    $("ulasanError").textContent = "Pesan minimal 5 karakter.";
    return;
  }

  ulasan.push({
    id: "ULS-" + Date.now(),
    email: user.email,
    nama: user.nama,
    jenis: $("uJenis").value,
    nilai: Number($("uNilai").value),
    pesan: pesan,
    tanggal: hariIni,
    balasan: ""
  });

  simpanUlasan();
  $("formUlasan").reset();
  $("ulasanError").textContent = "";
  tampilUlasan();
});
