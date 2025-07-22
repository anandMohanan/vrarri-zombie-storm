'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import StepLayout from '@/components/layout/StepLayout';
import SignatureCanvas from 'react-signature-canvas';

export default function TermsStep() {
  const { confirmCurrentPlayer, setCurrentStep, team, updateCurrentPlayer } = useAppStore();
  const [hasSignature, setHasSignature] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const handleAgree = async () => {
    if (sigCanvasRef.current && hasSignature) {
      setIsUploading(true);
      
      try {
        const signatureData = sigCanvasRef.current.toDataURL();
        
        // Update current player with signature data and agreement
        updateCurrentPlayer({ 
          signature: signatureData,
          agreedToTerms: true 
        });
        
        // This will now upload signature to Firebase Storage
        await confirmCurrentPlayer();
        
        // Navigate to next step
        if (team.players.length + 1 < team.maxPlayers) {
          setCurrentStep('team-name');
        } else {
          setCurrentStep('team-name');
        }
      } catch (error) {
        console.error('Error processing signature:', error);
        alert('Error saving signature. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSignatureEnd = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      setHasSignature(true);
    }
  };

  const clearSignature = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      setHasSignature(false);
    }
  };

  return (
    <StepLayout showHeader={true} showTeamNumber={true} showPlayerIndicator={true}>
      <div className="space-y-3">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-gray-900">
            規約説明
          </h1>
          <p className="text-gray-600">
            Terms and Conditions
          </p>
        </div>

        {/* Terms Content */}
        <div className="bg-gray-50 rounded-lg p-6 h-53 overflow-y-auto border">
          <div className="space-y-4 text-sm leading-relaxed">
            <p className="font-semibold">利用規約 / Terms of Service</p>
            
            <div className="space-y-2">
              <p>1. <strong>安全に関する注意事項 / Safety Guidelines</strong></p>
              <p>• VR体験中は指定されたプレイエリア内でのみ活動してください。</p>
              <p>• Please stay within the designated play area during VR experience.</p>
              <p>• 体調不良を感じた場合は、すぐにスタッフにお知らせください。</p>
              <p>• If you feel unwell, please notify staff immediately.</p>
            </div>

            <div className="space-y-2">
              <p>2. <strong>プライバシーポリシー / Privacy Policy</strong></p>
              <p>• ゲームプレイ動画は、お客様への提供および施設の品質向上のためにのみ使用されます。</p>
              <p>• Gameplay videos will only be used for customer delivery and facility improvement.</p>
              <p>• 個人情報は適切に管理し、第三者への提供は行いません。</p>
              <p>• Personal information will be properly managed and not shared with third parties.</p>
            </div>

            <div className="space-y-2">
              <p>3. <strong>設備の使用について / Equipment Usage</strong></p>
              <p>• VRヘッドセットや機器は丁寧にお取り扱いください。</p>
              <p>• Please handle VR headsets and equipment with care.</p>
              <p>• 故意による破損の場合は、修理費用をご負担いただく場合があります。</p>
              <p>• Intentional damage may result in repair costs.</p>
            </div>

            <div className="space-y-2">
              <p>4. <strong>体験に関する注意 / Experience Guidelines</strong></p>
              <p>• 13歳未満のお客様は保護者の同意が必要です。</p>
              <p>• Customers under 13 require parental consent.</p>
              <p>• 妊娠中の方、心臓に疾患のある方は体験をお控えください。</p>
              <p>• Pregnant individuals or those with heart conditions should refrain from participation.</p>
            </div>

            <div className="space-y-2">
              <p>5. <strong>免責事項 / Disclaimer</strong></p>
              <p>• 体験中の事故やけがについて、当施設は責任を負いかねます。</p>
              <p>• The facility is not responsible for accidents or injuries during the experience.</p>
              <p>• お客様の責任において体験にご参加ください。</p>
              <p>• Please participate at your own risk.</p>
            </div>

            <p className="text-xs text-gray-500 pt-4">
              本規約は2024年1月1日より施行されます。 / These terms are effective from January 1, 2024.
            </p>
          </div>
        </div>

        {/* Signature Section */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              上記規約に同意いただける場合は、下記にサインをお願いします。
            </p>
            <p className="text-xs text-gray-500">
              If you agree to the above terms, please sign below.
            </p>
          </div>

          {/* Signature Canvas */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
            <div className="text-sm text-gray-600 mb-2">署名 / Signature</div>
            <div className="border border-gray-200 rounded">
              <SignatureCanvas
                ref={sigCanvasRef}
                canvasProps={{
                  width: 500,
                  height: 150,
                  className: 'signature-canvas w-full'
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
                className="text-xs"
                disabled={isUploading}
              >
                Clear
              </Button>
              <span className="text-xs text-gray-500">
                {hasSignature ? '✓ Signature captured' : 'Please sign above'}
              </span>
            </div>
          </div>
        </div>

        {/* Agree Button */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleAgree}
            disabled={!hasSignature || isUploading}
            size="lg"
            className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white px-12 py-4 text-lg font-medium rounded-md transition-colors duration-200"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              '同意する / Agree'
            )}
          </Button>
        </div>
      </div>
    </StepLayout>
  );
}
