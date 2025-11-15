import SpinnerEffect from "@/components/loading/SpinnerEffect";
import { memo } from "react";

const LoadingScreen = memo(function LoadingScreen() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-layout-background z-50">
            <div className="flex flex-col items-center gap-y-4">
                <div className="relative">
                    <SpinnerEffect />
                    <div className="absolute inset-0 bg-gradient-to-r from-qorange-default to-qblue-default rounded-full opacity-20 blur-sm"></div>
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-layout-foreground mb-1">
                        QuizLab
                    </h2>
                    <p className="text-sm text-layout-foreground animate-pulse">
                        Um momento, por favor...
                    </p>
                </div>
            </div>
        </div>
    );
});
export default LoadingScreen;
