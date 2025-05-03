import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, User, Mail, Phone, IdCard, Home } from "lucide-react";
import { motion } from "framer-motion";

const EditInfo = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    otherDetails: {
      fullName: "",
      contactNumber: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        otherDetails: {
          fullName: user.otherDetails?.fullName || "",
          contactNumber: user.otherDetails?.contactNumber || "",
          address: user.otherDetails?.address || "",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["fullName", "contactNumber", "address"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        otherDetails: { ...prev.otherDetails, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/update-details/${user._id}`,
        formData
      );
      setUser(res.data.updatedUser);
      toast.success("Info updated successfully!");
      navigate("/info");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update info");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-xl dark:bg-gray-900 dark:border-gray-700">
            <CardHeader className="mb-4">
              <CardTitle className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                <User className="w-6 h-6" /> Edit Your Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <IdCard size={16} /> Student ID
                  </label>
                  <Input
                    name="id"
                    value={formData.id}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <User size={16} /> Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Mail size={16} /> Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <User size={16} /> Full Name
                  </label>
                  <Input
                    name="fullName"
                    value={formData.otherDetails.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Phone size={16} /> Contact Number
                  </label>
                  <Input
                    name="contactNumber"
                    value={formData.otherDetails.contactNumber}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Home size={16} /> Address
                  </label>
                  <Textarea
                    name="address"
                    value={formData.otherDetails.address}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Save size={18} /> Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EditInfo;
