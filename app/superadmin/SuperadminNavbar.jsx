"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { name: "Users", href: "/superadmin/users" },
  { name: "Admins", href: "/superadmin/admins" },
  { name: "Templates", href: "/superadmin/templates" },
  { name: "Reports", href: "/superadmin/reports" },
  { name: "Tokens", href: "/superadmin/tokens" },
];

export default function SuperadminNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("superadminAuth");
    router.replace("/superadmin/login");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 to-blue-900 px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-lg font-semibold transition-colors px-2 py-1 rounded-lg ${pathname === link.href
              ? "text-white bg-purple-700"
              : "text-cyan-200 hover:text-white hover:bg-purple-800"
              }`}
          >
            {link.name}
          </Link>
        ))}
        <Link
          href="/superadmin/questions"
          className={`text-lg font-semibold transition-colors px-2 py-1 rounded-lg ${pathname === "/superadmin/questions"
            ? "text-white bg-purple-700"
            : "text-cyan-200 hover:text-white hover:bg-purple-800"
            }`}
        >
          Questions
        </Link>
        <Link
          href="/superadmin/responses"
          className={`text-lg font-semibold transition-colors px-2 py-1 rounded-lg ${pathname === "/superadmin/responses"
            ? "text-white bg-purple-700"
            : "text-cyan-200 hover:text-white hover:bg-purple-800"
            }`}
        >
          Responses
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-pink-600 to-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-pink-700 hover:to-red-700 transition-all"
      >
        Logout
      </button>
    </nav>
  );
} 