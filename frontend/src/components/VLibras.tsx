"use client";

import { useEffect } from "react";

export default function VLibras() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;

    script.onload = () => {
      // @ts-expect-error
      new window.VLibras.Widget("https://vlibras.gov.br/app");
    };

    document.body.appendChild(script);
  }, []);

  return (
    // @ts-expect-error - VLibras custom attributes
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}
