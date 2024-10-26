import React, { ReactNode } from "react";

function LinkButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      className="rounded-full font-light text-sm px-2 py-2 cursor-pointer hover:bg-slate-200"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default LinkButton;
