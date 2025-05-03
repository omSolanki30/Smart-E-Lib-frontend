import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
  BadgeCheck,
  User,
  Mail,
  Phone,
  UserCog,
  BookUser,
  Home,
  Edit2,
  Save,
  IdCard,
  FileUser,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Info = () => {
  const { user, setUser } = useAuth();
  const [otherDetails, setOtherDetails] = useState({
    fullName: user?.otherDetails?.fullName || "",
    contactNumber: user?.otherDetails?.contactNumber || "",
    address: user?.otherDetails?.address || "",
  });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowForm(
      !(
        user?.otherDetails?.fullName &&
        user?.otherDetails?.contactNumber &&
        user?.otherDetails?.address
      )
    );
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${user._id}`
        );
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
      }
    };
    if (user?._id) fetchUser();
  }, []);

  useEffect(() => {
    const incomplete = !(
      otherDetails.fullName &&
      otherDetails.contactNumber &&
      otherDetails.address
    );
    setShowForm(incomplete);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !otherDetails.fullName ||
      !otherDetails.contactNumber ||
      !otherDetails.address
    ) {
      toast.error("❌ Please fill all fields before saving.");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/update-details/${user._id}`,
        {
          name: user.name,
          email: user.email,
          otherDetails,
        }
      );

      const updatedUser = res.data.updatedUser;
      toast.success("Details updated successfully!");

      // Update local states
      setUser(updatedUser);
      setOtherDetails(updatedUser.otherDetails); // 👈 this is important
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setShowForm(false); // hide form now
    } catch (err) {
      console.error(err);
      toast.error("Failed to update details");
    }
  };

  const InfoCard = ({ icon, label, value }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-all dark:bg-gray-900 dark:border-gray-700">
        <CardHeader className="flex gap-4 items-center">
          <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>
          <div>
            <CardTitle className="text-sm text-gray-600 dark:text-gray-300">
              {label}
            </CardTitle>
            <CardDescription className="text-base text-black dark:text-white font-medium">
              {value || "N/A"}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600 text-white p-6 rounded-xl shadow-md mb-8"
        >
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <BookUser className="w-7 h-7" /> Welcome, {user?.name}
          </h2>
          <p className="text-sm text-indigo-100">Here's your account summary</p>
        </motion.div>

        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={() => navigate("/edit-info")}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit Info
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <InfoCard
            icon={<IdCard size={22} />}
            label="User ID"
            value={user?._id}
          />
          <InfoCard
            icon={<BadgeCheck size={22} />}
            label="Student ID"
            value={user?.id}
          />
          <InfoCard icon={<User size={22} />} label="Name" value={user?.name} />
          <InfoCard
            icon={<Mail size={22} />}
            label="Email"
            value={user?.email}
          />
          <InfoCard
            icon={<UserCog size={22} />}
            label="Role"
            value={user?.role}
          />
        </div>

        {!showForm && otherDetails.fullName && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
              📘 Additional Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoCard
                icon={<User size={20} />}
                label="Full Name"
                value={otherDetails.fullName}
              />
              <InfoCard
                icon={<Phone size={20} />}
                label="Contact Number"
                value={otherDetails.contactNumber}
              />
              <InfoCard
                icon={<Home size={20} />}
                label="Address"
                value={otherDetails.address}
              />
            </div>
          </div>
        )}

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10 bg-white dark:bg-gray-900 border p-6 rounded-xl shadow-md dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
              Complete Your Details
            </h3>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <Input
                placeholder="Full Name"
                value={otherDetails.fullName}
                onChange={(e) =>
                  setOtherDetails({ ...otherDetails, fullName: e.target.value })
                }
              />
              <Input
                placeholder="Contact Number"
                value={otherDetails.contactNumber}
                onChange={(e) =>
                  setOtherDetails({
                    ...otherDetails,
                    contactNumber: e.target.value,
                  })
                }
              />
              <Textarea
                placeholder="Address"
                value={otherDetails.address}
                onChange={(e) =>
                  setOtherDetails({ ...otherDetails, address: e.target.value })
                }
                className="col-span-2"
              />
              <Button type="submit" className="col-span-2">
                <Save className="w-4 h-4 mr-2" /> Save Details
              </Button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Info;
