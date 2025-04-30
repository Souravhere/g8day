"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "./beamEffect";
import { Brain, Database, FileText, MessageCircle, Scroll, User } from "lucide-react";

const Circle = forwardRef(function Circle({ className, children }, ref) {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex max-w-26 items-center justify-center rounded-2xl border-2 border-border bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
                className
            )}
        >
            {children}
        </div>
    );
});

Circle.displayName = "Circle";

export function AnimatedBeamMultipleOutputDemo({
    className,
}) {
    const containerRef = useRef(null);
    const div1Ref = useRef(null);
    const div2Ref = useRef(null);
    const div3Ref = useRef(null);
    const div4Ref = useRef(null);

    return (
        <div
            className={cn(
                "relative flex h-fit w-full items-center justify-center overflow-hidden p-6 font-mono",
                className
            )}
            ref={containerRef}
        >
            <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
                <div className="flex flex-col justify-center items-center gap-2">
                    <Circle ref={div1Ref}>
                    <span className="flex flex-col text-black text-xs font-semibold text-center items-center"><Scroll className="text-red-400"/>Saju Wisdom</span>
                    </Circle>
                    <Circle ref={div2Ref}>
                        <span className="flex flex-col text-black font-semibold text-xs text-center items-center"><Database className="text-red-400"/>Blockchain</span>
                    </Circle>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                    <Circle ref={div3Ref}>
                        <span className="flex flex-col text-black font-semibold text-center items-center text-xs"><Brain className="text-red-400"/> AI Analysis</span>
                    </Circle>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                    <Circle ref={div4Ref} className="size-16">
                        <User className="text-red-400" />
                    </Circle>
                </div>
            </div>

            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div3Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div3Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div3Ref}
                toRef={div4Ref} 
            />
        </div>
    );
}
