import WallCal from "./components/WallCal";
import SkyBackground from "./components/SkyBackground";
import DigitalClock from "./components/DigitalClock";

export default function Home() {
  return (
    <main className="w-full flex justify-center w-full max-w-7xl relative h-[100dvh] overflow-hidden md:overflow-visible">
      <SkyBackground />
      <DigitalClock />
      <div className="w-full max-w-[960px] mx-auto animate-hang calendar-rope relative z-10 mt-24 md:mt-0 pb-4 h-[calc(100dvh-6rem)] md:h-auto flex flex-col justify-start">
        <WallCal />
      </div>
    </main>
  );
}
