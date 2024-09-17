'use client'

import React from 'react';
import ZipCodeLookup from './zip_code_lookup';
import TeleCodeLookup from './tele_code_lookup';
import NearestStationLookup from './nearest_station_lookup';

const App: React.FC = () => {
    return (
        <div>
            <h1>郵便番号から住所を検索</h1>
            <ZipCodeLookup />
            <h1>電話番号から会社名を検索</h1>
            <TeleCodeLookup />
            <h1>郵便番号から最寄り駅を検索</h1>
            <NearestStationLookup />
        </div>
    );
};

export default App;