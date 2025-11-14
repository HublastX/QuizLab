import React from "react";
import SpinnerEffect from "@/components/loading/SpinnerEffect";

export default function LoadingScreen() {
  return (
    <>
    <h1 className="text-center justify-center text-6x">Loading</h1>

    <div className="min-h-screen flex justify-center items-center">
        <div className="flex gap-x-4 m-auto">
        <SpinnerEffect />
        </div>
    </div>
    </>
  );
}
