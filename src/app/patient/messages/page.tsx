
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Mail, Paperclip, Search, Send, Video } from "lucide-react";

const conversations = [
    { name: "Dr. Chen", message: "Your lab results are back...", time: "5m ago", avatar: "https://i.pravatar.cc/150?u=docChen", active: true },
    { name: "Support Team", message: "Your request has been updated.", time: "2h ago", avatar: "https://i.pravatar.cc/150?u=support" },
    { name: "Dr. Patel", message: "Just a reminder about your...", time: "1d ago", avatar: "https://i.pravatar.cc/150?u=docPatel" },
    { name: "Pharmacy", message: "Your prescription is ready.", time: "3d ago", avatar: "https://i.pravatar.cc/150?u=pharmacy" },
];

const messages = [
    { from: 'other', text: "Hello Sarah, your recent lab results have come in. Everything looks stable, which is great news. Continue with your current medication dosage." },
    { from: 'me', text: "That's wonderful to hear, Dr. Chen. Thank you for the update!" },
    { from: 'other', text: "You're welcome. Let's schedule a brief virtual follow-up for next month to check in. Does that work for you?" },
]

export default function PatientMessagesPage() {
    return (
        <div className="p-6">
             <header className="py-6">
                <h1 className="text-3xl font-bold flex items-center gap-3"><Mail className="w-8 h-8"/> Messages</h1>
                <p className="text-muted-foreground">Communicate securely with your care team.</p>
            </header>
             <Card className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-220px)] overflow-hidden">
                {/* Conversations List */}
                <div className="md:col-span-1 border-r flex flex-col">
                    <div className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search messages..." className="pl-10"/>
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {conversations.map(convo => (
                            <div key={convo.name} className={cn("flex items-start gap-4 p-4 cursor-pointer border-b hover:bg-muted/50", convo.active && "bg-muted")}>
                                <Avatar>
                                    <AvatarImage src={convo.avatar} />
                                    <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{convo.name}</p>
                                        <p className="text-xs text-muted-foreground">{convo.time}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{convo.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="md:col-span-2 flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center">
                        <div className="flex items-center gap-3">
                             <Avatar>
                                <AvatarImage src={conversations[0].avatar} />
                                <AvatarFallback>{conversations[0].name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{conversations[0].name}</p>
                        </div>
                        <Button variant="ghost" size="icon"><Video className="w-5 h-5"/></Button>
                    </div>
                    <CardContent className="flex-grow p-6 space-y-6 overflow-y-auto bg-muted/20">
                        {messages.map((msg, index) => (
                           <div key={index} className={cn("flex items-end gap-2", msg.from === 'me' ? 'justify-end' : 'justify-start')}>
                                {msg.from === 'other' && <Avatar className="h-8 w-8"><AvatarImage src={conversations[0].avatar} /></Avatar>}
                                <div className={cn("max-w-md p-3 rounded-lg", msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-background')}>
                                    <p>{msg.text}</p>
                                </div>
                                {msg.from === 'me' && <Avatar className="h-8 w-8"><AvatarFallback>S</AvatarFallback></Avatar>}
                           </div>
                        ))}
                    </CardContent>
                    <div className="p-4 border-t bg-background">
                         <div className="relative">
                            <Input placeholder="Type a message..." className="pr-24"/>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <Button variant="ghost" size="icon"><Paperclip className="w-5 h-5"/></Button>
                                <Button size="sm"><Send className="mr-2 h-4 w-4"/>Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
             </Card>
        </div>
    )
}
