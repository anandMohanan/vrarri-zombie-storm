// components/steps/staff/PhotoCaptureStep.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import StepLayout from '@/components/layout/StepLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStaffStore } from '@/lib/staff-store';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase'; // your firebase.ts export
import {
    Loader2,
    Check, // For Accept
    RotateCcw, // For Retake
    Camera, // For Take
    RefreshCw, // For Flip (common for camera rotation)
    ArrowLeft, // For Cancel (back action)
} from 'lucide-react';
import { toast } from 'sonner';

export default function PhotoCaptureStep() {
    const { selectedPlayer, currentTeam, updatePlayerPhoto, setCurrentStep } =
        useStaffStore();

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [photo, setPhoto] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [cameraReady, setCameraReady] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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
            toast.error('Failed to access camera.', {
                description:
                    'Please ensure your browser has camera permissions enabled and try again.',
            });
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
        if (!video || !canvas) {
            toast.error('Camera not ready.', {
                description: 'Please wait for the camera to initialize.',
            });
            return;
        }

        const size = Math.min(video.videoWidth, video.videoHeight);
        const offsetX = (video.videoWidth - size) / 2;
        const offsetY = (video.videoHeight - size) / 2;

        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, 512, 512);
        setPhoto(canvas.toDataURL('image/png'));
        toast.success('Photo captured!', {
            description: 'Preview your photo and accept or retake.',
        });
    };

    const retake = () => {
        setPhoto(null);
        toast.info('Photo discarded. You can take a new one.');
    };

    const accept = async () => {
        if (!photo || !selectedPlayer || !currentTeam) {
            toast.error('Missing photo or player data. Cannot save.');
            return;
        }

        setIsUploading(true);
        try {
            const storagePath = `photos/${currentTeam.sessionCode}/${selectedPlayer.id}.png`;
            const storageRef = ref(storage, storagePath);
            await uploadString(storageRef, photo, 'data_url');
            const publicUrl = await getDownloadURL(storageRef);

            await updatePlayerPhoto(selectedPlayer.id, publicUrl);

            toast.success('Photo uploaded successfully!', {
                description: `Photo for ${selectedPlayer.name} has been saved.`,
            });
            stopCamera();
            setCurrentStep('player-selection');
        } catch (error) {
            console.error('Error uploading photo:', error);
            toast.error('Failed to upload photo.', {
                description: `There was an issue uploading the photo for ${selectedPlayer.name}. Please try again.`,
            });
        } finally {
            setIsUploading(false);
        }
    };

    const cancel = () => {
        stopCamera();
        setCurrentStep('player-selection');
        toast.info('Photo capture cancelled.');
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
                    <Button variant="outline" onClick={cancel} disabled={isUploading}>
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Cancel</span> {/* For accessibility */}
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
                                    disabled={!cameraReady || isUploading}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    <span className="sr-only">Flip Camera</span>{' '}
                                    {/* For accessibility */}
                                </Button>
                                <Button
                                    onClick={takePhoto}
                                    disabled={!cameraReady || isUploading}
                                    className="bg-black text-white"
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    <span>Take</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={retake} disabled={isUploading}>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    <span>Retake</span>
                                </Button>
                                <Button
                                    onClick={accept}
                                    className="bg-green-600 text-white"
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            <span>Accept</span>
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </StepLayout>
    );
}
