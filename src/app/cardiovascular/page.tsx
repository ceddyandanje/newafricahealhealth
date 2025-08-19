
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Activity, LineChart } from "lucide-react";

export default function CardiovascularPage() {
    return (
      <div className="bg-background">
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
            <Image
            src="https://placehold.co/870x580.png"
            alt="Illustration of a healthy heart with EKG lines"
            fill
            className="object-cover"
            data-ai-hint="heart ekg"
            priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Cardiovascular Health</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                Dedicated support and products for maintaining a healthy heart and managing cardiovascular conditions.
            </p>
            </div>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                    <h2 className="font-headline text-3xl font-semibold mb-4 text-primary">Proactive Heart Care</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                        Your cardiovascular health is central to your overall well-being. At Africa Heal Health, we provide the tools and support needed to monitor, manage, and improve your heart health. From managing hypertension to post-operative care, we are here for you.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Our services include reliable delivery of cardiovascular medications and state-of-the-art monitoring devices to help you and your doctor stay informed and in control.
                    </p>
                    <Button size="lg" className="mt-6" asChild>
                       <a href="/products?category=Cardiovascular">Browse Heart Health Products</a>
                    </Button>
                </div>
                <div className="relative h-96 rounded-2xl overflow-hidden glassmorphic p-2">
                    <Image
                        src="https://placehold.co/870x580.png"
                        alt="Doctor showing a patient a heart model"
                        fill
                        className="object-cover rounded-xl"
                        data-ai-hint="doctor heart model"
                    />
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-center font-headline mb-10">Our Cardiovascular Support Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <LineChart className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Health Monitoring</h3>
                        <p className="text-sm text-muted-foreground">Access easy-to-use blood pressure monitors and other devices to track your cardiovascular health from home.</p>
                    </div>
                     <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <Heart className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Medication Management</h3>
                        <p className="text-sm text-muted-foreground">Reliable supply of prescription medications for conditions like hypertension, high cholesterol, and heart failure.</p>
                    </div>
                     <div className="glassmorphic p-6 text-center">
                        <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                            <Activity className="h-8 w-8 text-primary"/>
                        </div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Lifestyle Resources</h3>
                        <p className="text-sm text-muted-foreground">Get access to expert-backed content on heart-healthy diets, exercise, and stress management techniques.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
