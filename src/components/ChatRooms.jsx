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

  // ✅ Typewriter effect (cursor hides after typing)
  useEffect(() => {
    const fullText = "Pixel Talkz";
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 800); // Hide cursor smoothly
      }
    }, 150); // Typing speed
    return () => clearInterval(interval);
  }, []);

  // ✅ Force Light Mode (prevents theme leak from rooms)
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
      description:
        "Connect and chat with others about anything fun and interesting",
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

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#FF6EC7] via-[#9D50FF] to-[#00D1FF] text-white p-2 rounded-lg shadow-md border border-transparent">
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

              {/* 🪄 Animated App Name with cursor hidden after typing */}
              <span
                className="text-3xl font-extrabold tracking-wider select-none bg-gradient-to-r from-[#FF6EC7] via-[#9D50FF] via-[#00D1FF] to-[#00FFA3] text-transparent bg-clip-text"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                }}
              >
                {typedText}
                {showCursor && (
                  <span className="animate-pulse text-[#00FFA3] drop-shadow-[0_0_10px_#00FFA3]">
                    |
                  </span>
                )}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Featured Room */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-[#FF6EC7] via-[#9D50FF] via-[#00D1FF] to-[#00FFA3] text-white relative neon-rainbow border-none">
            <div className="relative p-8 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight">
                  Featured Room
                </h2>
                <p className="mb-5 text-gray-100/90 leading-relaxed max-w-xl">
                  Explore our most active space and meet people already chatting.
                  Jump in or pick another room below.
                </p>
                <button
                  onClick={() => navigate(`/${rooms[0].id}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6EC7] via-[#9D50FF] to-[#00FFA3] text-white font-bold rounded-lg shadow hover:opacity-90"
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 w-full max-w-sm">
                <img
                  src={collegelife_image}
                  alt="college life banner"
                  className="rounded-xl shadow-lg w-full object-cover h-56 ring-1 ring-white/20"
                />
              </div>
            </div>
          </div>

          {/* Room Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Discover Rooms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onMouseEnter={() => setHoveredRoom(room.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                  onClick={() => navigate(`/${room.id}`)}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-transparent shadow-md hover:shadow-[0_0_18px_#9D50FF] hover:border-[#9D50FF] transition-all duration-300 fade-pop"
                >
                  <div className="relative h-48">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
                    />
                    {hoveredRoom === room.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300">
                        <button className="bg-gradient-to-r from-[#FF6EC7] via-[#9D50FF] to-[#00FFA3] text-white px-4 py-2 font-bold hover:opacity-90">
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
              className="text-base font-extrabold text-gray-800 hover:text-indigo-600 transition-colors duration-200"
            >
              © 2025 <span className="bg-gradient-to-r from-[#FF6EC7] via-[#9D50FF] to-[#00FFA3] text-transparent bg-clip-text">Pixel Talkz</span>. Developed By{" "}
              <span className="text-purple-700">KISHORE R</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRooms;
