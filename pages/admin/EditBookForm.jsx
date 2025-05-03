import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PencilLine, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

const EditBookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    bookCode: "",
    title: "",
    author: "",
    category: "",
    pdfUrl: "",
    isAvailable: true,
  });
  const [extraFields, setExtraFields] = useState([]);
  const [newField, setNewField] = useState({ key: "", value: "" });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`);
        setForm(res.data);

        const coreKeys = [
          "_id",
          "bookCode",
          "title",
          "author",
          "category",
          "pdfUrl",
          "isAvailable",
          "__v",
        ];
        const additional = Object.entries(res.data).filter(
          ([key]) => !coreKeys.includes(key)
        );
        setExtraFields(additional.map(([key, value]) => ({ key, value })));
      } catch (err) {
        console.error("Failed to fetch book:", err);
        toast.error("Failed to load book details");
        navigate("/admin/books");
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExtraFieldChange = (index, keyOrValue, value) => {
    const updated = [...extraFields];
    updated[index][keyOrValue] = value;
    setExtraFields(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form };
    extraFields.forEach((field) => {
      if (field.key.trim()) data[field.key] = field.value;
    });

    try {
      await axios.put(`http://localhost:5000/api/books/${id}`, data);
      toast.success("Book updated successfully");
      navigate("/admin/books");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update book");
    }
  };

  const addNewField = () => {
    if (newField.key.trim()) {
      setExtraFields([...extraFields, newField]);
      setNewField({ key: "", value: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-10 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl border">
          <CardHeader className="flex items-center gap-3">
          <PencilLine className="text-indigo-600 dark:text-indigo-300 w-6 h-6" />
            <div>
              <CardTitle className="text-2xl">Edit Book</CardTitle>
              <CardDescription>Update book details below.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.entries(form).map(([key, value]) =>
                ["bookCode", "title", "author", "category", "pdfUrl"].includes(
                  key
                ) ? (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Label>
                    <Input
                      name={key}
                      value={value}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ) : null
              )}

              {/* Extra Fields Section */}
              <div className="pt-4 border-t">
                <Label className="mb-2 block text-lg text-indigo-600 dark:text-indigo-300"> 
                  Additional Fields
                </Label>
                {extraFields.map((field, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Field Name"
                      value={field.key}
                      onChange={(e) =>
                        handleExtraFieldChange(index, "key", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) =>
                        handleExtraFieldChange(index, "value", e.target.value)
                      }
                    />
                  </div>
                ))}

                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="New Field Name"
                    value={newField.key}
                    onChange={(e) =>
                      setNewField({ ...newField, key: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Value"
                    value={newField.value}
                    onChange={(e) =>
                      setNewField({ ...newField, value: e.target.value })
                    }
                  />
                  <Button type="button" onClick={addNewField} className="gap-1">
                    <PlusCircle className="w-4 h-4" /> Add
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/admin/books")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EditBookForm;
