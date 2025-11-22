import React, { FC } from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

/**
 * PhoneFrame Component
 * Reusable mobile device mockup frame with status bar
 */
export const PhoneFrame: FC<PhoneFrameProps> = ({ children }) => (
  <div className="relative mx-auto">
    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-30"></div>
    <div className="relative bg-gray-900 rounded-3xl shadow-2xl w-96 h-[720px] overflow-hidden border-8 border-gray-800 flex flex-col">
      {/* Phone notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
      
      {/* Status bar */}
      <div className="bg-gray-900 px-6 py-3 flex justify-between text-white text-xs z-10 flex-shrink-0">
        <span className="font-semibold">9:41</span>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-white rounded-sm"></div>
            <div className="w-1 h-3 bg-white rounded-sm opacity-75"></div>
            <div className="w-1 h-3 bg-white rounded-sm opacity-50"></div>
            <div className="w-1 h-3 bg-white rounded-sm opacity-25"></div>
          </div>
          <span className="font-semibold">100%</span>
        </div>
      </div>
      
      {/* Screen content */}
      <div className="flex-1 overflow-y-auto bg-white">{children}</div>
    </div>
  </div>
);
