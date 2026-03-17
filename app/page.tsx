import { BannerRotator } from "@/components/BannerRotator";
import { CompressorTool } from "@/components/CompressorTool";
import { Card, CardContent } from "@/components/ui-elements";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 px-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
          Discord Compressor
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Professional-grade compression for Discord. Stay under the 25MB limit without losing quality.
        </p>
      </section>

      {/* Main Tool Section */}
      <section className="max-w-4xl mx-auto w-full px-4">
        <CompressorTool />
      </section>

      {/* NordVPN Affiliate Banner Section */}
      <section className="max-w-4xl mx-auto w-full px-4 flex flex-col items-center">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">
          Partner Deal
        </span>
        <BannerRotator 
          mode="affiliate"
          affiliateImage="/banners/nordvpn-728.png"
          affiliateLink="YOUR_NORDVPN_AFFILIATE_LINK_HERE" 
        />
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto w-full px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-2">Instant Compression</h3>
            <p className="text-slate-500 text-sm">Hardware-accelerated processing directly in your browser.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-2">Privacy First</h3>
            <p className="text-slate-500 text-sm">Files never leave your device. All processing happens locally.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-2">Optimized for Discord</h3>
            <p className="text-slate-500 text-sm">Presets specifically tuned for Discord's attachment limits.</p>
          </CardContent>
        </Card>
      </section>

      {/* SEO/Bottom Navigation */}
      <section className="bg-slate-50 border-y border-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-bold text-xl mb-4">Support & Resources</h2>
          <div className="flex justify-center gap-6 text-sm font-semibold text-blue-600">
            <Link href="/contact" className="hover:underline">Contact Support</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
