function SupportServices() {
    const services = [
      {
        Icon: Stethoscope,
        title: "Medical Equipment Support",
        description: "Comprehensive support for all medical devices and equipment",
        button: "Learn More"
      },
      {
        Icon: WrenchIcon,
        title: "Technical Assistance",
        description: "Expert troubleshooting and technical support for complex medical systems",
        button: "Contact Technicians"
      },
      {
        Icon: GraduationCap,
        title: "Training & Resources",
        description: "Educational materials and training programs for medical equipment",
        button: "Explore Resources"
      }
    ];
  
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#0A3E7A] mb-16">Our Support Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(({ Icon, title, description, button }) => (
              <div key={title} className="bg-[#E3EFF9] p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-6">
                  <Icon size={48} className="text-[#4A81C0]" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#0A3E7A]">{title}</h3>
                <p className="text-gray-600 mb-8">{description}</p>
                <button className="w-full bg-[#0A3E7A] text-white px-6 py-3 rounded-lg hover:bg-[#4A81C0] transition-colors">
                  {button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }