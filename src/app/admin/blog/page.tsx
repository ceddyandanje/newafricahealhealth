
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { PenSquare, PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';
import { addNotification } from '@/lib/notifications';

type BlogPost = {
    slug: string;
    title: string;
    description: string;
    image: string;
    dataAiHint: string;
    category: string;
    date: string;
};

const initialBlogPosts: BlogPost[] = [
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
];

const postSchema = z.object({
    title: z.string().min(10, 'Title is too short'),
    description: z.string().min(20, 'Description is too short'),
    category: z.string().min(3, 'Category is required'),
    image: z.string().url('Must be a valid URL'),
    dataAiHint: z.string().min(2, 'AI hint is required'),
});


function PostForm({ post, onSave, onOpenChange }: { post?: BlogPost, onSave: (data: BlogPost) => void, onOpenChange: (open: boolean) => void }) {
    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: post || { title: '', description: '', category: '', image: 'https://placehold.co/600x400.png', dataAiHint: '' },
    });

    const handleSubmit = (values: z.infer<typeof postSchema>) => {
        const slug = values.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50);
        onSave({ 
            ...values,
            slug: post?.slug || slug,
            date: post?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        });
        onOpenChange(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 max-h-[70vh] overflow-y-auto p-1">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="image" render={({ field }) => (
                    <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                    <FormItem><FormLabel>Image AI Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter className="pt-4">
                    <Button type="submit">Save Post</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

export default function BlogAdminPage() {
    const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined);
    const [deletingPost, setDeletingPost] = useState<BlogPost | undefined>(undefined);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const { toast } = useToast();

    const handleSavePost = (post: BlogPost) => {
        const isEditing = !!editingPost;
        if (isEditing) {
            setPosts(posts.map(p => (p.slug === post.slug ? post : p)));
            addLog('INFO', `Blog post "${post.title}" was updated.`);
            addNotification({ type: 'system_update', title: 'Blog Post Updated', description: `The post "${post.title}" has been successfully updated.`});
            toast({ title: "Post Updated", description: "The blog post has been saved." });
        } else {
            setPosts([post, ...posts]);
            addLog('INFO', `New blog post "${post.title}" was created.`);
            addNotification({ type: 'system_update', title: 'New Blog Post', description: `A new post titled "${post.title}" has been published.`});
            toast({ title: "Post Created", description: "The new blog post has been published." });
        }
        setEditingPost(undefined);
    };

    const handleDeletePost = (post: BlogPost) => {
        setPosts(posts.filter(p => p.slug !== post.slug));
        addLog('WARN', `Blog post "${post.title}" was deleted.`);
        addNotification({ type: 'system_update', title: 'Blog Post Deleted', description: `The post "${post.title}" has been removed.`});
        toast({ variant: 'destructive', title: "Post Deleted", description: "The blog post has been removed." });
        setDeletingPost(undefined);
        setIsDeleteConfirmOpen(false);
    };
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <PenSquare className="w-8 h-8" />
                    Blog Management
                </h1>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingPost(undefined)}><PlusCircle className="mr-2 h-4 w-4" /> New Post</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader><DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle></DialogHeader>
                        <PostForm post={editingPost} onSave={handleSavePost} onOpenChange={setIsFormOpen} />
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Blog Posts</CardTitle>
                    <CardDescription>Create, edit, and manage all articles.</CardDescription>
                     <div className="pt-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Search posts by title..." className="pl-10 max-w-sm" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post.slug}>
                                    <TableCell className="font-semibold">{post.title}</TableCell>
                                    <TableCell><Badge variant="secondary">{post.category}</Badge></TableCell>
                                    <TableCell>{post.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingPost(post); setIsFormOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingPost(post); setIsDeleteConfirmOpen(true);}}><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the post: "{deletingPost?.title}".
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDeletePost(deletingPost!)}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

