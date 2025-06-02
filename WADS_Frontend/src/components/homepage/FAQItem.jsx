/* eslint-disable react/prop-types */
import { ChevronDown } from "lucide-react";

function FAQItem({ question, answer, isOpen, toggle }) {
  return (
    <div
      className={`rounded-md overflow-hidden ${
        isOpen ? "border-2" : ""
      }l shadow-md`}
    >
      <button
        className="w-full text-left p-4 flex justify-between items-center bg-white"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span className="font-medium">{question}</span>
        <ChevronDown
          size={20}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-32" : "max-h-0"
        }`}
      >
        <div className="p-4 bg-blue-50 text-sm text-gray-700">{answer}</div>
      </div>
    </div>
  );
}
export default FAQItem;
