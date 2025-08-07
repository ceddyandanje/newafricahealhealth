
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Siren, Ambulance, Phone, HeartPulse, User, Users, MapPin, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const emergencyServices = [
    { id: 'first-aid', name: 'First Aid', icon: HeartPulse },
    { id: 'ground-ambulance', name: 'Ground Ambulance', icon: Ambulance },
    { id: 'air-ambulance', name: 'Air Ambulance', icon: Siren },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

export default function DetailedEmergencyForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [requestFor, setRequestFor] = useState('me');
    const [location, setLocation] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [bloodGroup, setBloodGroup] = useState<string>("");
    const [allergies, setAllergies] = useState("");
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

    const handleCall = () => {
        // In a real app, this would initiate a call.
        toast({ title: "Calling Emergency Line", description: "Connecting you now..."});
        window.location.href = "tel:+254712345678";
    }

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
            bloodGroup,
            allergies
        });

        toast({
            title: "Emergency Request Sent",
            description: `A ${selectedService} request has been dispatched to your location. Help is on the way.`,
        });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="mt-6">
                  <Phone className="mr-2 h-5 w-5" /> Contact Emergency Line
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                        <Siren className="text-red-500" /> Emergency Request
                    </DialogTitle>
                    <DialogDescription>
                       Fill out the details below. This is for urgent medical situations only.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
                    <div>
                        <Label className="font-semibold mb-2 block">1. Who is this request for?</Label>
                        <RadioGroup defaultValue="me" value={requestFor} onValueChange={setRequestFor} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="me" id="detail-me" />
                                <Label htmlFor="detail-me" className="flex items-center gap-2"><User/> Me</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="someone" id="detail-someone" />
                                <Label htmlFor="detail-someone" className="flex items-center gap-2"><Users/> Someone Else</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div>
                        <Label className="font-semibold mb-2 block">2. What service do you need?</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {emergencyServices.map(service => (
                                <Card
                                    key={service.id}
                                    className={cn(
                                        "p-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center h-full",
                                        selectedService === service.id ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'
                                    )}
                                    onClick={() => setSelectedService(service.id)}
                                >
                                    <service.icon className={cn("w-6 h-6 mb-1", selectedService === service.id ? "text-primary" : "text-muted-foreground")} />
                                    <p className="text-xs font-semibold">{service.name}</p>
                                </Card>
                            ))}
                        </div>
                    </div>

                     <div>
                        <Label className="font-semibold mb-2 block">3. Confirm Location</Label>
                         <Button variant="outline" className="w-full" onClick={handleLocation} disabled={isLocating}>
                             <MapPin className="mr-2 h-4 w-4" />
                             {isLocating ? 'Acquiring Location...' : (location || 'Get Active Location')}
                         </Button>
                    </div>

                    <div>
                        <Label className="font-semibold mb-2 block">4. Medical Information (Optional)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                               <Label htmlFor="blood-group" className="text-xs">Blood Group</Label>
                               <Select value={bloodGroup} onValueChange={setBloodGroup}>
                                   <SelectTrigger id="blood-group">
                                       <SelectValue placeholder="Select..." />
                                   </SelectTrigger>
                                   <SelectContent>
                                       {bloodGroups.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                                   </SelectContent>
                               </Select>
                            </div>
                            <div>
                                <Label htmlFor="allergies" className="text-xs">Allergies</Label>
                                <Input id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g., Penicillin, Peanuts" />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="grid grid-cols-2 gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCall}>
                        <Phone className="mr-2" /> Call Now
                    </Button>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700" onClick={handleSubmit}>Request Help</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
