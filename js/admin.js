document.addEventListener("DOMContentLoaded", function() {
    capNhatMenuAuth();
    kiemTraQuyenAdmin();
    hienThiDanhSachPhongAdmin();
    hienThiDanhSachUserAdmin();
});

function layDanhSachPhong() {
    var data = localStorage.getItem("dsPhong");
    if (!data) {
        var dsMoiDau = [
            { id: 1, ten: "Phòng Standard 101 (STD)", gia: "500000", tienIch: "Nhu cầu: Rẻ nhất có thể. Giường: 1 giường đôi. Tầng 1, hướng sân vườn.", trangThai: "Còn trống", hinhAnh: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
            { id: 2, ten: "Phòng Standard 102 (STD)", gia: "500000", tienIch: "Nhu cầu: Rẻ nhất có thể. Giường: 2 giường đơn. Tầng 1, hướng sân vườn.", trangThai: "Còn trống", hinhAnh: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
            { id: 3, ten: "Phòng Standard 103 (STD)", gia: "520000", tienIch: "Nhu cầu: Rẻ nhất có thể. Giường: 1 giường đôi. Tiện nghi cơ bản đầy đủ.", trangThai: "Còn trống", hinhAnh: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
            { id: 4, ten: "Phòng Standard 104 (STD)", gia: "520000", tienIch: "Nhu cầu: Rẻ nhất có thể. Giường: 2 giường đơn. Tiện nghi cơ bản đầy đủ.", trangThai: "Còn trống", hinhAnh: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
            { id: 5, ten: "Phòng Standard 105 (STD)", gia: "550000", tienIch: "Nhu cầu: Rẻ nhất có thể. Giường: 1 giường đôi lớn. Gần sảnh chính.", trangThai: "Còn trống", hinhAnh: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" }
        ];
        localStorage.setItem("dsPhong", JSON.stringify(dsMoiDau));
        return dsMoiDau;
    }
    return JSON.parse(data);
}

function layDanhSachTaiKhoan() {
    var data = localStorage.getItem("dsTaiKhoan");
    if (!data) {
        var tkMacDinh = [
            { username: "admin", password: "123456", role: "admin", name: "Quản trị viên" }
        ];
        localStorage.setItem("dsTaiKhoan", JSON.stringify(tkMacDinh));
        return tkMacDinh;
    }
    return JSON.parse(data);
}

function kiemTraQuyenAdmin() {
    var currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        alert("Vui lòng đăng nhập tài khoản Quản trị viên (admin) để truy cập!");
        window.location.href = "login.html";
        return;
    }
    var user = JSON.parse(currentUser);
    if (user.role !== "admin") {
        alert("Bạn không có quyền truy cập trang quản trị!");
        window.location.href = "index.html";
    }
}

function chuyenTab(tabId, btn) {
    var contents = document.getElementsByClassName("tab-content");
    for (var i = 0; i < contents.length; i++) {
        contents[i].classList.remove("active");
    }
    var buttons = document.getElementsByClassName("tab-btn");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }
    document.getElementById(tabId).classList.add("active");
    btn.classList.add("active");
}

function hienThiDanhSachPhongAdmin() {
    var ds = layDanhSachPhong();
    var dsDonDat = JSON.parse(localStorage.getItem("dsDonDat")) || [];
    var tbody = document.getElementById("adminRoomTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    var countTrong = 0;
    var countDat = 0;

    for (var i = 0; i < ds.length; i++) {
        if (ds[i].trangThai === "Còn trống") countTrong++;
        else countDat++;

        var thongTinKhach = "Chưa có";
        if (ds[i].trangThai === "Đã đặt") {
            var foundDon = null;
            for (var j = 0; j < dsDonDat.length; j++) {
                if (dsDonDat[j].tenPhong === ds[i].ten) {
                    foundDon = dsDonDat[j];
                    break;
                }
            }
            if (foundDon) {
                thongTinKhach = `<b>${foundDon.hoTen}</b><br>SĐT: ${foundDon.dienThoai}<br><small>${foundDon.ngayNhan} đến ${foundDon.ngayTra}</small>`;
            } else {
                thongTinKhach = `<span style="color:#d97706;">Đã đặt (Khách lẻ/Trực tiếp)</span>`;
            }
        }

        var tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td style="font-weight: bold;">${ds[i].ten}</td>
            <td>${Number(ds[i].gia).toLocaleString('vi-VN')} VNĐ</td>
            <td><span style="color: ${ds[i].trangThai === 'Còn trống' ? '#059669' : '#dc2626'}; font-weight: bold;">${ds[i].trangThai}</span></td>
            <td style="text-align: left; font-size: 13px;">${thongTinKhach}</td>
            <td>
                <button class="btn-approve" onclick="doiTrangThaiPhongAdmin(${i})" style="margin-right: 4px; margin-bottom: 4px;">Đổi Trạng Thái</button>
                <button class="btn-approve" onclick="suaPhongAdmin(${i})" style="background-color: #2563eb; margin-right: 4px; margin-bottom: 4px;">Sửa</button>
                <button class="btn-delete" onclick="xoaPhongAdmin(${i})" style="margin-bottom: 4px;">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    }

    document.getElementById("statTotalRooms").innerText = ds.length;
    document.getElementById("statAvailable").innerText = countTrong;
    document.getElementById("statBooked").innerText = countDat;
}

function moFormThemPhong() {
    var editIndexElem = document.getElementById("editRoomIndex");
    var roomFormElem = document.getElementById("roomForm");
    var titleElem = document.getElementById("roomFormTitle");
    var btnSaveElem = document.getElementById("btnSaveRoom");
    var boxElem = document.getElementById("boxEditRoom");

    if (editIndexElem) editIndexElem.value = "";
    if (roomFormElem) roomFormElem.reset();
    if (titleElem) titleElem.innerText = "THÊM PHÒNG MỚI";
    if (btnSaveElem) btnSaveElem.innerText = "Thêm Phòng Mới";
    if (boxElem) boxElem.style.display = "block";
    window.scrollTo({ top: 300, behavior: 'smooth' });
}

function suaPhongAdmin(index) {
    var ds = layDanhSachPhong();
    var phong = ds[index];
    if (!phong) return;

    var editIndexElem = document.getElementById("editRoomIndex");
    var nameElem = document.getElementById("roomName");
    var priceElem = document.getElementById("roomPrice");
    var imgElem = document.getElementById("roomImg");
    var amenitiesElem = document.getElementById("roomAmenities");
    var titleElem = document.getElementById("roomFormTitle");
    var btnSaveElem = document.getElementById("btnSaveRoom");
    var boxElem = document.getElementById("boxEditRoom");

    if (editIndexElem) editIndexElem.value = index;
    if (nameElem) nameElem.value = phong.ten || "";
    if (priceElem) priceElem.value = phong.gia || "";
    if (imgElem) imgElem.value = phong.hinhAnh || "";
    if (amenitiesElem) amenitiesElem.value = phong.tienIch || "";

    if (titleElem) titleElem.innerText = "ĐIỀU CHỈNH THÔNG TIN PHÒNG";
    if (btnSaveElem) btnSaveElem.innerText = "Lưu Điều Chỉnh";
    if (boxElem) boxElem.style.display = "block";
    window.scrollTo({ top: 300, behavior: 'smooth' });
}

function dongFormPhong() {
    var boxElem = document.getElementById("boxEditRoom");
    var editIndexElem = document.getElementById("editRoomIndex");
    var roomFormElem = document.getElementById("roomForm");

    if (boxElem) boxElem.style.display = "none";
    if (editIndexElem) editIndexElem.value = "";
    if (roomFormElem) roomFormElem.reset();
}

function doiTrangThaiPhongAdmin(index) {
    var ds = layDanhSachPhong();
    var newStatus = (ds[index].trangThai === "Còn trống") ? "Đã đặt" : "Còn trống";
    ds[index].trangThai = newStatus;
    
    if (newStatus === "Còn trống") {
        var dsDonDat = JSON.parse(localStorage.getItem("dsDonDat")) || [];
        dsDonDat = dsDonDat.filter(function(don) {
            return don.tenPhong !== ds[index].ten;
        });
        localStorage.setItem("dsDonDat", JSON.stringify(dsDonDat));
    }

    localStorage.setItem("dsPhong", JSON.stringify(ds));
    hienThiDanhSachPhongAdmin();
}

function luuPhong(event) {
    if (event) event.preventDefault();
    
    var editIndexElem = document.getElementById("editRoomIndex");
    var nameElem = document.getElementById("roomName");
    var priceElem = document.getElementById("roomPrice");
    var imgElem = document.getElementById("roomImg");
    var amenitiesElem = document.getElementById("roomAmenities");

    var ten = nameElem ? nameElem.value.trim() : "";
    var gia = priceElem ? priceElem.value.trim() : "";
    var img = imgElem ? imgElem.value.trim() : "";
    var tienIch = amenitiesElem ? amenitiesElem.value.trim() : "";

    if (!ten || !gia) {
        alert("Vui lòng nhập đầy đủ tên phòng và giá phòng!");
        return false;
    }

    var ds = layDanhSachPhong();
    var editIndex = editIndexElem ? editIndexElem.value : "";

    if (editIndex === "") {
        ds.push({
            id: Date.now(),
            ten: ten,
            gia: String(gia),
            hinhAnh: img || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
            tienIch: tienIch || "Tiêu chuẩn cơ bản",
            trangThai: "Còn trống"
        });
        alert("Thêm phòng mới thành công!");
    } else {
        var idx = Number(editIndex);
        ds[idx].ten = ten;
        ds[idx].gia = String(gia);
        if (img) ds[idx].hinhAnh = img;
        if (tienIch) ds[idx].tienIch = tienIch;
        alert("Cập nhật điều chỉnh phòng thành công!");
    }

    localStorage.setItem("dsPhong", JSON.stringify(ds));
    dongFormPhong();
    hienThiDanhSachPhongAdmin();
    return false;
}

function xoaPhongAdmin(index) {
    if (!confirm("Bạn có chắc chắn muốn xóa phòng này không?")) return;
    var ds = layDanhSachPhong();
    ds.splice(index, 1);
    localStorage.setItem("dsPhong", JSON.stringify(ds));
    hienThiDanhSachPhongAdmin();
    alert("Đã xóa phòng thành công!");
}

function hienThiDanhSachUserAdmin() {
    var tbody = document.getElementById("adminUserTableBody");
    if (!tbody) return;

    var dsTK = layDanhSachTaiKhoan();
    tbody.innerHTML = "";
    document.getElementById("statUsers").innerText = dsTK.length;

    for (var i = 0; i < dsTK.length; i++) {
        var tk = dsTK[i];
        var tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td style="font-weight: bold;">${tk.name || "Khách hàng"}</td>
            <td>${tk.username}</td>
            <td><code>${tk.password}</code></td>
            <td><span style="color: ${tk.role === 'admin' ? '#7c3aed' : '#2563eb'}; font-weight: bold;">${tk.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</span></td>
            <td>
                <button class="btn-approve" onclick="moFormSuaUser(${i})" style="background-color: #2563eb; margin-right: 4px;">Điều Chỉnh</button>
                ${tk.username !== 'admin' ? `<button class="btn-delete" onclick="xoaUserAdmin('${tk.username}')">Xóa</button>` : '<span style="color:gray;">Mặc định</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    }
}

function moFormThemUser() {
    document.getElementById("editUserIndex").value = "";
    document.getElementById("editFullName").value = "";
    document.getElementById("editUsername").value = "";
    document.getElementById("editPassword").value = "";
    document.getElementById("editRole").value = "user";

    document.getElementById("userFormTitle").innerText = "THÊM TÀI KHOẢN MỚI";
    document.getElementById("btnSaveUser").innerText = "Thêm Tài Khoản";
    document.getElementById("boxEditUser").style.display = "block";
    window.scrollTo({ top: 300, behavior: 'smooth' });
}

function moFormSuaUser(index) {
    var dsTK = layDanhSachTaiKhoan();
    var user = dsTK[index];

    document.getElementById("editUserIndex").value = index;
    document.getElementById("editFullName").value = user.name || "Khách hàng";
    document.getElementById("editUsername").value = user.username;
    document.getElementById("editPassword").value = user.password;
    document.getElementById("editRole").value = user.role || "user";

    document.getElementById("userFormTitle").innerText = "ĐIỀU CHỈNH THÔNG TIN & QUYỀN HẠN KHÁCH HÀNG";
    document.getElementById("btnSaveUser").innerText = "Lưu Thay Đổi";
    document.getElementById("boxEditUser").style.display = "block";
    window.scrollTo({ top: 300, behavior: 'smooth' });
}

function dongFormSuaUser() {
    document.getElementById("boxEditUser").style.display = "none";
    document.getElementById("editUserIndex").value = "";
}

function luuThongTinKhachHang(event) {
    if (event) event.preventDefault();
    var editIndexStr = document.getElementById("editUserIndex").value;
    var name = document.getElementById("editFullName").value.trim();
    var username = document.getElementById("editUsername").value.trim();
    var password = document.getElementById("editPassword").value.trim();
    var role = document.getElementById("editRole").value;

    var dsTK = layDanhSachTaiKhoan();

    if (editIndexStr === "") {
        for (var i = 0; i < dsTK.length; i++) {
            if (dsTK[i].username === username) {
                alert("Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác!");
                return false;
            }
        }
        dsTK.push({
            username: username,
            password: password,
            role: role,
            name: name
        });
        alert("Thêm tài khoản mới thành công!");
    } else {
        var index = Number(editIndexStr);
        dsTK[index].name = name;
        dsTK[index].username = username;
        dsTK[index].password = password;
        dsTK[index].role = role;
        alert("Cập nhật điều chỉnh thông tin & quyền hạn thành công!");
    }

    localStorage.setItem("dsTaiKhoan", JSON.stringify(dsTK));
    dongFormSuaUser();
    hienThiDanhSachUserAdmin();
    return false;
}

function xoaUserAdmin(username) {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này không? Tất cả các phòng do tài khoản này đặt cũng sẽ được hủy và giải phóng!")) return;
    
    var dsTK = layDanhSachTaiKhoan();
    var userCuaCanXoa = null;
    
    for (var k = 0; k < dsTK.length; k++) {
        if (dsTK[k].username === username) {
            userCuaCanXoa = dsTK[k];
            break;
        }
    }

    dsTK = dsTK.filter(function(item) {
        return item.username !== username;
    });
    localStorage.setItem("dsTaiKhoan", JSON.stringify(dsTK));

    var dsDonDat = JSON.parse(localStorage.getItem("dsDonDat")) || [];
    var dsPhong = layDanhSachPhong();

    var dsDonDatMoi = [];
    for (var i = 0; i < dsDonDat.length; i++) {
        var don = dsDonDat[i];
        var isMatch = false;

        if (don.username && don.username === username) {
            isMatch = true;
        } else if (userCuaCanXoa && userCuaCanXoa.name && don.hoTen && don.hoTen.toLowerCase().trim() === userCuaCanXoa.name.toLowerCase().trim()) {
            isMatch = true;
        } else if (don.hoTen && don.hoTen.toLowerCase().trim() === username.toLowerCase().trim()) {
            isMatch = true;
        }

        if (isMatch) {
            for (var j = 0; j < dsPhong.length; j++) {
                if (dsPhong[j].ten === don.tenPhong) {
                    dsPhong[j].trangThai = "Còn trống";
                }
            }
        } else {
            dsDonDatMoi.push(don);
        }
    }

    localStorage.setItem("dsDonDat", JSON.stringify(dsDonDatMoi));
    localStorage.setItem("dsPhong", JSON.stringify(dsPhong));

    hienThiDanhSachUserAdmin();
    hienThiDanhSachPhongAdmin();
    
    alert("Đã xóa tài khoản và giải phóng các phòng đã đặt thành công!");
}