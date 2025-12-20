import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import InstallButton from "../components/PWA/InstallButton";

export default function Home() {
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        Saylo
      </motion.h1>

      <p>Treine comunicação com lições rápidas e personagens falantes.</p>

      <Link to="/lesson/1">Começar lição 1 →</Link>


      <br />
      <br />
      <InstallButton />
    </div>
  );
}
