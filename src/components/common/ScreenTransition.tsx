import { FC, ReactNode } from "react";
import { Screen } from "./constants";

interface ScreenTransitionProps {
  children: ReactNode;
  currentScreen: Screen;
}

/**
 * ScreenTransition Component
 * Adds slide animation when transitioning between screens
 */
export const ScreenTransition: FC<ScreenTransitionProps> = ({
  children,
  currentScreen,
}) => {
  return (
    <div
      key={currentScreen}
      className="w-full h-full flex flex-col"
      style={{
        animation: "slideIn 0.3s ease-out forwards",
      }}
    >
      {children}
    </div>
  );
};
