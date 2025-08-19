

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle2, LifeBuoy, Scissors, ShieldPlus, Package } from "lucide-react";
import Link from "next/link";

export default function OrganTransplantsPage() {
    return (
      <div className="bg-background">
         <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
            <Image
                src="https://images.unsplash.com/photo-1582719471384-894c86c97e54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format=fit=crop&w=870&q=80"
                alt="Surgical team performing a procedure"
                fill
                className="object-cover"
                data-ai-hint="surgery operation"
                priority
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-bold font-headline">Organ Transplant & Surgical Solutions</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                    Coordinating life-saving transplants and providing professional-grade surgical equipment.
                </p>
            </div>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="relative h-96 rounded-2xl overflow-hidden glassmorphic p-2">
                    <Image
                        src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
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

            {/* New Surgical Equipment Section */}
            <div className="py-16 text-center bg-muted/30 rounded-2xl">
                <h2 className="text-3xl font-bold font-headline mb-4">Professional Surgical Equipment</h2>
                <p className="text-muted-foreground mb-10 max-w-3xl mx-auto">
                    We also supply a comprehensive range of high-quality surgical equipment to medical professionals and facilities, ensuring they have the tools they need for optimal patient outcomes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10">
                    <div className="glassmorphic p-6">
                        <Scissors className="h-10 w-10 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-lg">Precision Instruments</h3>
                        <p className="text-sm text-muted-foreground">Scalpels, forceps, retractors, and more, crafted for accuracy.</p>
                    </div>
                    <div className="glassmorphic p-6">
                        <ShieldPlus className="h-10 w-10 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-lg">Sterilization & Disposables</h3>
                        <p className="text-sm text-muted-foreground">Autoclaves, surgical gloves, gowns, and sterile drapes.</p>
                    </div>
                     <div className="glassmorphic p-6">
                        <Package className="h-10 w-10 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-lg">General Supplies</h3>
                        <p className="text-sm text-muted-foreground">Sutures, staples, sponges, and other essential operating room supplies.</p>
                    </div>
                </div>
                 <Button size="lg" asChild>
                    <Link href="/products?category=Surgical+Equipment">Browse Surgical Equipment</Link>
                </Button>
            </div>

            <div className="pt-16">
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
  
