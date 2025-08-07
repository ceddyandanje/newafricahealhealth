
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const blogPosts = [
    {
        slug: 'benefits-of-moringa',
        title: 'The Amazing Health Benefits of Moringa',
        description: 'Discover why this superfood is a game-changer for your health, packed with vitamins, minerals, and antioxidants.',
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'moringa leaves',
        category: 'Superfoods',
        date: 'October 26, 2023',
    },
    {
        slug: 'natural-skincare-guide',
        title: 'A Guide to Natural Skincare with Shea Butter and Black Soap',
        description: 'Learn how to nourish your skin with traditional African ingredients for a radiant, healthy glow.',
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'shea butter skincare',
        category: 'Skincare',
        date: 'October 22, 2023',
    },
    {
        slug: 'managing-diabetes-naturally',
        title: '5 Tips for Managing Diabetes Naturally',
        description: 'Explore lifestyle changes and natural supplements that can support your diabetes management plan.',
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'healthy food diabetes',
        category: 'Health & Wellness',
        date: 'October 18, 2023',
    },
     {
        slug: 'rooibos-tea-for-relaxation',
        title: 'Unwind and Relax with Caffeine-Free Rooibos Tea',
        description: 'Find out why Rooibos tea is the perfect beverage to calm your mind and improve your sleep.',
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'tea cup relaxation',
        category: 'Beverages',
        date: 'October 15, 2023',
    },
];


export default function WellnessBlogPage() {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Wellness Blog</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Your source for tips, articles, and inspiration for a healthier, happier life.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
                <Card key={post.slug} className="glass-card flex flex-col group overflow-hidden">
                     <Link href={`/wellness-blog/${post.slug}`} className="flex flex-col h-full">
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
                                <span>{post.date}</span>
                                <span className="flex items-center group-hover:text-primary">
                                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                                </span>
                            </div>
                        </div>
                    </Link>
                </Card>
            ))}
        </div>
      </div>
    );
  }
  