
"use client";

import { Button } from "@/components/ui/button";
import { Bot, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        {isOpen && (
            <div
                className={cn(
                "mb-4 w-96 h-auto flex flex-col glassmorphic transition-all duration-300 ease-in-out"
                )}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80" alt="AI Assistant" data-ai-hint="friendly robot" />
                            <AvatarFallback>AHH</AvatarFallback>
                        </Avatar>
                        <h2 className="font-headline text-lg font-bold">AHH Assistant</h2>
                    </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                </Button>
                </div>
                <div className="p-8 flex-grow flex flex-col items-center justify-center text-center">
                    <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
                    <p className="text-muted-foreground">
                        Our intelligent AI Health Assistant is currently under development. Please check back later for personalized health support.
                    </p>
                </div>
            </div>
        )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={cn(
            "rounded-full w-16 h-16 shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out",
            isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Sparkles className="h-8 w-8" />
      </Button>
    </div>
  );
}
