import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ behavior = "auto" }) {
  const { pathname } = useLocation();

  // Use useLayoutEffect for synchronous scroll
  useLayoutEffect(() => {
    // Immediate scroll for instant feedback
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  // Use useEffect for smooth scroll
  useEffect(() => {
    if (behavior === "smooth") {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      });
    }
  }, [pathname, behavior]);

  return null;
}