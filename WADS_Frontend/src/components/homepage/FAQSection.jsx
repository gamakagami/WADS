import { useState } from "react";
import FAQItem from "./FAQItem";
import SearchHelp from "./SearchHelp";
import CategoryTab from "./CategoryTab";

function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "How often should medical equipment be calibrated?",
      answer:
        "Calibration frequency varies by device. Most equipment requires calibration every 6-12 months, but check your device manual for specific requirements.",
    },
    {
      question: "What is the emergency support process?",
      answer:
        "For urgent equipment issues, call our 24/7 emergency support line. Have your device ID and facility code ready.",
    },
  ];

  const faqCategories = [
    "General Questions",
    "Equipment Maintenance",
    "Technical Support",
  ];
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section className="py-10 px-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openFAQ === index}
            toggle={() => setOpenFAQ(openFAQ === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
}

export default FAQSection;
