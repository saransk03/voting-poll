import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const QnA = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCandidate = location.state?.candidate;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: 1,
      question: t("qna.q1.question"),
      type: "text",
      options: [
        { id: "a", text: t("qna.q1.options.a") },
        { id: "b", text: t("qna.q1.options.b") },
        { id: "c", text: t("qna.q1.options.c") },
        { id: "d", text: t("qna.q1.options.d") },
        { id: "e", text: t("qna.q1.options.e") },
      ],
    },
    {
      id: 2,
      question: t("qna.q2.question"),
      type: "text",
      options: [
        { id: "a", text: t("qna.q2.options.a") },
        { id: "b", text: t("qna.q2.options.b") },
        { id: "c", text: t("qna.q2.options.c") },
        { id: "d", text: t("qna.q2.options.d") },
        { id: "e", text: t("qna.q2.options.e") },
      ],
    },
    {
      id: 3,
      question: t("qna.q3.question"),
      type: "text",
      options: [
        { id: "a", text: t("qna.q3.options.a") },
        { id: "b", text: t("qna.q3.options.b") },
        { id: "c", text: t("qna.q3.options.c") },
        { id: "d", text: t("qna.q3.options.d") },
        { id: "e", text: t("qna.q3.options.e") },
        { id: "f", text: t("qna.q3.options.f") },
        { id: "g", text: t("qna.q3.options.g") },
        { id: "h", text: t("qna.q3.options.h") },
        { id: "i", text: t("qna.q3.options.i") },
        { id: "j", text: t("qna.q3.options.j") },
      ],
    },
    {
      id: 4,
      question: t("qna.q4.question"),
      type: "text",
      options: [
        { id: "a", text: t("qna.q4.options.a") },
        { id: "b", text: t("qna.q4.options.b") },
        { id: "c", text: t("qna.q4.options.c") },
        { id: "d", text: t("qna.q4.options.d") },
        { id: "e", text: t("qna.q4.options.e") },
        { id: "f", text: t("qna.q4.options.f") },
        { id: "g", text: t("qna.q4.options.g") },
      ],
    },
    {
      id: 5,
      question: t("qna.q5.question"),
      type: "image",
      options: [
        {
          id: "a",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/dmk-logo-png_seeklogo-411320.png",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/vck.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/Indian_National_Congress_hand_logo.png",
          ],
        },
        {
          id: "b",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.png",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/bjp-logo-png.png",
          ],
        },
        {
          id: "c",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.png",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.jpg",
          ],
        },
        {
          id: "d",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/pmk.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/Indian_National_Congress_hand_logo.png",
          ],
        },
        {
          id: "e",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.png",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/pmk.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/1118412_desiya_murpokku_dravida_kazhagam_logo.jpg",
          ],
        },
        {
          id: "f",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/pmk.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/1118412_desiya_murpokku_dravida_kazhagam_logo.jpg",
          ],
        },
        {
          id: "g",
          images: [
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/images.jpg",
            "https://ik.imagekit.io/saransk03/Voting%20Poll/Parties/Indian_National_Congress_hand_logo.png",
          ],
        },
        {
          id: "h",
          text: "No alliance",
          images: [], // Empty array for text-only option
        },
      ],
    },
  ];

  useEffect(() => {
    if (!selectedCandidate) {
      navigate("/vote", { replace: true });
    }
  }, [selectedCandidate, navigate]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  const handleOptionSelect = (optionId) => {
    if (isAnimating) return;
    setSelectedOption(optionId);
    setShowError(false);
  };

  const handleNext = () => {
    if (!selectedOption) {
      setShowError(true);
      return;
    }

    if (isAnimating) return;

    setIsAnimating(true);
    setAnswers((prev) => ({
      ...prev,
      [question.id]: selectedOption,
    }));

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(answers[questions[currentQuestion + 1]?.id] || null);
      } else {
        setIsCompleted(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      setIsAnimating(false);
      setShowError(false);
    }, 400);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0 && !isAnimating) {
      setIsAnimating(true);
      setShowError(false);
      setTimeout(() => {
        setCurrentQuestion((prev) => prev - 1);
        setSelectedOption(answers[questions[currentQuestion - 1].id] || null);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const finalData = {
      candidate: selectedCandidate,
      answers: answers,
      submittedAt: new Date().toISOString(),
    };

    console.log("Final Vote Data:", finalData);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(`Vote submitted successfully for ${selectedCandidate.name}!`);
      navigate("/vote", { replace: true });
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state if no candidate
  if (!selectedCandidate) {
    return (
      <div className="min-h-[100dvh] h-[100dvh] bg-black flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-accet mx-auto mb-4"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-white/50">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (isCompleted) {
    return (
      <div className="min-h-dvh h-dvh bg-black relative flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-32 w-96 h-96 bg-accet/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 -right-32 w-96 h-96 bg-[#017474]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accet/10 rounded-full blur-[150px]" />
        </div>

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-5%`,
                  backgroundColor: ["#00ffc8", "#017474", "#00d4aa", "#ffffff"][
                    Math.floor(Math.random() * 4)
                  ],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        )}

        {/* Completion Card */}
        <div className="relative z-10 w-[90%] max-w-md mx-auto px-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-accet via-[#017474] to-accet rounded-3xl blur-lg opacity-50 animate-pulse" />

          <div className="relative bg-gradient-to-b from-accet/10 via-black/90 to-black/95 border-2 border-accet/50 rounded-3xl p-6 sm:p-8 text-center">
            {/* Success Icon */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-accet/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-accet to-[#017474] rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-black"
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
              <div className="absolute -inset-2 border-2 border-accet/30 rounded-full animate-ping" />
              <div className="absolute -inset-4 border border-accet/20 rounded-full animate-pulse" />
            </div>

            <h1 className="text-[24px] sm:text-[28px] font-heading uppercase font-black tracking-wider text-transparent bg-gradient-to-r from-accet via-[#00ffcc] to-[#017474] bg-clip-text mb-2">
              Survey Complete!
            </h1>
            <h2 className="text-[14px] sm:text-[16px] font-tamil font-bold text-transparent bg-gradient-to-r from-[#017474] to-accet bg-clip-text mb-4">
              கருத்துக்கணிப்பு முடிந்தது!
            </h2>

            <p className="text-white/60 text-xs sm:text-sm mb-6">
              Thank you for completing the survey. Click submit to confirm your
              vote.
            </p>

            {/* Candidate Info */}
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-accet/20">
              <p className="text-white/40 text-xs mb-2">Your vote for</p>
              <div className="flex items-center justify-center gap-3">
                <img
                  src={selectedCandidate.party_logo}
                  alt={selectedCandidate.party}
                  className="w-12 h-12 rounded-full border-2 border-accet/40 object-cover"
                />
                <div className="text-left">
                  <h3 className="text-accet font-heading font-bold text-lg uppercase tracking-wide">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-white/50 text-xs">
                    {selectedCandidate.party} | {selectedCandidate.tamil_party}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-accet/10 rounded-lg px-4 py-2 border border-accet/30">
                <p className="text-accet font-bold text-xl">
                  {questions.length}
                </p>
                <p className="text-white/40 text-xs">Questions</p>
              </div>
              <div className="bg-accet/10 rounded-lg px-4 py-2 border border-accet/30">
                <p className="text-accet font-bold text-xl">
                  {Object.keys(answers).length}
                </p>
                <p className="text-white/40 text-xs">Answered</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl uppercase font-black tracking-widest text-[13px] font-heading bg-gradient-to-r from-accet via-[#00d4aa] to-[#017474] text-black hover:shadow-[0_0_40px_rgba(0,255,200,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Confirm & Submit Vote</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        <style>{`
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          .animate-confetti {
            animation: confetti 3s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  // Helper function to render images with + sign
  const renderAllianceImages = (images, isSelected) => {
    return (
      <div className="flex items-center justify-start gap-2 sm:gap-2 flex-wrap">
        {images.map((img, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                isSelected
                  ? "border-accet shadow-[0_0_10px_rgba(0,255,200,0.5)]"
                  : "border-white/20 group-hover:border-accet/50"
              }`}
            >
              <img
                src={img}
                alt={`Party ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/50x50?text=Logo";
                }}
              />
            </div>

            {/* Plus Sign (not after last image) */}
            {idx < images.length - 1 && (
              <span
                className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${
                  isSelected ? "text-accet" : "text-white/50"
                }`}
              >
                +
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-dvh bg-black relative">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-accet/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-[#017474]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-accet/5 rounded-full blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 200, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 255, 200, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="h-full w-full relative z-10 flex flex-col">
        <div className="flex-1 flex flex-col py-4 px-4 min-h-0">
          {/* Header with Candidate Info */}
          <div className="shrink-0 mb-4 mt-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img
                src={selectedCandidate.party_logo}
                alt={selectedCandidate.party}
                className="w-8 h-8 rounded-full border border-accet/40 object-cover"
              />
              <div className="bg-accet/10 border border-accet/30 rounded-full px-3 py-1">
                <span className="text-accet text-[10px] font-medium">
                  {t("messages.votingFor")}{" "}
                  <span className="font-bold">{selectedCandidate.name}</span>
                </span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="relative max-w-md mx-auto mt-4">
              {/* Step Indicators */}
              <div className="flex justify-between items-center mb-2 px-1">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center justify-center transition-all duration-500 ${
                      index <= currentQuestion
                        ? "scale-100"
                        : "scale-75 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-500 ${
                        index < currentQuestion
                          ? "bg-gradient-to-br from-accet to-[#017474] text-black"
                          : index === currentQuestion
                          ? "bg-accet/20 border-2 border-accet text-accet"
                          : "bg-white/5 border border-white/20 text-white/30"
                      }`}
                    >
                      {index < currentQuestion ? (
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
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
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index === currentQuestion && (
                      <div className="absolute inset-0 bg-accet/30 rounded-full animate-ping" />
                    )}
                  </div>
                ))}
              </div>

              {/* Progress Line */}
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accet via-[#00d4aa] to-[#017474] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Question Counter */}
              <div className="flex justify-between items-center mt-2 text-[10px]">
                <span className="text-white/40">
                  {t("messages.questionCounter")} {currentQuestion + 1}{" "}
                  {t("messages.of")} {questions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="flex-1 min-h-0 flex flex-col justify-center">
            <div
              className={`transition-all duration-400 mx-auto w-full max-w-2xl ${
                isAnimating
                  ? "opacity-0 translate-x-10"
                  : "opacity-100 translate-x-0"
              }`}
            >
              {/* Question */}
              <div className="text-center mb-5">
                <p className="text-[14px] sm:text-[16px] font-heading font-bold text-accet">
                  {question.question}
                </p>
              </div>

              {/* Error Message */}
              {showError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-center animate-shake">
                  <p className="text-red-400 text-sm font-medium flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Please select an option to continue
                  </p>
                </div>
              )}

              {/* Options Grid */}
              <div
                className={`grid gap-2 sm:gap-3 ${
                  question.type === "image"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {question.options.map((option, index) => {
                  const isSelected = selectedOption === option.id;
                  const hasImages = option.images && option.images.length > 0;

                  return (
                    <button
                      key={`${option.id}-${index}`}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`group relative overflow-hidden transition-all duration-300 transform rounded-xl ${
                        isSelected
                          ? "scale-[1.02] bg-gradient-to-br from-accet/20 via-accet/10 to-transparent border-2 border-accet shadow-[0_0_20px_rgba(0,255,200,0.3)]"
                          : `bg-white/5 border ${
                              showError
                                ? "border-red-500/30"
                                : "border-white/10"
                            } hover:border-accet/40 hover:bg-white/10 active:scale-[0.98]`
                      } ${
                        question.type === "image"
                          ? "px-3 py-4 sm:px-4 sm:py-5"
                          : "px-4 py-3 sm:p-4"
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {/* Selection Glow Effect */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-accet/10 via-transparent to-accet/10 animate-pulse" />
                      )}

                      <div className="relative flex items-center justify-between gap-3">
                        {/* IMAGE TYPE - Alliance Logos */}
                        {question.type === "image" && hasImages ? (
                          <>
                            {/* Alliance Images */}
                            <div className="flex-1">
                              {renderAllianceImages(option.images, isSelected)}
                            </div>

                            {/* Selection Indicator */}
                            <div
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                                isSelected
                                  ? "bg-accet scale-100"
                                  : "bg-white/10 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                              }`}
                            >
                              {isSelected ? (
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
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-white/30" />
                              )}
                            </div>
                          </>
                        ) : question.type === "image" && option.text ? (
                          /* Text option in image question (like "No alliance") */
                          <>
                            <div className="flex-1 flex items-center justify-start">
                              
                                <p
                                  className={`font-heading font-normal text-sm sm:text-base transition-colors duration-300 ${
                                    isSelected ? "text-accet" : "text-white/70"
                                  }`}
                                >
                                  {option.text}
                                </p>
                              
                            </div>

                            {/* Selection Indicator */}
                            <div
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                                isSelected
                                  ? "bg-accet scale-100"
                                  : "bg-white/10 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                              }`}
                            >
                              {isSelected ? (
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
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-white/30" />
                              )}
                            </div>
                          </>
                        ) : (
                          /* TEXT TYPE OPTION */
                          <>
                            <div className="flex-1 text-left">
                              <p
                                className={`font-heading capitalize font-medium tracking-wide text-[13px] sm:text-[14px] transition-colors duration-300 ${
                                  isSelected
                                    ? "text-accet"
                                    : "text-white/90 group-hover:text-white"
                                }`}
                              >
                                {option.text}
                              </p>
                            </div>

                            {/* Checkbox/Radio indicator */}
                            <div
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                                isSelected
                                  ? "bg-accet scale-100"
                                  : "bg-white/10 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                              }`}
                            >
                              {isSelected ? (
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-black"
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
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Shimmer Effect on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="shrink-0 flex items-center justify-between gap-4 mt-4 max-w-lg mx-auto w-full">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                currentQuestion === 0
                  ? "bg-white/5 text-white/20 cursor-not-allowed"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/30"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">{t("messages.back")}</span>
            </button>

            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                selectedOption
                  ? "bg-gradient-to-r from-accet via-[#00d4aa] to-[#017474] text-black hover:shadow-[0_0_30px_rgba(0,255,200,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gradient-to-r from-accet/50 to-[#017474]/50 text-black/70"
              }`}
            >
              <span>
                {currentQuestion === questions.length - 1
                  ? t("messages.finish")
                  : t("messages.next")}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default QnA;