import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import useSound from "use-sound";
import beep from "../assets/beep.wav"
import { useTranslation } from "react-i18next";
 

const SwiperCard = ({ selectedCandidate, setSelectedCandidate }) => {
  const {t}= useTranslation()
  const [playClick] = useSound(beep, { volume: 0.3});
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const candidates = [
  {
    id: 1,
    name: t("candidates.p1.name"),
    party: t("candidates.p1.party"),
    party_logo: "https://i.pinimg.com/736x/ef/e0/f8/efe0f8970f04bafbb8d5f416cda2fc2f.jpg",
    leader_img: "https://i.pinimg.com/736x/cb/94/47/cb9447a9a518aa16563a2748f428e589.jpg",
  },
  {
    id: 2,
    name: t("candidates.p2.name"),
    party: t("candidates.p2.party"),
    party_logo: "https://i.pinimg.com/1200x/8d/0a/d6/8d0ad6577fd8aede3244c674ca6bfc3c.jpg",
    leader_img: "https://images.seeklogo.com/logo-png/41/1/dmk-logo-png_seeklogo-411320.png",
  },
  {
    id: 3,
    name: t("candidates.p3.name"),
    party: t("candidates.p3.party"),
    party_logo: "https://i.pinimg.com/1200x/8e/94/f8/8e94f852a6bf7bc2a3fb7918af013ff4.jpg",
    leader_img: "https://images.seeklogo.com/logo-png/41/1/aiadmk-logo-png_seeklogo-411321.png",
  },
  {
    id: 4,
    name: t("candidates.p4.name"),
    party: t("candidates.p4.party"),
    party_logo: "https://i.pinimg.com/1200x/eb/05/23/eb0523f9f6be7c0bdec78f67cd9ca050.jpg",
    leader_img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgEKfezxlo_XSniQNjVhAQcbF4mEFKSup5tg&s",
  },
  {
    id: 5,
    name: t("candidates.p5.name"),
    party: t("candidates.p5.party"),
    party_logo: "https://www.schemecolor.com/images/scheme/bharatiya-janata-party-bjp-flag-colors.png",
    leader_img: "https://i.pinimg.com/1200x/87/98/06/879806e54afb6170f276e63787dc10e6.jpg",
  },
  {
    id: 6,
    name: t("candidates.p6.name"),
    party: t("candidates.p6.party"),
    party_logo: "https://i.pinimg.com/736x/c1/d3/cc/c1d3ccbc02c015529332ecd52fbfcc1d.jpg",
    leader_img: "https://i.pinimg.com/736x/ba/5a/fa/ba5afa25ea6ca1abea61b5895be253ab.jpg",
  },
  {
    id: 7,
    name: t("candidates.p7.name"),
    party: t("candidates.p7.party"),
    party_logo: "https://i.pinimg.com/1200x/98/c6/3c/98c63c764c77502b22e93746a7d79a98.jpg",
    leader_img: "https://i.pinimg.com/736x/8c/9e/8a/8c9e8a9c95aaed234d059791a0cb541f.jpg",
  },
  {
    id: 8,
    name: t("candidates.p8.name"),
    party: t("candidates.p8.party"),
    party_logo: "https://i.pinimg.com/736x/de/93/f3/de93f35351b928c834706c9b8aeefd66.jpg",
    leader_img: "https://upload.wikimedia.org/wikipedia/commons/6/67/Pmk_flag.jpg",
  },
  {
    id: 9,
    name: t("candidates.p9.name"),
    party: t("candidates.p9.party"),
    party_logo: "https://votersverdict.com/party_img/1118412_desiya_murpokku_dravida_kazhagam_logo.webp",
    leader_img: "https://i.pinimg.com/1200x/40/47/9a/40479a53cc1be2c47d86a661358509da.jpg",
  },
  {
    id: 10,
    name: t("candidates.p10.name"),
    party: t("candidates.p10.party"),
    party_logo: "https://i.pinimg.com/736x/93/62/df/9362dfd674d8308e4414278642c5f65b.jpg",
    leader_img: "https://i.pinimg.com/736x/93/62/df/9362dfd674d8308e4414278642c5f65b.jpg",
  },
  {
    id: 11,
    name: t("candidates.p11.name"),
    party: t("candidates.p11.party"),
    party_logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJsd14m-3naYxXQ406pta-yUOcoXzXaX5cwA&s",
    leader_img: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag_AMMK.jpg",
  },
  {
    id: 12,
    name: t("candidates.p12.name"),
    party: t("candidates.p12.party"),
    party_logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjLGPO2H742nhN27pR1xCrpDJb8EHmpUdpg&s",
    leader_img: "https://prime9tamil.com/wp-content/uploads/2025/05/tvk-velmurugan.jpg",
  },
  {
    id: 13,
    name: t("candidates.p13.name"),
    party: t("candidates.p13.party"),
    party_logo: "https://www.globalsecurity.org/military/world/india/images/cpi-m.gif",
    leader_img: "https://i.pinimg.com/1200x/00/b2/c8/00b2c835686c67028a5ae70d27349308.jpg",
  },
];


  useEffect(() => {
    if (!swiperReady) return;
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.init();
    swiper.navigation.update();
  }, [swiperReady]);

  const handleCardClick = (candidate, isActive) => {
    if (isActive) {
      if (selectedCandidate?.id === candidate.id) {
        setSelectedCandidate(null);
      } else {
        setSelectedCandidate(candidate);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Swiper Container with proper padding */}
      <div className="relative w-full px-2 sm:px-4">
        <Swiper
          modules={[Navigation, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={candidates.length > 2}
          watchSlidesProgress={true}
          slideToClickedSlide={true}
          speed={600}
          slidesPerView={1.2}
          spaceBetween={20}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 2,
            slideShadows: false,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setSwiperReady(true);
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            480: {
              slidesPerView: 1.4,
              spaceBetween: 30,
            },
            640: {
              slidesPerView: 1.8,
              spaceBetween: 40,
            },
            768: {
              slidesPerView: 2.2,
              spaceBetween: 50,
            },
            1024: {
              slidesPerView: 2.5,
              spaceBetween: 60,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 80,
            },
          }}
          className="!overflow-visible !py-12"
        >
          {candidates.map((item, index) => {
            const isSelected = selectedCandidate?.id === item.id;
            const isHovered = hoveredIndex === index;
            
            return (
              <SwiperSlide key={item.id} className="!h-auto">
                {({ isActive, isPrev, isNext }) => (
                  <div
                    className="flex justify-center items-center transition-all duration-500 ease-out py-2"
                    style={{
                      transform: isActive
                        ? "perspective(1000px) rotateY(0deg) scale(1)"
                        : isPrev
                        ? "perspective(1000px) rotateY(12deg) scale(0.9)"
                        : isNext
                        ? "perspective(1000px) rotateY(-12deg) scale(0.9)"
                        : "perspective(1000px) rotateY(0deg) scale(0.85)",
                      opacity: isActive ? 1 : 0.6,
                    }}
                  >
                    {/* Card Container */}
                    <div
                      className={`relative group cursor-pointer transition-all duration-500 ${
                        isSelected && isActive ? "scale-[1.02]" : ""
                      } ${!isActive ? "pointer-events-none" : ""}`}
                      onClick={() => handleCardClick(item, isActive)}
                      onMouseEnter={() => isActive && setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Card Glow Effect */}
                      <div
                        className={`absolute -inset-1 bg-gradient-to-r from-accet via-[#017474] to-accet rounded-3xl blur-lg transition-all duration-500 ${
                          isSelected && isActive
                            ? "opacity-50"
                            : isActive
                            ? "opacity-0 group-hover:opacity-30"
                            : "opacity-0"
                        }`}
                      />

                      {/* Main Card */}
                      <div
                        className={`relative w-70 sm:w-75 p-4 rounded-2xl backdrop-blur-xl transition-all duration-500 ${
                          isSelected && isActive
                            ? "bg-linear-to-b from-accet/20 via-black/80 to-black/90 border-2 border-accet shadow-[0_0_40px_rgba(0,255,200,0.2)]"
                            : "bg-linear-to-b from-white/5 via-black/60 to-black/80 border-2 border-accet/30 hover:border-accet/60"
                        }`}
                      >
                        {/* Selection Indicator */}
                        {isSelected && isActive && (
                          <div className="absolute top-3 right-3 z-20">
                            <div className="relative">
                              <div className="absolute inset-0 bg-accet rounded-full blur-md animate-pulse" />
                              <div className="relative w-7 h-7 bg-gradient-to-br from-accet to-[#017474] rounded-full flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-black"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Party Logo - Positioned properly */}
                        <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-10">
                          <div className="relative">
                            <div
                              className={`absolute inset-0 bg-accet/50 rounded-full blur-xl transition-all duration-500 ${
                                isSelected && isActive
                                  ? "opacity-100 scale-110"
                                  : "opacity-0"
                              }`}
                            />

                            <div
                              className={`absolute -inset-1 border-2 border-accet/40 rounded-full transition-all duration-500 ${
                                (isHovered || isSelected) && isActive
                                  ? "scale-110 opacity-100"
                                  : "scale-100 opacity-0"
                              }`}
                            />

                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-gray-800 to-black p-0.5 border-2 border-accet/50 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                              <div className="w-full h-full rounded-full overflow-hidden bg-black flex justify-center items-center">
                                <img
                                  src={item.party_logo}
                                  alt={item.party}
                                  className="w-[88%] h-[88%] object-cover rounded-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="flex flex-col justify-center items-center mt-10">
                          {/* Candidate Image */}
                          <div className="relative">
                            {/* Image Glow */}
                            <div
                              className={`absolute -inset-2 bg-gradient-to-r from-accet/40 via-[#017474]/40 to-accet/40 rounded-2xl blur-xl transition-all duration-500 ${
                                isSelected && isActive
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-40"
                              }`}
                            />

                            {/* Image Border Gradient */}
                            <div className="relative p-[3px] rounded-2xl bg-gradient-to-br from-accet via-[#017474] to-accet/50">
                              <div className="rounded-xl overflow-hidden bg-black">
                                <img
                                  src={item.leader_img}
                                  alt={item.name}
                                  className={`h-52 w-52 sm:h-56 sm:w-56 object-cover transition-all duration-700 ${
                                    isHovered && isActive ? "scale-110" : "scale-100"
                                  }`}
                                />

                                {/* Image Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              </div>
                            </div>

                            {/* Decorative Corner Elements */}
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accet/60 rounded-tl-lg" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-accet/60 rounded-tr-lg" />
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-accet/60 rounded-bl-lg" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accet/60 rounded-br-lg" />
                          </div>

                          {/* Candidate Info */}
                          <div className="text-center mt-4">
                            <h1 className="text-[16px] px-2 font-heading uppercase font-black tracking-wide text-transparent bg-linear-to-r from-accet via-[#00ffcc] to-[#017474] bg-clip-text leading-5">
                              {item.name}
                            </h1>

                            {/* Divider */}
                            <div className="flex items-center justify-center gap-2 my-2">
                              <div className="h-px w-8 bg-linear-to-r from-transparent to-accet/50" />
                              <div className="w-1.5 h-1.5 bg-accet/60 rounded-full" />
                              <div className="h-px w-8 bg-linear-to-l from-transparent to-accet/50" />
                            </div>

                            <div className="flex items-center justify-center gap-2">
                              <span className="text-[15px] sm:text-[18px] font-heading uppercase font-black tracking-[0.1em] text-transparent bg-gradient-to-r from-accet to-[#017474] bg-clip-text">
                                {item.party}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Tap Indicator for Active Card */}
                        {isActive && !isSelected && (
                          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                            <p className="text-[8px] text-white/80 tracking-widest font-body uppercase animate-pulse">
                              {t("messages.tapToSelect")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Buttons */}
        <button
        onClick={()=>{
          playClick()
        }}
          ref={prevRef}
          aria-label="Previous"
          className="absolute top-1/2 -translate-y-1/2 left-0 sm:left-2 lg:left-16 z-30 
            w-10 h-10 sm:w-12 sm:h-12
            rounded-full bg-black/50 backdrop-blur-md border border-accet/30
            flex justify-center items-center
            hover:bg-accet/20 hover:border-accet/60 hover:scale-110 active:scale-95
            transition-all duration-300"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-accet"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
        onClick={()=>{
          playClick()
        }}
          ref={nextRef}
          aria-label="Next"
          className="absolute top-1/2 -translate-y-1/2 right-0 sm:right-2 lg:right-16 z-30 
            w-10 h-10 sm:w-12 sm:h-12
            rounded-full bg-black/50 backdrop-blur-md border border-accet/30
            flex justify-center items-center
            hover:bg-accet/20 hover:border-accet/60 hover:scale-110 active:scale-95
            transition-all duration-300"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-accet"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SwiperCard;