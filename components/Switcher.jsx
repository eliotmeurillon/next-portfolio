import { useState } from "react";
import useDarkSide from "../hooks/useDarkSide";
import { motion } from "framer-motion";
import { BsFillMoonFill } from "react-icons/bs";
import { HiOutlineSun } from "react-icons/hi";

export default function Switcher() {
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );

  const toggleDarkMode = () => {
    setTheme(darkSide ? "light" : "dark");
    setDarkSide(!darkSide);
  };

  return (
    <motion.div
      size={30}
      whileTap={{ scale: 0.9 }}
      className="bg-green-500 rounded-full p-1"
    >
      {darkSide ? (
        <motion.div className="" animate={{ rotate: 360 }}>
          <BsFillMoonFill color="white" onClick={toggleDarkMode} />
        </motion.div>
      ) : (
        <motion.div animate={{ rotate: 0 }}>
          <HiOutlineSun color="white" onClick={toggleDarkMode} />
        </motion.div>
      )}
    </motion.div>
  );
}