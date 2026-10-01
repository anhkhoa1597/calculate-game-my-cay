# Sổ giá Tiệm Mì Cay

## GitHub Pages

Trong repo, vào **Settings → Pages → Deploy from a branch**, chọn **main** và **/(root)** rồi Save. Trang web nằm tại https://anhkhoa1597.github.io/calculate-game-my-cay/ sau khi GitHub triển khai xong.

Mở `index.html` bằng Chrome / Safari / Edge. Không cần cài thư viện hoặc build. Thông số hợp lệ tự nhớ khi chỉnh, Tìm giá hoặc Dùng giá; reload khôi phục lại. Không có import/export JSON. Nếu localStorage lỗi, bạn vẫn tính giá bình thường nhưng thông số có thể không được nhớ. Bản lưu hỏng dùng cấu hình LV1 và có thể thay bằng cấu hình mới. Dữ liệu nhớ tại trình duyệt và địa chỉ đang mở; chuyển trình duyệt hoặc chuyển file có thể tạo vùng lưu khác.

Nếu trình duyệt hạn chế localStorage khi mở file, chạy trong thư mục dự án:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Rồi mở http://127.0.0.1:8765.

1. Nhập cấp, ngày, sao và số đánh giá gần đây. Không có đánh giá = 4 sao. Khi chỉ biết sao, dùng 30 đánh giá để xấp xỉ.
2. Chọn đúng món đã mua, trang bị và nhân viên đang sử dụng. Bấm “Chọn tất cả theo cấp” chỉ khi đã mua mở toàn bộ món ở cấp đó.
3. Đo giây mỗi thao tác và thời gian đọc/chuyển đơn. Mặc định là ước tính. Đừng bỏ qua hiệu chỉnh này: nó quyết định sức phục vụ và khách bỏ về.
4. Bấm “Tìm giá cho quán”. Xem lợi nhuận, tô phục vụ, khách mất, sao cuối ngày và bảng giá. “Dùng giá trong công cụ” chỉ lưu vào công cụ này; tự nhập lại trong game.

## Mô hình

Data trích từ source game `https://aenhatrang.com/g/5f4be5d7038028cafd44.js` ngày 27/09/2026. `game-data.js` chứa toàn bộ 21 bảng dữ liệu đã trích trong cuộc trao đổi. Giao diện có phần tra cứu.

`engine.js` mô phỏng theo bước 0,1 giây: giờ cao điểm, giá và từ chối, trọng số 6 tô gần nhất, nhóm khách, bàn, app, kiên nhẫn, nồi luộc chạy song song, thao tác, nhân viên, sao mới, tip và chi phí. Mỗi món giá theo bước 1.000đ. Bộ tìm giá quét tỷ lệ và điều chỉnh từng món, kiểm chứng 8 phương án, rồi đánh giá phương án tốt nhất bằng 256 seed mới cùng mốc giá hiện tại.

“Tốt nhất” trong tập đã thử, mục tiêu lợi nhuận một ngày, không phải tối ưu toàn cục hay cam kết kết quả trong game. Khoảng tin cậy chỉ phản ánh ngẫu nhiên mô phỏng. Tốc độ thực tế, thứ tự thao tác và các cơ chế không mô phỏng tạo sai số riêng.

Bếp dùng pipeline lý tưởng: có nguyên liệu đủ, thao tác đúng, mì được lấy ở vùng chín, duy trì nồi đều và phục vụ đơn sắp hết hạn. Bảng tiêu thụ là trung bình phần đã bán, không phải lượng tồn kho đủ cho mọi trường hợp. Hao hụt thêm có ô nhập riêng. Không mô phỏng thiếu hàng, drama ngẫu nhiên, đổi yêu cầu, mặc cả, giao xa, công thức bí truyền, khách du lịch, nhiệm vụ/thưởng, phản hồi đánh giá hoặc lên cấp giữa ngày. Sale nguyên liệu không điều chỉnh giá vốn mua hàng trong mô hình chi phí tiêu thụ này. Không tính phí đầu tư trang bị/mở món.

Kiểm tra tính toán:

```sh
node check.cjs
node check-worker.cjs
node check-ui.cjs
node --check app.js
node --check engine.js
node --check worker.js
git diff --check
```

Kiểm tra gồm công thức thu hút, ngưỡng phạt giá, cấu hình, tái lập ngẫu nhiên, khách quá tải, công suất và sổ lợi nhuận. Không có dependency bên ngoài.

Giao diện ưu tiên điện thoại: nhập quán, tìm/lọc món không dấu, tìm giá, xem sức bếp/mất khách rồi dùng giá. Desktop dùng cùng chức năng. HTTP(S) tính nền bằng Worker; mở file trực tiếp có fallback tính trên trang và có thể chậm. Tra cứu 21 bảng data chỉ dựng khi mở. Kiểm tra UI giới hạn ở smoke mobile khoảng 390px, liếc 320px và mở desktop; không bắt buộc Lighthouse hoặc ma trận thiết bị.
