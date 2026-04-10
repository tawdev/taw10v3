"use client";

import React from "react";
import { LazyMotion, domAnimation } from "framer-motion";

// Components
import Hero from "@/components/sections/Hero";
import Expertise from "@/components/sections/Expertise";
import Pricing from "@/components/sections/Pricing";
import Steps from "@/components/sections/Steps";
import Leadership from "@/components/sections/Leadership";
import Team from "@/components/sections/Team";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <LazyMotion features={domAnimation}>
      <main>
        <Hero />
        <Expertise />
        <Pricing />
        <Steps />
        <Leadership />
        <Team />
        <Contact />
      </main>
    </LazyMotion>
  );
}
