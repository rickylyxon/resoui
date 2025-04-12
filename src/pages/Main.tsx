import React, { useRef } from "react";
import About from "./About";
import Event from "./Events";
import Home from "./Home";

const Main = () => {
  const eventSectionRef = useRef<HTMLDivElement>(null);
  const homeSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <section id="home" ref={homeSectionRef}>
        <Home scrollToEvents={() => scrollToSection(eventSectionRef)} />
      </section>
      <section id="event" ref={eventSectionRef}>
        <Event />
      </section>
      <section id="about">
        <About />
      </section>
    </div>
  );
};

export default Main;


