export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-3">Codeless</h3>
            <p className="text-sm leading-relaxed">
              Build pages, manage admins & users, capture leads, and track everything — without writing a single line of code.
            </p>

            <div className="flex gap-4 mt-5">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">GitHub</a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="/features" className="hover:text-white">Features</a></li>
              <li><a href="/templates" className="hover:text-white">Templates</a></li>
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              <li><a href="/docs" className="hover:text-white">Documentation</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white">About us</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
              <li><a href="/user/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
              <li><a href="/refund" className="hover:text-white">Refund Policy</a></li>
              <li><a href="/security" className="hover:text-white">Security</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} Codeless. All rights reserved.</p>
          <p className="mt-3 md:mt-0">
            Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
