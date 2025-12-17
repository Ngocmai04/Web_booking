import { useEffect, useRef } from "react";
import reindeerImg from "../assets/reindeer.png";

const MAX_REINDEER = 8;
const LAG_SPEED = 0.08; // Tốc độ đuổi theo (Càng nhỏ -> Khoảng cách càng XA)
const IDLE_TIMEOUT = 150; // Thời gian chờ trước khi biến mất (ms)

const ReindeerCursor = () => {
  const reindeersRef = useRef([]);
  const cursorRef = useRef({ x: 0, y: 0 });
  const reindeersPos = useRef(
    Array.from({ length: MAX_REINDEER }, () => ({ x: 0, y: 0, angle: 0 }))
  );
  const requestRef = useRef();
  const lastMoveTime = useRef(Date.now()); // Theo dõi lần cuối di chuyển chuột

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      lastMoveTime.current = Date.now(); // Cập nhật thời gian
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const now = Date.now();
      // Kiểm tra xem chuột có đang dừng không
      const isIdle = now - lastMoveTime.current > IDLE_TIMEOUT;

      reindeersPos.current.forEach((pos, i) => {
        // Con đầu tiên theo chuột, con sau theo con trước
        const target = i === 0 ? cursorRef.current : reindeersPos.current[i - 1];

        const dx = target.x - pos.x;
        const dy = target.y - pos.y;

        // CÔNG THỨC KHOẢNG CÁCH:
        // i === 0: Con đầu chạy nhanh (0.25) để bám sát chuột
        // i > 0: Các con sau chạy chậm (LAG_SPEED) để tạo khoảng cách xa
        const speed = i === 0 ? 0.25 : LAG_SPEED; 

        pos.x += dx * speed;
        pos.y += dy * speed;

        // Tính góc xoay
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            pos.angle = angle;
        }

        const el = reindeersRef.current[i];
        if (el) {
          const scale = 1 - i * 0.05; // Giảm kích thước nhẹ hơn chút
          
          // Cập nhật vị trí
          el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.angle}deg) scale(${scale})`;
          
          // LOGIC BIẾN MẤT:
          // Nếu đang Idle (dừng chuột) -> Opacity = 0
          // Nếu đang di chuyển -> Opacity = 1 (trừ dần theo thứ tự để đẹp hơn)
          el.style.opacity = isIdle ? 0 : (1 - i * 0.05);
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      {Array.from({ length: MAX_REINDEER }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (reindeersRef.current[i] = el)}
          style={{
            position: "fixed",
            top: -10, // Offset nhẹ để căn giữa ảnh với con trỏ
            left: -10,
            width: "40px",
            height: "40px",
            pointerEvents: "none",
            zIndex: 9999 - i,
            willChange: "transform, opacity",
            // Thêm transition opacity để khi biến mất nó mờ dần chứ không tắt phụt
            transition: "opacity 0.4s ease-out", 
          }}
        >
          <img
            src={reindeerImg}
            alt="reindeer"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              // Bỏ bớt hiệu ứng bóng đổ nặng nề
              filter: i === 0 ? "drop-shadow(0 0 4px gold)" : "none", 
            }}
          />
        </div>
      ))}
    </>
  );
};

export default ReindeerCursor;