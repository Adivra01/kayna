import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, RotateCcw, Shield } from "lucide-react";
import { useLocalization } from "@/hooks/useLocalization";

const BrandPromiseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { home, isRTL } = useLocalization();

  const promises = [
    { icon: Truck, text: home.promiseShipping },
    { icon: RotateCcw, text: home.promiseReturns },
    { icon: Shield, text: home.promisePayment },
  ];

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-accent" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-16">
          {promises.map((promise) => (
            <div key={promise.text} className="flex items-center gap-3">
              <promise.icon className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">{promise.text}</span>
            </div>
          ))}
        </div>

        <div ref={contentRef} className="text-center">
          <h2 className="text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-bold text-primary leading-[1.1] mb-6">
            {home.promiseTitle1} <span className="italic">{home.promiseTitle2}</span> ?
          </h2>
          
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-secondary rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-dark-lg"
          >
            <span>{home.promiseCTA}</span>
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandPromiseSection;
