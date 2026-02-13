import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-eu-blue py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          <p className="text-gray-300 mt-2">Last updated: January 17, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-8 prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-6">
            By accessing and using EU Jobs Brussels (the &quot;Service&quot;), you accept and agree to be bound by these 
            Terms of Service. If you do not agree to these terms, please do not use our Service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-600 mb-6">
            EU Jobs Brussels is an online job board platform that connects job seekers with employers in the 
            European Union affairs sector. We provide job listing services, application management tools, and 
            career resources.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
          <p className="text-gray-600 mb-4">When creating an account, you agree to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Job Seekers</h2>
          <p className="text-gray-600 mb-4">As a job seeker, you agree to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Provide truthful information in your profile and applications</li>
            <li>Not misrepresent your qualifications or experience</li>
            <li>Respect the confidentiality of employer information</li>
            <li>Not use the platform for any unlawful purpose</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Employers</h2>
          <p className="text-gray-600 mb-4">As an employer, you agree to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Post only legitimate job opportunities</li>
            <li>Provide accurate job descriptions and requirements</li>
            <li>Comply with all applicable employment laws</li>
            <li>Not discriminate against candidates based on protected characteristics</li>
            <li>Handle applicant data in accordance with GDPR</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment Terms</h2>
          <p className="text-gray-600 mb-6">
            Job posting fees are charged according to our published pricing. All payments are non-refundable 
            except as specified in our refund policy. We reserve the right to change our pricing with 30 days 
            notice.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Content</h2>
          <p className="text-gray-600 mb-4">You may not post content that:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Is false, misleading, or fraudulent</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains malware or harmful code</li>
            <li>Promotes discrimination or harassment</li>
            <li>Violates any applicable laws or regulations</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
          <p className="text-gray-600 mb-6">
            All content on EU Jobs Brussels, including logos, text, graphics, and software, is the property of 
            EU Jobs Brussels or its licensors and is protected by intellectual property laws. You may not 
            reproduce, distribute, or create derivative works without our express permission.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            EU Jobs Brussels is provided &quot;as is&quot; without warranties of any kind. We are not liable for any 
            indirect, incidental, or consequential damages arising from your use of the Service. Our total 
            liability shall not exceed the amount paid by you in the past 12 months.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to suspend or terminate your account at any time for violation of these terms 
            or for any other reason at our discretion. You may also terminate your account at any time by 
            contacting us.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
          <p className="text-gray-600 mb-6">
            These Terms shall be governed by and construed in accordance with the laws of Belgium. Any disputes 
            shall be subject to the exclusive jurisdiction of the courts of Brussels.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
          <p className="text-gray-600 mb-6">
            We may modify these Terms at any time. We will notify users of significant changes via email or 
            through the Service. Continued use of the Service after changes constitutes acceptance of the 
            modified Terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact</h2>
          <p className="text-gray-600 mb-6">
            For questions about these Terms, please contact us at:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700"><strong>Email:</strong> legal@eujobs.brussels</p>
            <p className="text-gray-700"><strong>Address:</strong> Rue de la Loi 200, 1049 Brussels, Belgium</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-eu-blue hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
