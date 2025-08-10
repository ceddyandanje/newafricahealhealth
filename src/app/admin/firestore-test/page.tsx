
'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Edit, List, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function FirestoreTestPage() {
    const [isLoadingWrite, setIsLoadingWrite] = useState(false);
    const [isLoadingRead, setIsLoadingRead] = useState(false);
    const [isLoadingTest, setIsLoadingTest] = useState(false);
    const [readData, setReadData] = useState<any[]>([]);
    const { toast } = useToast();
    const testCollectionName = "test-collection";

    const handleConnectionTest = async () => {
        setIsLoadingTest(true);
        try {
            // A lightweight operation to test connection. This will fail if rules are incorrect.
            // We are trying to get a document that doesn't exist. The success/failure of the *request* is what we care about.
            await getDoc(doc(db, "test-connection-collection", "test-doc"));
            toast({
                title: "Connection Successful",
                description: "Successfully connected to Firestore.",
            });
        } catch (e: any) {
            console.error("Error testing connection: ", e);
            toast({
                variant: "destructive",
                title: "Connection Failed",
                description: `Could not connect to Firestore. ${e.message}`,
            });
        } finally {
            setIsLoadingTest(false);
        }
    }

    const handleWrite = async () => {
        setIsLoadingWrite(true);
        try {
            const docRef = await addDoc(collection(db, testCollectionName), {
                name: "name",
                email: "email@email.com",
                timestamp: new Date()
            });
            toast({
                title: "Write Successful",
                description: `Document written with ID: ${docRef.id}`,
            });
        } catch (e: any) {
            console.error("Error adding document: ", e);
            toast({
                variant: "destructive",
                title: "Write Failed",
                description: `Could not write document to Firestore. ${e.message}`,
            });
        } finally {
            setIsLoadingWrite(false);
        }
    };

    const handleRead = async () => {
        setIsLoadingRead(true);
        setReadData([]);
        try {
            const querySnapshot = await getDocs(collection(db, testCollectionName));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReadData(data);
            if (data.length === 0) {
                 toast({
                    title: "Read Complete",
                    description: "The collection is empty or does not exist.",
                });
            } else {
                toast({
                    title: "Read Successful",
                    description: `Successfully fetched ${data.length} documents.`,
                });
            }
        } catch (e: any) {
             console.error("Error reading documents: ", e);
             toast({
                variant: "destructive",
                title: "Read Failed",
                description: `Could not read documents from Firestore. ${e.message}`,
            });
        } finally {
            setIsLoadingRead(false);
        }
    };

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Database className="w-8 h-8" />
                    Firestore Connection Test
                </h1>
            </header>
            <div className="grid md:grid-cols-2 gap-6">
                 <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500"/> 1. Test Connection</CardTitle>
                        <CardDescription>Click this button first to verify that the app can communicate with your Firestore database.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleConnectionTest} disabled={isLoadingTest}>
                            {isLoadingTest && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Test Connection
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Edit className="w-5 h-5"/> 2. Trial Write</CardTitle>
                        <CardDescription>Click the button to write a sample document to the '{testCollectionName}' collection in Firestore.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleWrite} disabled={isLoadingWrite}>
                            {isLoadingWrite && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Write Test Data
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><List className="w-5 h-5"/> 3. Trial Read</CardTitle>
                        <CardDescription>Click to fetch all documents from the '{testCollectionName}' collection and display them below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button onClick={handleRead} disabled={isLoadingRead}>
                             {isLoadingRead && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Read Test Data
                         </Button>
                    </CardContent>
                </Card>
                 <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Results</CardTitle>
                            <CardDescription>Data read from Firestore will be displayed here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingRead ? (
                                <p>Reading data...</p>
                            ) : readData.length > 0 ? (
                                <pre className="p-4 bg-muted rounded-md text-sm overflow-auto">
                                    {JSON.stringify(readData, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-muted-foreground">No data to display. Click "Read Test Data" to fetch.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
