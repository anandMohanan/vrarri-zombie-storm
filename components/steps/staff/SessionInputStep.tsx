'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';          // 1️⃣ new import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StepLayout from '@/components/layout/StepLayout';
import { useStaffStore } from '@/lib/staff-store';

interface SessionInputStepProps {
    storeId: string;
}

const PAGE_SIZE = 8;

export default function SessionInputStep({ storeId }: SessionInputStepProps) {
    const { sessionHistory, loadTeamBySessionCode, setCurrentStep } = useStaffStore();

    const [sessionCode, setSessionCode] = useState('');
    const [showHistory, setShowHistory] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // 2️⃣ new flag

    /* ---------- real-time listener ---------- */
    useEffect(() => {
        setIsLoading(true); // start spinner
        const logsRef = collection(db, 'registrationLogs');
        const q = query(logsRef, orderBy('completedAt', 'desc'), limit(50));
        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                const history = snap.docs
                    .map((doc) => {
                        const data = doc.data();
                        return {
                            sessionCode: data.sessionCode,
                            teamName: data.teamName,
                            playerCount: data.playerCount,
                            createdAt:
                                data.completedAt?.toDate?.()?.toLocaleString('ja-JP') || 'Unknown',
                            storeId: data.storeId || '',
                            selectedGame: data.selectedGame || '',
                        };
                    })
                    .filter((s) => !storeId || storeId === 'DEFAULT' || s.storeId === storeId);
                useStaffStore.setState({ sessionHistory: history });
                setPage(0);
                setIsLoading(false); // stop spinner
            },
            () => setIsLoading(false) // stop on error too
        );
        return unsubscribe;
    }, [storeId]);

    /* ---------- pagination ---------- */
    const totalPages = Math.ceil(sessionHistory.length / PAGE_SIZE);
    const start = page * PAGE_SIZE;
    const paginated = sessionHistory.slice(start, start + PAGE_SIZE);

    /* ---------- handlers ---------- */
    const handleEnter = async () => {
        if (!sessionCode.trim()) return;
        setLoading(true);
        const ok = await loadTeamBySessionCode(sessionCode);
        if (ok) setCurrentStep('player-selection');
        else alert('Team not found. Please check the session code.');
        setLoading(false);
    };

    const handleHistoryClick = (code: string) => {
        setSessionCode(code);
        setShowHistory(false);
    };

    const placeholder =
        storeId && storeId !== 'DEFAULT' ? `${storeId}-12345` : 'XRC-12345';

    return (
        <StepLayout staff>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
                {/* Session Code Input */}
                <div className="space-y-6">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            チーム番号を入力してください
                        </h2>
                        <p className="text-gray-600">Please enter team number.</p>
                        {storeId && storeId !== 'DEFAULT' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                    Store:{' '}
                                    <span className="font-medium">{storeId}</span> 
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Input
                            value={sessionCode}
                            onChange={(e) => setSessionCode(e.target.value)}
                            placeholder={placeholder}
                            className="text-2xl p-6 text-center font-mono tracking-wider border-2"
                            maxLength={9}
                        />
                        <Button
                            onClick={handleEnter}
                            disabled={!sessionCode.trim() || loading}
                            size="lg"
                            className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg font-medium"
                        >
                            {loading ? 'Loading...' : 'Enter'}
                        </Button>
                    </div>
                </div>

                {/* Session History */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Team Number History</h3>

                    <Card>
                        <CardContent className="p-4">
                            {isLoading ? (
                                // 3️⃣ spinner while waiting for first snapshot
                                <div className="flex justify-center items-center py-10">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                </div>
                            ) : paginated.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No recent sessions found</p>
                                    {storeId && storeId !== 'DEFAULT' && (
                                        <p className="text-xs mt-1">for store: {storeId}</p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Team&nbsp;#</TableHead>
                                                    <TableHead>Team&nbsp;Name</TableHead>
                                                    <TableHead>Store</TableHead>
                                                    <TableHead>Game</TableHead>
                                                    <TableHead className="text-right">Players</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {paginated.map((s) => (
                                                    <TableRow
                                                        key={s.sessionCode}
                                                        className="cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleHistoryClick(s.sessionCode)}
                                                    >
                                                        <TableCell className="font-mono text-blue-600">
                                                            {s.sessionCode}
                                                        </TableCell>
                                                        <TableCell>{s.teamName}</TableCell>
                                                        <TableCell className="text-xs">{s.storeId}</TableCell>
                                                        <TableCell className="text-xs">{s.selectedGame}</TableCell>
                                                        <TableCell className="text-right">{s.playerCount}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                                disabled={page === 0}
                                            >
                                                Previous
                                            </Button>
                                            <span className="text-sm text-gray-600">
                                                Page {page + 1} of {totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setPage((p) => Math.min(totalPages - 1, p + 1))
                                                }
                                                disabled={page >= totalPages - 1}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </StepLayout>
    );
}
