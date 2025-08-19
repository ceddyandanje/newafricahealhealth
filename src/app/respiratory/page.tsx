
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Wind, AirVent, ShieldPlus } from "lucide-react";

export default function RespiratoryPage() {
    return (
      <div className="bg-background">
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
            <Image
            src="https://placehold.co/870x580.png"
            alt="Person breathing fresh air in a mountain landscape"
            fill
            className="object-cover"
            data-ai-hint="fresh air breathing"
            priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Respiratory Care</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                Breathe easier with our specialized support for asthma, COPD, and other respiratory conditions.
            </p>
            </div>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="relative h-96 rounded-2xl overflow-hidden glassmorphic p-2">
                    <Image
                        src="https://placehold.co/920x613.png"
                        alt="Person doing yoga to improve breathing"
                        fill
                        className="object-cover rounded-xl"
                        data-ai-hint="yoga breathing"
                    />
                </div>
                <div>
                    <h2 className="font-headline text-3xl font-semibold mb-4 text-primary">Supporting Your Every Breath</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                        Managing a respiratory condition is a daily priority. Africa Heal Health offers reliable access to essential medications and devices, helping you maintain control over your respiratory health. We aim to empower you with the tools you need for a more active and comfortable life.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        From portable nebulizers for on-the-go treatment to a steady supply of inhalers and other medications, our service is designed for your convenience and peace of mind.
                    </p>
                    <Button size="lg" className="mt-6" asChild>
                         <a href="/products?category=Respiratory">Shop Respiratory Products</a>
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-center font-headline mb-10">How We Support Respiratory Health</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <AirVent className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Treatment Devices</h3>
                        <p className="text-sm text-muted-foreground">Access modern and portable nebulizers, spacers, and peak flow meters to effectively manage your condition.</p>
                    </div>
                     <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <Wind className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Medication Supply</h3>
                        <p className="text-sm text-muted-foreground">Dependable delivery of maintenance and rescue inhalers, and other prescription respiratory medications.</p>
                    </div>
                     <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <ShieldPlus className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Preventative Care</h3>
                        <p className="text-sm text-muted-foreground">Information and products to help you avoid triggers, manage allergies, and maintain optimal lung function.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
