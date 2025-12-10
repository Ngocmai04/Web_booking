import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const SnowFalling = () => {
  const { width, height } = useWindowSize();

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={200}         // nhiều tuyết hơn
      gravity={0.04}               // rơi chậm
      wind={0.002}                 // gió nhẹ
      friction={0.98}              // rơi mượt hơn
      colors={["#ffffff"]}         // toàn bộ màu trắng
      opacity={0.9}                // chấm sáng rõ hơn
      tweenDuration={9000}         // animation mượt
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}

      // ❄️ Vẽ bông tuyết hình tròn (nhiều kích thước)
      drawShape={(ctx) => {
        const size = Math.random() * 3 + 1.2; // tạo tuyết to nhỏ ngẫu nhiên
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);

        // Glow effect (phát sáng)
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
      }}
    />
  );
};

export default SnowFalling;
