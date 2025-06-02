import ServiceCard from "./ServiceCard";
import { FaStethoscope } from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { FaGraduationCap } from "react-icons/fa";
function ServicesSection() {
  return (
    <section className="py-10 px-4 bg-gray-50">
      <h2 className="text-center text-2xl font-bold mb-8">
        Our Support Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <ServiceCard
          icon={FaStethoscope}
          title="Medical Equipment Support"
          description="Comprehensive support for all medical devices and equipment"
          buttonText="Learn More"
          buttonLink="#"
        />
        <ServiceCard
          icon={FaScrewdriverWrench}
          title="Technical Assistance"
          description="Expert troubleshooting and technical support for complex medical systems"
          buttonText="Contact Technicians"
          buttonLink="#"
        />
        <ServiceCard
          icon={FaGraduationCap}
          title="Training & Resources"
          description="Educational materials and training programs for medical equipment"
          buttonText="Explore Resources"
          buttonLink="#"
          iconProps={{
            size: 30,
            style: { transform: "scaleY(1.3)" }, // This makes the icon taller
          }}
        />
      </div>
    </section>
  );
}

export default ServicesSection;
