import { useEffect, useRef, useState } from "react";
import reindeerImg from "../assets/reindeer.png";

const MAX_REINDEER = 4;
const FADE_TIME = 1200;
const SPACING = 30; // khoảng cách giữa các tuần lộc
const IDLE_THRESHOLD = 100; // ms để coi như dừng chuột

const ReindeerCursor = () => {
  const [reindeers, setReindeers] = useState([]);
  const [trail, setTrail] = useState([]); // lưu đường đi
  const [isMoving, setIsMoving] = useState(false);
  const lastPos = useRef({ x: 0, y: 0, time: Date.now() });
  const idleTimer = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const newPos = { x: e.clientX, y: e.clientY, time: now };

      setIsMoving(true);

      // Clear idle timer
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }

      // Set timer để phát hiện khi dừng chuột
      idleTimer.current = setTimeout(() => {
        setIsMoving(false);
      }, IDLE_THRESHOLD);

      // Thêm vị trí mới vào trail
      setTrail((prev) => {
        const updated = [...prev, newPos];
        // Giữ đủ điểm để đặt tất cả tuần lộc
        return updated.slice(-MAX_REINDEER * 3);
      });

      lastPos.current = newPos;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
    };
  }, []);

  // Cập nhật vị trí tuần lộc theo trail
  useEffect(() => {
    const updateReindeers = () => {
      if (trail.length < 2) return;

      const newReindeers = [];

      // Tính toán vị trí cho từng tuần lộc dọc theo đường đi
      for (let i = 0; i < MAX_REINDEER; i++) {
        const targetDistance = i * SPACING;

        // Tìm vị trí trên trail theo khoảng cách
        let accumulatedDistance = 0;
        let reindeerPos = trail[trail.length - 1];
        let angle = 0;

        for (let j = trail.length - 1; j > 0; j--) {
          const current = trail[j];
          const prev = trail[j - 1];
          const dx = current.x - prev.x;
          const dy = current.y - prev.y;
          const segmentDistance = Math.sqrt(dx * dx + dy * dy);

          if (accumulatedDistance + segmentDistance >= targetDistance) {
            // Nội suy vị trí chính xác
            const ratio = (targetDistance - accumulatedDistance) / segmentDistance;
            reindeerPos = {
              x: current.x - dx * ratio,
              y: current.y - dy * ratio,
              time: Date.now(),
            };
            angle = Math.atan2(dy, dx) * (180 / Math.PI);
            break;
          }

          accumulatedDistance += segmentDistance;
          reindeerPos = prev;
          angle = Math.atan2(dy, dx) * (180 / Math.PI);
        }

        newReindeers.push({
          id: i,
          ...reindeerPos,
          angle,
          scale: 1 - i * 0.08,
          delay: i * 0.05,
        });
      }

      setReindeers(newReindeers);
    };

    const interval = setInterval(updateReindeers, 16); // ~60fps
    return () => clearInterval(interval);
  }, [trail]);

  // Dọn trail cũ và fade out khi dừng
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      if (!isMoving) {
        // Khi dừng chuột, xóa trail nhanh hơn
        setTrail((prev) => prev.slice(5));
      } else {
        // Khi đang di chuyển, giữ trail bình thường
        setTrail((prev) =>
          prev.filter((p) => now - p.time < FADE_TIME)
        );
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isMoving]);

  return (
    <>
      {/* Hiệu ứng tuyết rơi phía sau */}
      {isMoving && reindeers.map((r, i) => (
        <div
          key={`snow-${r.id}`}
          style={{
            position: "fixed",
            top: r.y + 20,
            left: r.x,
            pointerEvents: "none",
            opacity: 0.3 * (1 - i * 0.1),
            zIndex: 9998,
            animation: `snowFall 0.8s ease-out forwards`,
          }}
        >
          <span className="text-white text-xs">❄</span>
        </div>
      ))}

      {/* Tuần lộc */}
      {reindeers.map((r, i) => (
        <div
          key={`reindeer-${r.id}`}
          style={{
            position: "fixed",
            top: r.y - 18,
            left: r.x - 18,
            pointerEvents: "none",
            opacity: isMoving ? (1 - i * 0.08) : 0,
            transform: `scale(${r.scale}) rotate(${r.angle + 0}deg)`,
            transition: isMoving ? "all 0.1s ease-out" : "opacity 0.5s ease-out, transform 0.3s ease-out",
            zIndex: 9999 - i,
            filter: `drop-shadow(0 0 ${10 - i}px rgba(255, 215, 0, ${0.6 - i * 0.05}))`,
          }}
        >
          {/* Ảnh tuần lộc */}
          <img
            src={reindeerImg}
            alt="reindeer"
            style={{
              width: "36px",
              height: "36px",
              objectFit: "contain",
              // transform: "scaleX(-1)",
            }}
          />

          {/* Sparkle effect cho tuần lộc đầu tiên */}
          {i === 0 && isMoving && (
            <div
              style={{
                position: "absolute",
                top: -5,
                left: -5,
                width: "46px",
                height: "46px",
                background: "radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)",
                borderRadius: "50%",
                animation: "pulse 1s ease-in-out infinite",
              }}
            />
          )}
        </div>
      ))}

      <style>{`
        @keyframes snowFall {
          from {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          to {
            transform: translateY(30px) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.2;
          }
        }
      `}</style>
    </>
  );
};

export default ReindeerCursor;