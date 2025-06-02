function FAQSection({ faqData, activeTab, setActiveTab, expandedQuestion, setExpandedQuestion }) {
    return (
      <section className="py-20 px-4 bg-[#E3EFF9]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0A3E7A] mb-16">Frequently Asked Questions</h2>
          
          {/* Use the FAQTabs component */}
          <FAQTabs activeTab={activeTab} setActiveTab={setActiveTab} />
  
          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData[activeTab]?.map((item) => (
              <FAQItem
                key={item.question}
                item={item}
                expandedQuestion={expandedQuestion}
                setExpandedQuestion={setExpandedQuestion}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }