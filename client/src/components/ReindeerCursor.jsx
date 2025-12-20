import { useEffect, useRef } from "react";
import reindeerImg from "../assets/reindeer.png";
import santaImg from "../assets/santa.png"; // Thêm ảnh ông già Noel

const MAX_REINDEER = 8;
const LAG_SPEED = 0.12; // Tăng tốc độ để mượt hơn
const IDLE_TIMEOUT = 200;

const ReindeerCursor = () => {
  const reindeersRef = useRef([]);
  const santaRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const reindeersPos = useRef(
    Array.from({ length: MAX_REINDEER }, () => ({
      x: 0,
      y: 0,
      angle: 0,
      flipX: false // Thêm state để track hướng flip
    }))
  );
  const santaPos = useRef({ x: 0, y: 0, angle: 0, flipX: false });
  const requestRef = useRef();
  const lastMoveTime = useRef(Date.now());

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      lastMoveTime.current = Date.now();
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const now = Date.now();
      const isIdle = now - lastMoveTime.current > IDLE_TIMEOUT;

      // Animate reindeer
      reindeersPos.current.forEach((pos, i) => {
        const target = i === 0 ? cursorRef.current : reindeersPos.current[i - 1];

        const dx = target.x - pos.x;
        const dy = target.y - pos.y;

        // Smooth interpolation cho tất cả con tuần lộc
        const speed = i === 0 ? 0.2 : LAG_SPEED;

        pos.x += dx * speed;
        pos.y += dy * speed;

        // Tính góc xoay CHỈ KHI di chuyển đủ xa
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          // LOGIC FLIP: Chỉ flip theo trục Y khi góc > 90 hoặc < -90
          // Điều này giữ con tuần lộc luôn đứng đúng chiều
          if (angle > 90 || angle < -90) {
            pos.flipX = true;
            // Điều chỉnh góc khi flip để giữ hướng đúng
            pos.angle = angle;
          } else {
            pos.flipX = false;
            pos.angle = angle;
          }
        }

        const el = reindeersRef.current[i];
        if (el) {
          const scale = 1 - i * 0.04; // Giảm size nhẹ nhàng hơn

          // Transform với scaleY để flip
          const scaleY = pos.flipX ? -1 : 1;
          el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.angle}deg) scale(${scale}, ${scale * scaleY})`;

          // Opacity mượt mà hơn
          const opacity = isIdle ? 0 : Math.max(0.5, 1 - i * 0.06);
          el.style.opacity = opacity;
        }
      });

      // Animate Santa (follows last reindeer)
      const lastReindeer = reindeersPos.current[MAX_REINDEER - 1];
      const dx = lastReindeer.x - santaPos.current.x;
      const dy = lastReindeer.y - santaPos.current.y;

      santaPos.current.x += dx * 0.08; // Santa di chuyển chậm hơn
      santaPos.current.y += dy * 0.08;

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        if (angle > 90 || angle < -90) {
          santaPos.current.flipX = true;
          santaPos.current.angle = angle + 180;
        } else {
          santaPos.current.flipX = false;
          santaPos.current.angle = angle; // Đảo ngược hướng ông già Noel
        }
      }

      const santaEl = santaRef.current;
      if (santaEl) {
        const scaleX = santaPos.current.flipX ? 1 : -1;
        santaEl.style.transform = `translate3d(${santaPos.current.x}px, ${santaPos.current.y}px, 0) rotate(${santaPos.current.angle}deg) scale(${1.2 * scaleX},1.2)`;
        santaEl.style.opacity = isIdle ? 0 : 0.95;
      }

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
      {/* Reindeer */}
      {Array.from({ length: MAX_REINDEER }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (reindeersRef.current[i] = el)}
          style={{
            position: "fixed",
            top: -20,
            left: -20,
            width: "40px",
            height: "40px",
            pointerEvents: "none",
            zIndex: 9999 - i,
            willChange: "transform, opacity",
            transition: "opacity 0.5s ease-out",
          }}
        >
          <img
            src={reindeerImg}
            alt="reindeer"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: i === 0
                ? "drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))"
                : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />
        </div>
      ))}

      {/* Santa */}
      <div
        ref={santaRef}
        style={{
          position: "fixed",
          top: -25,
          left: -25,
          width: "50px",
          height: "50px",
          pointerEvents: "none",
          zIndex: 9999 - MAX_REINDEER,
          willChange: "transform, opacity",
          transition: "opacity 0.5s ease-out",
        }}
      >
        <img
          src={santaImg}
          alt="santa"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))",
          }}
        />
      </div>
    </>
  );
};

export default ReindeerCursor;