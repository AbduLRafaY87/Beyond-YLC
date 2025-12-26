import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Beyond YLC ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              Beyond YLC is a platform that connects Young Leaders Conference (YLC) alumni and participants to collaborate on Social Action Projects (SAPs), share resources, and continue their impact beyond the conference. Our services include user profiles, project collaboration tools, community networking, and resource sharing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>

            <h3 className="text-lg font-medium text-gray-900 mb-2">Account Creation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use certain features of our Platform, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be at least 13 years old to create an account</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mb-2">Account Responsibilities</h3>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for all activities that occur under your account. You may not share your account credentials with others or allow unauthorized access to your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree not to use the Platform to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Harass, abuse, or harm others</li>
              <li>Post false, misleading, or defamatory content</li>
              <li>Distribute malware or engage in hacking activities</li>
              <li>Spam other users or send unsolicited communications</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Interfere with the Platform's operations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content and Intellectual Property</h2>

            <h3 className="text-lg font-medium text-gray-900 mb-2">User-Generated Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain ownership of content you create and share on the Platform. By posting content, you grant us a non-exclusive, royalty-free license to use, display, and distribute your content on the Platform.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Content</h3>
            <p className="text-gray-700 leading-relaxed">
              The Platform and its original content, features, and functionality are owned by Beyond YLC and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Please review our{' '}
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </Link>
              , which also governs your use of the Platform, to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account and access to the Platform immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Platform will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed">
              The Platform is provided "as is" without warranties of any kind. We do not guarantee that the Platform will be uninterrupted, error-free, or secure. Your use of the Platform is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall Beyond YLC be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless Beyond YLC and its affiliates from any claims, losses, liability, damages, and expenses arising from your use of the Platform or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Platform. Your continued use of the Platform after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@beyondylc.com" className="text-blue-600 hover:text-blue-700">
                legal@beyondylc.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
