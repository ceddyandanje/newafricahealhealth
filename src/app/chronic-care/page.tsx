
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeartPulse, Repeat, ShieldCheck } from "lucide-react";

export default function ChronicCarePage() {
    return (
      <div className="bg-background">
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
            <Image
            src="https://placehold.co/1920x800.png"
            alt="Elderly person smiling and holding hands with a caregiver"
            fill
            className="object-cover"
            data-ai-hint="caregiver patient"
            priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Chronic Care Management</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                Simplified, compassionate, and continuous care for long-term health conditions.
            </p>
            </div>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                    <h2 className="font-headline text-3xl font-semibold mb-4 text-primary">Your Partner in Long-Term Health</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                        Living with a chronic condition requires consistent management and support. Africa Heal Health provides comprehensive solutions to help you manage your health with confidence and ease. We handle the complexities of medication management so you can focus on living your life to the fullest.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Our services are designed to provide peace of mind through reliable medication delivery, automated refills, and access to a supportive community and resources.
                    </p>
                    <Button size="lg" className="mt-6" asChild>
                        <a href="/products?category=Chronic+Care">Explore Products</a>
                    </Button>
                </div>
                <div className="relative h-96 rounded-2xl overflow-hidden glassmorphic p-2">
                    <Image
                        src="https://placehold.co/600x450.png"
                        alt="Pharmacist discussing medication with a patient"
                        fill
                        className="object-cover rounded-xl"
                        data-ai-hint="pharmacist patient"
                    />
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-center font-headline mb-10">Features of Our Chronic Care Program</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <HeartPulse className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Medication Delivery</h3>
                        <p className="text-sm text-muted-foreground">Receive your prescription medications delivered discreetly and reliably to your doorstep every month.</p>
                    </div>
                     <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <Repeat className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Automated Refills</h3>
                        <p className="text-sm text-muted-foreground">Never worry about running out of medication. Our system manages your refill schedule automatically.</p>
                    </div>
                     <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <ShieldCheck className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Condition Management</h3>
                        <p className="text-sm text-muted-foreground">Access tools, resources, and expert advice to better manage conditions like diabetes, hypertension, and more.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
