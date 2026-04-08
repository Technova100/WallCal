import WallCal from "./components/WallCal";
import SkyBackground from "./components/SkyBackground";
import DigitalClock from "./components/DigitalClock";
import { ThemeProvider } from "./components/ThemeContext";

export default function Home() {
  return (
    <ThemeProvider>
      <main className="relative flex h-dvh w-full max-w-7xl justify-center overflow-hidden md:overflow-visible">
        <SkyBackground />
        <DigitalClock />
        {/* Standalone rope for mobile — outside the transform context so fixed positioning works */}
        <div className="mobile-rope" />
        <div className="calendar-rope relative z-10 mx-auto mt-8 flex h-[calc(100dvh-4.25rem)] w-full max-w-240 flex-col justify-start pb-3 animate-hang sm:mt-8 sm:h-[calc(100dvh-5rem)] md:mt-0 md:h-auto md:pb-4">
          <WallCal />
        </div>
      </main>
    </ThemeProvider>
  );
}