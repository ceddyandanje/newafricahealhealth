import Link from "next/link"
import { HeartPulse } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted/40">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <HeartPulse className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">Africa Heal Health</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Africa Heal Health. All rights reserved.
        </p>
        <nav className="flex items-center space-x-4 mt-4 md:mt-0">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  )
}
