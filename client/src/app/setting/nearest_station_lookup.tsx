import React, { useState } from 'react';
import axios from 'axios';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"

interface AddressData {
    prefecture: string;
    city: string;
    town: string;
    x: string;
    y: string;
}

interface StationData {
    name: string;
    line: string;
    distance: string;
}

const NearestStationLookup: React.FC = () => {
    const [zipCode, setZipCode] = useState<string>('');
    const [addressData, setAddressData] = useState<AddressData | null>(null);
    const [stationData, setStationData] = useState<StationData | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleComplete = (value: string) => {
        setZipCode(value);
    };

    const lookupNearestStation = async () => {
        if (!/^\d{7}$/.test(zipCode)) {
            setError('郵便番号は7桁の数字で入力してください。');
            return;
        }

        setIsLoading(true);
        setError('');
        setAddressData(null);
        setStationData(null);

        try {
            // 郵便番号から住所情報を取得
            const addressResponse = await axios.get<{ response: { location: AddressData[] } }>(
                `https://geoapi.heartrails.com/api/json?method=searchByPostal&postal=${zipCode}`
            );

            if (addressResponse.data.response.location.length === 0) {
                setError('該当する住所が見つかりません。');
                setIsLoading(false);
                return;
            }

            const addressData = addressResponse.data.response.location[0];
            setAddressData(addressData);

            // 緯度経度から最寄り駅を検索
            const stationResponse = await axios.get<{ response: { station: StationData[] } }>(
                `https://express.heartrails.com/api/json?method=getStations&x=${addressData.x}&y=${addressData.y}`
            );

            if (stationResponse.data.response.station.length === 0) {
                setError('最寄り駅が見つかりません。');
            } else {
                setStationData(stationResponse.data.response.station[0]);
            }
        } catch (error) {
            setError('エラーが発生しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>最寄り駅検索</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="zipcode">郵便番号</Label>
                    <InputOTP maxLength={7} value={zipCode} onChange={handleComplete}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="flex items-center">
                            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                            {error}
                        </span>
                    </div>
                )}

                {addressData && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <span className="flex items-center mb-2">
                            <CheckCircledIcon className="h-4 w-4 mr-2" />
                            検索結果:
                        </span>
                        <ul className="list-disc list-inside">
                            <li>都道府県: {addressData.prefecture}</li>
                            <li>市区町村: {addressData.city}</li>
                            <li>町域: {addressData.town}</li>
                        </ul>
                    </div>
                )}

                {stationData && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                        <span className="flex items-center mb-2">
                            <CheckCircledIcon className="h-4 w-4 mr-2" />
                            最寄り駅情報:
                        </span>
                        <ul className="list-disc list-inside">
                            <li>駅名: {stationData.name}</li>
                            <li>路線: {stationData.line}</li>
                            <li>距離: 約{Math.round(parseFloat(stationData.distance))}m</li>
                        </ul>
                    </div>
                )}


            </CardContent>
            <CardFooter>
                <Button onClick={lookupNearestStation} disabled={isLoading} className="w-full">
                    {isLoading ? "検索中..." : "最寄り駅を検索"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default NearestStationLookup;