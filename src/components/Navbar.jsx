import { useState } from 'react';
import { Home, TreePine, Users, CreditCard, Shield, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: 'Home', icon: Home },
    { name: 'Members', icon: Users },
    { name: 'Family Tree', icon: TreePine },
    { name: 'Payments', icon: CreditCard },
    { name: 'Admin', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/10 backdrop-blur bg-black/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[2px]">
              <div className="h-full w-full rounded-md bg-black/90 grid place-items-center">
                <Shield className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <span className="text-white font-semibold tracking-wide">Apna Parivaar</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {links.map(({ name, icon: Icon }) => (
              <a key={name} href="#" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
                <Icon className="h-4 w-4" />
                <span>{name}</span>
              </a>
            ))}
            <a href="#" className="inline-flex items-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:from-cyan-400 hover:to-blue-500 transition-colors">
              Launch App
            </a>
          </nav>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/70 backdrop-blur">
          <div className="space-y-1 px-4 py-3">
            {links.map(({ name, icon: Icon }) => (
              <a key={name} href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-white/80 hover:text-white hover:bg-white/10">
                <Icon className="h-4 w-4" />
                <span>{name}</span>
              </a>
            ))}
            <a href="#" className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:from-cyan-400 hover:to-blue-500 transition-colors">
              Launch App
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
