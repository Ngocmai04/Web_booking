import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div
      className="pt-10 px-6 md:px-16 lg:px-24 xl:px-32 text-white relative"
      style={{
        background: "linear-gradient(180deg, #8b0000 0%, #4a0000 100%)",
      }}
    >
      {/* ❄️ Snow glow border top */}
      <div
        className="absolute top-0 left-0 w-full h-[40px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(20px)",
        }}
      ></div>

      <div className="flex flex-wrap justify-between gap-12 md:gap-6 relative z-10">
        {/* ===== Brand Info ===== */}
        <div className="max-w-80">
          <img
            src={assets.logo}
            alt="logo"
            className="mb-4 h-16 text-white"
          />
          <p className="text-sm opacity-90">
            Discover magical places to stay this holiday season — from cozy
            cabins to luxurious winter resorts.
          </p>

          <div className="flex items-center gap-3 mt-4">
            <img
              src={assets.instagramIcon}
              alt="instagram"
              className="w-6 invert hover:scale-110 transition"
            />
            <img
              src={assets.facebookIcon}
              alt="facebook"
              className="w-6 invert hover:scale-110 transition"
            />
            <img
              src={assets.twitterIcon}
              alt="twitter"
              className="w-6 invert hover:scale-110 transition"
            />
            <img
              src={assets.linkendinIcon}
              alt="linkedin"
              className="w-6 invert hover:scale-110 transition"
            />
          </div>
        </div>

        {/* ===== Company ===== */}
        <div>
          <p className="font-playfair text-lg text-white drop-shadow-lg">
            🎁 COMPANY
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {["About", "Careers", "Press", "Blog", "Partners"].map((text) => (
              <li key={text}>
                <a
                  href="#"
                  className="hover:text-green-300 transition-colors"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Support ===== */}
        <div>
          <p className="font-playfair text-lg text-white drop-shadow-lg">
            🎄 SUPPORT
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {[
              "Help Center",
              "Safety Information",
              "Cancellation Options",
              "Contact Us",
              "Accessibility",
            ].map((text) => (
              <li key={text}>
                <a
                  href="#"
                  className="hover:text-green-300 transition-colors"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Stay Updated ===== */}
        <div className="max-w-80">
          <p className="font-playfair text-lg text-white drop-shadow-lg">
            ✨ STAY UPDATED
          </p>
          <p className="mt-3 text-sm opacity-90">
            Subscribe for festive updates, special Christmas deals, and more.
          </p>

          <div className="flex items-center mt-4">
            <input
              type="text"
              className="bg-white text-black rounded-l h-9 px-3 outline-none"
              placeholder="Your email"
            />
            <button className="flex items-center justify-center bg-green-600 hover:bg-green-700 h-9 w-10 rounded-r transition">
              <img
                src={assets.arrowIcon}
                alt="arrow"
                className="w-3.5 invert brightness-200"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-white/40 mt-8" />

      {/* Bottom row */}
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5 text-sm opacity-90">
        <p>© {new Date().getFullYear()} QuickStay — Merry Christmas 🎄</p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#" className="hover:text-green-300 transition">
              Privacy
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-green-300 transition">
              Terms
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-green-300 transition">
              Sitemap
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
