# Nước lẩu bí truyền — đối chiếu 02/10/2026

Nguồn đang phục vụ: https://aenhatrang.com/g/78326809a3f7aa01996b.js (HTML https://aenhatrang.com/). Bundle khai báo 2.3.9; SHA256 `37acc45936af9864145b6bf49a6ed34777f29d1bb8e16539413fc69b049f0add`. Không đưa bundle vào repo. Bản calculator hiện được kiểm tra theo 2.3.8, chưa có hiệu ứng bí truyền.

## Quy tắc đã đọc trong 2.3.9

- `ls()`: hiện minigame khi xong hướng dẫn, ngày >=3 và không thi giải/PvP.
- `Fn=2`: tối đa 2 lượt/ngày. `vh()`/`ni()`: chọn nồi ở lượt đầu; thử lại dùng nồi đã chọn, không tự chuyển nồi hôm đó. Sau khi thành công không thử tiếp.
- `rs()`: chuỗi 4 gia vị ở LV1–3, 5 ở LV4–6, 6 ở LV7–10. Có 8 loại gia vị, xáo trộn không lặp; seed `lau|tuần|id_nồi`, tuần = floor((ngày−1)/7)+1. Công thức thay theo tuần; buff không tồn tại cả tuần.
- `Ai()`/`Ot()`: buff chỉ hoạt động khi record đúng ngày, thành công, nồi đã mở và không thi giải.
- `hs(group)`: đếm số tô có broth trùng nồi bí truyền trong nhóm.
- `ql(group)`: sau các phạt chờ/giá/mì/sai món/random và bù giá rẻ, nếu có ít nhất một tô bí truyền và rating <5 thì +1 sao; rồi clamp [1,5]. Một nhóm ba tô trùng nồi cũng chỉ +1 sao. Áp dụng cả đơn online. Đơn hủy/chưa hoàn thành không đi qua nhánh cộng sao này.
- `Cc(group,...)`: chỉ khách ăn tại quán nhận `2000 × số tô trùng nồi` khi hoàn tất nhóm. Thứ tự: tip nền → hũ tip → tô sứ → bí truyền → mèo may mắn → payday ×2. Hũ tip không nhân phần 2.000 bí truyền; payday nhân đôi thành 4.000. Nếu bí truyền nâng rating từ 3 lên 4, còn có thể mở điều kiện thưởng tô sứ/mèo. Reviewer ghi cùng rating cuối ba lần, không cộng bí truyền thành ba sao.
- `wi()` không nhân hệ số gia truyền trực tiếp. `pc` tương ứng cơ chế chọn món không chọn theo buff hoặc giá. Gia truyền ảnh hưởng thu hút qua sao mới trong ca; không tự đổi vốn, giá mặc định, ngưỡng chê đắt, thời gian luộc hay số topping. Chưa thấy nhánh thu thêm tiền/tiêu thụ gia vị trong minigame ni; không tự thêm phụ phí gia truyền vào mô hình.

## App đã kiểm tra gì, chưa kiểm tra gì

`check.cjs` có cấu hình nhiều nước lèo và quá tải; `check-worker.cjs` có LV9 mở cả 9 loại và chạy optimize/đối chiếu Worker. Các test này không chứng minh từng nước lèo riêng biệt hoặc cơ chế gia truyền đều đúng. Calculator chưa có trạng thái gia truyền, chưa cộng sao/tip bí truyền và chưa xếp hạng nồi nên chọn.

Không thể gọi kết quả cũ là tối ưu có tính gia truyền. Không thể khẳng định luôn chọn nồi đắt nhất: lợi ích phụ thuộc tỷ lệ tô trùng, số nhóm được cộng sao, kênh tại quán/online, sức bếp và chuỗi sao/thu hút.

## Cần xác minh trước triển khai

Đây là audit cơ chế bí truyền, không phải audit trọn bản 2.3.9. Bundle mới đổi tên minify; cần đối chiếu literal catalog và các nhánh liên quan core trước khi đổi provenance engine sang 2.3.9. Giữ các giới hạn đã công khai về drama, giao xa, thiếu hàng, lên level giữa ca và đánh giá đầu ngày xấp xỉ. Đề xuất chỉ có nghĩa trong mô hình đó.
