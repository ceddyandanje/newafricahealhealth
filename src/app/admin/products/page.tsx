
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Package, PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import Image from 'next/image';
import { products as initialProducts } from "@/lib/products";
import { type Product } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/logs';
import { addNotification } from '@/lib/notifications';

const productSchema = z.object({
    name: z.string().min(3, 'Name is required'),
    description: z.string().min(10, 'Description is required'),
    price: z.coerce.number().min(1, 'Price must be a positive number'),
    category: z.string().min(2, 'Category is required'),
    brand: z.string().min(2, 'Brand is required'),
    image: z.string().url('Must be a valid image URL'),
    dataAiHint: z.string().min(2, 'AI hint is required'),
});

function ProductForm({ product, onSave, onOpenChange }: { product?: Product, onSave: (data: Product) => void, onOpenChange: (open: boolean) => void }) {
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: product ? { ...product, price: product.price } : { name: '', description: '', price: 0, category: '', brand: '', image: 'https://placehold.co/600x400.png', dataAiHint: '' },
    });

    const handleSubmit = (values: z.infer<typeof productSchema>) => {
        onSave({ ...values, id: product?.id || Date.now().toString() });
        onOpenChange(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 max-h-[70vh] overflow-y-auto p-1">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price (in KES)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="brand" render={({ field }) => (
                    <FormItem><FormLabel>Brand</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="image" render={({ field }) => (
                    <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                    <FormItem><FormLabel>Image AI Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter className="pt-4">
                    <Button type="submit">Save Product</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}


export default function ProductsAdminPage() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [deletingProduct, setDeletingProduct] = useState<Product | undefined>(undefined);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const { toast } = useToast();
    
    const handleSaveProduct = (product: Product) => {
        const isEditing = !!editingProduct;
        const productWithPriceInCents = { ...product, price: product.price * 100 };
        if (isEditing) {
            setProducts(products.map(p => (p.id === product.id ? productWithPriceInCents : p)));
            addLog('INFO', `Product "${product.name}" was updated.`);
            addNotification({ type: 'product_update', title: 'Product Updated', description: `Product "${product.name}" was successfully updated.`});
            toast({ title: "Product Saved", description: "Changes to the product have been saved." });
        } else {
            setProducts([productWithPriceInCents, ...products]);
            addLog('INFO', `New product "${product.name}" was added.`);
            addNotification({ type: 'product_update', title: 'Product Added', description: `A new product, "${product.name}", is now available.`});
            toast({ title: "Product Added", description: "The new product has been added to the inventory." });
        }
        setEditingProduct(undefined);
    };

    const handleDeleteProduct = (product: Product) => {
        setProducts(products.filter(p => p.id !== product.id));
        addLog('WARN', `Product "${product.name}" was deleted.`);
        addNotification({ type: 'product_update', title: 'Product Deleted', description: `Product "${product.name}" has been removed from inventory.`});
        toast({ variant: 'destructive', title: "Product Deleted", description: "The product has been removed." });
        setDeletingProduct(undefined);
        setIsDeleteConfirmOpen(false);
    }
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Package className="w-8 h-8" />
                    Product Management
                </h1>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingProduct(undefined)}><PlusCircle className="mr-2 h-4 w-4" /> Add Product</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader><DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle></DialogHeader>
                        <ProductForm product={editingProduct ? {...editingProduct, price: editingProduct.price / 100} : undefined} onSave={handleSaveProduct} onOpenChange={setIsFormOpen} />
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                    <CardDescription>View, edit, and manage all products.</CardDescription>
                    <div className="pt-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Search products by name..." className="pl-10 max-w-sm" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Image src={product.image} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                                            <p className="font-semibold">{product.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.brand}</TableCell>
                                    <TableCell>KES {product.price / 100}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setIsFormOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeletingProduct(product); setIsDeleteConfirmOpen(true);}}><Trash2 className="h-4 w-4" /></Button>
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
                            This action cannot be undone. This will permanently delete the product: {deletingProduct?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDeleteProduct(deletingProduct!)}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
