
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { getAllPosts, BlogPost } from "@/lib/blog";

export default async function WellnessBlogPage() {
    const blogPosts = await getAllPosts();

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Wellness Hub</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A curated selection of health articles from the World Health Organization (WHO) and other trusted sources.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
                <Card key={post.id} className="glassmorphic flex flex-col group overflow-hidden">
                     <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
                        <div className="relative w-full aspect-video overflow-hidden">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                data-ai-hint={post.dataAiHint}
                            />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                            <h2 className="font-headline text-xl font-semibold mb-2 flex-grow">{post.title}</h2>
                            <p className="text-muted-foreground text-sm mb-4">{post.description}</p>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mt-auto">
                                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                <span className="flex items-center group-hover:text-primary">
                                    Read on WHO <ArrowRight className="ml-1 h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </a>
                </Card>
            ))}
        </div>
      </div>
    );
  }
