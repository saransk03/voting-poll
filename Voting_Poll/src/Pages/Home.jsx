import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import LanguageDialog from "../Components/LanguageDialog";

const Home = () => {
  const { t, i18n } = useTranslation();
  const [playClick] = useSound(scifi);
  const navigate = useNavigate();
  const [showLangDialog, setShowLangDialog] = useState(false);

  const handleClose = () => {
    setShowLangDialog(false);
  };

  const currentLang = i18n.language;

  return (
    <>
      <div className="container mx-auto">
        <div className="w-[90%] mx-auto h-dvh relative flex flex-col">
          
          {/* ========== Language Button - Top Right ========== */}
          <button
            onClick={() => {
              playClick();
              setShowLangDialog(true);
            }}
            className="absolute top-4 right-0 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-accet/30 px-3 py-1.5 rounded-full hover:bg-accet/20 hover:border-accet transition-all duration-300"
          >
            <span className="text-white text-[10px] font-heading font-bold uppercase">
              {currentLang === "en" ? "EN" : "தமிழ்"}
            </span>
            <svg
              className="w-3 h-3 text-accet"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Title */}
          <div className="flex justify-center items-start pt-4">
            <h1 className="text-[20px] font-heading text-center uppercase font-black tracking-wide leading-6 text-transparent bg-linear-to-r from-accet to-[#017474] bg-clip-text">
              {t("home.title")}
            </h1>
          </div>

          {/* Center Image */}
          {/* <div className="flex-1 flex justify-center items-center">
            <div>
              <img
                src="https://ik.imagekit.io/saransk03/Voting%20Poll/Google_AI_Studio_2025-12-27T06_07_01.312Z.png"
                alt="img"
                className="w-56"
              />
            </div>
          </div> */}

          {/* Start Button */}
          <div className="w-full absolute bottom-4">
            <button
              onClick={() => {
                playClick();
                navigate("/form");
              }}
              className="w-full font-heading text-[12px] tracking-wider rounded-full text-white bg-accet/30 uppercase font-bold border border-accet flex justify-center items-center py-2"
            >
              {t("home.startButton")}{'  '}
              {t("home.votingText")}
            </button>
          </div>

          {/* Background Blur */}
          {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-52 w-52 bg-blue-500/60 rounded-full blur-3xl -z-10" /> */}
        </div>
      </div>

      {/* ========== Language Dialog (Reused) ========== */}
      {showLangDialog && (
        <LanguageDialog
          isChangeMode={true}
          onLanguageSelect={() => setShowLangDialog(false)}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default Home;