import Link from 'next/link';
import { Mail, Home } from 'lucide-react';

export default function EmailNavbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors">
              <Home className="w-5 h-5" />
              <span className="font-semibold">Home</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/email" className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 