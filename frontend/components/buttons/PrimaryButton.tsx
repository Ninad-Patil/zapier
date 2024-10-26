import React, { ReactNode } from "react";

function PrimaryButton({
  children,
  onClick,
  size = "small",
}: {
  children: ReactNode;
  onClick: () => void;
  size?: "small" | "big";
}) {
  return (
    <div
      onClick={onClick}
      className={`${
        size === "small" ? "text-sm px-8 pt-2" : "text-xl px-10 py-4"
      } bg-amber-700 text-white rounded-full hover:shadow-md cursor-pointer`}
    >
      {children}
    </div>
  );
}

export default PrimaryButton;