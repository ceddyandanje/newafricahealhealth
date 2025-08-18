
'use client';

import Image from "next/image";
import { Phone, LifeBuoy, Ambulance } from "lucide-react";
import DetailedEmergencyForm from "@/components/health/detailed-emergency-form";

export default function EmergencyServicesPage() {
  return (
    <div className="bg-background">
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1554734867-bf3c00a49371?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Ambulance speeding down a city street"
          fill
          className="object-cover"
          data-ai-hint="ambulance emergency"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Emergency Medical Services</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
            Rapid, reliable, and expert care when every second counts.
          </p>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-headline text-3xl font-semibold mb-4 text-primary">In Partnership with Phoenix Aviation</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Africa Heal Health has partnered with the industry-leading <strong className="font-semibold text-foreground">Phoenix Aviation</strong> to provide world-class emergency medical services. This collaboration ensures that our clients receive the highest standard of care during critical situations, leveraging Phoenix Aviation's extensive experience and state-of-the-art fleet.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether it's a critical medical evacuation from a remote location or swift ground ambulance transport, our joint services are designed for maximum efficiency and patient safety.
            </p>
            <DetailedEmergencyForm />
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden glassmorphic p-2">
              <Image
                  src="https://images.unsplash.com/photo-1586368635215-f13c34d616e5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Helicopter ambulance flying over a landscape"
                  fill
                  className="object-cover rounded-xl"
                  data-ai-hint="ambulance emergency"
              />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center font-headline mb-10">Our Emergency Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="glassmorphic p-8 text-center">
                <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                    <LifeBuoy className="h-10 w-10 text-primary"/>
                </div>
              <h3 className="font-headline text-2xl font-semibold mb-2">Medical Evacuation (Medevac)</h3>
              <p className="text-muted-foreground">
                Air ambulance services for emergency evacuations from any location. Our fleet, operated by Phoenix Aviation, is equipped with advanced medical technology to provide ICU-level care in the air.
              </p>
            </div>
            <div className="glassmorphic p-8 text-center">
                <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                    <Ambulance className="h-10 w-10 text-primary"/>
                </div>
              <h3 className="font-headline text-2xl font-semibold mb-2">Ground Ambulance</h3>
              <p className="text-muted-foreground">
                24/7 advanced and basic life support ground ambulance services. Our teams are highly trained to manage medical emergencies with speed and compassion, ensuring safe and swift transport to medical facilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
