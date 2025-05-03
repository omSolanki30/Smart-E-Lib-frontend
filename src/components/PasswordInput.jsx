import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ label, name, value, onChange, required = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative space-y-1">
      {label && (
        <Label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </Label>
      )}
      <Input
        id={name}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        className="pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
      />
      <span
        className="absolute right-3 top-2/3 transform -translate-y-1/3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </span>
    </div>
  );
};

export default PasswordInput;
