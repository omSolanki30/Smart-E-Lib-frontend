import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none bg-white/90 backdrop-blur rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-700">SmartLibrary</h1>
            <p className="text-sm text-gray-500">Access your account below</p>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
