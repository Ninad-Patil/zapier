"use client";
import React from "react";
import LinkButton from "./buttons/LinkButton";
import { useRouter } from "next/navigation";
import PrimaryButton from "./buttons/PrimaryButton";

function Appbar() {
  const router = useRouter();
  return (
    <div className="flex border-b justify-between p-4">
      <div className="flex justify-center items-center text-xl font-extrabold">
        _Zapier
      </div>
      <div className="flex">
        <div className="pr-2">
          <LinkButton onClick={() => {}}>Contact Sales</LinkButton>
        </div>
        <div className="pr-2">
          <LinkButton
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </LinkButton>
        </div>

        <PrimaryButton
          onClick={() => {
            router.push("/signup");
          }}
        >
          Signup
        </PrimaryButton>
      </div>
    </div>
  );
}

export default Appbar;
