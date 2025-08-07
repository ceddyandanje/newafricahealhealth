import Image from "next/image";

export default function AboutUsPage() {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">About Africa Heal Health</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Your trusted partner in comprehensive healthcare solutions, from chronic disease management to global medical access.
            </p>
          </div>
  
          <div className="grid md:grid-cols-2 gap-12 items-center glassmorphic p-8 rounded-3xl">
            <div>
              <h2 className="font-headline text-3xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Our mission is to bridge the gaps in healthcare in Africa by providing accessible, affordable, and high-quality solutions. We believe that everyone deserves to live a healthy life, and we are committed to making that a reality. We leverage technology and a global network of partners to deliver wellness directly to you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From managing chronic illnesses with ease to facilitating life-saving organ transplants and emergency medical evacuations, Africa Heal Health is dedicated to your well-being every step of the way.
              </p>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
                <Image
                    src="https://placehold.co/600x400.png"
                    alt="Team of smiling healthcare professionals"
                    fill
                    className="object-cover"
                    data-ai-hint="healthcare professionals team"
                />
            </div>
          </div>
  
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center font-headline mb-8">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glassmorphic p-6 text-center">
                <h3 className="font-headline text-xl font-semibold mb-2">Chronic Care</h3>
                <p className="text-sm text-muted-foreground">Simplified management of chronic conditions with prescription uploads, medication delivery, and refill reminders.</p>
              </div>
              <div className="glassmorphic p-6 text-center">
                <h3 className="font-headline text-xl font-semibold mb-2">Emergency Response</h3>
                <p className="text-sm text-muted-foreground">Rapid air and ground ambulance services in partnership with industry leaders, ensuring you get critical care when you need it most.</p>
              </div>
              <div className="glassmorphic p-6 text-center">
                <h3 className="font-headline text-xl font-semibold mb-2">Global Health Access</h3>
                <p className="text-sm text-muted-foreground">Seamless coordination for medical tourism and organ transplants with world-renowned hospitals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  