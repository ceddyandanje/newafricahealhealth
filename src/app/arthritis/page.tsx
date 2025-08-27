
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bone, Hand, Activity } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function ArthritisPage() {
    return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="bg-background">
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
                <Image
                src="https://images.unsplash.com/photo-1666886573215-b59d8ad9970c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Senior person holding their knee in discomfort"
                fill
                className="object-cover"
                data-ai-hint="knee pain"
                priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-bold font-headline">Arthritis & Joint Care</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                    Effective solutions to manage joint pain, reduce inflammation, and improve mobility.
                </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="font-headline text-3xl font-semibold mb-4 text-primary">Move with Greater Comfort</h2>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                            Arthritis and joint pain can significantly impact your daily life. Africa Heal Health offers a comprehensive range of products and medications to help you manage your symptoms and maintain an active lifestyle. We provide reliable access to pain relievers, anti-inflammatory drugs, and supportive aids.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Our goal is to help you find the right combination of treatments to reduce pain, protect your joints, and enhance your overall well-being.
                        </p>
                        <Button size="lg" className="mt-6" asChild>
                            <a href="/products?category=Arthritis">Browse Joint Care Products</a>
                        </Button>
                    </div>
                    <div className="relative h-96 rounded-2xl overflow-hidden glassmorphic p-2">
                        <Image
                            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=920&q=80"
                            alt="Senior person doing light stretching exercises"
                            fill
                            className="object-cover rounded-xl"
                            data-ai-hint="senior stretching"
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-center font-headline mb-10">Supporting Your Joint Health</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="glassmorphic p-6 text-center">
                            <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                <Hand className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mb-2">Pain Relief</h3>
                            <p className="text-sm text-muted-foreground">A wide selection of topical creams, patches, and oral analgesics to manage acute and chronic joint pain.</p>
                        </div>
                        <div className="glassmorphic p-6 text-center">
                            <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                <Bone className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mb-2">Anti-Inflammatory Medication</h3>
                            <p className="text-sm text-muted-foreground">Access to NSAIDs and other prescription medications to reduce swelling and inflammation in the joints.</p>
                        </div>
                        <div className="glassmorphic p-6 text-center">
                            <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                                <Activity className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-headline text-xl font-semibold mb-2">Support & Braces</h3>
                            <p className="text-sm text-muted-foreground">Find supportive braces for knees, wrists, and other joints to provide stability and reduce strain during activities.</p>
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

