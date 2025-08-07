'use client';

import { healthAssistantQuery } from '@/ai/flows/health-assistant-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import Link from 'next/link';

const formSchema = z.object({
  query: z.string().min(10, 'Please enter a more detailed question.'),
});

type Message = {
  role: 'user' | 'assistant';
  content: string;
  products?: string[];
};

export default function HealthAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: values.query };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result = await healthAssistantQuery({ query: values.query });
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.answer,
        products: result.suggestedProducts,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto flex flex-col h-[80vh]">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-primary/20 rounded-full mb-4">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-headline text-4xl font-bold">AI Health Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Ask health-related questions and get product suggestions.
            <br />
            <span className="text-xs">This is not a substitute for professional medical advice.</span>
          </p>
        </div>

        <div className="glassmorphic p-4 flex-grow overflow-y-auto space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <div className="bg-primary/20 p-2 rounded-full flex-shrink-0"><Bot className="h-6 w-6 text-primary" /></div>
              )}
              <div className={`p-4 rounded-lg max-w-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.products && message.products.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Suggested Products:</h4>
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
              {message.role === 'user' && (
                <div className="bg-muted p-2 rounded-full flex-shrink-0"><User className="h-6 w-6 text-foreground" /></div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-2 rounded-full"><Bot className="h-6 w-6 text-primary" /></div>
              <div className="p-4 rounded-lg bg-muted flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4 glassmorphic p-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="e.g., What can help with improving sleep?" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
