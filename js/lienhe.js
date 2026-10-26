function xuLyGuiLienHe() {
    var name = document.getElementById("contactName").value.trim();
    var email = document.getElementById("contactEmail").value.trim();
    var message = document.getElementById("contactMessage").value.trim();
    var notif = document.getElementById("contactNotification");

    if (name === "" || email === "" || message === "") {
        alert("Vui lòng điền đầy đủ thông tin vào tất cả các trường!");
        return;
    }

    var regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(email)) {
        alert("Địa chỉ Email không đúng định dạng!");
        document.getElementById("contactEmail").focus();
        return;
    }

    if (notif) {
        notif.style.color = "#16a34a";
        notif.innerText = "Cảm ơn " + name + "! Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi qua email sớm nhất.";
    } else {
        alert("Cảm ơn " + name + "! Tin nhắn của bạn đã được gửi thành công.");
    }

    // Reset form
    document.getElementById("contactName").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactMessage").value = "";
}