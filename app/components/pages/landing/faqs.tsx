interface FAQ {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export interface FAQSectionProps {
  title: string;
  subtitle: string;
  faqs: FAQ[];
}

export default function FAQSection({ title, subtitle, faqs }: FAQSectionProps) {
  return (
    <div className="bg-base-200 relative">
      <div id="faqs" className="absolute -top-20" />
      <div className="container text-center my-6 md:my-12 lg:my-18">
        <h2 className="text-2xl md:text-3xl mb-2 font-bold">{title}</h2>
        <p className="text-base max-w-3xl mx-auto">{subtitle}</p>

        <div className="my-4 md:my-8 lg:my-12 space-y-4 max-w-4xl mx-auto text-left">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="collapse collapse-plus bg-base-100 border-base-300 border"
            >
              <input
                type="checkbox"
                defaultChecked={faq.defaultOpen ?? true}
                name={`faq-${i}`}
                aria-label={`Collapse for ${faq.question}`}
              />
              <h3 className="collapse-title font-semibold">{faq.question}</h3>
              <div className="collapse-content text-sm">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
