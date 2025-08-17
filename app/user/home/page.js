"use client";
import { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Image,
  Video,
  ExternalLink,
  Search,
  User,
  Sparkles,
  ArrowRight,
  Plus,
  Grid3X3,
  Zap,
  Palette,
  Globe,
  Star,
  TrendingUp,
  Play,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  ThumbsUp,
  PlayCircle,
  CheckCircle,
  Smartphone,
  Share2,
  Rocket,
  Users,
  Target,
  BookOpen,
  GraduationCap,
  Building2,
  MessageCircle,
  Mail,
  HelpCircle,
  Settings,
  CreditCard,
  BarChart3,
  Globe2,
  Languages,
} from "lucide-react";
import UserNavbar from "../Header";
import FAQ from "../FAQ";

export default function UserDashboard() {
  const [loading, setLoading] = useState(false);

  // Handle CTA button clicks
  const handleTryInstantly = () => {
    console.log("Try It Instantly clicked");
    // Add your logic here
  };

  const handleSignUpFree = () => {
    console.log("Sign Up Free clicked");
    // Add your logic here
  };

  // Features data
  const features = [
    {
      icon: Settings,
      title: "No-Code Simplicity",
      description: "Build your page with zero tech skills. If you can type, you're ready.",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      icon: Palette,
      title: "Ready-Made Templates",
      description: "Choose a layout. Add your content. Your brand, your vibe - already designed.",
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-400",
    },
    {
      icon: Upload,
      title: "Upload Anything",
      description: "Text, headlines, images, videos, buttons - drop it in, and it fits perfectly.",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
    },
    {
      icon: Rocket,
      title: "Instant Preview & Publish",
      description: "Click once. Your page is live. Share the link anywhere - no extra tools needed.",
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-500/10",
      iconColor: "text-rose-400",
    },
    {
      icon: Smartphone,
      title: "Mobile & SEO Ready",
      description: "Looks great on any screen. Google loves it too.",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-400",
    },
    {
      icon: Share2,
      title: "Smart Sharable Link",
      description: "Each page gets a custom link - perfect for Bios, Messages, DMs, QR codes, and more.",
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
    },
  ];

  // Target users data
  const targetUsers = [
    {
      icon: Users,
      title: "Solopreneurs & Hustlers",
      description: "Want to look pro online, without hiring anyone.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Target,
      title: "Coaches & Trainers",
      description: "Need a page for their next workshop, session, or course.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: TrendingUp,
      title: "Salespeople & Marketers",
      description: "Want to pitch or promote fast, with zero tech-blocks.",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: Star,
      title: "Creators & Influencers",
      description: "Share your link-in-bio page, media kit, or latest drop.",
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: Building2,
      title: "Startup Founders",
      description: "MVP page? Investor deck? Hiring? Handle it in minutes.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: GraduationCap,
      title: "Students & Educators",
      description: "Create a project, resume, or profile page - and impress.",
      color: "from-indigo-500 to-blue-600",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Riya M.",
      role: "Freelance Coach",
      text: "I created my event page during lunch. No calls, no help, no stress. This thing's a blessing!",
      rating: 5,
    },
    {
      id: 2,
      name: "Aditya K.",
      role: "Startup Founder",
      text: "CodelessPages saved me from hiring a designer. I launched my course page in 5 minutes flat.",
      rating: 5,
    },
    {
      id: 3,
      name: "Sonal P.",
      role: "Career Mentor",
      text: "I'm not techy at all. But this? I just typed and boom — my link was live.",
      rating: 5,
    },
    {
      id: 4,
      name: "Imran D.",
      role: "Solopreneur",
      text: "Finally… something that doesn't make me feel dumb. Looks great, works instantly.",
      rating: 5,
    },
    {
      id: 5,
      name: "Manisha R.",
      role: "Design Student",
      text: "Used it for my portfolio. Sent the link. Got 3 callbacks. Not kidding.",
      rating: 5,
    },
    {
      id: 6,
      name: "Rahul S.",
      role: "Marketing Consultant",
      text: "This replaced Canva + Google Docs + my dev guy. All in one.",
      rating: 5,
    },
  ];

  // How it works steps
  const howItWorks = [
    {
      step: 1,
      title: "Drop Your Content",
      description: "Write your headline, add to some text, upload a video or image — whatever you've got.",
      icon: Upload,
      color: "from-emerald-500 to-teal-600",
    },
    {
      step: 2,
      title: "Pick a Layout",
      description: "Choose a ready-made design. No settings. No tweaking. It just fits.",
      icon: Palette,
      color: "from-violet-500 to-purple-600",
    },
    {
      step: 3,
      title: "Go Live & Share",
      description: "Hit publish. Get your link. Send it anywhere - from DMs to QR codes.",
      icon: Rocket,
      color: "from-cyan-500 to-blue-600",
    },
  ];

  // Coming soon features
  const comingSoonFeatures = [
    {
      icon: Globe2,
      title: "Connect Your Own Domain",
      description: "Use your own domain name for your pages",
    },
    {
      icon: Target,
      title: "Lead Capture + Form Builder",
      description: "Collect leads and build forms easily",
    },
    {
      icon: CreditCard,
      title: "Simple Payment Links",
      description: "Accept payments directly on your pages",
    },
    {
      icon: BarChart3,
      title: "Basic Analytics",
      description: "Track page views and engagement",
    },
    {
      icon: Palette,
      title: "More Templates & Layout Packs",
      description: "Expanded design options for every need",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team or agency",
    },
    {
      icon: Languages,
      title: "Multilingual Page Support",
      description: "Create pages in multiple languages",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      <UserNavbar />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 py-12 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-violet-200 mb-8 animate-pulse">
            Type. Upload. Go Live.
          </h1>

          <p className="text-xl text-slate-200/90 leading-relaxed max-w-3xl mx-auto mb-12">
            Just bring your content. No coding. No waiting. No calling your geeky friend for help. One page. All yours. In seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleTryInstantly}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Zap className="mr-3 h-5 w-5" />
                Try It Instantly
              </div>
            </button>

            <button
              onClick={handleSignUpFree}
              className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-violet-500/25 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <User className="mr-3 h-5 w-5" />
                Sign Up Free
              </div>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-violet-200 mb-4">
              Everything You Need. Nothing You Don't.
            </h2>
            <p className="text-lg text-slate-200/70">
              Let's keep it sharp, visual, and clear for fast decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group cursor-pointer">
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    <div className="relative p-6">
                      <div className={`${feature.bgColor} backdrop-blur-sm rounded-2xl p-4 w-fit mb-4`}>
                        <IconComponent className={`h-8 w-8 ${feature.iconColor}`} />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-200/70 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-lg text-slate-200/80 font-medium">
              No designers. No developers. No delays.
            </p>
            <p className="text-lg text-slate-200/80 font-medium">
              Just your message - launched.
            </p>
          </div>
        </div>

        {/* Who It's For Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-violet-200 mb-4">
              Built for People Who Hate Waiting on Developers.
            </h2>
            <p className="text-lg text-slate-200/70 max-w-3xl mx-auto">
              If you've got something to say or sell - but don't want to learn code, chase freelancers, or spend hours on "digital stuff" - this is made for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {targetUsers.map((user, index) => {
              const IconComponent = user.icon;
              return (
                <div key={index} className="group cursor-pointer">
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 transform hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${user.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    <div className="relative p-6">
                      <div className={`bg-gradient-to-br ${user.color} rounded-2xl p-4 w-fit mb-4`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3">
                        {user.title}
                      </h3>
                      <p className="text-slate-200/70 text-sm leading-relaxed">
                        {user.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-lg text-slate-200/80 font-medium">
              If you've ever said "I just wish someone could do it for me"… this is that someone.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-violet-200 mb-4">
              Real People. Real Wins.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="text-emerald-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-200/80 text-sm leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "text-amber-400 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-violet-200 mb-4">
              3 Steps. That's It.
            </h2>
            <p className="text-lg text-slate-200/70">
              From blank to brilliant in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.step} className="text-center group">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-slate-900 font-bold text-sm">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-200/70 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-violet-200 mb-4">
            Stop Waiting. Start Sharing.
          </h2>
          <p className="text-lg text-slate-200/70 mb-8 max-w-2xl mx-auto">
            You've got something to show. Let the world see it - without a single line of code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleTryInstantly}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Zap className="mr-3 h-5 w-5" />
                Try It Instantly
              </div>
            </button>

            <button
              onClick={handleSignUpFree}
              className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-violet-500/25 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <User className="mr-3 h-5 w-5" />
                Sign Up Free
              </div>
            </button>
          </div>

          {/* Support Badge */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-3">
              Have a question or stuck somewhere?
            </h3>
            <p className="text-slate-200/70 text-sm mb-3">
              Message us on WhatsApp or email support@codelesspages.com — we're real people, and we respond fast.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-violet-200 mb-4">
              Coming Soon on CodelessPages
            </h2>
            <p className="text-lg text-slate-200/70">
              We're constantly adding new features to make your experience even better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoonFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group cursor-pointer">
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                    <div className="relative p-6">
                      <div className="bg-slate-600/30 backdrop-blur-sm rounded-2xl p-4 w-fit mb-4">
                        <IconComponent className="h-8 w-8 text-slate-300" />
                      </div>

                      <div className="flex items-center mb-2">
                        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full mr-2">
                          Coming Soon
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-300/70 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <FAQ />
    </div>
  );
}
