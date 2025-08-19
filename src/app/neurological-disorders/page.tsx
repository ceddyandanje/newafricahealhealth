
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Brain, ShieldCheck, Activity } from "lucide-react";

export default function NeurologicalDisordersPage() {
    return (
      <div className="bg-background">
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
            <Image
            src="https://images.unsplash.com/photo-1559757175-245135b9915e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Abstract image of neural networks"
            fill
            className="object-cover"
            data-ai-hint="neural network"
            priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Neurological Disorders Care</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                Specialized support for managing neurological conditions like epilepsy, Parkinson's, and multiple sclerosis.
            </p>
            </div>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="relative h-96 rounded-2xl overflow-hidden glassmorphic p-2">
                    <Image
                        src="https://images.unsplash.com/photo-1584515933487-779824d29209?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Compassionate caregiver assisting a patient"
                        fill
                        className="object-cover rounded-xl"
                        data-ai-hint="caregiver patient"
                    />
                </div>
                <div>
                    <h2 className="font-headline text-3xl font-semibold mb-4 text-primary">Managing Neurological Health</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                       Neurological disorders require consistent, specialized care. Africa Heal Health is committed to providing reliable access to the medications that are crucial for managing symptoms and improving quality of life for individuals with conditions like epilepsy, Parkinson's disease, and more.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        We ensure a steady supply of your prescribed treatments, from anti-seizure medications to dopamine agonists, delivered discreetly to your door. Our service simplifies medication management, allowing you and your loved ones to focus on well-being.
                    </p>
                    <Button size="lg" className="mt-6" asChild>
                         <a href="/products?category=Chronic+Care">Explore Neurological Products</a>
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-center font-headline mb-10">How We Support Neurological Conditions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <ShieldCheck className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Epilepsy Management</h3>
                        <p className="text-sm text-muted-foreground">Dependable access to a range of anti-epileptic drugs (AEDs) to help control seizures and manage epilepsy.</p>
                    </div>
                     <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <Activity className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Movement Disorders</h3>
                        <p className="text-sm text-muted-foreground">Reliable supply of medications for Parkinson's disease and other movement disorders to help manage symptoms like tremors and stiffness.</p>
                    </div>
                     <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <Brain className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Cognitive & Nerve Health</h3>
                        <p className="text-sm text-muted-foreground">Access to treatments for multiple sclerosis, neuropathy, and other conditions affecting the central and peripheral nervous systems.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
