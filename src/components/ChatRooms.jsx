import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Importing images
import funchat_image from "/public/funchat_image.png";
import study_image from "/public/study_image.png";
import development_image from "/public/development_image.png";
import coding_image from "/public/coding_image.png";
import gaming_image from "/public/gaming_image.png";
import collegelife_image from "/public/collegelife_image.png";

function ChatRooms() {
  const navigate = useNavigate();
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Typewriter effect
  useEffect(() => {
    const fullText = "Pixel Talkz";
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 800);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    document.querySelectorAll("[data-theme]").forEach((el) =>
      el.setAttribute("data-theme", "light")
    );
  }, []);

  const rooms = [
    {
      name: "Fun Chat",
      id: "messages",
      image: funchat_image,
      description: "Connect and chat with others about anything fun and interesting",
    },
    {
      name: "Study",
      id: "study",
      image: study_image,
      description: "Join study groups and get help with your assignments",
    },
    {
      name: "Development",
      id: "development",
      image: development_image,
      description:
        "Discuss development projects and collaborate with other developers",
    },
    {
      name: "Coding",
      id: "coding",
      image: coding_image,
      description:
        "Get help with code, share resources, and solve problems together",
    },
    {
      name: "Gaming",
      id: "gaming",
      image: gaming_image,
      description: "Find gaming buddies and discuss your favorite games",
    },
  ];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed text-zinc-900"
      style={{ backgroundImage: "url('/chatbg.png')" }}
      data-theme="light"
    >
      <div className="relative z-10">
       {/* Navbar */}
<header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-zinc-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <div className="flex items-center gap-3">

      {/* Logo block */}
      <div
        className="text-white p-2 rounded-lg shadow-md"
        style={{
          background:
            "linear-gradient(180deg, #8A2BE2 0%, #6A5BFF 40%, #4DA9FF 70%, #55E3FF 100%)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"
          />
        </svg>
      </div>

      {/* Title */}
      <span
        className="text-3xl font-extrabold tracking-wider select-none text-transparent bg-clip-text"
        style={{
          background:
            "linear-gradient(180deg, #8A2BE2 0%, #6A5BFF 40%, #4DA9FF 70%, #55E3FF 100%)",
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
          display: "inline-block",          // ⭐ FIX: Prevents full-width box
          WebkitBackgroundClip: "text",     // ⭐ Ensures clean gradient text
          filter: `
            drop-shadow(0 0 2px rgba(138,43,226,0.55))
            drop-shadow(0 0 4px rgba(77,169,255,0.35))
          `,
        }}
      >
        {typedText}
        {showCursor && (
          <span className="animate-pulse" style={{ color: "#8A2BE2" }}>|</span>
        )}
      </span>
    </div>
  </div>
</header>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* ⭐ Featured Section */}
          <div
            className="mb-12 rounded-2xl overflow-hidden text-gray-900 relative"
            style={{
              background:
                "linear-gradient(180deg, #8A2BE2 0%, #6A5BFF 40%, #4DA9FF 70%, #55E3FF 100%)",
            }}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

            <div className="relative p-8 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight text-white">
                  Featured Room
                </h2>
                <p className="mb-5 text-gray-100 leading-relaxed max-w-xl">
                  Explore our most active space and meet people already chatting.
                  Jump in or pick another room below.
                </p>
                <button
                  onClick={() => navigate(`/${rooms[0].id}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg hover:opacity-90 text-white"
                  style={{
                    background:
                      "linear-gradient(180deg, #8A2BE2 0%, #6A5BFF 40%, #4DA9FF 70%, #55E3FF 100%)",
                  }}
                >
                  Explore Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 w-full max-w-sm">
                <img
                  src={collegelife_image}
                  alt="college life banner"
                  className="rounded-xl shadow-lg w-full object-cover h-56 ring-1 ring-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Room Categories */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Discover Rooms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onMouseEnter={() => setHoveredRoom(room.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                  onClick={() => navigate(`/${room.id}`)}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    border:
                      "2px solid transparent",
                    background:
                      "linear-gradient(white, white) padding-box, linear-gradient(180deg, #8A2BE2, #6A5BFF, #4DA9FF, #55E3FF) border-box",
                  }}
                >
                  <div className="relative h-48">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
                    />
                    {hoveredRoom === room.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300">
                        <button
                          className="px-4 py-2 font-bold text-white"
                          style={{
                            background:
                              "linear-gradient(180deg, #8A2BE2 0%, #6A5BFF 40%, #4DA9FF 70%, #55E3FF 100%)",
                          }}
                        >
                          Join Room
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {room.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{room.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <a
              href="https://kishorer.vercel.app/"
              target="_blank"
              className="text-base font-medium text-black"
              style={{ fontFamily: "Horizon, sans-serif" }}
            >
              © 2025 Pixel Talkz. All Rights Reserved.Developed By R.KISHORE 
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRooms;