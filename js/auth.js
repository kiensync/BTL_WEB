var danhSachTaiKhoanMacDinh = [
    { username: "admin", password: "123456", role: "admin", name: "Quản trị viên" },
    { username: "guest", password: "123456", role: "user", name: "Khách hàng" }
];

function layDanhSachTaiKhoan() {
    var data = localStorage.getItem("dsTaiKhoan");
    if (!data) {
        localStorage.setItem("dsTaiKhoan", JSON.stringify(danhSachTaiKhoanMacDinh));
        return danhSachTaiKhoanMacDinh;
    }
    return JSON.parse(data);
}

function dangNhap(event) {
    if (event) event.preventDefault();

    var userInput = document.getElementById("username") ? document.getElementById("username").value.trim() : "";
    var passInput = document.getElementById("password") ? document.getElementById("password").value.trim() : "";

    if (!userInput || !passInput) {
        alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
        return false;
    }

    var dsTK = layDanhSachTaiKhoan();
    var found = null;

    for (var i = 0; i < dsTK.length; i++) {
        if (dsTK[i].username === userInput && dsTK[i].password === passInput) {
            found = dsTK[i];
            break;
        }
    }

    if (found) {
        localStorage.setItem("currentUser", JSON.stringify(found));
        alert("Đăng nhập thành công!");
        if (found.role === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
    } else {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
    return false;
}

function dangXuat() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

function capNhatMenuAuth() {
    var navAuthLink = document.getElementById("navAuthLink");
    if (!navAuthLink) return;

    var currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        var user = JSON.parse(currentUser);
        navAuthLink.innerText = "Đăng xuất (" + user.username + ")";
        navAuthLink.href = "#";
        navAuthLink.onclick = function(e) {
            e.preventDefault();
            dangXuat();
        };
    } else {
        navAuthLink.innerText = "Đăng nhập";
        navAuthLink.href = "login.html";
        navAuthLink.onclick = null;
    }
}