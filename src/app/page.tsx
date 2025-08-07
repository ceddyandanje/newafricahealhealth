
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, HeartPulse, Stethoscope, Phone, ArrowRight, Plane, Heart, Pill, Brain, AirVent, PlayCircle, ShieldCheck, CheckCircle2, RefreshCw, Sparkles, Truck, Video, ClipboardList, BookText, Star } from "lucide-react"
import Typewriter from "@/components/effects/typewriter"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
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
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-3">
                        Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
          </div>
          <div className="relative container mx-auto px-4 -mt-20 z-20">
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

        <section className="pt-8 pb-20">
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
        
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
              Shop by Health Condition
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <Link href="/products?category=diabetes-care" className="block group">
                <div className="glassmorphic p-8 text-center h-full transition-shadow duration-300 group-hover:shadow-2xl">
                  <div className="inline-block p-4 bg-primary/20 text-primary rounded-full mb-4">
                    <Pill className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Diabetes Care</h3>
                </div>
              </Link>
              <Link href="/products?category=heart-health" className="block group">
                <div className="glassmorphic p-8 text-center h-full transition-shadow duration-300 group-hover:shadow-2xl">
                  <div className="inline-block p-4 bg-primary/20 text-primary rounded-full mb-4">
                    <Heart className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Heart Health</h3>
                </div>
              </Link>
              <Link href="/products?category=respiratory" className="block group">
                <div className="glassmorphic p-8 text-center h-full transition-shadow duration-300 group-hover:shadow-2xl">
                  <div className="inline-block p-4 bg-primary/20 text-primary rounded-full mb-4">
                    <AirVent className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Respiratory</h3>
                </div>
              </Link>
              <Link href="/products?category=mental-health" className="block group">
                <div className="glassmorphic p-8 text-center h-full transition-shadow duration-300 group-hover:shadow-2xl">
                  <div className="inline-block p-4 bg-primary/20 text-primary rounded-full mb-4">
                    <Brain className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Mental Health</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="relative aspect-video">
                    <Image
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxkb2N0b3J8ZW58MHx8fHwxNzU0NTYyMTQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Doctor with patient in a hospital setting"
                    fill
                    className="object-cover rounded-2xl"
                    data-ai-hint="doctor patient hospital"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-24 h-24 text-white/70 hover:text-white transition-colors cursor-pointer" />
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">
                        Why We Do What We Do
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We do this work because we want people to know that there are many tools available for them to feel better. We want people to feel accepted, supported and to guide them when needed. We support people in every state they are in and guide them at their own pace. We want to offer a place where you feel peace, love and get the attention you deserve.
                    </p>
                </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Your Health Matters</h2>
                <h3 className="text-xl text-muted-foreground">Making Quality Healthcare Accessible for All.</h3>
                <p className="text-muted-foreground leading-relaxed">
                  As a global healthcare facilitator, we are dedicated to offering our patients top-notch, safe, and affordable medical services. Our team of seasoned medical experts, combined with an extensive network of hospitals and clinics worldwide, ensures that you receive the highest standard of care, no matter where you are.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-full text-primary">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h4 className="font-headline text-xl font-semibold">Why Choose Us</h4>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                        <span className="text-muted-foreground">We cater to local and international medical needs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                        <span className="text-muted-foreground">24/7 patient support</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-full text-primary">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h4 className="font-headline text-xl font-semibold">How We Do It</h4>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                        <span className="text-muted-foreground">We get you a free customized treatment plan</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                        <span className="text-muted-foreground">We connect you with the leading hospitals and specialists</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="relative h-[500px]">
                <Image src="https://images.unsplash.com/photo-1550831107-1553da8c8464?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxkb2N0b3IlMjBwYXRpZW50fGVufDB8fHx8MTc1NDU2MjM5NHww&ixlib=rb-4.1.0&q=80&w=1080" alt="Doctor with patient" width={320} height={480} className="absolute top-0 left-0 w-[320px] h-[480px] rounded-2xl object-cover z-10" data-ai-hint="doctor patient" />
                <Image src="https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMXx8aGFwcHklMjBkb2N0byUyMGFuZCUyMHBhdGllbnR8ZW58MHx8fHwxNzU0NTYyMzY2fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Happy doctor with patient" width={240} height={180} className="absolute top-10 right-0 w-[240px] h-[180px] rounded-2xl object-cover" data-ai-hint="doctor patient happy" />
                <Image src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxoYXBweSUyMHBlcnNvbnxlbnwwfHx8fDE3NTQ1NjIzMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Happy person" width={280} height={210} className="absolute bottom-20 left-1/4 w-[280px] h-[210px] rounded-2xl object-cover z-20" data-ai-hint="happy person" />
                <Image src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbGlmZXN0eWxlfGVufDB8fHx8MTc1NDU2MjQwMXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Yoga pose" width={200} height={200} className="absolute bottom-0 right-5 w-[200px] h-[200px] rounded-2xl object-cover z-10" data-ai-hint="yoga lifestyle" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20 text-foreground">
          <div className="absolute inset-0">
            <Image 
              src="https://images.unsplash.com/photo-1606206873764-fd15e242df52?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Medical background"
              fill
              className="object-cover"
              data-ai-hint="pills medication"
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Chronic Care Management</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Everything you need for seamless health management, delivered to your doorstep.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="bg-background/50 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Automated Refills</h3>
                  <p className="text-sm text-muted-foreground">Never miss a dose with our smart, automated prescription refill service.</p>
                </div>
              </div>

              <div className="bg-background/50 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">AI Health Assistant</h3>
                  <p className="text-sm text-muted-foreground">Get instant, personalized answers to your health questions 24/7.</p>
                </div>
              </div>
              
              <div className="bg-background/50 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Nationwide Delivery</h3>
                  <p className="text-sm text-muted-foreground">Fast, discreet, and reliable delivery of medications to your doorstep.</p>
                </div>
              </div>
              
              <div className="bg-background/50 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <Video className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Tele-Consultations</h3>
                  <p className="text-sm text-muted-foreground">Connect with certified pharmacists and doctors online for expert advice.</p>
                </div>
              </div>
              
              <div className="bg-background/50 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Chronic Care Plans</h3>
                  <p className="text-sm text-muted-foreground">Personalized long-term plans to help you manage your chronic conditions.</p>
                </div>
              </div>
              
              <div className="bg-background/50 p-6 rounded-2xl text-left flex items-start gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-full">
                  <BookText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Wellness Content</h3>
                  <p className="text-sm text-muted-foreground">Access a rich library of articles from trusted healthcare professionals.</p>
                </div>
              </div>

            </div>
          </div>
        </section>
        
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
      </main>
    </div>
  )
}

    

