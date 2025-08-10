
'use client';

import { Phone, Mail, MessageSquare, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function PatientContactPage() {
    return (
        <div className="p-6">
            <header className="py-6">
                <h1 className="text-3xl font-bold flex items-center gap-3"><Phone className="w-8 h-8"/> Contact Us</h1>
                <p className="text-muted-foreground">We're here to help. Reach out to us through any of the channels below.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Send us a Message</CardTitle>
                        <CardDescription>Fill out the form and our team will get back to you within 24 hours.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="first-name">First Name</Label>
                                <Input id="first-name" placeholder="John" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="last-name">Last Name</Label>
                                <Input id="last-name" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john.doe@example.com" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="How can we help you today?" />
                        </div>
                        <Button className="w-full">Submit Message</Button>
                    </CardContent>
                </Card>
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <Mail className="w-8 h-8 text-primary"/>
                            <div>
                                <CardTitle>Email Support</CardTitle>
                                <CardDescription>For general inquiries.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <a href="mailto:support@africahealhealth.com" className="font-semibold text-primary">support@africahealhealth.com</a>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <Phone className="w-8 h-8 text-primary"/>
                            <div>
                                <CardTitle>Call Us</CardTitle>
                                <CardDescription>For urgent matters.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <p className="font-semibold text-foreground">+254 712 345 678</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <HelpCircle className="w-8 h-8 text-primary"/>
                            <div>
                                <CardTitle>FAQ</CardTitle>
                                <CardDescription>Find answers to common questions.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <Button variant="link" className="p-0 h-auto">Visit our FAQ page</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
