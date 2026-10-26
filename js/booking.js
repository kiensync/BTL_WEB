document.addEventListener("DOMContentLoaded", function() {
    capNhatMenuAuth();
    hienThiOptionDatPhong();
    hienThiLichSuDatPhong();
});

function hienThiOptionDatPhong() {
    var selectBox = document.getElementById("loaiPhong");
    if (!selectBox) return;

    var ds = layDanhSachPhong();
    selectBox.innerHTML = "";

    var count = 0;
    for (var i = 0; i < ds.length; i++) {
        if (ds[i].trangThai === "Còn trống") {
            var giaDinhDang = Number(ds[i].gia).toLocaleString('vi-VN');
            var option = document.createElement("option");
            option.value = ds[i].ten;
            option.textContent = ds[i].ten + " - " + giaDinhDang + " VNĐ / đêm";
            selectBox.appendChild(option);
            count++;
        }
    }

    if (count === 0) {
        var option = document.createElement("option");
        option.value = "";
        option.textContent = "Hiện tại hết phòng trống";
        selectBox.appendChild(option);
    }

    capNhatPreviewPhong();
}

function capNhatPreviewPhong() {
    var selectBox = document.getElementById("loaiPhong");
    if (!selectBox) return;
    var tenPhongChon = selectBox.value;
    var ds = layDanhSachPhong();
    var phongChon = null;

    for (var i = 0; i < ds.length; i++) {
        if (ds[i].ten === tenPhongChon) {
            phongChon = ds[i];
            break;
        }
    }

    if (phongChon) {
        var imgElem = document.getElementById("previewImg");
        var nameElem = document.getElementById("previewName");
        var priceElem = document.getElementById("previewPrice");
        var amenitiesElem = document.getElementById("previewAmenities");

        if (imgElem) imgElem.src = phongChon.hinhAnh || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80";
        if (nameElem) nameElem.innerText = phongChon.ten;
        if (priceElem) priceElem.innerText = Number(phongChon.gia).toLocaleString('vi-VN') + " VNĐ / đêm";
        if (amenitiesElem) amenitiesElem.innerText = phongChon.tienIch;
    }
}

function xuLyDatPhong(event) {
    if (event) event.preventDefault();
    
    var currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) {
        alert("Vui lòng đăng nhập tài khoản để thực hiện đặt phòng!");
        window.location.href = "login.html";
        return false;
    }
    var currentUser = JSON.parse(currentUserStr);

    var hoTen = document.getElementById("hoTen").value.trim();
    var dienThoai = document.getElementById("dienThoai").value.trim();
    var tenPhong = document.getElementById("loaiPhong").value;
    var ngayNhan = document.getElementById("ngayNhan").value;
    var ngayTra = document.getElementById("ngayTra").value;

    if (!hoTen || !dienThoai || !tenPhong || !ngayNhan || !ngayTra) {
        alert("Vui lòng điền đầy đủ thông tin đặt phòng!");
        return false;
    }

    if (hoTen.length < 2 || !isNaN(hoTen)) {
        alert("Họ và tên không hợp lệ! Vui lòng nhập tên đầy đủ bằng chữ.");
        document.getElementById("hoTen").focus();
        return false;
    }

    var phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(dienThoai)) {
        alert("Số điện thoại không hợp lệ! Vui lòng nhập từ 9 đến 11 chữ số và không chứa chữ cái.");
        document.getElementById("dienThoai").focus();
        return false;
    }

    var dateNhan = new Date(ngayNhan);
    var dateTra = new Date(ngayTra);

    if (isNaN(dateNhan.getTime()) || isNaN(dateTra.getTime())) {
        alert("Vui lòng chọn ngày nhận phòng và ngày trả phòng hợp lệ!");
        return false;
    }

    if (dateTra <= dateNhan) {
        alert("Ngày trả phòng bắt buộc phải sau ngày nhận phòng!");
        document.getElementById("ngayTra").focus();
        return false;
    }

    var ds = layDanhSachPhong();
    var foundIndex = -1;
    for (var i = 0; i < ds.length; i++) {
        if (ds[i].ten === tenPhong) {
            foundIndex = i;
            break;
        }
    }

    if (foundIndex !== -1) {
        if (ds[foundIndex].trangThai === "Đã đặt") {
            alert("Phòng này hiện đã được đặt, vui lòng chọn phòng khác!");
            hienThiOptionDatPhong();
            return false;
        }

        ds[foundIndex].trangThai = "Đã đặt";
        localStorage.setItem("dsPhong", JSON.stringify(ds));

        var dsDonDat = JSON.parse(localStorage.getItem("dsDonDat")) || [];
        dsDonDat.push({
            id: Date.now(),
            username: currentUser.username,
            hoTen: hoTen,
            dienThoai: dienThoai,
            tenPhong: tenPhong,
            ngayNhan: ngayNhan,
            ngayTra: ngayTra
        });
        localStorage.setItem("dsDonDat", JSON.stringify(dsDonDat));

        alert("Đặt phòng thành công!");
        location.reload();
    } else {
        alert("Không tìm thấy thông tin phòng đã chọn!");
    }
    return false;
}

function hienThiLichSuDatPhong() {
    var tbody = document.getElementById("lichSuDatPhongBody");
    if (!tbody) return;

    var currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b;">Vui lòng đăng nhập để xem lịch sử đặt phòng.</td></tr>`;
        return;
    }
    var currentUser = JSON.parse(currentUserStr);

    var dsDonDat = JSON.parse(localStorage.getItem("dsDonDat")) || [];
    tbody.innerHTML = "";

    var dsDonCuaUser = [];
    for (var i = 0; i < dsDonDat.length; i++) {
        if (dsDonDat[i].username === currentUser.username) {
            dsDonCuaUser.push(dsDonDat[i]);
        }
    }

    if (dsDonCuaUser.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b;">Bạn chưa có phòng nào được đặt.</td></tr>`;
        return;
    }

    for (var i = 0; i < dsDonCuaUser.length; i++) {
        var don = dsDonCuaUser[i];
        var tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${don.hoTen}</td>
            <td>${don.dienThoai}</td>
            <td style="font-weight: bold; color: var(--header-bg);">${don.tenPhong}</td>
            <td>${don.ngayNhan}</td>
            <td>${don.ngayTra}</td>
            <td>
                <button class="btn-delete" onclick="huyDatPhong(${don.id}, '${don.tenPhong}')">Hủy Đặt</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

function huyDatPhong(idDon, tenPhong) {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn đặt phòng này không?")) return;
    
    var dsDonDat = JSON.parse(localStorage.getItem("dsDonDat")) || [];
    dsDonDat = dsDonDat.filter(function(item) { return item.id !== idDon; });
    localStorage.setItem("dsDonDat", JSON.stringify(dsDonDat));

    var dsPhong = layDanhSachPhong();
    for (var i = 0; i < dsPhong.length; i++) {
        if (dsPhong[i].ten === tenPhong) {
            dsPhong[i].trangThai = "Còn trống";
            break;
        }
    }
    localStorage.setItem("dsPhong", JSON.stringify(dsPhong));

    alert("Đã hủy đặt phòng thành công!");
    location.reload();
}