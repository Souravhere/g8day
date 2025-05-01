import { Quote } from 'lucide-react';
import Image from 'next/image';

export default function VisionStatement() {
    return (
        <section 
            id="vision-statement" 
            className="w-full bg-black text-white py-6 md:py-10 px-4 md:px-8 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
                    
                    {/* Left Column - Text Content */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl text-gray-100 md:text-5xl lg:text-6xl font-bold">Vision</h2>
                            <p className="text-xl md:text-2xl italic mt-3 text-gray-300/80">Guided by Destiny, Powered by Web3</p>
                        </div>
                        
                        <div className="relative pl-6 md:pl-8">
                            <div className="absolute -left-3 top-0 text-red-500 bg-black rounded-full p-1">
                                <Quote size={30} className="rotate-180" />
                            </div>
                            <blockquote className="text-lg text-gray-200 md:text-xl font-light leading-relaxed pt-8 text-shadow-glow">
                                "To merge Eastern metaphysics with Web3 technology making destiny a data driven and democratized experience."
                            </blockquote>
                            <div className="absolute -right-2 -bottom-4 text-red-500 bg-black rounded-full p-1">
                                <Quote size={24} />
                            </div>
                        </div>
                        
                        <div className="pt-6">
                            <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-full hover:shadow-glow-red transition-all duration-300 flex items-center space-x-2 group">
                                <span>Explore Our Mission</span>
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Right Column - Visual Element */}
                    <div>
                        <div className="relative aspect-square md:aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-2xl border border-gray-800 flex items-center justify-center">
                                <Image src='/vision.png' width={700} height={700} alt='Cta Image'/>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
}
