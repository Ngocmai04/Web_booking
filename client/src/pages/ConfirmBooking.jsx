import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ConfirmBooking = () => {
  const { bookingId, token } = useParams();
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        const { data } = await axios.get(
          `/api/bookings/confirm/${bookingId}/${token}`
        );

        if (data.success) {
          if (data.alreadyConfirmed) {
            setStatus("already");
            setMessage("This booking has already been confirmed.");
          } else {
            setStatus("success");
            setMessage(data.message);
            toast.success(data.message);
          }
        } else {
          setStatus("error");
          setMessage(data.message);
          toast.error(data.message);
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
        toast.error("Confirmation failed");
      }
    };

    if (bookingId && token) confirmBooking();
  }, [bookingId, token, axios]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#14532d] to-[#7f1d1d] px-4">
      {/* ===== CHRISTMAS BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Snow */}
        {[...Array(70)].map((_, i) => (
          <span
            key={i}
            className="absolute text-white/80 animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${8 + Math.random() * 12}s`,
              animationDelay: `${Math.random() * 8}s`,
              fontSize: `${8 + Math.random() * 14}px`,
            }}
          >
            ❄
          </span>
        ))}

        {/* Christmas light glow */}
        {[...Array(20)].map((_, i) => (
          <span
            key={`light-${i}`}
            className="absolute w-3 h-3 rounded-full animate-glow"
            style={{
              background:
                i % 3 === 0 ? "#22c55e" : i % 3 === 1 ? "#ef4444" : "#eab308",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* ===== CARD ===== */}
      <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(34,197,94,0.4)] border border-green-300 p-10 text-center">
        {/* Top ribbon */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-green-500 px-6 py-1 rounded-full text-white font-bold shadow-lg">
          🎄 Christmas Booking 🎄
        </div>

        {/* ===== STATES ===== */}
        {status === "loading" && (
          <div className="animate-float">
            <div className="text-7xl mb-6 animate-spin-slow">🎁</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Confirming your booking
            </h2>
            <p className="text-gray-600">Santa is checking your reservation…</p>
          </div>
        )}

        {status === "success" && (
          <div className="animate-float">
            {/* GREEN CONFIRM ICON */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-green-400 blur-xl opacity-60 animate-pulse" />
              <svg viewBox="0 0 100 100" className="relative w-full h-full">
                <circle cx="50" cy="50" r="48" fill="#16a34a" />
                <circle cx="50" cy="50" r="42" fill="#22c55e" />
                <path
                  d="M30 52 L44 66 L72 36"
                  stroke="white"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-extrabold text-green-600 mb-3">
              🎉 Booking Confirmed!
            </h2>
            <p className="text-gray-700 mb-6">{message}</p>

            <button
              onClick={() => navigate("/my-bookings")}
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:scale-110 transition"
            >
              🎄 View My Bookings
            </button>
          </div>
        )}

        {status === "already" && (
          <div className="animate-float">
            {/* GREEN CHECK ICON */}
            <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-green-400 blur-2xl opacity-50 animate-pulse"></div>

              {/* Solid background (FIX LỖI ĐEN) */}
              <div className="relative w-28 h-28 rounded-full bg-green-500 flex items-center justify-center shadow-2xl">
                <svg viewBox="0 0 100 100" className="w-20 h-20">
                  <path
                    d="M30 52 L44 66 L72 36"
                    stroke="white"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* TEXT */}
            <h2 className="text-3xl font-extrabold text-green-600 mb-3">
              Already Confirmed
            </h2>

            <p className="text-gray-700 mb-4 text-lg">{message}</p>

            <button
              onClick={() => navigate("/my-bookings")}
              className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-7 py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
              View My Bookings
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="animate-float">
            <div className="text-7xl mb-4">🎅</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Confirmation Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-7 py-3 rounded-xl hover:scale-105 transition"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>

      {/* ===== ANIMATIONS ===== */}
      <style>{`
        @keyframes snow {
          0% { transform: translateY(-10vh); opacity: 0 }
          10% { opacity: 1 }
          100% { transform: translateY(110vh); opacity: 0 }
        }
        .animate-snow {
          animation: snow linear infinite;
        }
        @keyframes glow {
          0%,100% { opacity: .3 }
          50% { opacity: 1 }
        }
        .animate-glow {
          animation: glow 2.5s ease-in-out infinite;
        }
        @keyframes float {
          0%,100% { transform: translateY(0) }
          50% { transform: translateY(-12px) }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg) }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ConfirmBooking;
