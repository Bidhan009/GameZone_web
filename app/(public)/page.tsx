import Header from './_components/Header';
import Body from './_components/body';
import Footer from './_components/footer';
import { Tablet, Cpu, Monitor, Headphones } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-min-h-screen flex-col bg-[#0f1218]">
      {/* Navigation Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Body />

        {/* Quick Category Section (Added for better UX)
        <section className="bg-[#0b0e14] py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-widest">
              Browse by <span className="text-purple-500">Category</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CategoryCard icon={<Monitor className="w-8 h-8" />} title="PC Games" />
              <CategoryCard icon={<Tablet className="w-8 h-8" />} title="Consoles" />
              <CategoryCard icon={<Cpu className="w-8 h-8" />} title="Hardware" />
              <CategoryCard icon={<Headphones className="w-8 h-8" />} title="Accessories" />
            </div>
          </div>
        </section> */}
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}

// Small helper component for the Category section
function CategoryCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#1a1f29] border border-gray-800 rounded-xl hover:border-purple-500 hover:bg-[#242a36] transition-all cursor-pointer group">
      <div className="text-purple-500 group-hover:scale-110 transition-transform mb-3">
        {icon}
      </div>
      <span className="text-white font-semibold">{title}</span>
    </div>
  );
}