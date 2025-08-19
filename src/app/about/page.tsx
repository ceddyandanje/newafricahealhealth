
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function AboutUsPage() {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">About Africa Heal Health</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Your trusted partner in comprehensive healthcare solutions, from chronic disease management to global medical access.
            </p>
          </div>
  
          {/* Mission and Vision Section */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                    src="https://placehold.co/870x580.png"
                    alt="Healthcare professionals discussing results on a tablet"
                    fill
                    className="object-cover"
                    data-ai-hint="healthcare team"
                />
            </div>
            <div className="space-y-8">
               <div>
                  <h2 className="font-headline text-3xl font-semibold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our mission is to bridge the gaps in healthcare in Africa by providing accessible, affordable, and high-quality solutions. We believe that everyone deserves to live a healthy life, and we are committed to making that a reality by leveraging technology and a global network of partners to deliver wellness directly to you.
                  </p>
               </div>
               <div>
                   <h2 className="font-headline text-3xl font-semibold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our vision is to create a continent where advanced healthcare is not a luxury but a standard for all. We aspire to be the leading platform for seamless medical services, eliminating geographical and financial barriers to build a healthier future for every African.
                  </p>
               </div>
            </div>
          </div>

          {/* Core Values Section */}
           <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-center font-headline mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glassmorphic p-8">
                <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                    <Heart className="h-8 w-8 text-primary"/>
                </div>
                <h3 className="font-headline text-xl font-semibold mb-2">Compassion</h3>
                <p className="text-sm text-muted-foreground">We approach every interaction with empathy, treating our users with the dignity and respect they deserve.</p>
              </div>
              <div className="glassmorphic p-8">
                 <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                    <Eye className="h-8 w-8 text-primary"/>
                </div>
                <h3 className="font-headline text-xl font-semibold mb-2">Accessibility</h3>
                <p className="text-sm text-muted-foreground">We are dedicated to making healthcare services available to everyone, regardless of location or circumstance.</p>
              </div>
              <div className="glassmorphic p-8">
                 <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                    <Lightbulb className="h-8 w-8 text-primary"/>
                </div>
                <h3 className="font-headline text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">We continuously leverage technology to simplify processes and improve the quality of care for our users.</p>
              </div>
            </div>
          </div>
  
          <div className="text-center bg-muted/50 p-12 rounded-2xl">
            <h2 className="text-3xl font-bold font-headline mb-4">Join Us on Our Journey</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you're seeking care, looking to partner with us, or interested in our mission, we invite you to connect with us.
            </p>
            <Button size="lg" asChild>
                <Link href="/patient/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  