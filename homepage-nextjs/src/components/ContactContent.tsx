'use client'

import { useEffect, useRef } from "react"
import Footer from "@/components/Footer"
import { ContactInfo } from "@/lib/api"

interface ContactContentProps {
  formHtml: string;
  contactInfo?: ContactInfo;
}

export default function ContactContent({ formHtml, contactInfo }: ContactContentProps) {
  const formWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!formWrapperRef.current) return;

    const form = formWrapperRef.current.querySelector('form');
    if (!form) return;

    const handleSubmit = async (e: Event) => {
      e.preventDefault();

      const formElement = e.target as HTMLFormElement;
      const formData = new FormData(formElement);

      // Get the form ID from the hidden _wpcf7 field (set by CF7 automatically)
      const wpcf7Id = formData.get('_wpcf7');
      if (!wpcf7Id) {
        console.error('CF7 form ID not found in form data');
        return;
      }

      // Check required fields
      const inputs = formElement.querySelectorAll('[aria-required="true"], [required]');
      let allFilled = true;
      inputs.forEach((input) => {
        const el = input as HTMLInputElement | HTMLTextAreaElement;
        if (!el.value.trim()) {
          allFilled = false;
        }
      });

      if (!allFilled) {
        let responseOutput = formElement.querySelector('.wpcf7-response-output');
        if (!responseOutput) {
          responseOutput = document.createElement('div');
          responseOutput.className = 'wpcf7-response-output';
          formElement.appendChild(responseOutput);
        }
        responseOutput.textContent = 'Please fill in all required fields before submitting.';
        (responseOutput as HTMLElement).style.borderColor = '#dc2626';
        (responseOutput as HTMLElement).style.color = '#dc2626';
        return;
      }

      try {
        // Submit directly to the CF7 REST API on WordPress
        const wpBase = (process.env.NEXT_PUBLIC_WP_API_URL || 'http://wasted-talent.local/wp-json/site-manager/v1').replace('/site-manager/v1', '');
        const response = await fetch(
          `${wpBase}/contact-form-7/v1/contact-forms/${wpcf7Id}/feedback`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const result = await response.json();

        let responseOutput = formElement.querySelector('.wpcf7-response-output');
        if (!responseOutput) {
          responseOutput = document.createElement('div');
          responseOutput.className = 'wpcf7-response-output';
          formElement.appendChild(responseOutput);
        }

        if (result.status === 'mail_sent') {
          responseOutput.textContent = result.message || 'Thank you for your message. It has been sent.';
          (responseOutput as HTMLElement).style.borderColor = '#16a34a';
          (responseOutput as HTMLElement).style.color = '#16a34a';
          formElement.reset();
        } else {
          responseOutput.textContent = result.message || 'An error occurred. Please try again.';
          (responseOutput as HTMLElement).style.borderColor = '#dc2626';
          (responseOutput as HTMLElement).style.color = '#dc2626';
        }
      } catch (error) {
        console.error('Form submission error:', error);
        let responseOutput = formElement.querySelector('.wpcf7-response-output');
        if (!responseOutput) {
          responseOutput = document.createElement('div');
          responseOutput.className = 'wpcf7-response-output';
          formElement.appendChild(responseOutput);
        }
        responseOutput.textContent = 'An error occurred. Please try again later.';
        (responseOutput as HTMLElement).style.borderColor = '#dc2626';
        (responseOutput as HTMLElement).style.color = '#dc2626';
      }
    };

    form.addEventListener('submit', handleSubmit);

    return () => {
      form.removeEventListener('submit', handleSubmit);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white pt-24">
      {/* Contact Form Section */}
      <section className="max-w-[700px] mx-auto px-6 pt-12 pb-16">
        <h1 style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 300,
          fontSize: '60px',
          textAlign: 'center',
          marginBottom: '16px',
        }}>
          Contact us
        </h1>
        <p className="text-center text-[14px] text-[#222222] mb-10">
          Have a question or need support?<br />
          Send us a message and we&apos;ll get back to you as soon as possible.
        </p>

        {/* CF7 Form rendered from WordPress */}
        {formHtml ? (
          <div
            ref={formWrapperRef}
            className="cf7-form-wrapper"
            dangerouslySetInnerHTML={{ __html: formHtml }}
          />
        ) : (
          <p className="text-gray-400 text-sm text-center">Contact form not configured yet.</p>
        )}
      </section>

      {/* Follow Us Section */}
      <section className="pb-20 text-center">
        <h2 style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 300,
          fontSize: '60px',
          marginBottom: '16px',
        }}>
          Follow us
        </h2>
        <div className="flex items-center justify-center gap-2 text-[14px]">
          {(contactInfo?.social_instagram || "https://instagram.com") && (
            <a href={contactInfo?.social_instagram || "https://instagram.com"} target="_blank" className="hover:underline">Instagram</a>
          )}
          <span className="text-gray-400">|</span>
          {(contactInfo?.social_facebook || "https://facebook.com") && (
            <a href={contactInfo?.social_facebook || "https://facebook.com"} target="_blank" className="hover:underline">Facebook</a>
          )}
          <span className="text-gray-400">|</span>
          {(contactInfo?.social_spotify || "https://spotify.com") && (
            <a href={contactInfo?.social_spotify || "https://spotify.com"} target="_blank" className="hover:underline">Spotify</a>
          )}
        </div>
      </section>

      {/* Styles for CF7 form matching mockup */}
      <style jsx global>{`
        .cf7-form-wrapper .wpcf7-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cf7-form-wrapper .contact-us-form {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .cf7-form-wrapper .contact-us-form .col-md-6 {
          flex: 0 0 calc(50% - 5px);
          max-width: calc(50% - 5px);
        }
        .cf7-form-wrapper .contact-us-form .col-md-12 {
          flex: 0 0 100%;
          max-width: 100%;
        }
        .cf7-form-wrapper .form-control,
        .cf7-form-wrapper input[type="text"],
        .cf7-form-wrapper input[type="email"],
        .cf7-form-wrapper input[type="tel"],
        .cf7-form-wrapper textarea {
          width: 100%;
          border: none;
          padding: 14px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          background: #F2F2F2;
          box-sizing: border-box;
          -webkit-appearance: none;
          border-radius: 0;
        }
        .cf7-form-wrapper .form-control:focus,
        .cf7-form-wrapper input[type="text"]:focus,
        .cf7-form-wrapper input[type="email"]:focus,
        .cf7-form-wrapper input[type="tel"]:focus,
        .cf7-form-wrapper textarea:focus {
          outline: none;
        }
        .cf7-form-wrapper textarea {
          resize: none;
        }
        .cf7-form-wrapper .form-control::placeholder,
        .cf7-form-wrapper input::placeholder,
        .cf7-form-wrapper textarea::placeholder {
          color: #9ca3af;
        }
        /* Button: full width, 14px bold, no letter-spacing */
        .cf7-form-wrapper .btn-invia,
        .cf7-form-wrapper input[type="submit"],
        .cf7-form-wrapper button[type="submit"] {
          display: block;
          width: 100%;
          background: #222222;
          color: #fff;
          border: none;
          padding: 14px;
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0;
          cursor: pointer;
          transition: background-color 0.2s;
          -webkit-appearance: none;
          border-radius: 0;
          box-sizing: border-box;
        }
        .cf7-form-wrapper .btn-invia:hover,
        .cf7-form-wrapper input[type="submit"]:hover,
        .cf7-form-wrapper button[type="submit"]:hover {
          background: #444;
        }
        /* Ensure button wrapper div is full width */
        .cf7-form-wrapper .wpcf7-form > p,
        .cf7-form-wrapper .wpcf7-form > div,
        .cf7-form-wrapper .wpcf7-form p,
        .cf7-form-wrapper .wpcf7-form div,
        .cf7-form-wrapper .wpcf7-form-control-wrap {
          width: 100%;
          box-sizing: border-box;
        }
        /* Acceptance checkbox */
        .cf7-form-wrapper .acceptance {
          font-size: 13px;
          color: #222222;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .cf7-form-wrapper .wpcf7-acceptance {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #222222;
          font-size: 13px;
        }
        .cf7-form-wrapper .wpcf7-acceptance .wpcf7-list-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin: 0;
        }
        .cf7-form-wrapper .wpcf7-acceptance .wpcf7-list-item label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #222222;
          cursor: pointer;
        }
        .cf7-form-wrapper .wpcf7-acceptance input[type="checkbox"] {
          width: auto;
          min-width: 16px;
          height: 16px;
          margin-top: 2px;
          cursor: pointer;
          flex-shrink: 0;
          background: #F2F2F2;
        }
        .cf7-form-wrapper .acceptance a {
          text-decoration: underline;
        }
        .cf7-form-wrapper .acceptance input[type="checkbox"] {
          width: auto;
          margin-top: 2px;
          cursor: pointer;
        }
        .cf7-form-wrapper .wpcf7-response-output {
          margin-top: 12px;
          padding: 12px;
          font-size: 14px;
          text-align: center;
        }
        .cf7-form-wrapper .wpcf7-not-valid-tip {
          color: #dc2626;
          font-size: 12px;
          margin-top: 4px;
        }
        .cf7-form-wrapper .mb-0 {
          margin-bottom: 0;
        }
        .cf7-form-wrapper .mb-1 {
          margin-bottom: 4px;
        }
        .cf7-form-wrapper .pt-5 {
          padding-top: 0;
        }
        .cf7-form-wrapper .row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .cf7-form-wrapper p {
          margin: 0;
        }
        .cf7-form-wrapper br {
          display: none;
        }
        @media (max-width: 767px) {
          .cf7-form-wrapper .contact-us-form .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>

      <Footer contactInfo={contactInfo} />
    </main>
  );
}
