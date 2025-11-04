import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RoleCards from './components/RoleCards';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.12),transparent_50%)]" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <RoleCards />

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Visual Family Tree</h3>
                <p className="mt-2 text-white/70 text-sm">
                  Explore relationships with an interactive, draggable graph powered by modern web tech.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Secure Access</h3>
                <p className="mt-2 text-white/70 text-sm">
                  Role-based permissions keep sensitive actions limited to the right people.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Payments Ready</h3>
                <p className="mt-2 text-white/70 text-sm">
                  Simulated subscriptions with logs for Super Admin to monitor activity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
