import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, HeartPulse, Stethoscope, Phone, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Doctor giving a thumbs up"
            fill
            className="object-cover object-top"
            data-ai-hint="doctor thumbs up"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Reliable Chronic Care & Emergency Response
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Your dedicated partner for managing chronic illness and accessing immediate medical services. We deliver wellness and peace of mind.
            </p>
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        <section className="bg-background -mt-24 relative z-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-muted p-6 rounded-lg text-center">
                <div className="inline-block p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg">Log In or Create Account</h3>
              </div>
              <div className="bg-muted p-6 rounded-lg text-center">
                <div className="inline-block p-4 bg-green-100 text-green-600 rounded-full mb-4">
                  <HeartPulse className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg">Find Health & Drug Plans</h3>
              </div>
              <div className="bg-muted p-6 rounded-lg text-center">
                <div className="inline-block p-4 bg-red-100 text-red-600 rounded-full mb-4">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg">Emergency Services</h3>
              </div>
              <div className="bg-muted p-6 rounded-lg text-center">
                <div className="inline-block p-4 bg-teal-100 text-teal-600 rounded-full mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg">Talk to Someone</h3>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
