import React, { useState } from 'react';
import axios from 'axios';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"

interface AddressData {
    address1: string;
    address2: string;
    address3: string;
}

const ZipCodeLookup: React.FC = () => {
    const [zipCode, setZipCode] = useState<string>('');
    const [addressList, setAddressList] = useState<string[]>([]);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleComplete = (value: string) => {
        setZipCode(value);
    };

    const lookupAddress = async () => {
        if (!/^\d{7}$/.test(zipCode)) {
            setError('郵便番号は7桁の数字で入力してください。');
            return;
        }

        setIsLoading(true);
        setError('');
        setAddressList([]);

        try {
            const response = await axios.get<{ results: AddressData[] | null }>(
                `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`
            );

            if (response.data.results) {
                const result = response.data.results[0];
                setAddressList([result.address1, result.address2, result.address3]);
            } else {
                setError('該当する住所が見つかりません。');
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
                <CardTitle>郵便番号検索</CardTitle>
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

                {addressList.length > 0 && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <span className="flex items-center mb-2">
                            <CheckCircledIcon className="h-4 w-4 mr-2" />
                            検索結果:
                        </span>
                        <ul className="list-disc list-inside">
                            {addressList.map((address, index) => (
                                <li key={index}>{address}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={lookupAddress} disabled={isLoading} className="w-full">
                    {isLoading ? "検索中..." : "住所検索"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ZipCodeLookup;