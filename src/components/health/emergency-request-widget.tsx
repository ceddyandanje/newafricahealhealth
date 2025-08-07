
'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Siren, Ambulance, Phone, HeartPulse, User, Users, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

const emergencyServices = [
    { id: 'first-aid', name: 'First Aid', icon: HeartPulse, description: 'Guidance for minor injuries.' },
    { id: 'ground-ambulance', name: 'Ground Ambulance', icon: Ambulance, description: 'For immediate medical transport.' },
    { id: 'air-ambulance', name: 'Air Ambulance', icon: Ambulance, description: 'For critical long-distance transport.' },
    { id: 'emergency-call', name: 'Emergency Call', icon: Phone, description: 'Speak to a professional now.' },
];

export function EmergencyRequestWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [requestFor, setRequestFor] = useState('me');
    const [location, setLocation] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const { toast } = useToast();

    const handleLocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
                toast({ title: "Location Acquired", description: "Your location has been successfully pinpointed." });
                setIsLocating(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast({ variant: 'destructive', title: "Location Error", description: "Could not get your location. Please check your browser settings." });
                setIsLocating(false);
            }
        );
    };

    const handleSubmit = () => {
        if (!selectedService || !location) {
            toast({
                variant: 'destructive',
                title: "Incomplete Request",
                description: "Please select a service and provide your location.",
            });
            return;
        }

        console.log({
            service: selectedService,
            for: requestFor,
            location,
        });

        toast({
            title: "Emergency Request Sent",
            description: `A ${selectedService} request has been dispatched to your location. Help is on the way.`,
        });
        setIsOpen(false);
        setSelectedService(null);
        setLocation(null);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button className="fixed top-1/2 -translate-y-1/2 right-0 rounded-l-full rounded-r-none w-12 h-12 shadow-lg z-50 bg-red-600 hover:bg-red-700 text-white animate-pulse">
                    <Phone className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle className="font-headline text-2xl flex items-center gap-2">
                        <Siren className="text-red-500" /> Emergency Services
                    </SheetTitle>
                    <SheetDescription>
                        Please select the service you require. This service is for urgent medical situations only.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <Label className="font-semibold mb-2 block">1. Who is this request for?</Label>
                        <RadioGroup defaultValue="me" value={requestFor} onValueChange={setRequestFor} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="me" id="me" />
                                <Label htmlFor="me" className="flex items-center gap-2"><User/> Me</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="someone" id="someone" />
                                <Label htmlFor="someone" className="flex items-center gap-2"><Users/> Someone Else</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div>
                        <Label className="font-semibold mb-2 block">2. What service do you need?</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {emergencyServices.map(service => (
                                <Card
                                    key={service.id}
                                    className={cn(
                                        "p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center h-full",
                                        selectedService === service.id ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'
                                    )}
                                    onClick={() => setSelectedService(service.id)}
                                >
                                    <service.icon className={cn("w-8 h-8 mb-1", selectedService === service.id ? "text-primary" : "text-muted-foreground")} />
                                    <p className="text-sm font-semibold">{service.name}</p>
                                </Card>
                            ))}
                        </div>
                    </div>

                     <div>
                        <Label className="font-semibold mb-2 block">3. Confirm Location</Label>
                         <Button variant="outline" className="w-full" onClick={handleLocation} disabled={isLocating}>
                             <MapPin className="mr-2 h-4 w-4" />
                             {isLocating ? 'Getting Location...' : (location || 'Get Active Location')}
                         </Button>
                    </div>
                </div>

                <SheetFooter>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" onClick={handleSubmit}>Request Help Now</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
