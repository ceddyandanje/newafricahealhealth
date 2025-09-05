
'use client';

import { FileText, Download, Filter, Search, FileUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

// No longer using dummy data
const documents: any[] = [];

const statusVariant = {
    New: 'default',
    Reviewed: 'secondary',
    Archived: 'outline',
} as const;

export default function PatientDocumentsPage() {
    return (
        <div className="p-6">
            <header className="py-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3"><FileText className="w-8 h-8"/> Documents</h1>
                    <p className="text-muted-foreground">Access your medical records and lab results.</p>
                </div>
                 <Button><FileUp className="mr-2 h-4 w-4"/> Upload Document</Button>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Your Medical Files</CardTitle>
                    <CardDescription>A secure repository of all your health-related documents.</CardDescription>
                     <div className="pt-4 flex justify-between items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search documents..." className="pl-10 max-w-sm" />
                        </div>
                        <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> Filter by Type</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Document Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.length > 0 ? (
                                documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{doc.name}</TableCell>
                                        <TableCell>{doc.date}</TableCell>
                                        <TableCell>{doc.type}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[doc.status as keyof typeof statusVariant]}>{doc.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm"><Download className="mr-2 h-4 w-4"/> Download</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                             ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No documents found. Uploaded documents will appear here.
                                    </TableCell>
                                </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
