"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function MediaPage() {
  useEffect(() => {
    // Initialize iframe resizer after script loads
    const initResizer = () => {
      if (typeof window !== 'undefined' && (window as any).iFrameResize) {
        const iframe = document.getElementById('elfsight-iframe');
        if (iframe) {
          (window as any).iFrameResize(iframe);
        }
      }
    };

    // Check if already loaded
    if ((window as any).iFrameResize) {
      initResizer();
    }
  }, []);

  return (
    <div className="min-h-screen pt-24">
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.2.10/iframeResizer.min.js"
        onLoad={() => {
          const iframe = document.getElementById('elfsight-iframe');
          if (iframe && (window as any).iFrameResize) {
            (window as any).iFrameResize(iframe);
          }
        }}
      />
      
      {/* Header */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Archive</h1>
          <a 
            href="https://instagram.com/spades_performance" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-spades-gold hover:text-spades-gold/80 transition-colors text-lg inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @spades_performance
          </a>
        </div>
      </section>

      {/* Instagram Feed - Elfsight iframe */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <iframe 
            id="elfsight-iframe"
            src="https://b221f54f117e4bb1a34e9d493ca8450e.elf.site" 
            style={{ border: 'none', width: '100%', minHeight: '800px' }}
            title="Instagram Feed"
          />
        </div>
      </section>
    </div>
  );
}
