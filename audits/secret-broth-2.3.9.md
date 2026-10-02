# Nước lẩu bí truyền — đối chiếu 02/10/2026

Nguồn đang phục vụ: https://aenhatrang.com/g/78326809a3f7aa01996b.js (HTML https://aenhatrang.com/). Bundle khai báo 2.3.9; SHA256 `37acc45936af9864145b6bf49a6ed34777f29d1bb8e16539413fc69b049f0add`. Không đưa bundle vào repo. Trước cập nhật, calculator kiểm tra theo 2.3.8 và chưa có hiệu ứng bí truyền.

## Quy tắc đã đọc trong 2.3.9

- `ls()`: hiện minigame khi xong hướng dẫn, ngày >=3 và không thi giải/PvP.
- `Fn=2`: tối đa 2 lượt/ngày. nhánh mở/thử minigame: chọn nồi ở lượt đầu; thử lại dùng nồi đã chọn, không tự chuyển nồi hôm đó. Sau khi thành công không thử tiếp.
- `rs()`: chuỗi 4 gia vị ở LV1–3, 5 ở LV4–6, 6 ở LV7–10. Có 8 loại gia vị, xáo trộn không lặp; seed `lau|tuần|id_nồi`, tuần = floor((ngày−1)/7)+1. Công thức thay theo tuần; buff không tồn tại cả tuần.
- `Ai()`/`Ot()`: buff chỉ hoạt động khi record đúng ngày, thành công, nồi đã mở và không thi giải.
- `hs(group)`: đếm số tô có broth trùng nồi bí truyền trong nhóm.
- `ql(group)`: sau các phạt chờ/giá/mì/sai món/random và bù giá rẻ, nếu có ít nhất một tô bí truyền và rating <5 thì +1 sao; rồi clamp [1,5]. Một nhóm ba tô trùng nồi cũng chỉ +1 sao. Áp dụng cả đơn online. Đơn hủy/chưa hoàn thành không đi qua nhánh cộng sao này.
- `Cc(group,...)`: chỉ khách ăn tại quán nhận `2000 × số tô trùng nồi` khi hoàn tất nhóm. Thứ tự: tip nền → hũ tip → tô sứ → bí truyền → mèo may mắn → payday ×2. Hũ tip không nhân phần 2.000 bí truyền; payday nhân đôi thành 4.000. Nếu bí truyền nâng rating từ 3 lên 4, còn có thể mở điều kiện thưởng tô sứ/mèo. Reviewer ghi cùng rating cuối ba lần, không cộng bí truyền thành ba sao.
- `wi()` không nhân hệ số gia truyền trực tiếp. `vc()`/`Ee()` (2.3.9) là cơ chế chọn món không chọn theo buff hoặc giá. Gia truyền ảnh hưởng thu hút qua sao mới trong ca; không tự đổi vốn, giá mặc định, ngưỡng chê đắt, thời gian luộc hay số topping. Chưa thấy nhánh thu thêm tiền/tiêu thụ gia vị trong minigame ni; không tự thêm phụ phí gia truyền vào mô hình.

## Trạng thái trước đợt triển khai này

`check.cjs` có cấu hình nhiều nước lèo và quá tải; `check-worker.cjs` có LV9 mở cả 9 loại và chạy optimize/đối chiếu Worker. Các test này không chứng minh từng nước lèo riêng biệt hoặc cơ chế gia truyền đều đúng. Calculator chưa có trạng thái gia truyền, chưa cộng sao/tip bí truyền và chưa xếp hạng nồi nên chọn.

Kết quả của bản cũ không bao gồm gia truyền. Không thể khẳng định luôn chọn nồi đắt nhất: lợi ích phụ thuộc tỷ lệ tô trùng, số nhóm được cộng sao, kênh tại quán/online, sức bếp và chuỗi sao/thu hút.

## Cần xác minh trước triển khai

Đây là audit cơ chế bí truyền, không phải audit trọn bản 2.3.9. Bundle mới đổi tên minify; cần đối chiếu literal catalog và các nhánh liên quan core trước khi đổi provenance engine sang 2.3.9. Giữ các giới hạn đã công khai về drama, giao xa, thiếu hàng, lên level giữa ca và đánh giá đầu ngày xấp xỉ. Đề xuất chỉ có nghĩa trong mô hình đó.

## Đối chiếu phục vụ triển khai

- Đọc literal 32 nguyên liệu, 20 trang bị, 6 nhân viên, mốc mở khóa của các mục, hệ số 10 sự kiện và 7 tham số nền trong 2.3.9. Vốn/giá mặc định/hạn dùng/phí mở và các hệ số đang dùng không đổi; thiếu unlock của mì/tô tương đương 0, thiếu need trang bị tương đương chuỗi rỗng. Không sửa catalog.
- Đọc các nhánh `wi/so`, `uA/ml`, `vc/Ee`, `Se/pl`, vòng tick/`onT`, `Js/ro/$s`, `ql/Cc`: các quy tắc đang mô phỏng về thu hút/forecast, chương/bàn/phí app, phân phối nhóm/topping/cay, deadline, nồi và rating/tip vẫn phù hợp với mô hình trước. Bổ sung bí truyền tại nhóm hoàn tất, không đổi traffic trước mở cửa hoặc cách chọn món.
- Giữ hạn chế về thao tác lý tưởng, sao đầu ngày xấp xỉ, thiếu hàng, khách du lịch, giao xa, drama, phản hồi và lên cấp giữa ca. Audit chỉ xác nhận các quy tắc đang mô phỏng, không bao phủ toàn bộ game.
- Nhánh rating của game còn rút random cho câu chữ review/hiệu ứng. Mô hình chỉ rút random cho các quyết định có ảnh hưởng tính toán; cùng seed của công cụ không tái hiện RNG toàn game. Không thêm random cho câu chữ gia truyền.
- Kiểm thử mới ở `check-secret.cjs`, kết quả thực ghi trong `tasks/verification.md` sau khi chạy; không coi danh sách test là bằng chứng đã qua.

## Trạng thái sau triển khai

Gia truyền đã có trong engine/UI và comparator; checks chi tiết đã qua, xem `tasks/verification.md` mục Gia truyền. Audit trạng thái trước triển khai bên trên được giữ để giải thích vì sao cần cập nhật, không mô tả bản mới.
