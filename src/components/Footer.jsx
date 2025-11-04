export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/60">© {new Date().getFullYear()} Apna Parivaar. All rights reserved.</p>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <a href="#" className="hover:text-white">Privacy</a>
          <span aria-hidden>•</span>
          <a href="#" className="hover:text-white">Terms</a>
          <span aria-hidden>•</span>
          <a href="#" className="hover:text-white">Support</a>
        </div>
      </div>
    </footer>
  );
}
