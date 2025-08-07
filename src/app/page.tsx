import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, HeartPulse, Stethoscope, Phone, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-gray-900">
      <main className="flex-grow">
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="A doctor smiling"
            fill
            className="object-cover object-center"
            data-ai-hint="doctor smiling"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Reliable Chronic Care & Emergency Response
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Your dedicated partner for managing chronic illness and accessing immediate medical services. We deliver wellness and peace of mind.
            </p>
            <Button size="lg" className="bg-[#28a745] hover:bg-[#218838] text-white font-semibold rounded-full px-8 py-3">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        <section className="bg-transparent -mt-20 relative z-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-blue-100/80 dark:bg-blue-900/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-blue-200 text-blue-700 rounded-full mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Log In or Create Account</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Access your information anytime, anywhere.</p>
              </div>
              <div className="bg-green-100/80 dark:bg-green-900/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-green-200 text-green-700 rounded-full mb-4">
                  <HeartPulse className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Find Health & Drug Plans</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Find & compare products in your area.</p>
              </div>
              <div className="bg-red-100/80 dark:bg-red-900/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-red-200 text-red-700 rounded-full mb-4">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Emergency Services</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Medevac air and ground ambulance services in partnership with Phoenix Aviations.</p>
              </div>
              <div className="bg-teal-100/80 dark:bg-teal-900/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-teal-200 text-teal-700 rounded-full mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Talk to Someone</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Contact us for support and assistance.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Your Chronic Care Journey, Simplified
            </h2>
            <p className="text-lg text-muted-foreground mb-16">
              Your health journey in three simple steps.
            </p>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-start">
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#28a745] text-white flex items-center justify-center text-2xl font-bold mb-4 z-10">1</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Upload Prescription</h3>
                <p className="text-muted-foreground">Safely upload your doctor's prescription. Our AI helps digitize it instantly.</p>
              </div>
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#28a745] text-white flex items-center justify-center text-2xl font-bold mb-4 z-10">2</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Order Medicine</h3>
                <p className="text-muted-foreground">Browse our extensive catalog or use your digitized prescription to order.</p>
              </div>
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#28a745] text-white flex items-center justify-center text-2xl font-bold mb-4 z-10">3</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Delivered to You</h3>
                <p className="text-muted-foreground">Receive your medication at your doorstep, with automated refills available.</p>
              </div>
            </div>
            <div className="mt-16">
              <Button size="lg" className="bg-[#28a745] hover:bg-[#218838] text-white font-semibold rounded-full px-8 py-3">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
