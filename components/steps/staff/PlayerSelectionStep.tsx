'use client';

import StepLayout from '@/components/layout/StepLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStaffStore } from '@/lib/staff-store';

export default function PlayerSelectionStep() {
    const {
        currentTeam,
        setCurrentStep,
        setSelectedPlayer
    } = useStaffStore();

    if (!currentTeam) {
        return <div>Loading...</div>;
    }

    const handlePhotoClick = (player: any) => {
        setSelectedPlayer(player);
        setCurrentStep('photo-capture');
    };

    const handleWeaponClick = (player: any) => {
        setSelectedPlayer(player);
        setCurrentStep('weapon-selection');
    };

    const getPlayerColorClass = (color: string) => {
        const colorMap = {
            'red': 'bg-red-500',
            'blue': 'bg-blue-500',
            'yellow': 'bg-yellow-500',
            'green': 'bg-green-500',
            'purple': 'bg-purple-500',
            'orange': 'bg-orange-500',
        };
        return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
    };

    const allPlayersReady = currentTeam.players.every(p => p.hasPhoto && p.hasWeapon);
    console.log(currentTeam);

    // Map weapon IDs to image paths
    const weaponImages: Record<string, string> = {
        'assault-rifle': '/assault_rifle_720.png',
        'submachine-gun': '/smg_720.png',
        'dual-pistols': '/pistol_double.png',
        'shotgun': '/shotgun_720.png',
        'sniper-rifle': '/sniper_720.png',
    };

    // Helper to format weapon names for display
    const formatWeaponName = (weaponId: string) => {
        return weaponId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <StepLayout staff showTeamNumber>
            <div className="space-y-6">
                {/* Team Info */}
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-2 sm:space-y-0 sm:space-x-6">
                                <span className="text-base sm:text-lg">
                                    Team: <span className="font-bold">#{currentTeam.sessionCode}</span>
                                </span>
                                <span className="text-base sm:text-lg">
                                    Name: <span className="font-bold">{currentTeam.teamName}</span>
                                </span>
                            </div>
                            <div className="text-right text-xs sm:text-sm text-gray-600">
                                <div>Store: <span className="font-medium">{currentTeam.storeId}</span></div>
                                <div>Game: <span className="font-medium">{currentTeam.selectedGame}</span></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Players Grid */}
                <div
                    className={
                        currentTeam.players.length === 1
                            ? 'max-w-lg mx-auto w-full'
                            : 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'
                    }
                >
                    {currentTeam.players.map((player, index) => (
                        <Card key={player.id} className="relative w-full">
                            <CardContent className="p-4 sm:p-6">
                                {/* Player Header */}
                                <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                                    <div
                                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded ${getPlayerColorClass(player.color)} border-2 border-white shadow-sm`}
                                    ></div>
                                    <span className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium text-white rounded ${getPlayerColorClass(player.color)}`}>
                                        Player {index + 1}
                                    </span>
                                    <span className="font-medium text-base sm:text-lg truncate">{player.name}</span>
                                </div>

                                {/* Photo and Weapon Section */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    {/* ---------- PHOTO PREVIEW ---------- */}
                                    <div className="space-y-2">
                                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                                            {player.hasPhoto && player.photoUrl ? (
                                                <img
                                                    src={player.photoUrl}
                                                    alt={`${player.name} photo`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center text-gray-400 p-2">
                                                    <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-1" />
                                                    <span className="text-xs">No photo</span>
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            onClick={() => handlePhotoClick(player)}
                                            className="w-full text-sm sm:text-base"
                                        >
                                            📸 Photo
                                        </Button>
                                    </div>

                                    {/* ---------- WEAPON PREVIEW ---------- */}
                                    <div className="space-y-2">
                                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                                            {player.hasWeapon && player.selectedWeapon ? (
                                                <img
                                                    src={weaponImages[player.selectedWeapon]}
                                                    alt={formatWeaponName(player.selectedWeapon)}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-center text-gray-400 p-2">
                                                    <div className="text-2xl sm:text-3xl opacity-50">❓</div>
                                                    <span className="text-xs">No weapon</span>
                                                </div>
                                            )}
                                        </div>
                                        {/* Selected weapon details */}
                                        {player.selectedWeapon && (
                                                <div className="flex items-center space-x-3 bg-white rounded-lg p-3 border">
                                                    <div>
                                                        <p className="font-bold text-gray-900">
                                                            {formatWeaponName(player.selectedWeapon)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {
                                                                {
                                                                    'assault-rifle': 'アサルトライフル',
                                                                    'submachine-gun': 'サブマシンガン',
                                                                    'dual-pistols': 'デュアルピストル',
                                                                    shotgun: 'ショットガン',
                                                                    'sniper-rifle': 'スナイパーライフル',
                                                                }[player.selectedWeapon]
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                        )}
                                        <Button
                                            onClick={() => handleWeaponClick(player)}
                                            className="w-full text-sm sm:text-base"
                                        >
                                            🔫 Weapon
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-6">
                    <Button
                        onClick={() => setCurrentStep('session-input')}
                        variant="outline"
                        size="lg"
                        className="px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-base"
                    >
                        Back
                    </Button>

                    <Button
                        onClick={() => setCurrentStep('completion')}
                        disabled={!allPlayersReady}
                        size="lg"
                        className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-base"
                    >
                        確定 / Confirm
                    </Button>
                </div>
            </div>
        </StepLayout>
    );
}
