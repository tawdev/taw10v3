"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices mapping fine-pointer
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Triggers if hovering over an interactive element
      if (
        target.closest("a") || 
        target.closest("button") || 
        target.closest("input") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Use state to detect mobile hiding early
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      scale: 1,
      backgroundColor: "rgba(218, 176, 85, 0.5)",
      border: "1px solid rgba(218, 176, 85, 0)",
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 1,
      backgroundColor: "rgba(218, 176, 85, 0.1)",
      border: "1px solid rgba(218, 176, 85, 1)",
      height: 48,
      width: 48,
    },
    click: {
      scale: 0.8,
      backgroundColor: "rgba(218, 176, 85, 1)",
    }
  };

  return (
    <>
      {/* Small dot following exactly */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[99999]"
        variants={variants}
        animate={isClicking ? "click" : isHovering ? "hover" : "default"}
        transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.5 }}
      />
    </>
  );
}
