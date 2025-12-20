import { useEffect, useRef, useState } from "react";
import santaReindeerImg from "../assets/santa-reindeer.png"; // Ảnh Santa + Reindeer chung

const FlyingSanta = () => {
  const sizeRef = useRef(90); // size ban đầu
  const directionRef = useRef(true); // true = trái → phải
  const [santas, setSantas] = useState([]);
  const intervalRef = useRef(null);
  const santaIdRef = useRef(0);

  useEffect(() => {

    // Hàm tạo Santa bay qua
    const createFlyingSanta = () => {
      const id = santaIdRef.current++;

      // Luân phiên hướng bay: đi – về
      const direction = directionRef.current;
      directionRef.current = !directionRef.current;

      // Random vị trí Y (từ 10% đến 70% chiều cao màn hình)
      const startY = Math.random() * 50 + 10;

      // Tăng size mỗi lần xuất hiện
      sizeRef.current += 15; // mỗi lần to thêm 15px
      if (sizeRef.current > 180) sizeRef.current = 100; // reset nếu quá to

      const size = sizeRef.current * (1 + startY / 100);

      // Random thời gian bay (từ 8s đến 15s)
      const duration = Math.random() * 7 + 8;

      const newSanta = {
        id,
        direction,
        startY,
        size,
        duration,
      };

      setSantas((prev) => [...prev, newSanta]);

      // Tự động xóa sau khi bay xong
      setTimeout(() => {
        setSantas((prev) => prev.filter((s) => s.id !== id));
      }, duration * 1000);
    };

    // Tạo Santa định kỳ (mỗi 15-30 giây)
    const scheduleNextSanta = () => {
      const randomDelay = Math.random() * 15000 + 15000; // 15-30 giây
      intervalRef.current = setTimeout(() => {
        createFlyingSanta();
        scheduleNextSanta();
      }, randomDelay);
    };

    // Tạo Santa đầu tiên sau 5 giây
    const initialTimeout = setTimeout(() => {
      createFlyingSanta();
      scheduleNextSanta();
    }, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 9998 }}>
      {santas.map((santa) => (
        <div
          key={santa.id}
          style={{
            position: "absolute",
            top: `${santa.startY}%`,
            left: santa.direction ? "-200px" : "100vw",
            width: `${santa.size}px`,
            height: `${santa.size}px`,
            animation: `fly-${santa.direction ? "right" : "left"} ${santa.duration}s linear`,
            transform: santa.direction ? "scaleX(1)" : "scaleX(-1)",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            willChange: "transform",
          }}
        >
          <img
            src={santaReindeerImg}
            alt="Flying Santa"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes fly-right {
          0% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(25vw) translateY(-20px);
          }
          50% {
            transform: translateX(50vw) translateY(0);
          }
          75% {
            transform: translateX(75vw) translateY(-15px);
          }
          100% {
            transform: translateX(calc(100vw + 200px)) translateY(0);
          }
        }

        @keyframes fly-left {
          0% {
            transform: translateX(0) translateY(0) scaleX(-1);
          }
          25% {
            transform: translateX(-25vw) translateY(-20px) scaleX(-1);
          }
          50% {
            transform: translateX(-50vw) translateY(0) scaleX(-1);
          }
          75% {
            transform: translateX(-75vw) translateY(-15px) scaleX(-1);
          }
          100% {
            transform: translateX(calc(-100vw - 200px)) translateY(0) scaleX(-1);
          }
        }
      `}</style>
    </div>
  );
};

export default FlyingSanta;