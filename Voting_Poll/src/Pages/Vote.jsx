import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SwiperCard from "../Components/SwiperCard";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav"
import { useTranslation } from "react-i18next";


const Vote = () => {
    const {t} = useTranslation()
    const [playClick] = useSound(scifi);
    const navigate = useNavigate();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isVoting, setIsVoting] = useState(false);

   const handleVote = () => {
    if (!selectedCandidate) return;
    
    setIsVoting(true);
    playClick()
    setTimeout(() => {
      navigate("/survey", { 
        state: { 
          candidate: selectedCandidate 
        } 
      });
    }, 500);
  };


  return (
    <div className="h-dvh bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-accet/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-[#017474]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accet/5 rounded-full blur-[150px]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 200, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 255, 200, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accet/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Container - NO overflow-hidden here */}
      <div className="container mx-auto relative z-10">
        <div className="w-full mx-auto h-dvh relative flex flex-col justify-between py-4">
          
          {/* Enhanced Header */}
          <div className="flex justify-center items-start z-20 px-4">
            <div className="relative">          
              <div className="text-center">               
                <h1 className="text-[18px] font-heading uppercase font-black tracking-wider leading-5.5 text-transparent bg-gradient-to-r from-accet via-accet/80 to-[#017474] bg-clip-text drop-shadow-[0_0_30px_rgba(0,255,200,0.3)]">
                 {t('vote.title')}
                </h1>
              </div>
            </div>
          </div>

          {/* Main Content - Added padding for party logo */}
          <div className="w-full mx-auto flex flex-col justify-center items-center">
            <SwiperCard 
              selectedCandidate={selectedCandidate}
              setSelectedCandidate={setSelectedCandidate}
            />
          </div>

          {/* Vote Button */}
          <div className="flex justify-center items-center flex-col relative px-4">
            {/* Button Glow */}
            <div className={`absolute -inset-2 bg-gradient-to-r from-accet to-[#017474] rounded-2xl blur-lg transition-all duration-500 ${
              selectedCandidate ? 'opacity-20' : 'opacity-0'
            }`} />
            
            <button 
              onClick={handleVote}
              disabled={!selectedCandidate || isVoting}
              className={`relative w-[95%] sm:w-80 py-3 rounded uppercase font-bold tracking-widest text-[12px] font-heading overflow-hidden transition-all duration-500 ${
                selectedCandidate 
                  ? 'bg-linear-to-r from-accet via-[#00d4aa] to-[#017474] text-black hover:shadow-[0_0_40px_rgba(0,255,200,0.4)] hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-linear-to-r from-white/10 to-white/5 text-white/30 cursor-not-allowed border border-white/10'
              }`}
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
              
              {/* Button Content */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isVoting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{t('vote.submitting')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('vote.castVote')}</span>
                  </>
                )}
              </span>
            </button>
            
            {/* Help Text */}
            <p className={`text-center text-[8px] mt-2 transition-all duration-300 ${
              selectedCandidate ? 'text-accet/60' : 'text-white/40'
            }`}>
              {selectedCandidate 
                ? `✓ ${selectedCandidate.name} ${t('vote.selectedSuffix')}`  
                : t('vote.instruction')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Vote;