import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-gray-300 mt-2">Last updated: January 17, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-8 prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            EU Jobs (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you visit our website 
            and use our services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
          <p className="text-gray-600 mb-4">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Account information (name, email, password)</li>
            <li>Profile information (CV, work history, skills)</li>
            <li>Job application data</li>
            <li>Communication preferences</li>
            <li>Payment information (for employers)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process job applications and connect job seekers with employers</li>
            <li>Send you job alerts and relevant notifications</li>
            <li>Process payments and prevent fraud</li>
            <li>Respond to your comments and questions</li>
            <li>Analyze usage patterns to improve user experience</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
          <p className="text-gray-600 mb-6">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Employers when you apply for jobs</li>
            <li>Service providers who assist in our operations</li>
            <li>Legal authorities when required by law</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
          <p className="text-gray-600 mb-6">
            We implement appropriate technical and organizational measures to protect your personal data against 
            unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, 
            and regular security assessments.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights (GDPR)</h2>
          <p className="text-gray-600 mb-4">Under the General Data Protection Regulation (GDPR), you have the right to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
          <p className="text-gray-600 mb-6">
            We use cookies and similar tracking technologies to track activity on our website and hold certain 
            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is 
            being sent.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
          <p className="text-gray-600 mb-6">
            We retain your personal data only for as long as necessary to fulfill the purposes for which it was 
            collected, including to satisfy legal, accounting, or reporting requirements. Inactive accounts may 
            be deleted after 24 months.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700"><strong>Email:</strong> privacy@eujobs.co</p>
            <p className="text-gray-700"><strong>Address:</strong> Rue de la Loi 200, 1049 Brussels, Belgium</p>
          </div>

          <div className="border-t pt-6 mt-8">
            <p className="text-gray-500 text-sm">
              This privacy policy is compliant with the General Data Protection Regulation (GDPR) and Belgian 
              data protection laws.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-eu-blue hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
