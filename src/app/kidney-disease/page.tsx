
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Filter, Droplets, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function KidneyDiseasePage() {
    return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="bg-background">
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
                <Image
                src="https://images.unsplash.com/photo-1650897492524-bbc1adb72626?q=80&w=911&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Medical illustration of kidneys"
                fill
                className="object-cover"
                data-ai-hint="kidney illustration"
                priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-bold font-headline">Kidney Disease Care</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                    Dedicated support for managing Chronic Kidney Disease (CKD) and maintaining renal health.
                </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="relative h-96 rounded-2xl overflow-hidden glassmorphic p-2">
                        <Image
                            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                            alt="Doctor discussing results with a patient"
                            fill
                            className="object-cover rounded-xl"
                            data-ai-hint="doctor patient discussion"
                        />
                    </div>
                    <div>
                        <h2 className="font-headline text-3xl font-semibold mb-4 text-primary">Comprehensive Renal Support</h2>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                            Living with Chronic Kidney Disease requires careful management and consistent access to care. Africa Heal Health provides reliable delivery of essential medications, specialized dietary supplements, and monitoring equipment to help you manage your condition effectively.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Our services are designed to support you through every stage of CKD, working in tandem with your healthcare provider to help preserve kidney function and improve your quality of life.
                        </p>
                        <Button size="lg" className="mt-6" asChild>
                            <a href="/products?category=Chronic+Care">Explore Renal Products</a>
                        </Button>
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-center font-headline mb-10">Our Support for Kidney Health</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="glassmorphic p-6 text-center">
                            <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                <Droplets className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mb-2">Blood Pressure Control</h3>
                            <p className="text-sm text-muted-foreground">Access to a range of antihypertensive medications and home blood pressure monitors, crucial for managing CKD.</p>
                        </div>
                        <div className="glassmorphic p-6 text-center">
                            <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                <Filter className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mb-2">Medication Management</h3>
                            <p className="text-sm text-muted-foreground">Reliable supply of phosphate binders, erythropoiesis-stimulating agents (ESAs), and other vital CKD medications.</p>
                        </div>
                        <div className="glassmorphic p-6 text-center">
                            <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                <ShieldCheck className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mb-2">Dietary Support</h3>
                            <p className="text-sm text-muted-foreground">Access to renal-specific vitamins and nutritional supplements to help manage your dietary needs.</p>
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

