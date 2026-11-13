import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AnnouncementBar from "@/components/layout/announcement-bar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnnouncementBar
        message="6000+ careers transformed. Explore our latest placement stories & hiring partners."
        href="/placements"
        cta="Go to Placements"
        storageKey="almabetter-placements-announcement"
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}