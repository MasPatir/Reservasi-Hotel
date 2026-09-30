// ============================================================
// ADMIN.JS - Panel admin / staf hotel
// ============================================================

function ubahReservasi(id, statusBaru) {
  const r = reservasi.find(function (x) { return x.id === id; });
  const k = kamar.find(function (x) { return x.id === r.idKamar; });
  const statusLama = r.status;
  r.status = statusBaru;
  if (k && statusBaru === "Check-in") k.status = "Terisi";
  // Kamar baru dikosongkan kalau tamu ini memang sedang menginap
  if (k && statusLama === "Check-in") k.status = "Tersedia";
  simpan();
  segarkan();
}

function ubahKamar(id, statusBaru) {
  kamar.find(function (k) { return k.id === id; }).status = statusBaru;
  simpan();
  segarkan();
}

function tampilAdmin() {
  const aktif = reservasi.filter(function (r) { return r.status !== "Dibatalkan"; });
  const pendapatan = aktif.reduce(function (t, r) { return t + r.total; }, 0);
  const terisi = kamar.filter(function (k) { return k.status === "Terisi"; }).length;

  $("statistik").innerHTML =
    `<div>Reservasi aktif<strong>${aktif.length}</strong></div>
     <div>Pendapatan<strong>${rupiah(pendapatan)}</strong></div>
     <div>Kamar terisi<strong>${terisi} / ${kamar.length}</strong></div>`;

  $("adminKamar").innerHTML = "<table><tr><th>Kamar</th><th>Tipe</th><th>Harga</th><th>Status</th></tr>" +
    kamar.map(function (k) {
      return `<tr><td>${aman(k.no)}</td><td>${k.tipe}</td><td>${rupiah(k.harga)}</td>
        <td><select onchange="ubahKamar(${k.id}, this.value)">
          <option ${k.status === "Tersedia" ? "selected" : ""}>Tersedia</option>
          <option ${k.status === "Terisi" ? "selected" : ""}>Terisi</option>
        </select></td></tr>`;
    }).join("") + "</table>";

  if (reservasi.length === 0) { $("adminReservasi").innerHTML = "<p>Belum ada reservasi masuk.</p>"; return; }
  $("adminReservasi").innerHTML = "<table><tr><th>No.</th><th>Tamu</th><th>Kamar</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th></tr>" +
    reservasi.slice().reverse().map(function (r) {
      let aksi = "";
      if (r.status === "Dipesan") aksi = `<button class="aksi" onclick="ubahReservasi('${r.id}','Check-in')">Check-in</button>
        <button class="aksi bahaya" onclick="ubahReservasi('${r.id}','Dibatalkan')">Batalkan</button>`;
      if (r.status === "Check-in") aksi = `<button class="aksi" onclick="ubahReservasi('${r.id}','Selesai')">Check-out</button>`;
      return `<tr><td>${r.id}</td><td>${aman(r.nama)}</td><td>${aman(r.kamar)}</td>
        <td>${r.masuk} s/d ${r.keluar}</td><td>${rupiah(r.total)}</td>
        <td><span class="badge ${r.status}">${r.status}</span></td><td>${aksi}</td></tr>`;
    }).join("") + "</table>";
}

$("formKamar").addEventListener("submit", function (e) {
  e.preventDefault();
  const no = $("kNo").value.trim();
  if (kamar.some(function (k) { return k.no === no; })) { alert("Nomor kamar " + no + " sudah ada."); return; }
  const idBaru = Math.max.apply(null, kamar.map(function (k) { return k.id; })) + 1;
  kamar.push({ id: idBaru, no: no, tipe: $("kTipe").value, harga: Number($("kHarga").value), status: "Tersedia" });
  simpan();
  $("formKamar").reset();
  segarkan();
});
