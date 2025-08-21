
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { PenSquare, PlusCircle, Search, Edit, Trash2, Loader2 } from "lucide-react";
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
import { useBlogPosts } from '@/hooks/use-blog';
import { addPost, updatePost, deletePost } from "@/lib/blog";
import { type BlogPost } from '@/lib/types';


const postSchema = z.object({
    title: z.string().min(10, 'Title is too short'),
    description: z.string().min(20, 'Description is too short'),
    category: z.string().min(3, 'Category is required'),
    image: z.string().url('Must be a valid URL'),
    dataAiHint: z.string().min(2, 'AI hint is required'),
    content: z.string().min(50, 'Content must be at least 50 characters long.'),
});


function PostForm({ post, onSave, onOpenChange }: { post?: BlogPost, onSave: (data: z.infer<typeof postSchema>, id?: string) => void, onOpenChange: (open: boolean) => void }) {
    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: post || { title: '', description: '', category: '', image: 'https://placehold.co/600x400.png', dataAiHint: '', content: '' },
    });

    const handleSubmit = (values: z.infer<typeof postSchema>) => {
        onSave(values, post?.id);
        onOpenChange(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 max-h-[70vh] overflow-y-auto p-1">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description (Short)</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="content" render={({ field }) => (
                    <FormItem><FormLabel>Content (HTML)</FormLabel><FormControl><Textarea {...field} rows={8} /></FormControl><FormMessage /></FormItem>
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
    const { posts, isLoading } = useBlogPosts();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | undefined>(undefined);
    const [deletingPost, setDeletingPost] = useState<BlogPost | undefined>(undefined);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const { toast } = useToast();

    const handleSavePost = async (postData: z.infer<typeof postSchema>, id?: string) => {
        const isEditing = !!id;
        const slug = postData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50);

        try {
            if (isEditing) {
                const postToUpdate = { ...postData, slug, date: editingPost!.date };
                await updatePost(id, postToUpdate);
                addLog('INFO', `Blog post "${postData.title}" was updated.`);
                addNotification({ recipientId: 'admin_role', type: 'blog_update', title: 'Blog Post Updated', description: `The post "${postData.title}" has been successfully updated.`});
                toast({ title: "Post Updated", description: "The blog post has been saved." });
            } else {
                 const newPost = { ...postData, slug, date: new Date().toISOString() };
                await addPost(newPost);
                addLog('INFO', `New blog post "${postData.title}" was created.`);
                addNotification({ recipientId: 'admin_role', type: 'blog_update', title: 'New Blog Post', description: `A new post titled "${postData.title}" has been published.`});
                toast({ title: "Post Created", description: "The new blog post has been published." });
            }
            setEditingPost(undefined);
        } catch (error) {
            console.error("Failed to save post:", error);
            toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save post to the database.'});
        }
    };

    const handleDeletePost = async (post: BlogPost) => {
        try {
            await deletePost(post.id);
            addLog('WARN', `Blog post "${post.title}" was deleted.`);
            addNotification({ recipientId: 'admin_role', type: 'blog_update', title: 'Blog Post Deleted', description: `The post "${post.title}" has been removed.`});
            toast({ variant: 'destructive', title: "Post Deleted", description: "The blog post has been removed." });
        } catch (error) {
            console.error("Failed to delete post:", error);
            toast({ variant: 'destructive', title: 'Delete Failed', description: 'Could not delete post from the database.'});
        } finally {
            setDeletingPost(undefined);
            setIsDeleteConfirmOpen(false);
        }
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
                        <Button onClick={() => { setEditingPost(undefined); setIsFormOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" /> New Post</Button>
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
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48">
                           <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
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
                                        <TableRow key={post.id}>
                                            <TableCell className="font-semibold whitespace-nowrap">{post.title}</TableCell>
                                            <TableCell><Badge variant="secondary">{post.category}</Badge></TableCell>
                                            <TableCell className="whitespace-nowrap">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => { setEditingPost(post); setIsFormOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingPost(post); setIsDeleteConfirmOpen(true);}}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
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
