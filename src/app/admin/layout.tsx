"use client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style jsx global>{`
        nav.fixed.top-0,
        footer { 
          display: none !important; 
        }
      `}</style>
      <div className="min-h-screen bg-spades-black">
        {children}
      </div>
    </>
  );
}

