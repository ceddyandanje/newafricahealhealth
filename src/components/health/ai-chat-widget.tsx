"use client";

import { healthAssistantQuery } from "@/ai/flows/health-assistant-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Loader2, Sparkles, X, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  query: z.string().min(10, "Please enter a more detailed question."),
});

type Message = {
  role: "user" | "assistant";
  content: string;
  products?: string[];
};

const initialMessage: Message = {
    role: 'assistant',
    content: "Hello! I'm your friendly AI health assistant. How can I help you today? You can ask me about health conditions, wellness tips, or product information.",
};


export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: "" },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessage: Message = { role: "user", content: values.query };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result = await healthAssistantQuery({ query: values.query });
      const assistantMessage: Message = {
        role: "assistant",
        content: result.answer,
        products: result.suggestedProducts,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <div
        className={cn(
          "mb-4 w-96 h-[70vh] flex flex-col glassmorphic transition-all duration-300 ease-in-out",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="AI Assistant" data-ai-hint="friendly robot" />
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <h2 className="font-headline text-lg font-bold">AI Assistant</h2>
            </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 flex-grow overflow-y-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex items-start gap-4", message.role === "user" ? "justify-end" : "")}
            >
              {message.role === "assistant" && (
                <div className="bg-primary/20 p-2 rounded-full flex-shrink-0">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "p-4 rounded-lg max-w-sm",
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.products && message.products.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" /> Suggested Products:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {message.products.map((product, i) => (
                        <Button key={i} size="sm" variant="secondary" asChild>
                          <Link href={`/products?search=${encodeURIComponent(product)}`}>{product}</Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="bg-muted p-2 rounded-full flex-shrink-0">
                  <User className="h-6 w-6 text-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-2 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="p-4 rounded-lg bg-muted flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="Ask a health question..." {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={cn(
            "rounded-full w-16 h-16 shadow-lg flex items-center justify-center transition-transform duration-300 ease-in-out",
            isOpen ? "scale-0" : "scale-100"
        )}
      >
        <MessageSquare className="h-8 w-8" />
      </Button>
    </div>
  );
}
