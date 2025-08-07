
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle2, LifeBuoy } from "lucide-react";

export default function OrganTransplantsPage() {
    return (
      <div className="bg-background">
         <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
            <Image
                src="https://placehold.co/1920x800.png"
                alt="Surgical team performing a procedure"
                fill
                className="object-cover"
                data-ai-hint="surgery operation"
                priority
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-bold font-headline">Organ Transplant Services</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                    Coordinating life-saving transplants with leading global hospitals.
                </p>
            </div>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="relative h-96 rounded-2xl overflow-hidden glassmorphic p-2">
                    <Image
                        src="https://placehold.co/600x450.png"
                        alt="Heart illustration with technology elements"
                        fill
                        className="object-cover rounded-xl"
                        data-ai-hint="heart technology"
                    />
                </div>
                <div>
                    <h2 className="font-headline text-3xl font-semibold mb-4 text-primary">A Second Chance at Life</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                        Africa Heal Health provides a crucial link between patients and the world's leading organ transplant centers. We understand the urgency and complexity of transplant procedures and are dedicated to providing compassionate, comprehensive coordination services.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                            <span className="text-muted-foreground">Specializing in Kidney and Heart transplants.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                            <span className="text-muted-foreground">Access to a global network of accredited hospitals.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                            <span className="text-muted-foreground">Full logistical and emotional support for patients and families.</span>
                        </li>
                    </ul>
                     <Button size="lg" className="mt-6">
                        Inquire Now
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-center font-headline mb-10">Our Transplant Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="glassmorphic p-8">
                        <div className="flex items-start gap-4">
                             <div className="p-3 bg-primary/20 rounded-full w-fit">
                                <Heart className="h-8 w-8 text-primary"/>
                            </div>
                            <div>
                                <h3 className="font-headline text-xl font-semibold mb-2">Patient Evaluation</h3>
                                <p className="text-sm text-muted-foreground">
                                    Thorough assessment of medical records by transplant specialists to determine eligibility and the best course of action.
                                </p>
                            </div>
                        </div>
                    </div>
                     <div className="glassmorphic p-8">
                        <div className="flex items-start gap-4">
                             <div className="p-3 bg-primary/20 rounded-full w-fit">
                                <LifeBuoy className="h-8 w-8 text-primary"/>
                            </div>
                            <div>
                                <h3 className="font-headline text-xl font-semibold mb-2">Donor Matching & Logistics</h3>
                                <p className="text-sm text-muted-foreground">
                                    Assistance with legal donor arrangements and coordination of all pre-transplant logistics and travel.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
  