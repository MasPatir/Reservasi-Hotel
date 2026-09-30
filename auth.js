// ============================================================
// AUTH.JS - Masuk, daftar, dan keluar
// ============================================================

function aturMode(daftar) {
  modeDaftar = daftar;
  $("judulAuth").textContent = daftar ? "Daftar akun" : "Masuk";
  $("btnSubmitAuth").textContent = daftar ? "Daftar" : "Masuk";
  $("gantiMode").textContent = daftar ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar";
  $("kolomDaftar").hidden = !daftar;
  $("authError").textContent = "";
}

function bukaAuth(daftar) {
  aturMode(daftar);
  $("aPass").type = "password";
  $("lihatPass").checked = false;
  authPopup.showModal();
}

$("gantiMode").addEventListener("click", function () { aturMode(!modeDaftar); });
$("tutupAuth").addEventListener("click", function () { authPopup.close(); });
authPopup.addEventListener("close", function () { $("formAuth").reset(); });
$("lihatPass").addEventListener("change", function () { $("aPass").type = this.checked ? "text" : "password"; });

$("btnAuth").addEventListener("click", function () {
  if (userAktif()) {            // sudah login -> tombol jadi "Keluar"
    sesi = null;
    localStorage.removeItem("sesi");
    segarkan();
  } else {
    bukaAuth(false);
  }
});

$("formAuth").addEventListener("submit", function (e) {
  e.preventDefault();
  const error = $("authError");
  const email = $("aEmail").value.trim().toLowerCase();
  const password = $("aPass").value;

  if (modeDaftar) {
    const nama = $("aNama").value.trim();
    const alamat = $("aAlamat").value.trim();
    const hp = $("aHp").value.trim();
    if (!nama || !alamat) { error.textContent = "Nama dan alamat wajib diisi."; return; }
    if (!/^[0-9]{9,14}$/.test(hp)) { error.textContent = "No. HP harus 9-14 digit angka."; return; }
    if (pengguna.some(function (u) { return u.email === email; })) {
      error.textContent = "Email sudah terdaftar. Silakan masuk."; return;
    }
    pengguna.push({ email: email, password: password, nama: nama, alamat: alamat, hp: hp, role: "pelanggan" });
    simpan();
  } else {
    const cocok = pengguna.find(function (u) { return u.email === email && u.password === password; });
    if (!cocok) { error.textContent = "Email atau password salah."; return; }
  }

  sesi = email;
  localStorage.setItem("sesi", sesi);
  authPopup.close();
  segarkan();
});
