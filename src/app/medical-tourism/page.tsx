
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plane, Hospital, CalendarCheck, FileText } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function MedicalTourismPage() {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
            <div className="bg-background">
                <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
                    <Image
                    src="https://images.unsplash.com/photo-1566935843973-aed0ddcb0ecc?q=80&w=829&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Airplane wing over clouds"
                    fill
                    className="object-cover"
                    data-ai-hint="airplane travel"
                    priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline">Medical Tourism</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                        Access world-class healthcare, affordably and without stress. We handle everything.
                    </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <h2 className="font-headline text-3xl font-semibold mb-4 text-primary">Your Bridge to Global Healthcare</h2>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                Navigating international medical care can be complex. Africa Heal Health simplifies the entire process, connecting you with leading hospitals and specialists around the world. We manage the logistics so you can focus solely on your health and recovery.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                From initial consultation to travel arrangements and post-treatment care, our dedicated team provides personalized support every step of the way.
                            </p>
                            <Button size="lg" className="mt-6">
                                Start Your Journey
                            </Button>
                        </div>
                        <div className="relative h-96 rounded-2xl overflow-hidden glassmorphic p-2">
                            <Image
                                src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                                alt="Smiling patient talking to a doctor"
                                fill
                                className="object-cover rounded-xl"
                                data-ai-hint="patient doctor"
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-center font-headline mb-10">How It Works</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                            <div className="glassmorphic p-6 text-center">
                                <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                    <FileText className="h-8 w-8 text-primary"/>
                                </div>
                                <h3 className="font-headline text-xl font-semibold mb-2">1. Consultation</h3>
                                <p className="text-sm text-muted-foreground">Submit your medical records for a free, no-obligation quote and treatment plan from top hospitals.</p>
                            </div>
                            <div className="glassmorphic p-6 text-center">
                                <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                    <Hospital className="h-8 w-8 text-primary"/>
                                </div>
                                <h3 className="font-headline text-xl font-semibold mb-2">2. Hospital Selection</h3>
                                <p className="text-sm text-muted-foreground">We help you choose the best hospital and doctor based on your specific medical needs and budget.</p>
                            </div>
                            <div className="glassmorphic p-6 text-center">
                                <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                    <Plane className="h-8 w-8 text-primary"/>
                                </div>
                                <h3 className="font-headline text-xl font-semibold mb-2">3. Travel & Stay</h3>
                                <p className="text-sm text-muted-foreground">We handle all travel logistics, including flights, visas, and accommodation for a stress-free experience.</p>
                            </div>
                            <div className="glassmorphic p-6 text-center">
                                <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                    <CalendarCheck className="h-8 w-8 text-primary"/>
                                </div>
                                <h3 className="font-headline text-xl font-semibold mb-2">4. Treatment & Aftercare</h3>
                                <p className="text-sm text-muted-foreground">Receive world-class medical treatment and continuous follow-up support upon your return home.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
      </div>
    );
  }
  
