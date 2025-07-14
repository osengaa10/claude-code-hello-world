import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Website Usage Terms",
  description: "Read our terms of service to understand the rules and regulations for using BestTech Reviews website and services.",
  keywords: "terms of service, website terms, user agreement, legal, usage rules",
  openGraph: {
    title: "Terms of Service - Website Usage Terms",
    description: "Read our terms of service to understand the rules and regulations for using BestTech Reviews website and services.",
    type: "website",
  },
};

export default function Terms() {
  const lastUpdated = "January 1, 2024";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <p className="text-gray-600 mb-8">
          <strong>Last updated:</strong> {lastUpdated}
        </p>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <p className="text-blue-800">
            By accessing and using BestTech Reviews website, you agree to be bound by these Terms of Service 
            and all applicable laws and regulations. If you do not agree with any of these terms, 
            you are prohibited from using this site.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Use License</h2>
        <p className="text-gray-700 mb-4">
          Permission is granted to temporarily download one copy of the materials on BestTech Reviews 
          for personal, non-commercial transitory viewing only. This is the grant of a license, not a 
          transfer of title, and under this license you may not:
        </p>
        <ul className="space-y-2 mb-6">
          <li className="text-gray-700">• Modify or copy the materials</li>
          <li className="text-gray-700">• Use the materials for any commercial purpose or for any public display</li>
          <li className="text-gray-700">• Attempt to reverse engineer any software contained on the website</li>
          <li className="text-gray-700">• Remove any copyright or other proprietary notations from the materials</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Disclaimer</h2>
        <p className="text-gray-700 mb-6">
          The materials on BestTech Reviews are provided on an 'as is' basis. BestTech Reviews makes no 
          warranties, expressed or implied, and hereby disclaims and negates all other warranties including 
          without limitation, implied warranties or conditions of merchantability, fitness for a particular 
          purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Limitations</h2>
        <p className="text-gray-700 mb-6">
          In no event shall BestTech Reviews or its suppliers be liable for any damages (including, without 
          limitation, damages for loss of data or profit, or due to business interruption) arising out of 
          the use or inability to use the materials on BestTech Reviews, even if BestTech Reviews or its 
          authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Accuracy of Materials</h2>
        <p className="text-gray-700 mb-6">
          The materials appearing on BestTech Reviews could include technical, typographical, or photographic 
          errors. BestTech Reviews does not warrant that any of the materials on its website are accurate, 
          complete, or current. BestTech Reviews may make changes to the materials contained on its website 
          at any time without notice.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Links</h2>
        <p className="text-gray-700 mb-6">
          BestTech Reviews has not reviewed all of the sites linked to our website and is not responsible 
          for the contents of any such linked site. The inclusion of any link does not imply endorsement 
          by BestTech Reviews of the site. Use of any such linked website is at the user's own risk.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Affiliate Links</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-800">
            BestTech Reviews participates in affiliate marketing programs. This means we may receive 
            commissions for purchases made through links on our website. These affiliate relationships 
            do not influence our editorial opinions or product recommendations.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. User Content</h2>
        <p className="text-gray-700 mb-4">
          If you submit content to our website (such as comments or reviews), you grant us a non-exclusive, 
          royalty-free license to use, modify, and distribute that content. You are responsible for ensuring 
          that your content:
        </p>
        <ul className="space-y-2 mb-6">
          <li className="text-gray-700">• Does not violate any laws or regulations</li>
          <li className="text-gray-700">• Does not infringe on third-party rights</li>
          <li className="text-gray-700">• Is not harmful, threatening, or abusive</li>
          <li className="text-gray-700">• Does not contain spam or commercial solicitation</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy Policy</h2>
        <p className="text-gray-700 mb-6">
          Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
          of the website, to understand our practices.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications</h2>
        <p className="text-gray-700 mb-6">
          BestTech Reviews may revise these terms of service at any time without notice. By using this 
          website, you are agreeing to be bound by the then current version of these terms of service.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
        <p className="text-gray-700 mb-6">
          These terms and conditions are governed by and construed in accordance with the laws of the 
          United States and you irrevocably submit to the exclusive jurisdiction of the courts in that 
          state or location.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions about these Terms of Service, please contact us:
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">
            <strong>Email:</strong> legal@besttech-reviews.com<br />
            <strong>Website:</strong> https://besttech-reviews.com/contact
          </p>
        </div>
      </div>
    </div>
  );
}