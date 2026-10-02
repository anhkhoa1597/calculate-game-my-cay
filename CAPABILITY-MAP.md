# Capability map: Gia truyền tự đề xuất và giao diện gọn

02/10/2026 · Dự thảo chờ duyệt phạm vi. Không thay thế spec/plan của bản đã triển khai. Chưa viết spec từng module hoặc sửa code trong bước này.

| Module id | Trách nhiệm | Phụ thuộc |
|---|---|---|
| secret-recommendation | Luôn giả định nấu thành công khi đủ điều kiện; tự so các nước lèo đang bán và đề xuất nồi. Kết quả giá/tô/lời phải khớp nồi đề xuất. Bỏ luồng nhập trạng thái chưa thử/khóa/hết lượt/đã đúng. | — |
| compact-navigation | Giao diện mobile gọn, ba vùng Quán/Menu/Kết quả dễ chuyển; tìm món và Tìm giá dễ tới; hiển thị đề xuất gia truyền tự động của core. | secret-recommendation |

Thứ tự: secret-recommendation → compact-navigation. Cả hai dùng engine/Worker/state hiện có, HTML/CSS/JavaScript thuần. Không framework/dependency mới.

## Giả định đưa ra để chốt phạm vi

- “Luôn thành công” là giả định của công cụ, không phải đổi luật game: ngày 1–2 vẫn chưa có gia truyền; chỉ đề xuất nồi đã mở và đang bán, từ ngày 3 sau hướng dẫn. Không giải minigame hoặc tự thao tác game.
- Mục tiêu vẫn là lời trung bình một ngày có tính sức bếp, sao và thời gian chờ. Giữ cách so nồi trên cùng bảng giá đã duyệt; chưa mở rộng sang full optimize riêng từng nồi hay chứng minh tối ưu toàn cục. Spec module core sẽ làm rõ cách chọn giá/kết quả cho đúng nồi được đề xuất.
- Không buộc chọn “không gia truyền” làm kết quả chính khi người dùng yêu cầu luôn thành công: lựa chọn nồi nằm trong các nước lèo hợp lệ. Nếu khác biệt nhỏ thì vẫn hiển thị nồi đứng đầu theo trung bình, kèm nhãn chưa phân biệt rõ.
- Bỏ điều khiển trạng thái gia truyền; dữ liệu lưu cũ cần được xử lý để không ép core theo nồi/trạng thái cũ. Storage vẫn là phần phụ, không thêm import/export JSON.
- UI dùng ba vùng nội dung thay vì ba liên kết cuộn trên một trang dài. Giữ thông số và vị trí tìm món khi đổi vùng; quay lại Kết quả luôn thấy kết quả mới nhất hoặc thông báo cần tính lại.
- Giảm padding/khoảng trắng, phần giới thiệu và giải thích mở sẵn; món bán hiển thị thành hàng gọn thay thẻ lớn. Input/nút nhỏ về hình thức, chữ vẫn rõ và vùng chạm phù hợp mobile. Desktop chỉ cần dùng được.
- Kết quả chính ưu tiên giá, nồi gia truyền, lời và số tô trung bình/min–max. Thu chi, phương án khác, công thức/data để trong phần mở thêm. Test core kỹ; UI chỉ kiểm chứng những luồng bị thay đổi.

## Cơ sở rà UX bằng UI/UX Pro Max

Đã đọc skill, `references/quick-reference.md`, `references/pro-rules.md`. Stack hiện có là HTML/CSS/JS thuần, không Tailwind; không áp guidance của framework khác.

- `compact mobile form --domain ux`: match Form Labels/Mobile Keyboards/Submit Feedback phù hợp; giữ nhãn, bàn phím numeric và trạng thái tính. Kết quả không cung cấp quy tắc mật độ cụ thể, không dùng nó làm bằng chứng về chiều cao input.
- `bottom navigation hierarchy`, retry `bottom nav mobile`: match Sticky Navigation và Back Button phù hợp; không dùng Breadcrumbs vì app không có cây phân cấp. Ba vùng nội dung là đề xuất theo luồng thực tế của app, không phải kết quả search tự khẳng định.
- `progressive disclosure forms --domain ux`: không có match trực tiếp về disclosure; dùng guidance Forms & Feedback trong reference làm fallback, không coi Heading Line Balance là match cho vấn đề này.
- Reference: nhãn và focus rõ, một hành động chính mỗi vùng, bottom nav ít mục, không che nội dung, progressive disclosure, số dễ đọc. Hướng thiết kế giữ màu/type đang có; thay mật độ và cấu trúc sử dụng, không tạo thương hiệu mới.

Audit source UI: input/select đang min-height48px; CTA48px; nhiều container padding16–24px. Menu mobile mỗi món là thẻ nhiều hàng. Thanh dưới chỉ là anchor đến Quán/Menu/Kết quả; các phần vẫn cùng xuất hiện trên trang dài. Đây là nguyên nhân có thể giải quyết bằng tổ chức nội dung, không chỉ thu nhỏ CSS.

## Sau khi duyệt capability map

Viết `SPEC-secret-recommendation.md` trước (provider của kết quả), rồi `SPEC-compact-navigation.md` với giao diện sử dụng kết quả đó; mỗi spec đủ objective/commands/structure/style/testing/boundaries. Chưa thay kế hoạch đã hoàn tất hoặc ghi task mới trước khi duyệt scope.
