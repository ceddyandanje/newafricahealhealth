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
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Log In or Create Account</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Access your account</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-green-100 text-green-600 rounded-full mb-4">
                  <HeartPulse className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Find Health & Drug Plans</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Explore our plans</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-red-100 text-red-600 rounded-full mb-4">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Emergency Services</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Get help immediately</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="inline-block p-4 bg-teal-100 text-teal-600 rounded-full mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Talk to Someone</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Connect with us</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
