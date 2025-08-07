

import Image from "next/image";
import { CheckCircle2, Stethoscope, HeartPulse, Brain, Plane, LifeBuoy } from "lucide-react";

export default function ServicesPage() {
    return (
      <div className="bg-background">
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
            <Image
                src="https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Surgical team performing a procedure"
                fill
                className="object-cover"
                data-ai-hint="surgery operation"
                priority
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-bold font-headline">Our Services</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                  Comprehensive healthcare solutions designed to meet your needs, from chronic care to specialized medical services.
                </p>
            </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-96 rounded-2xl overflow-hidden glassmorphic p-2">
                 <Image
                    src="https://placehold.co/600x450.png"
                    alt="Doctor discussing with a patient"
                    fill
                    className="object-cover rounded-xl"
                    data-ai-hint="doctor patient discussion"
                />
            </div>
            <div>
              <h2 className="font-headline text-3xl font-semibold mb-4">Dedicated to Your Well-being</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                At Africa Heal Health, we provide a holistic range of services to ensure you and your loved ones have access to the best possible care. Our approach combines technology, expert medical knowledge, and a deep commitment to patient well-being.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                    <span className="text-muted-foreground">Personalized chronic disease management plans.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                    <span className="text-muted-foreground">Coordination of international medical travel and treatment.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                    <span className="text-muted-foreground">Rapid and reliable emergency medical response.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                    <span className="text-muted-foreground">Compassionate coordination for organ transplant services.</span>
                </li>
              </ul>
            </div>
          </div>
  
          <div>
            <h2 className="text-3xl font-bold text-center font-headline mb-10">Explore Our Core Offerings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glassmorphic p-8 text-center flex flex-col items-center">
                <div className="p-4 bg-primary/20 rounded-full w-fit mb-4">
                    <HeartPulse className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-headline text-xl font-semibold mb-2">Chronic Care</h3>
                <p className="text-sm text-muted-foreground">Manage long-term health conditions with ease through medication delivery, refill reminders, and access to specialists.</p>
              </div>
              <div className="glassmorphic p-8 text-center flex flex-col items-center">
                <div className="p-4 bg-primary/20 rounded-full w-fit mb-4">
                    <LifeBuoy className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-headline text-xl font-semibold mb-2">Emergency Response</h3>
                <p className="text-sm text-muted-foreground">Fast and reliable medical evacuation and ground ambulance services when every second counts.</p>
              </div>
              <div className="glassmorphic p-8 text-center flex flex-col items-center">
                <div className="p-4 bg-primary/20 rounded-full w-fit mb-4">
                    <Plane className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-headline text-xl font-semibold mb-2">Medical Tourism</h3>
                <p className="text-sm text-muted-foreground">We facilitate seamless medical tourism with world-renowned hospitals for specialized treatments.</p>
              </div>
               <div className="glassmorphic p-8 text-center flex flex-col items-center">
                <div className="p-4 bg-primary/20 rounded-full w-fit mb-4">
                    <Brain className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-headline text-xl font-semibold mb-2">Organ Transplants</h3>
                <p className="text-sm text-muted-foreground">Coordinating life-saving organ transplants, specializing in kidney and heart procedures.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  