import { FaGithub, FaRocket } from "react-icons/fa";
import "../styles/Header.css";

export default function Header() {
  return (
    <header className="header-top">
      <button>
        <a href="https://github.com/horaciosdev/react-timer" target="_blank">
          <FaGithub /> GitHub
        </a>
      </button>{" "}
      <button>
        <a href="https://my-portfolio-ten-navy.vercel.app/" target="_blank">
          <FaRocket /> Other Projects
        </a>
      </button>
    </header>
  );
}
