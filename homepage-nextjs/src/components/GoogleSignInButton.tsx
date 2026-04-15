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
          prompt: () => void;
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
              click_listener?: () => void;
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
  const hiddenBtnRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  const labelMap = {
    signin_with: "Sign in with Google",
    signup_with: "Sign up with Google",
    continue_with: "Continue with Google",
  };

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
    if (!scriptLoaded || !window.google || !GOOGLE_CLIENT_ID) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });

    // Render a hidden Google button so we can programmatically click it
    if (hiddenBtnRef.current) {
      window.google.accounts.id.renderButton(hiddenBtnRef.current, {
        type: "icon",
        size: "large",
      });
    }

    setReady(true);
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

  const handleCustomClick = () => {
    // Click the hidden real Google button to trigger the OAuth flow
    const hiddenBtn = hiddenBtnRef.current;
    if (hiddenBtn) {
      const clickTarget =
        hiddenBtn.querySelector<HTMLElement>('[role="button"]') ||
        hiddenBtn.querySelector<HTMLElement>("div[tabindex]") ||
        hiddenBtn.querySelector<HTMLElement>("iframe");

      if (clickTarget) {
        clickTarget.click();
        return;
      }
    }
    // Fallback: try prompt
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Hidden real Google button (needed to trigger OAuth) */}
      <div
        ref={hiddenBtnRef}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

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
        <button
          type="button"
          onClick={handleCustomClick}
          disabled={!ready}
          className="w-full flex items-center justify-center gap-3 py-3 border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 14,
            color: "#222222",
            borderColor: "#DDD",
            backgroundColor: "#fff",
            height: 50,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          <span>{labelMap[text]}</span>
        </button>
      )}
    </div>
  );
}
