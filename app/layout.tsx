import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment | Minar Jewellers",
  description: "Book a personalised jewellery appointment with Minar Jewellers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
