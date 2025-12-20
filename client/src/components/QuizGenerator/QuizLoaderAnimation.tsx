import { motion } from "framer-motion";

export const QuizLoaderAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <motion.span
        className="text-2xl font-extrabold bg-blue-900 bg-clip-text text-transparent select-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Generujemy twój quiz...
      </motion.span>

      <div className="flex space-x-3">
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="w-5 h-5 rounded-full bg-blue-900 shadow-md"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 1, 0.6],
              y: [0, -6, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        ))}
      </div>
    </div>
  );
};
