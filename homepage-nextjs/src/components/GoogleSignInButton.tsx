"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              width?: number;
              logo_alignment?: string;
            },
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface GoogleSignInButtonProps {
  text?: "signin_with" | "signup_with" | "continue_with";
  onError?: (message: string) => void;
}

export default function GoogleSignInButton({
  text = "continue_with",
  onError,
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Google Identity Services script
  useEffect(() => {
    if (document.getElementById("google-identity-services")) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-identity-services";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Google Sign-In when script is loaded
  useEffect(() => {
    if (
      !scriptLoaded ||
      !window.google ||
      !buttonRef.current ||
      !GOOGLE_CLIENT_ID
    )
      return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });

    // Get the actual container width for the Google button
    const containerWidth = buttonRef.current.offsetWidth;

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: text,
      shape: "rectangular",
      width: Math.min(containerWidth, 400),
      logo_alignment: "center",
    });
  }, [scriptLoaded]);

  const handleGoogleCallback = async (response: { credential: string }) => {
    setIsLoading(true);

    const result = await loginWithGoogle(response.credential);

    if (result.success) {
      router.push("/account");
    } else {
      onError?.(result.message || "Google login failed. Please try again.");
      setIsLoading(false);
    }
  };

  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="w-full google-signin-wrapper">
      <style>{`
        .google-signin-wrapper > div > div {
          width: 100% !important;
        }
        .google-signin-wrapper iframe {
          width: 100% !important;
          min-width: 100% !important;
        }
      `}</style>
      {isLoading ? (
        <div
          className="w-full py-3 text-center text-sm"
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            color: "#666",
          }}
        >
          Signing in with Google...
        </div>
      ) : (
        <div
          ref={buttonRef}
          className="w-full"
          style={{ minHeight: 44 }}
        />
      )}
    </div>
  );
}
