import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/africa-heal-health-x8xrn.firebasestorage.app/o/FB_IMG_1754584185750.jpg?alt=media&token=447d8b93-7b65-4236-832b-9d9d89411946";
  return (
    <footer className="bg-muted/40 dark:bg-black/20 text-foreground border-t border-black/20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: AHH Info & Socials */}
          <div className="space-y-4 col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image src={logoUrl} alt="Africa Heal Health Logo" width={40} height={40} className="rounded-full" />
              <span className="font-bold text-xl font-headline">Africa Heal Health</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your partner in health for chronic illness management. We deliver wellness to your doorstep.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 col-span-1">
            <h3 className="font-headline font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary">About Us</Link>
              <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
            </nav>
          </div>

          {/* Column 3: Contact Us */}
          <div className="space-y-4 col-span-1">
            <h3 className="font-headline font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>123 Health Ave, Nairobi, Kenya</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>+254 712 345678</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>support@africahealhealth.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4 col-span-1">
            <h3 className="font-headline font-semibold">Newsletter</h3>
            <p className="text-sm text-muted-foreground">Get the latest health news and product updates.</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your Email" className="flex-grow" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AHH. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
