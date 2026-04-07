import WallCal from "./components/WallCal";
import SkyBackground from "./components/SkyBackground";
import DigitalClock from "./components/DigitalClock";

export default function Home() {
  return (
    <main className="w-full flex justify-center w-full max-w-7xl relative">
      <SkyBackground />
      <DigitalClock />
      <div className="w-full max-w-[960px] mx-auto animate-hang calendar-rope relative z-10">
        <WallCal />
      </div>
    </main>
  );
}
