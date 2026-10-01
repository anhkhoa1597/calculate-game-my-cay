# Spec: Sổ giá Tiệm Mì Cay

Trạng thái: đã được người dùng duyệt ngày 02/10/2026; kế hoạch triển khai ở `tasks/plan.md` và `tasks/todo.md`.
Ngày: 02/10/2026.
Phạm vi: thiết kế lại trải nghiệm của công cụ hiện có, ưu tiên điện thoại. Đây là một capability giao diện trên bộ tính toán đã có; không chia thành nhiều module hay viết lại engine trong đợt này.

## 1. Mục tiêu

Người chơi nhập đúng tình trạng quán, nhận bảng giá dễ áp dụng và hiểu ảnh hưởng tới lợi nhuận, sức phục vụ, khách mất và sao. Người dùng cần quyết định được: nên đổi giá hay giữ giá; quán thiếu khách hay bếp đang quá tải.

Thành công không phải chỉ làm giao diện đẹp: người chơi phải nhập được thông số trên điện thoại, xem và dùng giá từng món mà không kéo ngang bảng menu, đọc được giới hạn mô phỏng trước khi tin vào đề xuất.

### Giả định của bản đề xuất

- Giữ tên Sổ giá, tiếng Việt, GitHub Pages, HTML/CSS/JavaScript và localStorage.
- Đây là công cụ tính toán, không phải landing page bán sản phẩm.
- Giữ dữ liệu game, ý nghĩa thông số, giới hạn giá và hợp đồng kết quả engine hiện tại.
- Giữ các anchor `shop`, `menu`, `results` và nhãn Quán, Menu, Kết quả.
- Giữ cấu hình đã lưu; nâng cấp giao diện không reset cấu hình hoặc giá đang nhập.
- Ưu tiên lợi nhuận một ngày theo mô hình. Không gọi kết quả là tối ưu toàn cục hay cam kết lợi nhuận thực tế.
- Không thêm tài khoản, backend, đồng bộ đám mây hoặc kết nối tự chỉnh giá trong game.

## 2. Kiểm tra giao diện hiện tại

Nhận định từ source ở commit `b884b07`; chưa có bằng chứng kiểm tra hình ảnh trên trình duyệt thực.

| Phần | Hiện tại | Hướng xử lý |
|---|---|---|
| Nhận diện | Sổ giá / Tiệm Mì Cay, nền giấy sáng, đỏ gạch và xanh | Giữ wordmark và đỏ gạch; dùng màu trung tính cho cấu trúc, màu trạng thái chỉ cho ý nghĩa cụ thể |
| Typography | System sans; nhiều nhãn và helper nhỏ | Giữ font hệ thống hỗ trợ tiếng Việt, tăng cỡ chữ chức năng |
| Layout | Desktop hai cột; mobile một cột, form dài trước menu | Dùng nhóm thu gọn, điều hướng rõ, giảm phần giới thiệu trước tác vụ |
| Menu | 9 nước lèo, 21 topping; mobile mỗi món một khối | Giữ cách nhập từng món; thêm lọc đang bán / có thể mở / tất cả và tìm theo tên |
| Kết quả | Lợi nhuận, metrics, so sánh dài, giả định ở cuối | Tóm tắt quyết định trước, chi tiết theo nhóm có thể mở |
| Trạng thái | Chưa tính, thay đổi cấu hình, đang tính, lỗi, đã xong | Giữ đủ chu kỳ; bổ sung lỗi tại ô và xác định kết quả còn phù hợp cấu hình nào |
| Thanh dưới | Quán / Menu / Kết quả + Tìm giá, safe area | Giữ; kiểm tra bàn phím, zoom, focus và trạng thái tính toán |
| Lưu cấu hình | Một key localStorage; báo lỗi bằng status | Giữ schema và key; phản ánh lưu thành công / thất bại chính xác |
| Hiệu năng | Tính trên main thread, dựng toàn bộ bảng tra cứu ngay | Tách tính vào Worker trên HTTP(S); dựng tra cứu khi mở |
| SEO / điều hướng | Một trang, title hiện có, không có tracking | Giữ URL, title, anchor; không thêm tracking hoặc nội dung SEO giả |

### Áp dụng skill có chọn lọc

- Spec-driven-development: tài liệu này là Phase 1 Specify. Chỉ lập kế hoạch và tasks cho thiết kế mới sau khi spec được duyệt. Không ghi đè plan/todo cũ ở giai đoạn này.
- UI/UX Pro Max: ưu tiên accessibility, touch, responsive, inline validation và progressive disclosure.
- Design Taste: redesign theo hướng preserve. Chỉ dùng audit, nhất quán màu/chữ/shape và copy đơn giản. Dashboard, bảng dữ liệu và form là ngoài phạm vi của skill này; không áp máy móc quy tắc landing page, ảnh hero, GSAP hay chuyển sang React.
- Tra cứu `calculator mobile data tool --design-system` trả về mẫu Hero + Features + CTA không phù hợp. Tra cứu hẹp `calculator utility --domain product` không có kết quả. Không lưu mẫu này làm design system. Hướng chức năng trong spec là lựa chọn có lý giải, không phải mẫu database đã khớp.
- Tra cứu `focus not obscured` và `error summary validation` trả về hướng dẫn đúng cho web: focus không bị UI cố định che và lỗi có liên kết tới ô nhập.

## 3. Hướng thiết kế

Design Read: công cụ tính giá cho người chơi Việt Nam trên điện thoại, ngôn ngữ trực quan và thực dụng; phát triển giao diện hiện có bằng CSS native.

- `DESIGN_VARIANCE: 3`: cấu trúc dễ đoán, không cần bố cục nghệ thuật.
- `MOTION_INTENSITY: 2`: phản hồi nhấn và chuyển trạng thái nhẹ; không hiệu ứng cuộn trang.
- `VISUAL_DENSITY: 6`: thông số đủ gần nhau để thao tác, không ép thành cockpit chữ nhỏ.

### Quy tắc hình ảnh và typography

- Không thêm hero lớn, ảnh trang trí, fake screenshot, marquee hay animation thư viện.
- Font `system-ui`; số tiền dùng `font-variant-numeric: tabular-nums`.
- Body và input 16px; helper/metadata tối thiểu 12px; tiêu đề mobile 24-28px, không lấn át form.
- Spacing theo 4/8px; gutter mobile 16px; desktop max-width 1400px.
- Radius: input/button 6px, khối chức năng 8px. Không dùng pill cho mọi control.
- Một accent nhận diện đỏ gạch. Xanh chỉ báo đề xuất/được cải thiện, vàng chỉ cảnh báo, đỏ lỗi; luôn có nội dung chữ đi cùng màu.
- Semantic tokens cho nền, bề mặt, chữ, helper, đường viền, accent, focus, success, warning, error. Không rải mã màu trong component.
- Chế độ sáng/tối theo hệ thống, cùng cấu trúc và thương hiệu; không đảo theme riêng từng section. Không cần nút theme thủ công ở đợt này.
- Nhãn plain text; không cần thư viện icon. Không dùng emoji hoặc ký hiệu trang trí thay nội dung.
- Primary CTA dùng một nhãn nhất quán: Tìm giá. Nút Dùng giá là hành động khác, cần helper nói rõ chỉ cập nhật công cụ.

## 4. Cấu trúc thông tin và tương tác

### 4.1 Quán

- Thông số chính: cấp, ngày, sao, số đánh giá, sự kiện.
- Tốc độ phục vụ có giải thích ngắn và ví dụ cách đo; mở khi lần đầu dùng.
- Trang bị/nhân viên và điều kiện bổ sung nằm trong nhóm thu gọn; tiêu đề nhóm hiển thị số mục đang dùng hoặc tóm tắt cấu hình.
- Cấp không đồng nghĩa đã mua mở khóa. Không tự tick toàn bộ món/nâng cấp khi tăng cấp.
- Giảm cấp phải thông báo những mục không còn hợp lệ. Không âm thầm làm người chơi tưởng cấu hình vẫn đầy đủ.
- Không có đánh giá: 4 sao. Khi người dùng nhập sao nhưng chưa nhập số đánh giá, giải thích lựa chọn xấp xỉ 30 đánh giá.
- Giây/thao tác và thời gian đọc/chuyển khách giữ tách biệt với luộc; chữ hướng dẫn không gọi pipeline lý tưởng là tốc độ thực tế đã đo.

### 4.2 Menu

- Nhóm Nước lèo và Topping; hiển thị số món đang bán.
- Bộ lọc mặc định Có thể mở theo cấp; tùy chọn Đang bán và Tất cả. Giữ thứ tự gốc trong từng nhóm.
- Tìm kiếm không dấu, không phân biệt hoa thường; không đổi lựa chọn khi lọc.
- Món chưa đến cấp có nhãn Cần LVx và thao tác disabled khi xem Tất cả.
- Mỗi món thể hiện: tên, đang bán, cấp/phí mở, vốn, giá hiện tại, giá đề xuất.
- Nước lèo: vốn hiển thị đã cộng tô 1.500đ và mì 3.000đ. Topping: vốn riêng của topping.
- Giá hiện tại nhập bằng bàn phím số; bước 1.000đ, giới hạn game. Không tự làm tròn một giá sai rồi lưu mà không báo.
- Giá đề xuất chưa có: Chưa tính. Kết quả hết hiệu lực: Cần tính lại.
- Chọn tất cả theo cấp chỉ chọn món, có helper giải thích phải thực sự đã mua mở; không chọn trang bị/nhân viên.
- Giữ tối thiểu một nước lèo hoặc báo lỗi cụ thể tại nhóm trước khi tính.

### 4.3 Tìm giá và kết quả

1. Kiểm tra form, đọc một snapshot cấu hình hợp lệ, rồi chạy bộ tìm giá.
2. Trong lúc tính: báo tiến độ bằng chữ; giữ điều hướng và cuộn phản hồi được. Không ghi kết quả của một snapshot lên cấu hình khác.
3. Kết quả đầu tiên: lợi nhuận/ngày, chênh lệch so với giá hiện tại, sức phục vụ và mất khách. Không cần mở chi tiết để thấy giá đề xuất từng món.
4. Hàng cảnh báo ngắn theo dữ liệu: quá tải, sao giảm hoặc chênh lệch chưa đủ chắc chắn.
5. Chi tiết mở theo nhóm: thu/chi; khách & sức bếp; phương án khác; nguyên liệu tiêu thụ; giả định mô phỏng.
6. Dùng giá chỉ lưu giá vào công cụ; không tự gửi vào game. Sau đó lấy giá mới làm mốc so sánh và yêu cầu tính lại.

Phải phân biệt các trường hợp:

| Tình huống | Nội dung cần thể hiện |
|---|---|
| Lợi nhuận đề xuất cao hơn và chênh lệch rõ | Có thể thử giá này, kèm số chênh lệch và rủi ro |
| Chênh lệch nằm trong nhiễu | Chưa đủ bằng chứng tốt hơn; cân nhắc giữ giá hiện tại |
| Lợi nhuận đề xuất thấp hơn | Không gợi ý tăng lời; nêu rõ chênh lệch âm và điều kiện tìm giá |
| Giá hiện tại bị chê đắt nhưng chế độ an toàn đang bật | Hai phương án khác điều kiện; giải thích lợi nhuận có thể thấp hơn để tránh phạt giá |
| Bếp quá tải | Nêu số nhóm/đơn hết kiên nhẫn, chưa xong, mất vì đầy; không gộp thành một số khách thiếu giải thích |
| Sao cuối ngày giảm | Cảnh báo tác động tới những ngày sau; không coi tối ưu hôm nay là tối ưu dài hạn |

Số tô khác số nhóm/đơn. Bảng tiêu thụ là trung bình phần đã giao, không phải lượng tồn chắc chắn đủ. Khoảng tin cậy là nhiễu mô phỏng, không bao gồm sai số mô hình.

### 4.4 Lưu và lỗi

- Cấu hình hợp lệ được tự lưu; refresh giữ cấu hình và giá.
- Input đang sai không ghi đè cấu hình hợp lệ gần nhất. Giá `0`, rỗng và NaN không được âm thầm đổi thành giá hợp lệ.
- Lỗi tại ô: nội dung ngắn, `aria-invalid`, liên kết helper/error bằng `aria-describedby`.
- Submit sai: error summary có thể focus, liên kết từng lỗi tới control. Không đổi focus trên mỗi keystroke.
- Lưu thất bại: không hiển thị Đã lưu; thông báo trạng thái chưa lưu và cho xuất JSON.
- Cấu hình hỏng/không tương thích: thông báo và giữ bản lưu gốc để phục hồi; không overwrite ngay khi tải trang.
- Khi đổi cấu hình, đánh dấu kết quả cần tính lại; không hiển thị bảng giá cũ như đề xuất còn hợp lệ.
- Nút Về LV1 phải tránh xóa nhầm cấu hình đang dùng: xác nhận trong UI hoặc có hoàn tác rõ ràng. Đây là yêu cầu sản phẩm, không phải xin quyền thực thi của agent.

### 4.5 Mobile và desktop

- 320-767px: một cột, menu thành khối món; giá hiện tại và giá đề xuất đặt cạnh nhau khi đủ chỗ, xếp dọc ở 320px nếu cần.
- 768-1023px: một cột rộng hoặc hai cột chỉ khi mỗi vùng đủ rộng, không ép bảng tràn.
- Từ 1024px: thông số bên trái, vùng làm việc bên phải. Menu và kết quả nằm gần nhau, các chi tiết không lấn nội dung chính.
- Thanh mobile giữ Quán / Menu / Kết quả + Tìm giá; mỗi target ít nhất 44×44px, ưu tiên control 48px và khoảng cách 8px.
- Thanh cố định phải tôn trọng safe area. Chiều cao vùng bù được đo theo thanh thực tế, không dựa vào một con số giả định nếu status dài.
- Khi bàn phím mở: input đang focus, lỗi và nút Done của hệ thống không bị thanh che. Thu gọn/ẩn thanh hoặc chuyển về flow nếu cần.
- Zoom 200%, màn hình ngang và tăng cỡ chữ không làm nội dung bị cắt. Không dùng `maximum-scale`/`user-scalable=no`.
- Focus sau tính xong chuyển tới tiêu đề kết quả; tránh tự cuộn bất ngờ khi người dùng đã chuyển sang đọc vùng khác. Không lấy focus khi đang nhập.
- Toàn trang không cuộn ngang. Bảng data gốc được phép cuộn riêng, có nhãn vùng và hint, không kéo theo trang.

## 5. Hợp đồng tính toán giữ nguyên

`M.validate`, `M.defaults`, `M.optimize`, `M.batch`, `M.simulate`, catalog và schema kết quả là nguồn hiện có. Giao diện không tự tạo một công thức lợi nhuận thứ hai.

- Giá nền và topping tách riêng; vốn tô = 1.500 + 3.000 + vốn nước lèo + vốn topping.
- Thu hút theo tỷ lệ giá mì trung bình, sao, trang bị, ngày, buzz và sự kiện. Giá topping không đổi xác suất chọn topping, nhưng có thể gây từ chối và trừ sao.
- Chờ khách, bàn, app, thời gian luộc, thao tác, 210 giây/ngày và overtime tối đa 60 giây phải giữ trong mô phỏng.
- Giữ lương, điện trang bị, thuê nhà, phí app, tip, hao hụt trong lợi nhuận.
- Giữ seed tái lập và seed kiểm chứng khác tập tìm giá; không thay sample count chỉ để làm kết quả đẹp.
- Chế độ tránh bị chê đắt phải nói rõ đây là ràng buộc của tìm giá, không hứa tránh mọi đánh giá xấu.
- Vẫn dùng dữ liệu snapshot 27/09/2026. Công thức có thể thay đổi khi game cập nhật.
- Tiếp tục công khai những cơ chế chưa mô phỏng: thiếu hàng, drama/đổi yêu cầu, giao xa, mặc cả, công thức bí truyền, khách du lịch, lên cấp giữa ngày, nhiệm vụ, phản hồi review và phí đầu tư.
- Nếu cần sửa sai mô hình trong quá trình kiểm tra, ghi thành vấn đề riêng và cập nhật spec trước khi mở rộng phạm vi.

## 6. Stack và cấu trúc dự án

Giữ HTML5, CSS native, JavaScript chạy trực tiếp. Không có build, npm dependency hoặc yêu cầu bundler. Worker là API trình duyệt, không phải thư viện.

```text
index.html       Markup, form và vùng kết quả
style.css        Tokens, responsive và trạng thái sáng/tối
app.js           Form, validation UI, localStorage, render, điều phối tính
engine.js        Mô phỏng và tìm giá hiện tại
worker.js        Dự kiến: nhận snapshot, trả progress/result/error trên HTTP(S)
game-data.js     Catalog và bảng trích từ game
check.cjs        Kiểm tra logic hiện có bằng Node assert
README.md        Hướng dẫn chạy, Pages và giới hạn mô hình
SPEC.md          Spec này
tasks/plan.md    Plan hiện có; cập nhật sau khi spec được duyệt
tasks/todo.md    Tasks hiện có; cập nhật sau khi spec được duyệt
```

Worker chạy trên GitHub Pages/localhost với đường dẫn tương đối. Khi mở `file://` mà Worker không hoạt động, giữ fallback engine trực tiếp cùng kết quả và báo hạn chế phản hồi; không hứa INP giống bản HTTP(S).

## 7. Lệnh thực thi

Chạy tại thư mục dự án:

```sh
cd /Users/khoadanganh/Documents/Codex/mi-cay-planner
python3 -m http.server 8765 --bind 127.0.0.1
# Mở http://127.0.0.1:8765

node check.cjs
node --check app.js
node --check engine.js
# Sau khi worker.js tồn tại:
node --check worker.js

git diff --check
git status --short
```

Build: không cần, GitHub Pages phục vụ file gốc. Lint: `git diff --check` chỉ kiểm tra whitespace, không thay thế lint JavaScript. Kiểm tra cú pháp dùng `node --check`; không thêm linter chỉ cho đợt UI này.

## 8. Code style

- Tên biến/function camelCase; CSS class kebab-case; semantic tokens ở `:root`.
- Format file đang chỉnh cho dễ đọc, không gom toàn bộ CSS hoặc function thành một dòng.
- DOM động phải dùng `textContent` cho dữ liệu người dùng; markup từ template phải escape dữ liệu đúng ngữ cảnh.
- Dùng native `button`, `label`, `input`, `details`, `table`; không thay control bằng div clickable.
- Logic mô phỏng ở engine; logic trình bày/lưu ở app. Worker không sửa trạng thái UI hoặc localStorage.

Ví dụ quy ước trạng thái lưu:

```js
function saveSettings(settings) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(settings));
    setSaveStatus('Đã lưu');
    return true;
  } catch {
    setSaveStatus('Chưa lưu được. Hãy tải cấu hình JSON.');
    return false;
  }
}
```

## 9. Kiểm thử và bằng chứng

Không yêu cầu tỷ lệ coverage giả hoặc framework mới. Dùng Node assert cho logic; trình duyệt thực cho layout, nhập liệu, keyboard và localStorage.

| Lớp | Trường hợp cần kiểm chứng |
|---|---|
| Hồi quy engine | Công thức thu hút, ngưỡng giá, vốn/lợi nhuận, seed, quán quá tải, công suất |
| Worker | Cùng cấu hình/seed cho kết quả như engine trực tiếp; lỗi trả về rõ; kết quả không áp nhầm snapshot |
| Form/lưu | Input sai không ghi đè; storage thất bại; reload; giảm cấp; chọn món; lọc không mất giá |
| Kết quả | Lợi nhuận âm, chênh lệch nhỏ, quá tải, sao giảm, giá cũ không đạt ràng buộc an toàn |
| Responsive | 320, 375, 390, 768, 1024, 1440px; portrait/landscape; bàn phím số; zoom 200% |
| Accessibility | Tab/Shift+Tab, focus/error summary, nhãn, live status, contrast, reduced motion, light/dark |
| Hiệu năng | Lighthouse mobile trên HTTP(S); trace khi tìm giá và kiểm tra thao tác/cuộn không bị khóa |

Mục tiêu hiệu năng trên HTTP(S): LCP < 2,5s, CLS < 0,1 và INP < 200ms. Đây là mục tiêu phải đo với cấu hình kiểm thử ghi rõ, không coi là kết quả đã đạt. Không đặt deadline chạy tối ưu trên mọi điện thoại; luôn có tiến độ, giao diện phản hồi và kết quả/lỗi rõ.

Trình duyệt phải kiểm tra ít nhất Safari iOS và Chrome Android cho bàn phím/safe area; Chrome desktop cho keyboard và zoom. Nếu không có kết nối trình duyệt/thiết bị, đánh dấu chưa kiểm chứng và không báo đã hoàn thành kiểm tra UI.

## 10. Ranh giới

### Luôn làm

- Giữ cấu hình hiện có và hợp đồng tính toán; validate trước lưu/tính.
- Dùng đường dẫn tương đối tương thích repo Pages.
- Đo contrast: chữ thường ≥4,5:1; control/focus có độ tương phản đủ, không dựa vào màu riêng.
- Kiểm tra trạng thái chưa có dữ liệu, đang tính, lỗi, đã xong và kết quả hết hiệu lực.
- Chạy kiểm tra liên quan trước commit và ghi rõ hạn chế bằng chứng.

### Trao đổi trước khi mở rộng

- Thay thuật toán/mục tiêu lợi nhuận, thêm cơ chế game hoặc cập nhật snapshot data.
- Thêm dependency/build/backend, đổi schema localStorage hoặc tự đổi thương hiệu.
- Đổi route, nhãn điều hướng chính, tên/order trường hoặc bỏ tính năng hiện có.
- Bật tracking, lưu dữ liệu ra ngoài máy hoặc thao tác tự động trong game.

### Không làm

- Hứa tối ưu tuyệt đối hoặc trộn số minh họa với số mô phỏng thật.
- Gắn thông báo Đã lưu khi lưu thất bại; xóa bản lưu hỏng trước khi có phương án phục hồi.
- Để giá cũ trông như đề xuất hợp lệ sau khi cấu hình đã đổi.
- Cắt sample count, bỏ kiểm tra hoặc giấu hạn chế để đạt cảm giác nhanh/chính xác.
- Commit secret, thêm hiệu ứng/ảnh không phục vụ công việc tính giá.

## 11. Tiêu chí nghiệm thu

- [ ] AC01: Cấu hình từ bản `b884b07` mở ở bản mới giữ nguyên lựa chọn và giá.
- [ ] AC02: Người dùng LV1 và người dùng mở đủ 9 nước lèo cấu hình được quán mà không nhầm cấp với đã mua.
- [ ] AC03: Menu và bảng so sánh không yêu cầu kéo ngang ở 320px; data gốc chỉ cuộn trong vùng riêng.
- [ ] AC04: Control đủ lớn, bàn phím không che ô đang nhập; thanh dưới không che nội dung/focus ở zoom 200%.
- [ ] AC05: Giá sai, không có nước lèo và prerequisite sai được chỉ đúng vị trí; bản đã lưu hợp lệ không bị ghi đè.
- [ ] AC06: Lọc/tìm món giữ nguyên cấu hình, giá đang nhập và đề xuất hợp lệ.
- [ ] AC07: Người dùng nhìn được lợi nhuận, chênh lệch, số tô, các loại mất khách và cảnh báo sao mà không mở phần công thức.
- [ ] AC08: Không dùng lời khẳng định tăng lời khi đề xuất kém hơn hoặc chênh lệch chưa đủ bằng chứng.
- [ ] AC09: Tính trên Worker và engine trực tiếp cho cùng kết quả với cùng đầu vào/seed; trang HTTP(S) vẫn cuộn/điều hướng trong lúc tính.
- [ ] AC10: Lưu thất bại báo đúng; refresh cấu hình hợp lệ hoạt động; reset tránh mất cấu hình do bấm nhầm.
- [ ] AC11: Light/dark, keyboard, reduced motion và contrast có bằng chứng kiểm tra thực.
- [ ] AC12: Tất cả Node checks và syntax checks liên quan qua; giới hạn mô hình và tiêu chí chưa đo được ghi trung thực.

## 12. Quyết định đã duyệt

Bản đề xuất mặc định giữ nhận diện và stack, thêm lọc menu, inline validation, dark mode theo hệ thống và Worker để giao diện phản hồi khi tính. Mục tiêu tối ưu vẫn là lợi nhuận một ngày.

Người dùng đã duyệt spec. Bước tiếp theo là duyệt kế hoạch/tasks trước khi triển khai theo workflow đã chọn. Những yêu cầu trong tài liệu là mục tiêu của đợt tiếp theo, không phải mô tả rằng code hiện tại đã đáp ứng.
