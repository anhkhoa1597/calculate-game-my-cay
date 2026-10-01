# Implementation Plan: Sổ giá Tiệm Mì Cay

Spec được người dùng duyệt ngày 02/10/2026: `SPEC.md`.
Trạng thái kế hoạch: đề xuất để duyệt; chưa bắt đầu triển khai.
Task list duy nhất: `tasks/todo.md`.

## Tổng quan

Nâng cấp công cụ hiện có theo spec mobile: nhập đúng và lưu an toàn, tìm/lọc menu, kết quả dễ quyết định, tính trên Worker, responsive sáng/tối và thanh dưới không che bàn phím. Giữ engine, catalog, localStorage key/schema, GitHub Pages và HTML/CSS/JavaScript native.

Đây là cập nhật kế hoạch của cùng dự án. Các đầu việc bản đầu đã xong được giữ trong lịch sử ở todo; việc kiểm tra trình duyệt chưa hoàn tất được mang sang T9, không coi đã nghiệm thu.

## Quyết định kiến trúc

- Không thêm dependency, bundler, backend hoặc thiết kế lại thuật toán.
- Worker classic dùng `importScripts` để tái sử dụng `game-data.js` và `engine.js`; đường dẫn tương đối hoạt động dưới repo Pages.
- Giao tiếp Worker: request `{ id, config }`; response `{ id, type, text/result/message }`, với `type` là `progress`, `result`, `error`. Chỉ nhận response của request đang hoạt động; không biến progress thành phần trăm giả.
- Mỗi lần tìm giá đọc snapshot hợp lệ. Trong lúc tính khóa các control thay đổi cấu hình; điều hướng, đọc kết quả cũ và cuộn vẫn hoạt động. Không cho áp giá cũ đang tính lại.
- HTTP(S) ưu tiên Worker. `file://`/Worker không hỗ trợ dùng engine trực tiếp và báo hạn chế phản hồi. Worker hỏng giữa lượt: kết thúc lượt với lỗi rõ, không tự chạy lại âm thầm để che lỗi.
- Dùng state hiện có làm nguồn dữ liệu cho menu; lọc qua `hidden` hoặc render từ state đầy đủ. Không đọc cấu hình chỉ từ các hàng hiện đang nhìn thấy.
- Giữ riêng draft đang nhập, cấu hình hợp lệ gần nhất và kết quả của snapshot; lỗi input/lưu không làm mất bản hợp lệ.
- Không thay `M.validate` để tạo UI errors. Lớp UI định vị lỗi control và kiểm tra rỗng trước chuyển số, sau đó vẫn gọi validation engine trước lưu/tính.
- Token CSS cho light/dark, cỡ chữ và khoảng cách. Không thêm thư viện icon hoặc animation.
- Đo thanh dưới bằng `ResizeObserver`; xử lý focus và bàn phím bằng browser events/VisualViewport khi khả dụng, có fallback flow khi input focus.
- Tra cứu data dựng một lần khi mở disclosure, giữ đủ 21 bảng và cuộn cục bộ.

## Dependencies

```text
T1 Worker chạy giá với UI phản hồi
T2 Lưu cấu hình an toàn
 └─ T3 Nhập liệu có lỗi đúng vị trí
     ├─ T4 Lọc/tìm menu mà không mất giá
     └─ T5 Hiểu và dùng kết quả
T1 ────────┘
T4 + T5 ── T6 Đọc và thao tác trên mobile/light-dark
T6 ─────── T7 Bàn phím, safe area và focus
T6 ─────── T8 Tra cứu data khi cần
T1-T8 ──── T9 Nghiệm thu thực + tài liệu
```

T1/T2 độc lập về logic nhưng đều chạm `app.js`, nên làm tuần tự. Không giao song song chỉnh cùng file. Kiểm tra/doc có thể tách riêng sau khi slice đã ổn định, không cần thêm agent cho kế hoạch này.

## Thứ tự và checkpoint

1. T1: Tìm giá trên Worker, đối chiếu engine trực tiếp.
2. T2: Reload/lưu/reset giữ được cấu hình.
3. T3: Nhập sai được báo và sửa được tại đúng control.
4. Checkpoint A: đường đi nhập → lưu → tính qua, kết quả engine không đổi.
5. T4: Tìm/lọc/chọn món, giữ giá và selection.
6. T5: Kết quả đủ để quyết định đổi hay giữ giá.
7. T6: Layout mobile/desktop và light/dark nhất quán.
8. Checkpoint B: LV1 và quán cấp cao chạy đầy đủ, kiểm tra giao diện chính.
9. T7: Thanh dưới/focus/bàn phím không che thao tác.
10. T8: Tra cứu đủ data theo nhu cầu, không dựng bảng lúc khởi tạo.
11. T9: Chạy ma trận nghiệm thu, tài liệu và evidence.
12. Checkpoint C: đối chiếu AC01-AC12; công khai tiêu chí chưa kiểm chứng.

Chi tiết acceptance, lệnh kiểm tra và file từng task nằm trong todo, không nhân đôi checklist ở plan.

## Kiểm chứng chung

- Trước mỗi commit code: `node check.cjs`, `node --check app.js`, `node --check engine.js`, `git diff --check`; thêm syntax/check riêng cho Worker sau T1.
- Không có build. Dev: `python3 -m http.server 8765 --bind 127.0.0.1` tại root dự án.
- Tính đúng: LV1 và full quán LV9, cùng snapshot và seed, không đổi sample count hoặc công thức.
- Trình duyệt: 320/375/390/768/1024/1440px; dark/light; reduced motion; zoom 200%; keyboard desktop và bàn phím trên Safari iOS/Chrome Android.
- Mỗi checkpoint ghi evidence hoặc đánh dấu chưa kiểm chứng. Không dùng Node test để tuyên bố layout/bàn phím đã qua.
- LCP < 2,5s, CLS < 0,1, INP < 200ms là mục tiêu HTTP(S) cần đo; ghi máy, browser, điều kiện network/CPU. Không hứa cho `file://`.
- Phát hành: sau nghiệm thu, commit/push theo quyền đã có; không tự sửa cấu hình Pages hay bật tracking.

## Rủi ro và giảm thiểu

| Rủi ro | Ảnh hưởng | Cách giảm |
|---|---|---|
| Worker không chạy dưới file:// | Tính vẫn khóa main thread | Fallback có thông báo; hiệu năng được đánh giá trên HTTP(S) |
| Worker trả về muộn hoặc lỗi | Hiển thị giá nhầm cấu hình | Snapshot + request id, terminate khi kết thúc, bỏ response cũ |
| State chỉ đọc từ menu đang lọc | Mất selection/giá | State đầy đủ và lọc presentation, kiểm tra đổi filter sau nhập |
| localStorage bị chặn/cấu hình hỏng | Mất dữ liệu hoặc báo Đã lưu sai | Không overwrite bản hỏng, save trả kết quả, xuất JSON, reset có xác nhận |
| Bàn phím/zoom thay đổi viewport | Thanh dưới che focus | Đo chiều cao thực, keyboard fallback, test thiết bị thực |
| Màu đẹp nhưng thiếu contrast | Không đọc được số/helper | Token light/dark, đo ratio, giữ text ngoài màu trạng thái |
| Đề xuất thấp hơn giá cũ | Dẫn người dùng quyết định sai | Copy riêng cho delta âm, nhiễu và ràng buộc an toàn |
| Chưa có browser kết nối | Không đủ evidence UI | Giữ T9 mở, báo thiếu cụ thể; không nới tiêu chí nghiệm thu |

## Điểm chưa xác định

- Browser/thiết bị nào có thể kết nối để nghiệm thu bàn phím Safari iOS và Chrome Android; kiểm tra availability tại T6/T9.
- Lighthouse chưa có trong dự án. Dùng công cụ được host cung cấp nếu có; nếu cần cài công cụ mới, trao đổi trước theo spec.
- Chưa có câu hỏi sản phẩm ngăn lập kế hoạch. Phạm vi và mục tiêu lợi nhuận một ngày đã được duyệt.
