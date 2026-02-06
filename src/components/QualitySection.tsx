import { useLocalization } from "@/hooks/useLocalization";

const QualitySection = () => {
  const { home, isRTL } = useLocalization();

  return (
    <section id="qualite" className="py-24 lg:py-32 bg-background scroll-mt-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent text-sm uppercase tracking-[0.3em] mb-6 block">{home.qualLabel}</span>
          <h2 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold text-foreground leading-[0.9]">
            {home.qualTitle1}
            <span className="block text-accent italic mt-2">{home.qualTitle2}</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-6 lg:gap-12 max-w-4xl mx-auto">
          {home.qualItems.map((quality) => (
            <div
              key={quality.label}
              className="text-center p-6 lg:p-10 rounded-3xl bg-card border border-border hover:border-accent/30 transition-colors"
            >
              <div className="text-4xl sm:text-6xl lg:text-7xl font-black text-accent">
                {quality.number}
                <span className="text-2xl sm:text-3xl lg:text-4xl">{quality.unit}</span>
              </div>
              <div className="text-sm sm:text-base text-muted-foreground mt-3 uppercase tracking-wider">
                {quality.label}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-lg mt-12 max-w-xl mx-auto">
          {home.qualMessage}
        </p>
      </div>
    </section>
  );
};

export default QualitySection;
