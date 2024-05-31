import React from 'react';
import { Card } from './ui/card';

const BlurPlaceholder = () => (
  <Card className="h-full w-full flex items-center justify-center">
    <div className="w-full h-full bg-gray-200 blur-sm flex items-center justify-center">
      <div className="text-gray-500 text-center p-5">
        ...
      </div>
    </div>
  </Card>
);

export default BlurPlaceholder;