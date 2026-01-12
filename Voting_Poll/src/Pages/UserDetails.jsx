import React, { useState, useEffect, useRef } from "react";
import {
  HiArrowRight,
  HiArrowLeft,
  HiMiniUser,
  HiPhone,
} from "react-icons/hi2";
import {
  MdLocationOn,
  MdFingerprint,
  MdVerifiedUser,
  MdCheck,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DistrictMapPicker from "../Components/DistrictMapPicker";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import click from "../assets/click2.wav";
import scifi from "../assets/scifi.wav";
import { registerVoter, getCasteList } from "../utils/service/api";
import gsap from "gsap";

// --- STEP INDICATOR ---
const StepIndicator = ({ currentStep, totalSteps, steps, subtitle }) => {
  return (
    <div className="w-full mb-6">
      <div className="hidden lg:flex items-center justify-between relative px-4">
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-accet to-indigo-500 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;
          return (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-linear-to-br from-accet to-indigo-500 text-gray-900 shadow-lg shadow-accet/30"
                    : isActive
                    ? "bg-accet border-2 border-accet text-accet"
                    : "bg-shade border border-white/20 text-white/60"
                }`}
              >
                {isCompleted ? <MdCheck className="text-lg" /> : step.icon}
              </div>
              <span
                className={`mt-1 text-[9px] font-bold uppercase tracking-widest font-heading ${
                  isActive
                    ? "text-accet"
                    : isCompleted
                    ? "text-white/70"
                    : "text-white/30"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="lg:hidden flex items-center justify-between px-1">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl font-black text-accet font-num">
            {String(currentStep).padStart(2, "0")}
          </span>
          <div className="flex flex-col justify-center items-start">
            <span className="text-[11px] text-white font-heading font-bold uppercase">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">
              {subtitle[currentStep - 1]?.label}
            </span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 <= currentStep ? "w-6 bg-accet" : "w-3 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- SECTION TITLE ---
const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
    <div className="md:w-10 md:h-10 w-8 h-8 rounded-full bg-gradient-to-br from-accet to-indigo-400 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex flex-col">
      <h2 className="text-[13px] lg:text-base text-white font-heading font-bold uppercase tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[8px] md:text-[10px] text-white/40 hidden lg:block">
          {subtitle}
        </p>
      )}
    </div>
    <div className="flex-1 w-full h-0.5 bg-linear-to-r from-accet/50 to-transparent rounded-full" />
  </div>
);

// --- SEARCHABLE SELECT ---
const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (!isCustomMode) setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCustomMode]);

  const normalizedOptions = options.map((item) => {
    if (typeof item === "object" && item !== null) {
      return {
        value: item.value || item.id || item.name || "",
        label: item.label || item.name || item.value || "",
      };
    }
    return { value: item, label: item };
  });

  const filteredOptions = normalizedOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasExactMatch = normalizedOptions.some(
    (option) => option.label.toLowerCase() === searchTerm.toLowerCase()
  );

  const showOtherOption = searchTerm.length >= 2 && !hasExactMatch;

  const getDisplayValue = () => {
    if (isCustomMode) return value || "";
    const found = normalizedOptions.find(
      (opt) =>
        opt.value.toLowerCase() === value?.toLowerCase() ||
        opt.label.toLowerCase() === value?.toLowerCase()
    );
    return found?.label || value || "";
  };

  const handleSelect = (selectedValue, isOther = false) => {
    if (isOther) {
      setIsCustomMode(true);
      onChange(searchTerm);
    } else {
      setIsCustomMode(false);
      onChange(selectedValue);
      setIsOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (isCustomMode) onChange(newValue);
    if (!isOpen && !isCustomMode) setIsOpen(true);
  };

  const handleInputFocus = () => {
    onChange("");
    setIsOpen(true);
    setIsCustomMode(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
    setIsCustomMode(false);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div
        className={`relative bg-shade border ${
          isOpen
            ? "border-accet"
            : isCustomMode
            ? "border-indigo-500"
            : "border-white/20"
        } md:px-4 py-2.5 md:py-3 px-3 transition-colors cursor-text`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-white/40 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={
              isCustomMode ? value : isOpen ? searchTerm : getDisplayValue()
            }
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="w-full bg-transparent text-white font-body text-[11px] lg:text-[14px] outline-none placeholder:text-white/30 capitalize"
          />
          {(value || searchTerm) && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-white/10 rounded"
            >
              <svg
                className="w-3 h-3 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {isOpen && !isCustomMode && (
        <div className="absolute z-50 w-full mt-1 bg-shade border border-white/20 rounded-lg shadow-xl max-h-60 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-accet/30 border-t-accet rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-y-auto max-h-60">
              {filteredOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-2.5 text-[11px] lg:text-[13px] font-body transition-colors ${
                    option.value.toLowerCase() === value?.toLowerCase()
                      ? "bg-accet/20 text-accet"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <span className="capitalize">{option.label}</span>
                </button>
              ))}
              {showOtherOption && (
                <button
                  onClick={() => handleSelect(searchTerm, true)}
                  className="w-full text-left px-4 py-2 text-[11px] font-body text-white hover:bg-indigo-500/10 bg-indigo-500/5"
                >
                  Others - "{searchTerm}"
                </button>
              )}
              {filteredOptions.length === 0 && !showOtherOption && (
                <div className="py-6 text-center text-white/40 text-[11px]">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- MODALS ---
const ErrorModal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
    <div className="bg-shade border border-red-500/30 rounded-xl p-6 max-w-md w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
          <span className="text-red-500 text-xl">✕</span>
        </div>
        <h3 className="text-white font-heading font-bold uppercase tracking-wide">
          Registration Failed
        </h3>
      </div>
      <p className="text-white/70 text-sm mb-6">{message}</p>
      <button
        onClick={onClose}
        className="w-full py-3 bg-red-500/20 border border-red-500/50 text-red-400 font-heading uppercase tracking-widest text-sm"
      >
        Try Again
      </button>
    </div>
  </div>
);

const SuccessModal = ({ trackerId, onContinue }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
    <div className="bg-shade border border-green-500/30 rounded-xl p-6 max-w-md w-full text-center">
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
        <MdCheck className="text-green-500 text-3xl" />
      </div>
      <h3 className="text-white font-heading font-bold text-xl uppercase tracking-wide mb-2">
        Registration Successful!
      </h3>
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
        <p className="text-[10px] text-green-400 uppercase tracking-widest mb-1">
          Your Tracker ID
        </p>
        <p className="text-white font-mono text-lg font-bold tracking-wider">
          {trackerId}
        </p>
      </div>
      <button
        onClick={onContinue}
        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-heading uppercase tracking-widest text-sm"
      >
        Proceed to Vote
      </button>
    </div>
  </div>
);

// --- ✅ CLICK INDICATOR (Changed from ScrollIndicator) ---
const ClickIndicator = ({ onClick, isAnimating }) => (
  <div className="absolute bottom-16 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
    <button
      onClick={onClick}
      disabled={isAnimating}
      className="group cursor-pointer disabled:cursor-not-allowed flex flex-col items-center gap-5"
    >
      {/* Minimal text */}
      <span className="text-white/50 text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-heading group-hover:text-white/80 transition-colors duration-500">
        Enter
      </span>

      {/* Animated Line with Circle */}
      <div className="relative flex flex-col items-center">
        {/* Top line */}
        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white/20 to-white/40 group-hover:via-accet/30 group-hover:to-accet/60 transition-colors duration-500" />
        
        {/* Center circle */}
        <div className="relative my-2">
          {/* Outer ring */}
          <div className="absolute -inset-2 rounded-full border border-white/10 group-hover:border-accet/30 group-hover:scale-125 transition-all duration-500" />
          
          {/* Main circle */}
          <div className="w-10 h-10 rounded-full border border-white/20 group-hover:border-accet/50 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-accet/10 group-active:scale-90">
            {isAnimating ? (
              <div className="w-4 h-4 border border-accet/30 border-t-accet rounded-full animate-spin" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-accet group-hover:shadow-lg group-hover:shadow-accet/50 transition-all duration-300" />
            )}
          </div>
        </div>

        {/* Bottom animated dots */}
        <div className="flex flex-col items-center gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-[2px] h-[2px] rounded-full bg-white/20 group-hover:bg-accet/60 transition-all duration-300 animate-pulse"
              style={{ 
                animationDelay: `${i * 200}ms`,
                opacity: 1 - (i * 0.2)
              }}
            />
          ))}
        </div>
      </div>
    </button>
  </div>
);


// hexagonal button
// const ClickIndicator = ({ onClick, isAnimating }) => (
//   <div className="absolute bottom-16 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
//     <button
//       onClick={onClick}
//       disabled={isAnimating}
//       className="group cursor-pointer disabled:cursor-not-allowed flex flex-col items-center gap-3"
//     >
//       <div className="relative">
//         <svg className="absolute -inset-4 w-24 h-24 md:w-28 md:h-28 opacity-0 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 100 100">
//           <polygon 
//             points="50,2 95,25 95,75 50,98 5,75 5,25" 
//             fill="none" 
//             stroke="url(#hexGlow)" 
//             strokeWidth="1"
//             className="animate-pulse"
//           />
//           <defs>
//             <linearGradient id="hexGlow" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.3"/>
//               <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3"/>
//             </linearGradient>
//           </defs>
//         </svg>

//         <svg className="w-16 h-16 md:w-20 md:h-20 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 100 100">
//           <polygon 
//             points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" 
//             fill="rgba(0,0,0,0.5)"
//             stroke="url(#hexBorder)" 
//             strokeWidth="2"
//             className="group-hover:fill-[rgba(0,212,255,0.1)] transition-all duration-300"
//           />
//           <defs>
//             <linearGradient id="hexBorder" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="rgba(255,255,255,0.2)"/>
//               <stop offset="50%" stopColor="rgba(0,212,255,0.5)"/>
//               <stop offset="100%" stopColor="rgba(99,102,241,0.5)"/>
//             </linearGradient>
//           </defs>
//         </svg>

//         <div className="absolute inset-0 flex items-center justify-center">
//           {isAnimating ? (
//             <div className="w-5 h-5 border-2 border-accet/30 border-t-accet rounded-full animate-spin" />
//           ) : (
//             <svg 
//               className="w-5 h-5 md:w-6 md:h-6 text-white/70 group-hover:text-accet transition-colors duration-300"
//               fill="currentColor" 
//               viewBox="0 0 24 24"
//             >
//               <path d="M8 5v14l11-7z"/>
//             </svg>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col items-center">
//         <span className="text-[8px] md:text-[9px] text-white/30 uppercase tracking-[0.4em] font-mono">
//           initialize
//         </span>
//         <span className="text-[10px] md:text-[11px] text-white/60 uppercase tracking-widest font-heading group-hover:text-accet transition-colors duration-300">
//           Continue
//         </span>
//       </div>
//     </button>
//   </div>
// );



// ========================================
// ✅ MAIN COMPONENT
// ========================================
const UserDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [Click] = useSound(click, { volume: 0.2 });
  const [playClick] = useSound(scifi, { volume: 0.3 });

  // ✅ GSAP Refs
  const mainContainerRef = useRef(null);
  const imageLayerRef = useRef(null);
  const formLayerRef = useRef(null);
  const animationTlRef = useRef(null); // ✅ NEW: Timeline ref for button click

  const [fixedHeight, setFixedHeight] = useState(null);

  // States
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [showMap, setShowMap] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [direction, setDirection] = useState("next");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // ✅ NEW: Animation state

  // API States
  const [casteList, setCasteList] = useState([]);
  const [casteLoading, setCasteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackerId, setTrackerId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    district: "",
    religion: "",
    motherTongue: "",
    phone: "",
    caste: "",
    community: "",
    idType: "",
    idNumber: "",
  });

  useEffect(() => {
    const initialHeight = window.innerHeight;
    setFixedHeight(initialHeight);

    const handleOrientationChange = () => {
      setTimeout(() => {
        setFixedHeight(window.innerHeight);
      }, 100);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  // ✅ GSAP ANIMATION - Button Click Triggered (No ScrollTrigger)
  useEffect(() => {
    if (!fixedHeight) return;

    const ctx = gsap.context(() => {
      // ✅ Create timeline but DON'T play automatically (paused: true)
      const tl = gsap.timeline({
        paused: true,
        onStart: () => {
          setIsAnimating(true);
        },
        onComplete: () => {
          setIsRevealed(true);
          setIsAnimating(false);
        },
      });

      // ✅ IMAGE: Zoom IN + Fade OUT
      tl.to(
        imageLayerRef.current,
        {
          scale: 2.5,
          y: -300,
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
        },
        0
      );

      // ✅ FORM: Scale UP from center + Fade IN (from behind)
      tl.fromTo(
        formLayerRef.current,
        {
          scale: 0.2,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        0.4
      );

      // ✅ Store timeline in ref for button click access
      animationTlRef.current = tl;
    }, mainContainerRef);

    return () => ctx.revert();
  }, [fixedHeight]);

  // ✅ NEW: Handle Continue Button Click
  const handleContinueClick = () => {
    if (animationTlRef.current && !isAnimating && !isRevealed) {
      playClick(); // Play sound
      animationTlRef.current.play();
    }
  };

  // Fetch Caste List
  useEffect(() => {
    const fetchCasteList = async () => {
      setCasteLoading(true);
      const result = await getCasteList();
      if (result.success) setCasteList(result.data);
      setCasteLoading(false);
    };
    fetchCasteList();
  }, []);

  // Data Options
  const steps = [
    {
      icon: <HiMiniUser className="text-gray-900 text-sm" />,
      label: t("sections.personal") || "Personal",
    },
    {
      icon: <MdLocationOn className="text-gray-900 text-sm" />,
      label: t("sections.location") || "Location",
    },
    {
      icon: <HiPhone className="text-gray-900 text-sm" />,
      label: t("sections.contact") || "Contact",
    },
    {
      icon: <MdVerifiedUser className="text-gray-900 text-sm" />,
      label: t("sections.idVerification") || "Verify",
    },
  ];
  const subtitle = [
    { label: "Establish your identity" || t("sections.location") },
    { label: "Map your background" },
    { label: "Contact & Community details" },
    { label: "Final verification step" },
  ];

  const ageRanges = [
    { value: "below-18", label: "Below 18" },
    { value: "18-25", label: "18 - 25" },
    { value: "26-35", label: "26 - 35" },
    { value: "36-50", label: "36 - 50" },
    { value: "51-65", label: "51 - 65" },
    { value: "65+", label: "65+" },
  ];

  const genders = [
    { value: "male", label: t("options.genders.male") || "Male" },
    { value: "female", label: t("options.genders.female") || "Female" },
    { value: "other", label: t("options.genders.other") || "Other" },
  ];

  const religions = [
    { value: "hindu", label: t("options.religions.hindu") || "Hindu" },
    {
      value: "christian",
      label: t("options.religions.christian") || "Christian",
    },
    { value: "muslim", label: t("options.religions.muslim") || "Muslim" },
    { value: "others", label: t("options.religions.others") || "Others" },
  ];

  const motherTongues = [
    { value: "tamil", label: t("options.languages.tamil") || "Tamil" },
    { value: "telugu", label: t("options.languages.telugu") || "Telugu" },
    {
      value: "malayalam",
      label: t("options.languages.malayalam") || "Malayalam",
    },
    { value: "kannada", label: t("options.languages.kannada") || "Kannada" },
    { value: "hindi", label: t("options.languages.hindi") || "Hindi" },
    { value: "others", label: t("options.languages.others") || "Others" },
  ];

  const communities = [
    {
      value: "bc",
      label: "BC",
      full: t("options.communities.bc") || "Backward Class",
    },
    {
      value: "mbc",
      label: "MBC",
      full: t("options.communities.mbc") || "Most Backward",
    },
    {
      value: "fc",
      label: "FC",
      full: t("options.communities.fc") || "Forward Class",
    },
    {
      value: "sc",
      label: "SC",
      full: t("options.communities.sc") || "Scheduled Caste",
    },
    {
      value: "st",
      label: "ST",
      full: t("options.communities.st") || "Scheduled Tribe",
    },
    { value: "obc", label: "OBC", full: "Other Backward" },
  ];

  const idTypes = [
    {
      value: "aadhar",
      label: t("options.ids.aadhar") || "Aadhar Card",
      placeholder: "XXXX XXXX XXXX",
      maxLength: 12,
    },
    {
      value: "driving",
      label: t("options.ids.driving") || "Driving License",
      placeholder: "TN-00-0000-0000000",
      maxLength: 16,
    },
  ];

  // Handlers
  const handleChange = (name, value) => {
    Click();
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.gender && formData.age;
      case 2:
        return formData.district && formData.religion && formData.motherTongue;
      case 3:
        return (
          formData.community && formData.caste && formData.phone.length === 10
        );
      case 4:
        return formData.idType && formData.idNumber.length > 4 && agreed;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      playClick();
      setDirection("next");
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    Click();
    setDirection("back");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;
    setIsSubmitting(true);
    setError(null);
    playClick();

    try {
      const registrationData = {
        idType: formData.idType,
        idNumber: formData.idNumber,
        gender: formData.gender,
        age: formData.age,
        district: formData.district,
        religion: formData.religion,
        motherTongue: formData.motherTongue,
        community: formData.community,
        caste: formData.caste,
      };

      const result = await registerVoter(registrationData);

      if (result.success) {
        const id = result.data.tracker_id;
        setTrackerId(id);
        localStorage.setItem("tracker_id", id);
        setShowSuccess(true);
      } else {
        setError(result.error);
        setShowError(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessContinue = () => {
    setShowSuccess(false);
    localStorage.setItem("voter_status", "registered");
    navigate("/vote", { replace: true });
  };

  // Render Step Content
  const renderStepContent = () => {
    const animationClass =
      direction === "next" ? "animate-slideInRight" : "animate-slideInLeft";

    switch (step) {
      case 1:
        return (
          <div
            className={`space-y-4 lg:space-y-6 ${animationClass}`}
            key="step1"
          >
            <SectionTitle
              icon={<HiMiniUser className="text-gray-900 text-sm" />}
              title={t("sections.personal")}
              subtitle="Establish your identity"
            />

            {/* Name */}
            <div className="relative group">
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-wide mb-1.5 md:mb-2 block">
                {t("labels.fullName")}
              </label>
              <div className="relative bg-shade border border-white/20 md:px-4 py-2.5 md:py-3 px-3 group-hover:border-accet/30 transition-colors">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder={t("placeholders.fullName")}
                  className="w-full bg-transparent text-white font-body text-[12px] lg:text-[15px] capitalize outline-none placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-wide mb-1.5 md:mb-3 block">
                {t("labels.gender")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {genders.map((gender) => (
                  <button
                    key={gender.value}
                    onClick={() => handleChange("gender", gender.value)}
                    className={`py-2.5 px-2 md:p-4 border backdrop-blur-xl text-center transition-all duration-300 ${
                      formData.gender === gender.value
                        ? "bg-gradient-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    <span className="text-[9px] lg:text-[11px] font-heading uppercase tracking-widest">
                      {gender.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-wide mb-1.5 md:mb-3 block">
                {t("labels.ageGroup")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ageRanges.map((age) => (
                  <button
                    key={age.value}
                    onClick={() => handleChange("age", age.value)}
                    className={`py-2.5 md:py-3 px-2 border backdrop-blur-xl text-center transition-all duration-300 ${
                      formData.age === age.value
                        ? "bg-gradient-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    <span className="text-[10px] lg:text-[12px] font-heading tracking-wide">
                      {age.label}
                    </span>
                  </button>
                ))}
              </div>
              {formData.age === "below-18" && (
                <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 p-3 flex items-center gap-2">
                  <span className="text-sm">⚠️</span>
                  <p className="text-[8px] md:text-[10px] text-yellow-400 font-body">
                    {t("user_messages.ageWarning")}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div
            className={`space-y-4 lg:space-y-6 ${animationClass}`}
            key="step2"
          >
            <SectionTitle
              icon={<MdLocationOn className="text-gray-900 text-sm" />}
              title={t("sections.location")}
              subtitle="Map your background"
            />

            {/* District */}
            <div className="relative group">
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-wide mb-1.5 md:mb-2 block">
                {t("labels.district")}
              </label>
              <div
                onClick={() => {
                  Click();
                  setShowMap(true);
                }}
                className={`relative bg-shade border md:px-4 py-2.5 md:py-4 px-3 cursor-pointer transition-all flex justify-between items-center ${
                  formData.district
                    ? "border-accet/50"
                    : "border-white/20 hover:border-white/30"
                }`}
              >
                <span
                  className={
                    formData.district
                      ? "text-white font-medium text-[11px] lg:text-[14px]"
                      : "text-white/30 text-[10px] lg:text-[14px]"
                  }
                >
                  {formData.district || t("placeholders.district")}
                </span>
                <MdLocationOn className="text-accet text-[14px] lg:text-xl animate-pulse" />
              </div>
            </div>

            {/* Religion */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-widest mb-1.5 md:mb-3 block">
                {t("labels.religion")}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 lg:gap-3">
                {religions.map((religion) => (
                  <button
                    key={religion.value}
                    onClick={() => handleChange("religion", religion.value)}
                    className={`py-2.5 md:py-3 px-2 border backdrop-blur-xl text-center transition-all duration-300 ${
                      formData.religion === religion.value
                        ? "bg-gradient-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    <span className="text-[8px] lg:text-[10px] font-heading uppercase tracking-widest">
                      {religion.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mother Tongue */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-widest mb-1.5 md:mb-3 block">
                {t("labels.motherTongue")}
              </label>
              <div className="grid grid-cols-3 gap-2 lg:gap-3">
                {motherTongues.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleChange("motherTongue", lang.value)}
                    className={`py-2.5 md:py-3 px-2 border backdrop-blur-xl text-center transition-all duration-300 ${
                      formData.motherTongue === lang.value
                        ? "bg-gradient-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    <span className="text-[9px] lg:text-[11px] font-heading uppercase tracking-widest">
                      {lang.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div
            className={`space-y-4 lg:space-y-6 ${animationClass}`}
            key="step3"
          >
            <SectionTitle
              icon={<HiPhone className="text-gray-900 text-sm" />}
              title={t("sections.contact")}
              subtitle="Contact & Community details"
            />

            {/* Phone */}
            <div className="relative group">
              <label className="text-[8px] lg:text-[12px] text-accet font-bold font-heading uppercase tracking-widest mb-1.5 md:mb-2 block">
                {t("labels.phoneNumber")}
              </label>
              <div className="relative bg-shade border border-white/20 md:px-4 py-2.5 md:py-3 px-2 group-hover:border-accet/30 transition-colors">
                <div className="flex items-center gap-1 md:gap-3">
                  <span className="text-white/60 font-body text-sm py-1 px-1 md:px-2 text-[10px] md:text-[13px]">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      handleChange("phone", e.target.value.replace(/\D/g, ""))
                    }
                    placeholder={t("placeholders.phone")}
                    maxLength="10"
                    className="flex-1 bg-transparent text-white font-body text-[10px] lg:text-[14px] outline-none placeholder:text-white/30 tracking-wider"
                  />
                </div>
                {formData.phone && (
                  <div className="md:mt-2 flex items-center gap-2">
                    <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          formData.phone.length === 10
                            ? "bg-green-500"
                            : "bg-accet"
                        }`}
                        style={{
                          width: `${(formData.phone.length / 10) * 100}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-[7px] md:text-[9px] font-body ${
                        formData.phone.length === 10
                          ? "text-green-400"
                          : "text-white/40"
                      }`}
                    >
                      {formData.phone.length}/10
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Community */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-widest mb-1.5 md:mb-3 block">
                {t("labels.community")}
              </label>
              <div className="grid grid-cols-3 gap-2 lg:gap-3">
                {communities.map((community) => (
                  <button
                    key={community.value}
                    onClick={() => handleChange("community", community.value)}
                    className={`py-2.5 md:py-3 px-2 md:min-h-[70px] backdrop-blur-xl border text-center flex flex-col justify-center items-center transition-all duration-300 ${
                      formData.community === community.value
                        ? "bg-gradient-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 hover:border-white/30"
                    }`}
                  >
                    <span className="text-[9px] lg:text-[16px] font-heading font-bold text-white tracking-widest">
                      {community.label}
                    </span>
                    <span className="text-[7px] lg:text-[9px] font-body text-white/60 md:mt-1">
                      {community.full}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Caste */}
            <div className="relative group">
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-widest mb-1.5 md:mb-2 block">
                {t("labels.caste")}
              </label>
              <SearchableSelect
                value={formData.caste}
                onChange={(value) => handleChange("caste", value)}
                options={casteList}
                placeholder={t("placeholders.caste") || "Search your caste..."}
                loading={casteLoading}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div
            className={`space-y-4 lg:space-y-6 ${animationClass}`}
            key="step4"
          >
            <SectionTitle
              icon={<MdVerifiedUser className="text-gray-900 text-sm" />}
              title={t("sections.idVerification")}
              subtitle="Final verification step"
            />

            {/* ID Type */}
            <div>
              <label className="text-[8px] lg:text-[12px] font-bold text-accet font-heading uppercase tracking-widest mb-1.5 md:mb-3 block">
                {t("labels.idType")}
              </label>
              <div className="grid grid-cols-2 gap-1.5 lg:gap-3">
                {idTypes.map((id) => (
                  <button
                    key={id.value}
                    onClick={() => {
                      handleChange("idType", id.value);
                      setFormData((prev) => ({ ...prev, idNumber: "" }));
                    }}
                    className={`py-2.5 md:p-5 border backdrop-blur-xl text-center transition-all duration-300 ${
                      formData.idType === id.value
                        ? "bg-gradient-to-br from-accet/20 to-indigo-500/20 border-accet text-white shadow-lg shadow-accet/20"
                        : "bg-shade border-white/20 text-white hover:border-white/30"
                    }`}
                  >
                    <span className="text-[9px] lg:text-[11px] font-heading uppercase tracking-widest">
                      {id.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ID Number */}
            {formData.idType && (
              <div className="relative group animate-fadeIn">
                <label className="text-[9px] lg:text-[12px] text-accet font-bold font-heading uppercase tracking-wide mb-1 md:mb-2 block">
                  {formData.idType === "aadhar"
                    ? t("labels.aadharNumber")
                    : t("labels.dlNumber")}
                </label>
                <div className="relative bg-shade border border-white/20 md:px-4 py-2 md:py-3 px-3 group-hover:border-accet/30 transition-colors">
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => handleChange("idNumber", e.target.value)}
                    placeholder={
                      idTypes.find((id) => id.value === formData.idType)
                        ?.placeholder
                    }
                    maxLength={
                      idTypes.find((id) => id.value === formData.idType)
                        ?.maxLength
                    }
                    className="w-full bg-transparent text-white font-body text-[10px] md:text-[14px] outline-none placeholder:text-white/30 tracking-widest uppercase"
                  />
                </div>
              </div>
            )}

            {/* Privacy Notice */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 p-2 md:p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[8px] lg:text-[12px] text-green-400 font-heading uppercase tracking-wider">
                    {t("user_messages.dataSecure")}
                  </p>
                  <p className="text-[6px] lg:text-[10px] text-white/50 font-body mt-1">
                    {t("user_messages.encryptionNotice")}
                  </p>
                </div>
              </div>
            </div>

            {/* Agreement */}
            <div
              onClick={() => {
                Click();
                setAgreed(!agreed);
              }}
              className={`flex items-start gap-2 md:gap-3 p-2 md:p-4 border cursor-pointer transition-all ${
                agreed
                  ? "bg-accet/10 border-accet/50"
                  : "bg-shade border-white/20"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  agreed ? "bg-accet border-accet" : "border-white/30"
                }`}
              >
                {agreed && <MdCheck className="text-black text-sm" />}
              </div>
              <p className="text-[8px] lg:text-[11px] text-white/60 font-body leading-relaxed">
                {t("user_messages.agreement")}{" "}
                <span className="text-accet underline">
                  {t("user_messages.privacyPolicy")}
                </span>{" "}
                and{" "}
                <span className="text-accet underline">
                  {t("user_messages.terms")}
                </span>
                .
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ========================================
  // ✅ RENDER
  // ========================================
  return (
    <div className="bg-black">
      {/* ✅ MAIN CONTAINER */}
      <div
        ref={mainContainerRef}
        className="relative w-full overflow-hidden"
        style={{
          height: fixedHeight ? `${fixedHeight}px` : "100vh",
        }}
      >
        {/* ═══════════════════════════════════════════════
            ✅ FORM LAYER - BEHIND (z-index: 10)
        ═══════════════════════════════════════════════ */}
        <div
          ref={formLayerRef}
          className={`absolute inset-0 z-10 ${
            isRevealed ? "" : "pointer-events-none"
          }`}
          style={{
            height: fixedHeight ? `${fixedHeight}px` : "100vh",
            transformOrigin: "center center",
            willChange: "transform, opacity",
            opacity: 0, // ✅ Start hidden
            transform: "scale(0.2)", // ✅ Start small
          }}
        >
          <div className="lg:h-full w-full h-screen overflow-hidden lg:overflow-y-scroll">
            <div className="lg:min-h-screen py-8 lg:py-12">
              <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-center items-center mb-4 md:mb-6">
                  <div className="text-center">
                    <h1 className="text-xl lg:text-3xl font-heading uppercase font-black tracking-wide leading-6 text-transparent bg-gradient-to-r from-accet to-indigo-400 bg-clip-text">
                      {t("header.title")}
                    </h1>
                    <p className="text-[8px] lg:text-[13px] md:mt-1 font-medium text-white/40 font-body">
                      {t("header.subtitle")}
                    </p>
                  </div>
                </div>

                {/* Step Indicator */}
                <StepIndicator
                  currentStep={step}
                  totalSteps={totalSteps}
                  steps={steps}
                  subtitle={subtitle}
                />

                {/* Form Card */}
                <div className="lg:max-w-4xl mx-auto">
                  <div className="bg-shade/50 backdrop-blur-[2px] border border-white/10 rounded-xl p-4 lg:px-8 lg:py-6 lg:min-h-[450px] flex flex-col">
                    {/* Form Content */}
                    <div className="flex-1">{renderStepContent()}</div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-3 md:mt-8 pt-3 md:pt-6 border-t border-white/10">
                      <button
                        onClick={handleBack}
                        className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 text-[10px] lg:text-[12px] uppercase font-heading font-bold tracking-widest transition-all ${
                          step === 1
                            ? "opacity-0 pointer-events-none"
                            : "text-white/50 hover:text-white"
                        }`}
                      >
                        <HiArrowLeft /> {t("vote_messages.back") || "Back"}
                      </button>

                      {step < totalSteps ? (
                        <button
                          onClick={handleNext}
                          disabled={!isStepValid()}
                          className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 font-heading text-[10px] lg:text-[12px] tracking-wider uppercase font-bold transition-all duration-300 ${
                            isStepValid()
                              ? "bg-gradient-to-r from-accet/80 to-accet text-white hover:shadow-lg hover:shadow-accet/30"
                              : "bg-white/5 text-white/30 cursor-not-allowed"
                          }`}
                        >
                          {t("vote_messages.next") || "Continue"}{" "}
                          <HiArrowRight />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={!isStepValid() || isSubmitting}
                          className={`flex items-center gap-2 md:px-8 px-4 md:py-3 py-2.5 font-heading text-[11px] lg:text-[12px] tracking-wider uppercase font-bold transition-all duration-300 ${
                            isStepValid() && !isSubmitting
                              ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30"
                              : "bg-white/5 text-white/30 cursor-not-allowed"
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <MdVerifiedUser className="text-[12px] md:text-base" />
                              {t("vote_messages.finish") || "Proceed to Vote"}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="text-[7px] lg:text-[10px] tracking-widest text-white/40 flex justify-between items-center mt-2 md:mt-3 px-2 font-heading">
                    <button
                      onClick={() => navigate("/privacy")}
                      className="hover:text-white transition-colors"
                    >
                      {t("user_messages.privacyPolicy")}
                    </button>
                    <button
                      onClick={() => navigate("/terms")}
                      className="hover:text-white transition-colors"
                    >
                      {t("user_messages.terms")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            ✅ IMAGE LAYER - FRONT (z-index: 20)
        ═══════════════════════════════════════════════ */}
        <div
          ref={imageLayerRef}
          className={`absolute bottom-0 inset-0 z-20 overflow-hidden ${
            isRevealed ? "pointer-events-none" : ""
          }`}
          style={{
            height: fixedHeight ? `${fixedHeight}px` : "100vh",
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
        >
          {/* Background Image */}
          <img
            src="https://res.cloudinary.com/dfgyjzm7c/image/upload/v1768047744/ChatGPT_Image_Jan_10_2026_05_39_30_PM_uilkls.png"
            alt="Hero Background"
            className="w-full object-fit"
            style={{ height: fixedHeight ? `${fixedHeight}px` : "100vh" }}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/60" />

          {/* ✅ CLICK INDICATOR (Changed from ScrollIndicator) */}
          {!isRevealed && (
            <ClickIndicator
              onClick={handleContinueClick}
              isAnimating={isAnimating}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showMap && (
        <DistrictMapPicker
          currentDistrict={formData.district}
          onClose={() => setShowMap(false)}
          onConfirm={(selectedDistrict) => {
            handleChange("district", selectedDistrict);
            setShowMap(false);
          }}
        />
      )}

      {showError && (
        <ErrorModal message={error} onClose={() => setShowError(false)} />
      )}
      {showSuccess && (
        <SuccessModal
          trackerId={trackerId}
          onContinue={handleSuccessContinue}
        />
      )}

      {/* ✅ ANIMATIONS */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserDetails;