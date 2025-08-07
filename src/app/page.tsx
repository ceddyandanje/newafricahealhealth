import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, HeartPulse, Stethoscope, Phone, ArrowRight, Plane, Heart } from "lucide-react"
import Typewriter from "@/components/effects/typewriter"

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow">
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="A doctor giving a thumbs up"
            fill
            className="object-cover object-center"
            data-ai-hint="doctor thumbs-up"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">
              Reliable Medical Solutions
            </h1>
            <div className="text-2xl md:text-4xl font-semibold text-primary mb-4 h-12">
                <Typewriter words={["Chronic Care", "Emergency Response", "Medical Tourism", "Organ Transplants"]} />
            </div>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Your dedicated partner for managing chronic illness and accessing immediate medical services. We deliver wellness and peace of mind.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-3">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        <section>
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-blue-100/30 dark:bg-blue-900/40 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-blue-200 text-blue-700 rounded-full mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Log In or Create Account</h3>
                <p className="text-sm text-muted-foreground mt-1">Access your information anytime, anywhere.</p>
              </div>
              <div className="bg-green-100/30 dark:bg-green-900/40 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-green-200 text-green-700 rounded-full mb-4">
                  <HeartPulse className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Find Health & Drug Plans</h3>
                <p className="text-sm text-muted-foreground mt-1">Find & compare products in your area.</p>
              </div>
              <div className="bg-red-100/30 dark:bg-red-900/40 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-red-200 text-red-700 rounded-full mb-4">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Emergency Services</h3>
                <p className="text-sm text-muted-foreground mt-1">Medevac air and ground ambulance services in partnership with Phoenix Aviation.</p>
              </div>
              <div className="bg-teal-100/30 dark:bg-teal-900/40 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-teal-200 text-teal-700 rounded-full mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Talk to Someone</h3>
                <p className="text-sm text-muted-foreground mt-1">Contact us for support and assistance.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Your Chronic Care Journey, Simplified
            </h2>
            <p className="text-lg text-muted-foreground mb-16">
              Your health journey in three simple steps.
            </p>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-start">
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4 z-10">1</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Upload Prescription</h3>
                <p className="text-muted-foreground">Safely upload your doctor's prescription. Our AI helps digitize it instantly.</p>
              </div>
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4 z-10">2</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Order Medicine</h3>
                <p className="text-muted-foreground">Browse our extensive catalog or use your digitized prescription to order.</p>
              </div>
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4 z-10">3</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Delivered to You</h3>
                <p className="text-muted-foreground">Receive your medication at your doorstep, with automated refills available.</p>
              </div>
            </div>
            <div className="mt-16">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-3">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Global & Emergency Services</h2>
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-16">
                    Access world-class healthcare solutions, including medical tourism, critical organ transplants, and emergency response, coordinated by our expert team.
                </p>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glassmorphic p-8 text-left flex flex-col">
                        <div className="flex items-center mb-4">
                            <div className="inline-block p-3 bg-primary/20 text-primary rounded-full mr-4">
                                <Plane className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">Medical Tourism</h3>
                        </div>
                        <p className="text-muted-foreground mb-6 flex-grow">
                            Travel abroad for top-quality, affordable medical care. We handle all the logistics, including hassle-free visa processing, so you can focus on your health.
                        </p>
                        <Button variant="outline" className="self-start">
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="glassmorphic p-8 text-left flex flex-col">
                        <div className="flex items-center mb-4">
                            <div className="inline-block p-3 bg-primary/20 text-primary rounded-full mr-4">
                                <Heart className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">Organ Transplants</h3>
                        </div>
                        <p className="text-muted-foreground mb-6 flex-grow">
                            We facilitate life-saving organ transplant procedures, specializing in Kidney and Heart transplants, by connecting you with leading global hospitals.
                        </p>
                        <Button variant="outline" className="self-start">
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
      </main>
    </div>
  )
}
