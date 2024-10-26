"use client";
import React from "react";
import PrimaryButton from "./buttons/PrimaryButton";
import SecondaryButton from "./buttons/SecondaryButton";

function Hero() {
  return (
    <div>
      <div className="flex justify-center">
        <div className="pt-8 max-w-xl  text-5xl font-semibold text-center">
          Automate as fast as you can
        </div>
      </div>
      <div className="flex justify-center pt-4">
        <div className="pt-8 max-w-2xl  text-xl font-normal text-center">
          Turn chaos into smooth operations by automating workflows yourself—no
          developers, no IT tickets, no delays. The only limit is your
          imagination.
        </div>
      </div>
      <div className="flex justify-center pt-4">
        <div className="flex gap-4">
          <PrimaryButton onClick={() => {}} size="big">
            Get Started Free
          </PrimaryButton>
          <SecondaryButton onClick={() => {}} size="big">
            Contact Sales
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

export default Hero;
