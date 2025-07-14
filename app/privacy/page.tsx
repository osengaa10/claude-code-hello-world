import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - How We Handle Your Information",
  description: "Learn about how BestTech Reviews collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
  keywords: "privacy policy, data protection, cookies, personal information, GDPR compliance",
  openGraph: {
    title: "Privacy Policy - How We Handle Your Information",
    description: "Learn about how BestTech Reviews collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
    type: "website",
  },
};

export default function Privacy() {
  const lastUpdated = "January 1, 2024";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <p className="text-gray-600 mb-8">
          <strong>Last updated:</strong> {lastUpdated}
        </p>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <p className="text-blue-800">
            At BestTech Reviews, we respect your privacy and are committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
        <ul className="space-y-2 mb-6">
          <li className="text-gray-700">• Website usage data (pages visited, time spent, clicks)</li>
          <li className="text-gray-700">• Device information (browser type, operating system, screen resolution)</li>
          <li className="text-gray-700">• IP address and general location information</li>
          <li className="text-gray-700">• Referral sources (how you found our website)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">Information You Provide</h3>
        <ul className="space-y-2 mb-6">
          <li className="text-gray-700">• Contact form submissions</li>
          <li className="text-gray-700">• Email addresses for newsletter subscriptions</li>
          <li className="text-gray-700">• Comments on articles (if applicable)</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
        <ul className="space-y-2 mb-6">
          <li className="text-gray-700">• To improve our website and user experience</li>
          <li className="text-gray-700">• To analyze website traffic and usage patterns</li>
          <li className="text-gray-700">• To respond to your inquiries and provide customer support</li>
          <li className="text-gray-700">• To send newsletters and updates (with your consent)</li>
          <li className="text-gray-700">• To comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
        <p className="text-gray-700 mb-4">
          We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. 
          This includes:
        </p>
        <ul className="space-y-2 mb-6">
          <li className="text-gray-700">• <strong>Essential cookies:</strong> Required for basic website functionality</li>
          <li className="text-gray-700">• <strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
          <li className="text-gray-700">• <strong>Advertising cookies:</strong> Used to display relevant ads and track affiliate links</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
        <p className="text-gray-700 mb-4">We use the following third-party services:</p>
        <ul className="space-y-2 mb-6">
          <li className="text-gray-700">• <strong>Google Analytics:</strong> Website traffic analysis</li>
          <li className="text-gray-700">• <strong>Amazon Associates:</strong> Affiliate marketing program</li>
          <li className="text-gray-700">• <strong>Vercel:</strong> Website hosting and analytics</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
        <p className="text-gray-700 mb-4">
          We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
        </p>
        <ul className="space-y-2 mb-6">
          <li className="text-gray-700">• With your explicit consent</li>
          <li className="text-gray-700">• To comply with legal requirements</li>
          <li className="text-gray-700">• To protect our rights and safety</li>
          <li className="text-gray-700">• With service providers who help us operate our website</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
        <p className="text-gray-700 mb-6">
          We implement appropriate technical and organizational security measures to protect your personal information 
          against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
          the internet is 100% secure.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
        <p className="text-gray-700 mb-4">You have the right to:</p>
        <ul className="space-y-2 mb-6">
          <li className="text-gray-700">• Access your personal information</li>
          <li className="text-gray-700">• Correct inaccurate information</li>
          <li className="text-gray-700">• Request deletion of your data</li>
          <li className="text-gray-700">• Opt out of marketing communications</li>
          <li className="text-gray-700">• Disable cookies through your browser settings</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
        <p className="text-gray-700 mb-6">
          Our website is not intended for children under 13 years of age. We do not knowingly collect personal 
          information from children under 13. If you are a parent or guardian and believe your child has provided 
          personal information, please contact us immediately.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
        <p className="text-gray-700 mb-6">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
          new Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">
            <strong>Email:</strong> privacy@besttech-reviews.com<br />
            <strong>Website:</strong> https://besttech-reviews.com/contact
          </p>
        </div>
      </div>
    </div>
  );
}