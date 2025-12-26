import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Beyond YLC ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may collect personal information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>Name and contact information</li>
              <li>Email address and password</li>
              <li>Profile information and biography</li>
              <li>Social Action Project (SAP) details</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
            <p className="text-gray-700 leading-relaxed">
              We automatically collect certain information when you use our platform, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Pages visited and time spent on our platform</li>
              <li>Referral sources</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Provide and maintain our platform</li>
              <li>Create and manage your account</li>
              <li>Connect you with other community members</li>
              <li>Facilitate collaboration on Social Action Projects</li>
              <li>Send you important updates and communications</li>
              <li>Improve our platform and develop new features</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>With service providers who assist us in operating our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or merger</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Access and update your personal information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Request data portability</li>
              <li>Object to certain data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your experience on our platform. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform is intended for users who are at least 13 years old. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@beyondylc.com" className="text-blue-600 hover:text-blue-700">
                privacy@beyondylc.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
