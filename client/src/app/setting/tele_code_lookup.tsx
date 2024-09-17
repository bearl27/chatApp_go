import React, { useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"

// モックデータ（実際の実装では適切なAPIに置き換えてください）
const mockCompanyData: { [key: string]: string } = {
    "0120111111": "株式会社A",
    "0120222222": "株式会社B",
    "0120333333": "株式会社C",
};

const TeleCodeLookup: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [companyName, setCompanyName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleComplete = (value: string) => {
        setPhoneNumber(value);
    };

    const lookupCompany = async () => {
        if (!/^\d{10}$/.test(phoneNumber)) {
            setError('電話番号は10桁の数字で入力してください。');
            return;
        }

        setIsLoading(true);
        setError('');
        setCompanyName('');

        setTimeout(() => {
            const company = mockCompanyData[phoneNumber];
            if (company) {
                setCompanyName(company);
            } else {
                setError('該当する会社が見つかりません。');
            }
            setIsLoading(false);
        }, 1000); // APIの呼び出しをシミュレートするための遅延
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>電話番号検索</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phonenumber">電話番号</Label>
                    <InputOTP maxLength={10} value={phoneNumber} onChange={handleComplete}>
                        <InputOTPGroup>
                            {[...Array(10)].map((_, index) => (
                                <InputOTPSlot key={index} index={index} />
                            ))}
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

                {companyName && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <span className="flex items-center mb-2">
                            <CheckCircledIcon className="h-4 w-4 mr-2" />
                            検索結果:
                        </span>
                        <p>{companyName}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={lookupCompany} disabled={isLoading} className="w-full">
                    {isLoading ? "検索中..." : "会社名検索"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TeleCodeLookup;