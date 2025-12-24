import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPaperPlane,
  faGift,
  faHeadset,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer
      className="pt-14 px-6 md:px-16 lg:px-24 xl:px-32 text-white"
      style={{
        background:
          "linear-gradient(180deg, #8b0000 0%, #6b0000 60%, #2a0000 100%)",
      }}
    >
      <div className="flex flex-wrap justify-between gap-12">
        {/* ===== Brand ===== */}
        <div className="max-w-80">
          <img src={assets.logo} alt="logo" className="mb-4 h-16" />

          <p className="text-sm opacity-90 leading-relaxed">
            Discover magical places to stay this Christmas — cozy cabins, snowy
            retreats, and luxury winter resorts.
          </p>

          <div className="flex gap-5 mt-5 text-xl">
            <a href="https://www.instagram.com/dtks.luv/" className="hover:text-green-400 transition">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.facebook.com/dtks.luv" className="hover:text-green-400 transition">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://x.com/dtks_luv?s=21" className="hover:text-green-400 transition">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="hover:text-green-400 transition">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>

        {/* ===== Company ===== */}
        <div>
          <p className="flex items-center gap-2 font-playfair text-lg mb-4">
            <FontAwesomeIcon icon={faGift} className="text-green-400" />
            COMPANY
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-green-300">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-green-300">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-green-300">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/partners" className="hover:text-green-300">
                Partners
              </Link>
            </li>
          </ul>
        </div>

        {/* ===== Support ===== */}
        <div>
          <p className="flex items-center gap-2 font-playfair text-lg mb-4">
            <FontAwesomeIcon icon={faHeadset} className="text-green-400" />
            SUPPORT
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/help" className="hover:text-green-300">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-green-300">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/cancellation" className="hover:text-green-300">
                Cancellation
              </Link>
            </li>
            <li>
              <Link to="/accessibility" className="hover:text-green-300">
                Accessibility
              </Link>
            </li>
          </ul>
        </div>

        {/* ===== Newsletter ===== */}
        <div className="max-w-80">
          <p className="flex items-center gap-2 font-playfair text-lg mb-4">
            <FontAwesomeIcon
              icon={faEnvelopeOpenText}
              className="text-green-400"
            />
            STAY UPDATED
          </p>
          <p className="text-sm opacity-90 mb-4">
            Receive Christmas deals & festive offers straight to your inbox 🎅
          </p>

          <div className="relative mt-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="
                peer
                w-full h-11 px-4 pr-12
                rounded-full

                bg-[#4a0000]
                text-white
                border-2 border-[#7a0000]
                outline-none

                placeholder:text-red-300/60

                focus:bg-white
                focus:text-black
                focus:border-green-500
                focus:ring-4 focus:ring-green-400/30
                focus:placeholder:text-green-500

                transition-all duration-300
              "
            />

            <button
              className="
                absolute right-1 top-1/2 -translate-y-1/2
                h-9 w-9
                rounded-full

                bg-green-900
                text-green-200
                shadow-inner

                peer-focus:bg-green-600
                peer-focus:text-white
                peer-focus:shadow-lg

                peer-not-placeholder-shown:bg-green-600
                peer-not-placeholder-shown:text-white

                transition-all duration-300
              "
            >
              <FontAwesomeIcon icon={faPaperPlane} size="sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-white/30 mt-10" />

      {/* Bottom */}
      <div className="flex flex-col md:flex-row items-center justify-between py-6 text-sm opacity-90">
        <p>© {new Date().getFullYear()} Paradise Hotel — Merry Christmas 🎄</p>
        <ul className="flex gap-5">
          <li>
            <Link to="/privacy" className="hover:text-green-300">
              Privacy
            </Link>
          </li>
          <li>
            <Link to="/terms" className="hover:text-green-300">
              Terms
            </Link>
          </li>
          <li>
            <Link to="/sitemap" className="hover:text-green-300">
              Sitemap
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
