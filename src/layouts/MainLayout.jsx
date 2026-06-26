import { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import BackToTop from "../components/BackToTop/BackToTop";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <>
      <LoadingScreen />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={pageVariants}
          style={{ position: "relative" }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <BackToTop />
    </>
  );
};

export default MainLayout;
