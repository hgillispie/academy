'use client';

import { Button } from '../components/common/Button';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1030px] mx-auto px-6 py-12">
        <h1 className="text-[42px] font-normal text-black mb-8 text-center">
          Contact Us
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#f5f0ff] p-8 rounded-2xl border border-[#a97ff2] mb-8">
            <h2 className="text-2xl font-medium mb-4 text-black">Get in Touch</h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              We're here to help! Whether you have questions about our courses, need technical support, 
              or want to provide feedback, we'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-medium mb-4 text-black">Support</h3>
              <p className="text-gray-600 mb-4">
                For technical issues and course-related questions
              </p>
              <a 
                href="https://forum.builder.io" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button>Visit Community Forum</Button>
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-medium mb-4 text-black">Documentation</h3>
              <p className="text-gray-600 mb-4">
                Find answers in our comprehensive documentation
              </p>
              <a 
                href="https://www.builder.io/c/docs/introduction" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button>View Documentation</Button>
              </a>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-xl font-medium mb-4 text-black">Connect With Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">Discord:</span>
                <a 
                  href="https://discord.gg/builder" 
                  className="text-[#a97ff2] hover:text-[#9665d8] transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Join our Discord community
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">GitHub:</span>
                <a 
                  href="https://github.com/builderio/builder" 
                  className="text-[#a97ff2] hover:text-[#9665d8] transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Follow us on GitHub
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">Email:</span>
                <a 
                  href="mailto:support@builder.io" 
                  className="text-[#a97ff2] hover:text-[#9665d8] transition-colors"
                >
                  support@builder.io
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Want to learn more about Builder.io?
            </p>
            <a 
              href="https://www.builder.io" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button>Visit Builder.io</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
