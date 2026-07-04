import React, { useState, useEffect } from "react";
import { 
  Wifi, 
  Battery, 
  Clock, 
  Power, 
  Volume2, 
  Volume1, 
  HelpCircle, 
  Maximize2 
} from "lucide-react";
import { playClickSound } from "../utils/audio";

interface AndroidEmulatorProps {
  children: React.ReactNode;
}

export function AndroidEmulator({ children }: AndroidEmulatorProps) {
  const [time, setTime] = useState("");
  const [isScreenOn, setIsScreenOn] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(87);

  // Update time for the top status bar dynamically
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  // Update battery level slowly over time
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => (prev > 5 ? prev - 1 : 100));
    }, 1000 * 120);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePower = () => {
    playClickSound();
    setIsScreenOn(!isScreenOn);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none relative" id="android-emulator-container">
      
      {/* Physical Phone Case Wrapper */}
      <div className="relative mx-auto w-full max-w-[395px] h-[780px] bg-[#1a1210] rounded-[52px] p-3.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_0_12px_#2c1e1a,0_0_0_14px_#3d2b25,0_20px_40px_rgba(0,0,0,0.9)] border border-orange-950/20">
        
        {/* Left Side Buttons (Volume keys) */}
        <div className="absolute -left-3.5 top-36 w-1 h-14 bg-[#2c1e1a] rounded-l border-y border-l border-orange-950/40" />
        <div className="absolute -left-3.5 top-56 w-1 h-20 bg-[#2c1e1a] rounded-l border-y border-l border-orange-950/40" />

        {/* Right Side Button (Power button) */}
        <button 
          onClick={handleTogglePower}
          className="absolute -right-3.5 top-44 w-1.5 h-14 bg-[#df5a3e] rounded-r border-y border-r border-orange-950/40 cursor-pointer hover:brightness-110 active:translate-x-[-1px] transition-all"
          title="Activar/Desactivar pantalla"
          id="emulator-power-button"
        />

        {/* Dynamic Screen Bezel Glass */}
        <div className="relative w-full h-full bg-black rounded-[38px] overflow-hidden border-2 border-orange-950/30 flex flex-col shadow-inner">
          
          {/* Top Notch / Camera Punch-hole */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 h-5 w-24 bg-black rounded-b-xl z-50 flex items-center justify-center">
            {/* Camera lens */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#0a0706] border border-[#231513]/30 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#1e3a8a]/40" />
            </div>
            {/* Speaker grill */}
            <div className="w-6 h-1 bg-[#1a110f] rounded-full ml-3 border-t border-[#3c2a26]" />
          </div>

          {/* SCREEN CONTENT IF POWER IS ON */}
          {isScreenOn ? (
            <div className="w-full h-full flex flex-col relative select-none animate-fade-in" id="android-screen-on">
              
              {/* Android Top Status Bar */}
              <div className="h-7 bg-[#2c1b18] text-[#e6c280] text-[10px] font-mono px-6 flex items-center justify-between select-none shrink-0 z-40 border-b border-orange-950/10">
                <div className="flex items-center gap-1.5 font-bold font-sans">
                  <span>09:41</span>
                  <span className="text-[9px] text-[#b09893] bg-[#df5a3e]/10 border border-[#df5a3e]/30 px-1 py-0.2 rounded font-mono">
                    GÓNDOR 5G
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold font-sans">{batteryLevel}%</span>
                  <div className="relative flex items-center">
                    <Battery className="w-4 h-4 text-[#e6c280]" />
                    <div 
                      className="absolute left-[3px] top-[4.5px] h-1.5 rounded-xs bg-[#e6c280]"
                      style={{ width: `${(batteryLevel / 100) * 8}px` }}
                    />
                  </div>
                </div>
              </div>

              {/* Main OS App Canvas */}
              <div className="flex-1 min-h-0 w-full relative">
                {children}
              </div>

              {/* Android Bottom Navigation Pill Bar */}
              <div className="h-8 bg-[#231715] flex items-center justify-center shrink-0 z-40 border-t border-orange-950/10">
                {/* Simulated Android Gestural Navigation Pill */}
                <div className="w-28 h-1 bg-[#5c4743] rounded-full opacity-60" />
              </div>

            </div>
          ) : (
            /* BLACK SCREEN SLEEP STATE */
            <div 
              onClick={handleTogglePower}
              className="w-full h-full bg-black flex flex-col items-center justify-center text-center p-8 cursor-pointer select-none"
              id="android-screen-off"
            >
              <Power className="w-12 h-12 text-[#df5a3e]/30 animate-pulse mb-3" />
              <p className="text-[#3c2a26] text-xs font-mono tracking-widest uppercase">
                Dispositiu en repòs
              </p>
              <p className="text-[#2c1e1a] text-[10px] mt-1 font-sans">
                Fes clic al botó lateral o toca la pantalla per activar
              </p>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
}
