import React from 'react';
import { Grid } from 'lucide-react';

export const WelcomePrompt: React.FC = () => {
  return (
    <div className="h-1/2 lg:h-full lg:flex-1 bg-white flex items-center justify-center rounded-lg shadow-md border">
      <div className="text-center p-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <Grid className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-black mb-2">
          画像を選択
        </h3>
        <p className="text-gray-600 text-sm">
          ギャラリーまたはマップから選択してください
        </p>
      </div>
    </div>
  );
};