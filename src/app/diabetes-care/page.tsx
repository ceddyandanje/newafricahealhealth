
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Droplets, TestTube2, Apple } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function DiabetesCarePage() {
    return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="bg-background">
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
                <Image
                src="https://images.unsplash.com/photo-1624454002429-40ed87a5ec04?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Person checking blood sugar level with a glucometer"
                fill
                className="object-cover"
                data-ai-hint="diabetes glucometer"
                priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-bold font-headline">Diabetes Care</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                    Comprehensive support for managing diabetes, from monitoring supplies to medication and lifestyle guidance.
                </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="relative h-96 rounded-2xl overflow-hidden glassmorphic p-2">
                        <Image
                            src="https://images.unsplash.com/photo-1685485276223-0bb0226dcca8?q=80&w=756&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="A collection of healthy foods suitable for a diabetic diet"
                            fill
                            className="object-cover rounded-xl"
                            data-ai-hint="healthy food diabetes"
                        />
                    </div>
                    <div>
                        <h2 className="font-headline text-3xl font-semibold mb-4 text-primary">Empowering Your Diabetes Journey</h2>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                            Managing diabetes effectively is key to a healthy, active life. Africa Heal Health is your dedicated partner, providing a seamless supply of all your diabetes care needs. We simplify the process of getting your testing supplies, insulin, and other medications.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Our goal is to empower you with reliable products and valuable information, helping you maintain stable blood sugar levels and prevent complications.
                        </p>
                        <Button size="lg" className="mt-6" asChild>
                            <a href="/products?category=Diabetes+Care">Find Diabetes Supplies</a>
                        </Button>
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-center font-headline mb-10">Your Complete Diabetes Solution</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="glassmorphic p-6 text-center">
                            <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                <TestTube2 className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mb-2">Monitoring Supplies</h3>
                            <p className="text-sm text-muted-foreground">Get a steady supply of blood glucose meters, test strips, lancets, and continuous glucose monitors (CGMs).</p>
                        </div>
                        <div className="glassmorphic p-6 text-center">
                            <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                <Droplets className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mb-2">Insulin & Medication</h3>
                            <p className="text-sm text-muted-foreground">Reliable access to various types of insulin, oral medications, and supplies like syringes and insulin pump accessories.</p>
                        </div>
                        <div className="glassmorphic p-6 text-center">
                            <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                <Apple className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mb-2">Lifestyle Support</h3>
                            <p className="text-sm text-muted-foreground">Explore resources on diabetic-friendly diets, foot care products, and tips for healthy living with diabetes.</p>
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

    
