document.addEventListener("DOMContentLoaded", function() {
    if (typeof capNhatMenuAuth === "function") {
        capNhatMenuAuth();
    }
});

function dangKyTaiKhoan(event) {
    event.preventDefault();
    var name = document.getElementById("regName").value.trim();
    var username = document.getElementById("regUsername").value.trim();
    var password = document.getElementById("regPassword").value.trim();
    var confirmPassword = document.getElementById("regConfirmPassword").value.trim();

    if (!name || !username || !password || !confirmPassword) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return false;
    }

    var dsTK = layDanhSachTaiKhoan();
    for (var i = 0; i < dsTK.length; i++) {
        if (dsTK[i].username === username) {
            alert("Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác!");
            return false;
        }
    }

    dsTK.push({ username: username, password: password, role: "user", name: name });
    localStorage.setItem("dsTaiKhoan", JSON.stringify(dsTK));

    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    window.location.href = "login.html";
    return false;
}