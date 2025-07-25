// CompletionStep.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { markTeamReady } from '@/lib/firebase-service';
import StepLayout from '@/components/layout/StepLayout';
import { useStaffStore } from '@/lib/staff-store';

export default function CompletionStep() {
  const { currentTeam, resetSession, setCurrentStep } = useStaffStore();

  if (!currentTeam) return <div>Loading…</div>;

  const handleNextSession = async () => {
    try {
      await markTeamReady(currentTeam.sessionCode);
      console.log('Team marked as ready for gameplay');
    } catch (error) {
      console.error('Failed to mark team ready:', error);
    }
    resetSession();
  };

  const handleReturnToEdit = () => setCurrentStep('player-selection');

  const getPlayerColorClass = (color: string) => {
    const map: Record<string, string> = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    };
    return map[color] ?? 'bg-gray-500';
  };

  // Map weapon IDs to image paths
  const weaponImages: Record<string, string> = {
    'assault-rifle': '/assault_rifle_720.png',
    'submachine-gun': '/smg_720.png',
    'dual-pistols': '/pistol_double.png',
    shotgun: '/shotgun_720.png',
    'sniper-rifle': '/sniper_720.png',
  };

  return (
    <StepLayout staff showTeamNumber>
      <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Success Message */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 px-4">
            体験をお楽しみください！
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 px-4">
            Enjoy your experience!
          </p>
        </div>

        {/* Team Summary */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Team #{currentTeam.sessionCode} - {currentTeam.teamName}
              </h2>
              <div className="flex flex-wrap justify-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-2">
                <span>Store: {currentTeam.storeId}</span>
                <span>•</span>
                <span>Game: {currentTeam.selectedGame}</span>
                <span>•</span>
                <span>Setup Complete</span>
              </div>
            </div>

            {/* Player Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {currentTeam.players.map((player, index) => (
                <div
                  key={player.id}
                  className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded ${getPlayerColorClass(
                        player.color
                      )} border-2 border-white shadow-sm`}
                    />
                    <span className="font-medium text-sm sm:text-base">
                      Player {index + 1}
                    </span>
                    <span className="text-gray-600 text-sm truncate">
                      {player.name}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="truncate">Email: {player.email}</div>
                    {player.signatureMeta && (
                      <div className="truncate">
                        Signed:{' '}
                        {new Date(
                          player.signatureMeta.timestamp
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span>Photo:</span>
                      <span
                        className={`font-medium ${
                          player.hasPhoto ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {player.hasPhoto ? '✓ ' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Weapon:</span>
                      <span
                        className={`font-medium ${
                          player.hasWeapon ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {player.hasWeapon ? '✓' : '✗ Missing'}
                      </span>
                    </div>
                    {player.selectedWeapon && (
                      <div className="text-xs text-gray-600 mt-1 text-center">
                        {player.selectedWeapon
                          .split('-')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(' ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipment Summary */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
              Equipment Assigned
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 text-center">
              {currentTeam.players
                .filter((p) => p.hasWeapon)
                .map((player) => (
                  <div
                    key={player.id}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    <div className="w-20 h-20 mx-auto mb-2">
                      <img
                        src={weaponImages[player.selectedWeapon!]}
                        alt={player.selectedWeapon}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xs sm:text-sm font-medium">
                      <div
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${getPlayerColorClass(
                          player.color
                        )} mx-auto mb-1`}
                      />
                      <div className="truncate px-1">{player.name}</div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 px-1">
                      {player.selectedWeapon
                        ?.split('-')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Button
            onClick={handleReturnToEdit}
            variant="outline"
            size="lg"
            className="py-4 sm:py-6 text-sm sm:text-base h-auto"
          >
            <div className="flex flex-col items-center text-center">
              <span className="font-medium">
                プレイヤー確認に戻る（修正）
              </span>
              <span className="text-xs sm:text-sm font-normal mt-1">
                Return to player confirmation (edit)
              </span>
            </div>
          </Button>

          <Button
            onClick={handleNextSession}
            size="lg"
            className="bg-black hover:bg-gray-800 text-white py-4 sm:py-6 text-sm sm:text-base h-auto"
          >
            <div className="flex flex-col items-center text-center">
              <span className="font-medium">次のセッションへ</span>
              <span className="text-xs sm:text-sm font-normal mt-1">
                Proceed to next session
              </span>
            </div>
          </Button>
        </div>
      </div>
    </StepLayout>
  );
}
