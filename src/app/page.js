import AboutSection from "@/components/aboutSection";
import HeroSection from "@/components/heroSection";
import KeyFeaturesSection from "@/components/keyFeatures";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HeroSection/>
      <AboutSection/>
      <KeyFeaturesSection/>
    </div>
  );
}
