// components/steps/staff/PhotoCaptureStep.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import StepLayout from '@/components/layout/StepLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStaffStore } from '@/lib/staff-store';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase'; // your firebase.ts export

export default function PhotoCaptureStep() {
    const { selectedPlayer, currentTeam, updatePlayerPhoto, setCurrentStep } =
        useStaffStore();

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [photo, setPhoto] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [cameraReady, setCameraReady] = useState(false);

    /* ---------- camera lifecycle ---------- */
    useEffect(() => {
        startCamera();
        return () => stopCamera(); // stop on unmount
    }, [facingMode]);

    const startCamera = async () => {
        stopCamera();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode },
            });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
            setCameraReady(false);
        } catch (err) {
            console.error(err);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    };

    /* ---------- photo capture ---------- */
    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const size = Math.min(video.videoWidth, video.videoHeight);
        const offsetX = (video.videoWidth - size) / 2;
        const offsetY = (video.videoHeight - size) / 2;

        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, 512, 512);
        setPhoto(canvas.toDataURL('image/png'));
    };

    const retake = () => setPhoto(null);

    const accept = async () => {
        if (!photo || !selectedPlayer || !currentTeam) return;

        // 1. Upload to Firebase Storage
        const storagePath = `photos/${currentTeam.sessionCode}/${selectedPlayer.id}.png`;
        const storageRef = ref(storage, storagePath);
        await uploadString(storageRef, photo, 'data_url');
        const publicUrl = await getDownloadURL(storageRef);

        // 2. Save the public URL via your existing flow
        await updatePlayerPhoto(selectedPlayer.id, publicUrl);

        // 3. Stop camera and go back
        stopCamera();
        setCurrentStep('player-selection');
    };

    const cancel = () => {
        stopCamera();
        setCurrentStep('player-selection');
    };

    if (!selectedPlayer || !currentTeam) return <div>Loading…</div>;

    return (
        <StepLayout staff showTeamNumber>
            <div className="space-y-6 max-w-lg mx-auto">
                <Card>
                    <CardContent className="p-4 text-center">
                        <h2 className="text-xl font-bold">
                            Take photo for {selectedPlayer.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Team #{currentTeam.sessionCode}
                        </p>
                    </CardContent>
                </Card>

                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black">
                    {!photo ? (
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            playsInline
                            muted
                            onCanPlay={() => setCameraReady(true)}
                        />
                    ) : (
                        <img
                            src={photo}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="flex justify-between">
                    <Button variant="outline" onClick={cancel}>
                        Cancel
                    </Button>

                    <div className="flex gap-2">
                        {!photo ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setFacingMode((prev) =>
                                            prev === 'user' ? 'environment' : 'user'
                                        )
                                    }
                                >
                                    Flip
                                </Button>
                                <Button
                                    onClick={takePhoto}
                                    disabled={!cameraReady}
                                    className="bg-black text-white"
                                >
                                    📸 Take
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={retake}>
                                    Retake
                                </Button>
                                <Button onClick={accept} className="bg-green-600 text-white">
                                    ✓ Accept
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </StepLayout>
    );
}
