
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/blog";

// Generate static paths for all blog posts
export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <article className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/wellness-blog" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>
                </div>
                 <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        data-ai-hint={post.dataAiHint}
                        priority
                    />
                </div>
                <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
                <p className="text-muted-foreground text-sm mb-8">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <div 
                    className="prose dark:prose-invert max-w-none text-foreground" 
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                />
            </article>
        </div>
    );
}
