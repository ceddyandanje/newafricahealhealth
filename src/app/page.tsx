

import Link from "next/link"
import Image from "next/image"
import { Button, buttonVariants } from "@/components/ui/button"
import { User, HeartPulse, Stethoscope, Phone, ArrowRight, Plane, Heart, Pill, Brain, Ambulance, LifeBuoy, Sparkles, Truck, Video, ClipboardList, BookText, Star, RefreshCw } from "lucide-react"
import Typewriter from "@/components/effects/typewriter"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ConsultationForm from "@/components/forms/consultation-form"


export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[70vh] min-h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1618498082410-b4aa22193b38?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Healthcare professional smiling"
              fill
              className="object-cover object-center"
              data-ai-hint="doctor smiling"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
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
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-3">
                        <Link href="/about">Learn More <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                </div>
            </div>
          </div>
          <div className="relative container mx-auto px-4 -mt-20 z-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link href="/login" className="block group h-full">
                <div className="bg-blue-100/30 dark:bg-blue-900/40 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <div className="inline-block p-4 bg-blue-200 text-blue-700 rounded-full mb-4">
                    <User className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">Personalized Care</h3>
                  <p className="text-sm text-muted-foreground mt-1">Log in to access personalized care anytime, anywhere.</p>
                </div>
              </Link>
              <Link href="/products" className="block group h-full">
                <div className="bg-green-100/30 dark:bg-green-900/40 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <div className="inline-block p-4 bg-green-200 text-green-700 rounded-full mb-4">
                    <HeartPulse className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">Health & Drug Plans</h3>
                  <p className="text-sm text-muted-foreground mt-1">Find & compare products in your area.</p>
                </div>
              </Link>
              <Link href="/emergency-services" className="block group h-full">
                <div className="bg-red-100/30 dark:bg-red-900/40 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <div className="inline-block p-4 bg-red-200 text-red-700 rounded-full mb-4">
                    <Stethoscope className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">Emergency Services</h3>
                  <p className="text-sm text-muted-foreground mt-1">Medevac and ground ambulance services.</p>
                </div>
              </Link>
              <Link href="/#consultation" className="block group h-full">
                <div className="bg-teal-100/30 dark:bg-teal-900/40 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <div className="inline-block p-4 bg-teal-200 text-teal-700 rounded-full mb-4">
                    <Phone className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground mt-1">Contact us for support and assistance.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Global & Emergency Services Section */}
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
                            Travel abroad for top-quality, affordable medical care. We handle all the logistics, so you can focus on your health.
                        </p>
                        <Link href="/medical-tourism" className={cn(buttonVariants({ variant: "outline" }), "self-start")}>
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                    <div className="glassmorphic p-8 text-left flex flex-col">
                        <div className="flex items-center mb-4">
                            <div className="inline-block p-3 bg-primary/20 text-primary rounded-full mr-4">
                                <Heart className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">Organ Transplants</h3>
                        </div>
                        <p className="text-muted-foreground mb-6 flex-grow">
                            We facilitate life-saving organ transplant procedures by connecting you with leading global hospitals.
                        </p>
                         <Link href="/organ-transplants" className={cn(buttonVariants({ variant: "outline" }), "self-start")}>
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted/20">
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
                <p className="text-muted-foreground">Browse our catalog or use your digitized prescription to order.</p>
              </div>
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4 z-10">3</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Delivered to You</h3>
                <p className="text-muted-foreground">Receive your medication at your doorstep, with automated refills.</p>
              </div>
            </div>
            <div className="mt-16">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-3" asChild>
                <Link href="/products">Shop Products <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Chronic Care Management Section */}
        <section className="relative py-20 text-white">
          <div className="absolute inset-0">
            <Image 
              src="https://images.unsplash.com/photo-1655313719493-16ebe4906441?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Medical background"
              fill
              className="object-cover"
              data-ai-hint="pills medication"
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Chronic Care Management</h2>
            <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
              Everything you need for seamless health management, delivered to your doorstep.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background/20 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Automated Refills</h3>
                  <p className="text-sm text-white/80">Never miss a dose with our smart, automated prescription refill service.</p>
                </div>
              </div>
              <div className="bg-background/20 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">AI Health Assistant</h3>
                  <p className="text-sm text-white/80">Get instant, personalized answers to your health questions 24/7.</p>
                </div>
              </div>
              <div className="bg-background/20 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Nationwide Delivery</h3>
                  <p className="text-sm text-white/80">Fast, discreet, and reliable delivery of medications to your doorstep.</p>
                </div>
              </div>
              <div className="bg-background/20 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <Video className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Tele-Consultations</h3>
                  <p className="text-sm text-white/80">Connect with certified pharmacists and doctors online for expert advice.</p>
                </div>
              </div>
              <div className="bg-background/20 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Chronic Care Plans</h3>
                  <p className="text-sm text-white/80">Personalized long-term plans to help you manage your chronic conditions.</p>
                </div>
              </div>
              <div className="bg-background/20 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <BookText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Wellness Content</h3>
                  <p className="text-sm text-white/80">Access a rich library of articles from trusted healthcare professionals.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-12 bg-muted/20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">What Our Patients Say</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
                    Real stories from people we've helped on their health journey.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-background p-8 rounded-2xl shadow-lg flex flex-col text-left">
                        <div className="flex text-yellow-400 mb-4">
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                        </div>
                        <p className="text-muted-foreground mb-6 flex-grow">
                            "Managing my diabetes used to be a constant worry. The automated refills are a lifesaver, and the delivery is always on time. I feel so much more in control of my health now."
                        </p>
                        <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                                <AvatarImage src="https://placehold.co/100x100.png" alt="Amina K." data-ai-hint="smiling person" width={100} height={100} />
                                <AvatarFallback>AK</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">Amina K.</p>
                                <p className="text-sm text-muted-foreground">Diabetes Patient</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-background p-8 rounded-2xl shadow-lg flex flex-col text-left">
                         <div className="flex text-yellow-400 mb-4">
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                        </div>
                        <p className="text-muted-foreground mb-6 flex-grow">
                            "The AI assistant is surprisingly helpful for quick questions about my medication. It's like having a pharmacist available 24/7. This service has truly simplified my life."
                        </p>
                        <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                                <AvatarImage src="https://placehold.co/100x100.png" alt="John M." data-ai-hint="smiling person" width={100} height={100} />
                                <AvatarFallback>JM</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">John M.</p>
                                <p className="text-sm text-muted-foreground">Heart Condition Patient</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-background p-8 rounded-2xl shadow-lg flex flex-col text-left">
                         <div className="flex text-yellow-400 mb-4">
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                        </div>
                        <p className="text-muted-foreground mb-6 flex-grow">
                            "I manage medications for my elderly mother, and this platform has made it incredibly easy. Uploading prescriptions is simple, and I can track everything from my account. Highly recommended!"
                        </p>
                        <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                                <AvatarImage src="https://placehold.co/100x100.png" alt="Sarah L." data-ai-hint="smiling person" width={100} height={100} />
                                <AvatarFallback>SL</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">Sarah L.</p>
                                <p className="text-sm text-muted-foreground">Caregiver</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Shop by Health Condition Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
              Shop by Health Condition
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <Link href="/products?category=Chronic+Care" className="block group">
                <div className="glassmorphic p-8 text-center h-full transition-shadow duration-300 group-hover:shadow-2xl flex flex-col justify-center items-center">
                  <div className="inline-block p-4 bg-primary/20 text-primary rounded-full mb-4">
                    <Pill className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Chronic Care</h3>
                </div>
              </Link>
              <Link href="/emergency-services" className="block group">
                <div className="glassmorphic p-8 text-center h-full transition-shadow duration-300 group-hover:shadow-2xl flex flex-col justify-center items-center">
                  <div className="inline-block p-4 bg-primary/20 text-primary rounded-full mb-4">
                    <Ambulance className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Emergency Response</h3>
                </div>
              </Link>
              <Link href="/products?category=Medical+Tourism" className="block group">
                <div className="glassmorphic p-8 text-center h-full transition-shadow duration-300 group-hover:shadow-2xl flex flex-col justify-center items-center">
                  <div className="inline-block p-4 bg-primary/20 text-primary rounded-full mb-4">
                    <Plane className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Medical Tourism</h3>
                </div>
              </Link>
              <Link href="/products?category=Organ+Transplants" className="block group">
                <div className="glassmorphic p-8 text-center h-full transition-shadow duration-300 group-hover:shadow-2xl flex flex-col justify-center items-center">
                  <div className="inline-block p-4 bg-primary/20 text-primary rounded-full mb-4">
                    <Heart className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Organ Transplants</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Consultation Section */}
        <section id="consultation" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* Left Column: Steps */}
              <div className="space-y-8">
                <div className="text-center md:text-left mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Book your free consultation today</h2>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">1</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Describe your issue or query</h3>
                    <p className="text-muted-foreground">Write to us and tell us what your question or issue is.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">2</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">We'll recommend</h3>
                    <p className="text-muted-foreground">We will 'hook you up' with the right practitioner and the right therapy that you need.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">3</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Your contact details</h3>
                    <p className="text-muted-foreground">Leave us your number to contact you back.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Button to open form */}
              <div className="flex justify-center items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full max-w-sm bg-primary hover:bg-primary/90">
                        BOOK YOUR SESSION
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Book Free Consultation</DialogTitle>
                      </DialogHeader>
                      <ConsultationForm />
                    </DialogContent>
                  </Dialog>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
