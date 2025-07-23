'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import StepLayout from '@/components/layout/StepLayout';
import SignatureCanvas from 'react-signature-canvas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area'; // 👈 import
import { TERMS_JP } from '@/lib/terms/terms-jp';
import { TERMS_EN } from '@/lib/terms/terms-en';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// ------------------------------------------------------------------
// Consent labels per language
// ------------------------------------------------------------------
const CONSENT_LABELS = {
    jp: {
        agreeTerms: '上記規約を読み、同意しました。',
        agreeEsign: '電子署名の使用に同意します。',
        agreeEmail:
            'ニュースレターおよびプロモーションコンテンツを受け取るために、私のメールアドレスが使用されることに同意します。',
    },
    en: {
        agreeTerms: 'I have read and agree to the above agreement.',
        agreeEsign: 'I agree to the use of electronic signatures.',
        agreeEmail:
            'I agree that my email address may be used to receive newsletters and promotional content.',
    },
};

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function TermsStep() {
    const {
        confirmCurrentPlayer,
        setCurrentStep,
        team,
        updateCurrentPlayer,
    } = useAppStore();

    const sigCanvasRef = useRef<SignatureCanvas>(null);

    const [hasSignature, setHasSignature] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Consent toggles
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeEsign, setAgreeEsign] = useState(false);
    const [agreeEmail, setAgreeEmail] = useState(false);

    // Active tab
    const [activeTab, setActiveTab] = useState<'jp' | 'en'>('jp');

    const termsVersion = 'v1.0';

    const canProceed = agreeTerms && agreeEsign && agreeEmail && hasSignature;

    const labels = CONSENT_LABELS[activeTab];

    const handleSignatureEnd = () => {
        if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
            setHasSignature(true);
        }
    };

    const clearSignature = () => {
        sigCanvasRef.current?.clear();
        setHasSignature(false);
    };

    const handleAgree = async () => {
        if (!sigCanvasRef.current || !canProceed) return;

        setIsUploading(true);

        try {
            const signatureData = sigCanvasRef.current.toDataURL();

            updateCurrentPlayer({
                signature: signatureData,
                agreedToTerms: true,
                consentFlags: {
                    agreeTerms,
                    agreeEsign,
                    agreeEmail,
                },
                signatureMeta: {
                    timestamp: new Date().toISOString(),
                    termsVersion,
                },
            });

            await confirmCurrentPlayer();

            if (team.players.length + 1 < team.maxPlayers) {
                setCurrentStep('team-name');
            } else {
                setCurrentStep('team-name');
            }
            toast.success('Successfully saved signature / 保存しました');
        } catch (err) {
            console.error(err);
            alert('Error saving signature. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <StepLayout showHeader showTeamNumber showPlayerIndicator>
            <div className="space-y-6">
                {/* Title */}
                <div className="text-center">
                    <h1 className="text-xl font-bold text-gray-900">
                        規約説明 / Terms and Conditions
                    </h1>
                </div>

                {/* Tabs */}
                <Tabs
                    defaultValue="jp"
                    className="w-full"
                    onValueChange={(v) => setActiveTab(v as 'jp' | 'en')}
                >
                    <div className="flex items-center justify-between">
                        <TabsList className="grid w-fit grid-cols-2">
                            <TabsTrigger value="jp">日本語</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                        </TabsList>
                        <p>ver1.0</p>
                    </div>

                    <TabsContent value="jp">
                        <TermsBox text={TERMS_JP} />
                    </TabsContent>
                    <TabsContent value="en">
                        <TermsBox text={TERMS_EN} />
                    </TabsContent>
                </Tabs>

                {/* Consent toggles */}
                <div className="space-y-3 border-t pt-4">
                    <ToggleRow
                        checked={agreeTerms}
                        onChange={setAgreeTerms}
                        label={labels.agreeTerms}
                    />
                    <ToggleRow
                        checked={agreeEsign}
                        onChange={setAgreeEsign}
                        label={labels.agreeEsign}
                    />
                    <ToggleRow
                        checked={agreeEmail}
                        onChange={setAgreeEmail}
                        label={labels.agreeEmail}
                    />
                </div>

                {/* Signature */}
                <div className="space-y-4">
                    <p className="text-center text-sm text-gray-600">
                        上記規約に同意いただける場合は、下記にサインをお願いします。
                        <br />
                        If you agree to the above terms, please sign below.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                        <div className="text-sm text-gray-600 mb-2">署名 / Signature</div>
                        <div className="border border-gray-200 rounded">
                            <SignatureCanvas
                                ref={sigCanvasRef}
                                canvasProps={{
                                    width: 600,
                                    height: 200,
                                    className: 'border w-full',
                                }}
                                onEnd={handleSignatureEnd}
                                backgroundColor="white"
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearSignature}
                                disabled={isUploading}
                            >
                                Clear
                            </Button>
                            <span className="text-xs text-gray-500">
                                {hasSignature
                                    ? '✓ Signature captured'
                                    : 'Please sign above'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Agree button */}
                <div className="flex justify-center">
                    <Button
                        onClick={handleAgree}
                        disabled={!canProceed || isUploading}
                        size="lg"
                        className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white px-12 py-4 text-lg font-medium rounded-md transition-colors"
                    >
                        {isUploading ? <Loader2 className="animate-spin" /> : '同意する / Agree'}
                    </Button>
                </div>
            </div>
        </StepLayout>
    );
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
function TermsBox({ text }: { text: string }) {
    return (
        <ScrollArea className="h-64 rounded-lg border bg-gray-50 p-6">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {text}
            </pre>
        </ScrollArea>
    );
}

function ToggleRow({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
}) {
    return (
        <div className="flex items-start space-x-3">
            <Switch checked={checked} onCheckedChange={onChange} />
            <Label className="text-sm leading-tight">{label}</Label>
        </div>
    );
}
