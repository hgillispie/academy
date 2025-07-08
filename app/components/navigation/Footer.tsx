export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-[802px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.builder.io/c/docs/introduction"
                  className="text-gray-600 hover:text-[#a97ff2]"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://forum.builder.io" className="text-gray-600 hover:text-[#a97ff2]">
                  Community Forum
                </a>
              </li>
              <li>
                <a
                  href="https://www.builder.io/blog"
                  className="text-gray-600 hover:text-[#a97ff2]"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.builder.io/c/docs/help"
                  className="text-gray-600 hover:text-[#a97ff2]"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/builderio/builder"
                  className="text-gray-600 hover:text-[#a97ff2]"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://discord.gg/builder" className="text-gray-600 hover:text-[#a97ff2]">
                  Discord
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.builder.io/privacy"
                  className="text-gray-600 hover:text-[#a97ff2]"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://www.builder.io/terms"
                  className="text-gray-600 hover:text-[#a97ff2]"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} Builder.io Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
