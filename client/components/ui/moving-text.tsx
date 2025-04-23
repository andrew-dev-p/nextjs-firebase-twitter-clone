import { motion } from "framer-motion";
import React from "react";

const MovingText = ({ text }: { text: string }) => {
  return (
    <div className="text-center mb-2 font-bold text-lg bg-gradient-to-r from-blue-700 to-blue-300 bg-clip-text text-transparent flex justify-center gap-0.5">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 0 }}
          animate={{ y: [0, -1, 0] }}
          transition={{
            delay: i * 0.1,
            duration: 0.75,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

export default MovingText;
