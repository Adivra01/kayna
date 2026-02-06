import { Users, Zap, Target } from "lucide-react";
import testimonialHero from "@/assets/chapter-community.jpg";

const stats = [
  { icon: Users, value: "500+", label: "Guerriers" },
  { icon: Zap, value: "100%", label: "Engagement" },
  { icon: Target, value: "1", label: "Vision" },
];

const TestimonialSection = () => {
  return (
    <section className="relative min-h-[80vh] bg-primary overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={testimonialHero}
          alt="KAYNA Community"
          loading="lazy"
          className="w-full h-full object-cover brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 min-h-[80vh] flex items-center py-20">
        <div className="max-w-2xl">
          <span className="text-accent text-sm uppercase tracking-[0.3em] mb-6 block">Le Cercle</span>

          <h2 className="text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-bold text-secondary leading-[0.9] mb-8">
            Une communauté.
            <span className="block text-accent italic mt-2">Pas seul.</span>
          </h2>

          <p className="text-xl text-secondary/60 mb-12 max-w-lg leading-relaxed">
            Rejoins ceux qui ont choisi de ne plus subir.
            Ici, on partage des outils, on transmet une vision, on avance ensemble.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-3 mx-auto">
                  <stat.icon className="w-7 h-7 text-accent" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-secondary">{stat.value}</div>
                <div className="text-sm text-secondary/50 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
