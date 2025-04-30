import AboutSection from "@/components/aboutSection";
import HeroSection from "@/components/heroSection";
import KeyFeaturesSection from "@/components/keyFeatures";
import FortuneNFTMarketplace from "@/components/nftMarketplace";
import TokenomicsAndVision from "@/components/tokenomicsVision";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HeroSection/>
      <AboutSection/>
      <KeyFeaturesSection/>
      <FortuneNFTMarketplace/>
      <TokenomicsAndVision/>
    </div>
  );
}
