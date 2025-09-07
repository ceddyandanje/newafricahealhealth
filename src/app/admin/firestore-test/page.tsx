
'use client';

import { useState } from 'react';
import { db, app } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Edit, List, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { addLog } from '@/lib/logs';

export default function FirestoreTestPage() {
    const [isLoadingWrite, setIsLoadingWrite] = useState(false);
    const [isLoadingRead, setIsLoadingRead] = useState(false);
    const [isLoadingTest, setIsLoadingTest] = useState(false);
    const [isLoadingLog, setIsLoadingLog] = useState(false);
    const [readData, setReadData] = useState<any[]>([]);
    const { toast } = useToast();
    const testCollectionName = "test-collection";

    const handleConnectionTest = async () => {
        setIsLoadingTest(true);
        try {
            // This is a lightweight operation to confirm the SDK is initialized and can reach Firestore.
            await getDoc(doc(db, "test-connection", "test-doc"));
            toast({
                title: "Connection Successful",
                description: "Successfully connected to Firebase services.",
            });
        } catch (e: any) {
             // We can ignore specific 'permission-denied' errors as they still indicate a successful connection.
            if (e.code === 'permission-denied') {
                 toast({
                    title: "Connection Successful",
                    description: "Successfully connected to Firebase services (permission rules are active).",
                });
            } else {
                console.error("Error testing connection: ", e);
                toast({
                    variant: "destructive",
                    title: "Connection Failed",
                    description: `Could not connect to Firebase. ${e.message}`,
                });
            }
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

    const handleGenerateLog = async () => {
        setIsLoadingLog(true);
        try {
            await addLog('DEBUG', 'This is a test log from the Firestore Test page.');
            toast({
                title: "Log Generated",
                description: "A test log has been written to Firestore. Check the Logs page.",
            });
        } catch (e: any) {
             console.error("Error generating log: ", e);
             toast({
                variant: "destructive",
                title: "Log Failed",
                description: `Could not generate the test log. ${e.message}`,
            });
        } finally {
            setIsLoadingLog(false);
        }
    }

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Database className="w-8 h-8" />
                    Firebase Connectivity Test
                </h1>
            </header>
            <div className="grid md:grid-cols-2 gap-6">
                 <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500"/> Step 1: Test Firebase SDK Connection</CardTitle>
                        <CardDescription>This button verifies that the app's Firebase configuration is correct and can communicate with Firebase services. It performs a lightweight read operation to check the connection.</CardDescription>
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
                        <CardTitle className="flex items-center gap-2"><Edit className="w-5 h-5"/> Firestore Write</CardTitle>
                        <CardDescription>Writes a sample document to the '{testCollectionName}' collection.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleWrite} disabled={isLoadingWrite} variant="secondary">
                            {isLoadingWrite && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Write Test Data
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><List className="w-5 h-5"/> Firestore Read</CardTitle>
                        <CardDescription>Fetches documents from the '{testCollectionName}' collection.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button onClick={handleRead} disabled={isLoadingRead} variant="secondary">
                             {isLoadingRead && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Read Test Data
                         </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-500"/> Log Generation</CardTitle>
                        <CardDescription>Writes a 'DEBUG' level log entry to the 'logs' collection.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleGenerateLog} disabled={isLoadingLog} variant="secondary">
                            {isLoadingLog && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate Test Log
                        </Button>
                    </CardContent>
                </Card>

                 <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Read Results</CardTitle>
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
