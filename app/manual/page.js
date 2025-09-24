'use client'

import React, { useState } from 'react';
import { 
  Upload,
  Heading,
  AlignLeft,
  Palette,
  Video,
  MousePointer,
  Image,
  Rocket,
  ClipboardList,
  Edit,
  PlayCircle,
  Search,
  Headphones,
  Mail,
  Clock,
  Wrench,
  Shield,
  ExternalLink,
  Lightbulb,
  Code,
  Quote,
  Eye,
  Youtube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Link,
  FileImage,
  Hand
} from 'lucide-react';

export default function ContentUploadManual() {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: 'heading',
      title: 'Write Heading',
      icon: Heading,
      color: 'from-pink-500 to-rose-500',
      step: 1
    },
    {
      id: 'subheading', 
      title: 'Write Subheading',
      icon: AlignLeft,
      color: 'from-blue-500 to-cyan-500',
      step: 2
    },
    {
      id: 'colors',
      title: 'Choose Color',
      icon: Palette,
      color: 'from-green-500 to-emerald-500', 
      step: 3
    },
    {
      id: 'video',
      title: 'Add Video Content',
      icon: Video,
      color: 'from-orange-500 to-amber-500',
      step: 4
    },
    {
      id: 'cta',
      title: 'Call-to-Action Button',
      icon: MousePointer,
      color: 'from-purple-500 to-violet-500',
      step: 5
    },
    {
      id: 'images',
      title: 'Upload Images', 
      icon: Image,
      color: 'from-teal-500 to-cyan-500',
      step: 6
    }
  ];

  const finalSteps = [
    {
      icon: ClipboardList,
      title: 'Choose Template',
      description: 'Start by selecting the template you want to use for your content'
    },
    {
      icon: Edit,
      title: 'Add  Content', 
      description: 'Follow the template rules for heading,  video, CTA, and images'
    },
    {
      icon: PlayCircle,
      title: 'Create Content',
      description: 'Click the "Create Content" button to generate your final design'
    },
    {
      icon: Search,
      title: 'Review & Check',
      description: 'Review your created content carefully for any mistakes'
    }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Quick Response Time'
    },
    {
      icon: Wrench,
      title: 'Expert Technical Support'
    },
    {
      icon: Shield,
      title: 'Reliable Solution'
    }
  ];

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center bg-white rounded-3xl shadow-xl p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-blue-500 via-green-500 via-yellow-500 to-purple-500"></div>
          
          <div className="relative">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Upload className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Content Upload Manual
            </h1>
            
            <p className="text-xl text-gray-600 font-light mb-8">
              Complete guide for uploading and managing content on CodelessPages
            </p>
            
            <a 
              href="https://codelesspages.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5" />
              Visit CodelessPages.com
            </a>
          </div>
        </div>
          {/* Final Steps Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 mt-12 text-white">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Rocket className="w-10 h-10" />
              <h2 className="text-4xl font-bold">How to Upload Content</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {finalSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-4 hover:bg-white/30 transition-colors duration-300">
                    <StepIcon className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-12"></div>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Section Header */}
              <div 
                className={`p-8 bg-gradient-to-r ${section.color} text-white cursor-pointer`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                    <section.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {section.step}. {section.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Section Content */}
              <div className={`transition-all duration-300 ${activeSection === section.id ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-8">
                  {section.id === 'heading' && (
                    <div className="bg-gray-50 rounded-xl p-8 relative">
                      <div className="absolute -top-3 left-6 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div className="flex items-start gap-4 mb-6">
                        <Edit className="w-6 h-6 text-indigo-600 mt-1" />
                        <h3 className="text-xl font-semibold text-gray-900">Create Your Main Title</h3>
                      </div>
                      <ul className="space-y-3 text-gray-700 ml-10">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          The <strong>heading</strong> is the main title of your content
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Keep it short, clear, and attention-grabbing
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Use action-oriented words when possible
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 font-semibold">
                          <Lightbulb className="w-5 h-5" />
                          Example:
                        </div>
                        <p className="text-green-800 mt-2">Discover Your Perfect Plan</p>
                      </div>
                    </div>
                  )}

                  {section.id === 'subheading' && (
                    <div className="bg-gray-50 rounded-xl p-8 relative">
                      <div className="absolute -top-3 left-6 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <div className="flex items-start gap-4 mb-6">
                        <AlignLeft className="w-6 h-6 text-indigo-600 mt-1" />
                        <h3 className="text-xl font-semibold text-gray-900">Support Your Main Title</h3>
                      </div>
                      <ul className="space-y-3 text-gray-700 ml-10">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          The <strong>subheading</strong> supports the heading and provides additional context
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Explain the heading in one or two lines
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Keep it informative but concise
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 font-semibold">
                          <Quote className="w-5 h-5" />
                          Example:
                        </div>
                        <p className="text-green-800 mt-2">Join thousands of users who are already achieving success.</p>
                      </div>
                    </div>
                  )}

                  {section.id === 'colors' && (
                    <div className="bg-gray-50 rounded-xl p-8 relative">
                      <div className="absolute -top-3 left-6 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <div className="flex items-start gap-4 mb-6">
                        <Eye className="w-6 h-6 text-indigo-600 mt-1" />
                        <h3 className="text-xl font-semibold text-gray-900">Select Your Brand Colors</h3>
                      </div>
                      <ul className="space-y-3 text-gray-700 ml-10">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Choose a <strong>color code</strong> for your design
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Colors must be entered in <strong>HEX code format</strong>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Select colors that are visually appealing and match your brand
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Ensure good contrast so text remains readable
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                          <Code className="w-5 h-5" />
                          Examples:
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <code className="bg-gray-800 text-green-400 px-3 py-1 rounded font-mono text-sm">#FFFFFF</code>
                            <span className="text-gray-700">→ White</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <code className="bg-gray-800 text-green-400 px-3 py-1 rounded font-mono text-sm">#000000</code>
                            <span className="text-gray-700">→ Black</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <code className="bg-gray-800 text-green-400 px-3 py-1 rounded font-mono text-sm">#667eea</code>
                            <span className="text-gray-700">→ Blue</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'video' && (
                    <div className="bg-gray-50 rounded-xl p-8 relative">
                      <div className="absolute -top-3 left-6 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        4
                      </div>
                      <div className="flex items-start gap-4 mb-6">
                        <Youtube className="w-6 h-6 text-indigo-600 mt-1" />
                        <h3 className="text-xl font-semibold text-gray-900">Embed Your Video</h3>
                      </div>
                      <ul className="space-y-3 text-gray-700 ml-10">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Embed videos from <strong>YouTube</strong> or <strong>Vimeo</strong> only
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Paste the complete and correct video URL
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          The system will validate the URL automatically
                        </li>
                      </ul>
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3 text-green-700">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Valid:</span>
                          <span>https://www.youtube.com/watch?v=xyz123</span>
                        </div>
                        <div className="flex items-center gap-3 text-red-700">
                          <XCircle className="w-5 h-5" />
                          <span className="font-semibold">Invalid:</span>
                          <span>Shortened or broken links</span>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="font-semibold">Only YouTube and Vimeo URLs will be accepted</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'cta' && (
                    <div className="bg-gray-50 rounded-xl p-8 relative">
                      <div className="absolute -top-3 left-6 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        5
                      </div>
                      <div className="flex items-start gap-4 mb-6">
                        <Link className="w-6 h-6 text-indigo-600 mt-1" />
                        <h3 className="text-xl font-semibold text-gray-900">Create Compelling CTAs</h3>
                      </div>
                      <ul className="space-y-3 text-gray-700 ml-10">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          The <strong>CTA button</strong> encourages users to take action
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Add a <strong>valid URL</strong> to the button
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          The link will be checked for accuracy before publishing
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                          <Hand className="w-5 h-5" />
                          CTA Examples:
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-green-800">
                          <div>• Sign Up Now</div>
                          <div>• Learn More</div>
                          <div>• Buy Today</div>
                          <div>• Get Started</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'images' && (
                    <div className="bg-gray-50 rounded-xl p-8 relative">
                      <div className="absolute -top-3 left-6 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        6
                      </div>
                      <div className="flex items-start gap-4 mb-6">
                        <FileImage className="w-6 h-6 text-indigo-600 mt-1" />
                        <h3 className="text-xl font-semibold text-gray-900">Add Visual Content</h3>
                      </div>
                      <ul className="space-y-3 text-gray-700 ml-10">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Upload images <strong>less than 5 MB</strong>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          Supported formats: <strong>.jpg, .jpeg, .png</strong>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                          You can also provide a direct image link
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                        <div className="flex items-start gap-3 text-yellow-800">
                          <AlertTriangle className="w-5 h-5 mt-0.5" />
                          <div>
                            <span className="font-semibold">Important:</span> Do not use Google Drive or private storage links. Use publicly accessible image links from CDN or image hosting sites.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      

        {/* Support Section */}
        <div className="bg-gray-900 rounded-3xl p-12 mt-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Headphones className="w-10 h-10 text-white" />
            <h2 className="text-4xl font-bold text-white">Need Help?</h2>
          </div>
          
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            If you find any mistakes or need assistance, take a screenshot and contact our support team
          </p>
          
          <a 
            href="mailto:saurabhiitr01@gmail.com"
            className="inline-flex items-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            saurabhiitr01@gmail.com
          </a>

          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 bg-gray-800 p-4 rounded-xl">
                  <IconComponent className="w-6 h-6 text-cyan-400" />
                  <span className="text-white font-medium">{feature.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}