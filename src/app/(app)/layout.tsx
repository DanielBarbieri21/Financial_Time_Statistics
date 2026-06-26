import { Header } from "@/components/layout/Header";
import { Navbar } from "@/components/layout/Navbar";
import { TickerTape } from "@/components/layout/TickerTape";
import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <Navbar />
      <TickerTape />
      <main className="flex flex-1 flex-col gap-4 bg-muted/30 p-4 lg:gap-6 lg:p-6">
        {children}
      </main>
      <footer className="border-t bg-card p-4 text-center text-sm text-muted-foreground">
        <p>Desenvolvido por IronDev Software</p>
        <div className="mt-2 flex items-center justify-center gap-x-4">
          <Link href="mailto:dibarbieri21@gmail.com" className="hover:text-primary transition-colors">
            dibarbieri21@gmail.com
          </Link>
          <span className="text-muted-foreground/50">|</span>
          <Link href="https://wa.me/5532991186728" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            (32) 99118-6728
          </Link>
        </div>
      </footer>
    </div>
  );
}
