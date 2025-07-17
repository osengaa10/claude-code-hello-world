interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
  className?: string;
}

export default function FAQSchema({ faqs, className = '' }: FAQSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={`bg-primary-800 rounded-xl p-8 mt-12 ${className}`}>
        <h2 className="text-3xl font-semibold text-white mb-8 pb-2 border-b border-primary-600">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-primary-700 pb-6 last:border-b-0">
              <h3 className="text-xl font-semibold text-white mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-200 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}