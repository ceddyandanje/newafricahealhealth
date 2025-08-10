
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// This is still placeholder data. In a real app, you'd fetch this from a CMS or database.
const blogPosts = [
    {
        slug: 'benefits-of-moringa',
        title: 'The Amazing Health Benefits of Moringa',
        description: 'Discover why this superfood is a game-changer for your health, packed with vitamins, minerals, and antioxidants.',
        image: 'https://placehold.co/1200x600.png',
        dataAiHint: 'moringa leaves',
        category: 'Superfoods',
        date: 'October 26, 2023',
        content: `
<p>Moringa oleifera, often called the "drumstick tree" or "miracle tree," has been used for centuries for its medicinal properties and health benefits. Native to the sub-Himalayan areas of India, Pakistan, Bangladesh, and Afghanistan, it is now grown across the tropics.</p>
<h3 class="font-headline text-xl font-semibold mt-6 mb-2">Rich in Nutrients</h3>
<p>Moringa leaves are an excellent source of many vitamins and minerals. One cup of fresh, chopped leaves (21 grams) contains:</p>
<ul class="list-disc list-inside my-4 space-y-1">
  <li><strong>Protein:</strong> 2 grams</li>
  <li><strong>Vitamin B6:</strong> 19% of the RDA</li>
  <li><strong>Vitamin C:</strong> 12% of the RDA</li>
  <li><strong>Iron:</strong> 11% of the RDA</li>
  <li><strong>Riboflavin (B2):</strong> 11% of the RDA</li>
  <li><strong>Vitamin A (from beta-carotene):</strong> 9% of the RDA</li>
  <li><strong>Magnesium:</strong> 8% of the RDA</li>
</ul>
<p>The dried leaves are often sold as dietary supplements, either in powder or capsule form.</p>
<h3 class="font-headline text-xl font-semibold mt-6 mb-2">Powerful Antioxidants</h3>
<p>Antioxidants are compounds that act against free radicals in your body. High levels of free radicals may lead to oxidative stress, which is associated with chronic diseases like heart disease and type 2 diabetes. Several antioxidant plant compounds have been found in the leaves of Moringa oleifera. In addition to vitamin C and beta-carotene, these include Quercetin and Chlorogenic acid.</p>
`
    },
    {
        slug: 'natural-skincare-guide',
        title: 'A Guide to Natural Skincare with Shea Butter and Black Soap',
        description: 'Learn how to nourish your skin with traditional African ingredients for a radiant, healthy glow.',
        image: 'https://placehold.co/1200x600.png',
        dataAiHint: 'shea butter skincare',
        category: 'Skincare',
        date: 'October 22, 2023',
        content: `
<p>For generations, African ingredients like shea butter and black soap have been staples in beauty regimens. Their natural healing and moisturizing properties make them perfect for a simple, effective skincare routine.</p>
<h3 class="font-headline text-xl font-semibold mt-6 mb-2">The Magic of Shea Butter</h3>
<p>Shea butter is a fat extracted from the nuts of the shea tree. It's rich in vitamins A, E, and F, and offers UV protection (it is SPF ~6). It provides the skin with essential fatty acids and the nutrients necessary for collagen production.</p>
<h3 class="font-headline text-xl font-semibold mt-6 mb-2">African Black Soap</h3>
<p>Authentic African black soap is made from the ash of locally harvested plants and barks such as plantain, cocoa pods, palm tree leaves, and shea tree bark. It's known for its ability to cleanse, exfoliate, and fight acne without stripping the skin of its natural oils. It's a gentle, all-natural alternative to harsh chemical cleansers.</p>
`
    },
    {
        slug: 'managing-diabetes-naturally',
        title: '5 Tips for Managing Diabetes Naturally',
        description: 'Explore lifestyle changes and natural supplements that can support your diabetes management plan.',
        image: 'https://placehold.co/1200x600.png',
        dataAiHint: 'healthy food diabetes',
        category: 'Health & Wellness',
        date: 'October 18, 2023',
        content: `
<p>While medication is often essential, certain lifestyle changes and natural approaches can significantly support diabetes management.</p>
<ol class="list-decimal list-inside my-4 space-y-2">
    <li><strong>Focus on a Whole-Foods Diet:</strong> Prioritize non-starchy vegetables, lean proteins, and healthy fats.</li>
    <li><strong>Get Regular Exercise:</strong> Aim for at least 150 minutes of moderate-intensity aerobic activity per week.</li>
    <li><strong>Manage Stress:</strong> Chronic stress can raise blood sugar levels. Practice yoga, meditation, or deep breathing.</li>
    <li><strong>Stay Hydrated:</strong> Drinking enough water helps your kidneys flush out excess sugar.</li>
    <li><strong>Consider Supplements (with caution):</strong> Some studies suggest that cinnamon, aloe vera, and bitter melon may have a positive effect, but always consult your doctor first.</li>
</ol>
        `
    },
     {
        slug: 'rooibos-tea-for-relaxation',
        title: 'Unwind and Relax with Caffeine-Free Rooibos Tea',
        description: 'Find out why Rooibos tea is the perfect beverage to calm your mind and improve your sleep.',
        image: 'https://placehold.co/1200x600.png',
        dataAiHint: 'tea cup relaxation',
        category: 'Beverages',
        date: 'October 15, 2023',
        content: `
<p>Rooibos, or "red bush" tea, is a herbal tea from South Africa that is gaining global popularity for its soothing properties and health benefits.</p>
<h3 class="font-headline text-xl font-semibold mt-6 mb-2">Naturally Caffeine-Free</h3>
<p>Unlike black or green tea, rooibos is naturally caffeine-free, making it an excellent beverage choice for any time of day, especially before bed. It can help you relax and unwind without interfering with your sleep cycle.</p>
<h3 class="font-headline text-xl font-semibold mt-6 mb-2">Rich in Antioxidants</h3>
<p>Rooibos is packed with health-promoting antioxidants like aspalathin and quercetin. These antioxidants can help protect your cells from damage by free radicals and may lower your risk of chronic diseases.</p>
`
    },
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = blogPosts.find(p => p.slug === params.slug);

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
                <p className="text-muted-foreground text-sm mb-8">{post.date}</p>
                <div 
                    className="prose dark:prose-invert max-w-none text-foreground" 
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                />
            </article>
        </div>
    );
}
