import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, BookPlus, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function AddBookForm() {
  const [formData, setFormData] = useState({
    bookCode: "",
    title: "",
    author: "",
    category: "",
    pdfUrl: "",
    isAvailable: true,
  });

  const [extraFields, setExtraFields] = useState([]);
  const [newField, setNewField] = useState({ key: "", value: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExtraField = () => {
    if (newField.key.trim() && newField.value.trim()) {
      setExtraFields([...extraFields, { ...newField }]);
      setNewField({ key: "", value: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { ...formData };
    extraFields.forEach(({ key, value }) => {
      finalData[key] = value;
    });

    try {
      const res = await axios.post("/api/books", finalData);
      toast.success("Book created successfully!");
      navigate("/admin/books");
    } catch (error) {
      toast.error("Failed to create book");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white to-indigo-50 p-6"
    >
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookPlus className="text-indigo-600" size={28} />
              <div>
                <CardTitle className="text-2xl font-bold">
                  Add New Book
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="bookCode"
                value={formData.bookCode}
                onChange={handleChange}
                placeholder="Book Code"
                required
              />
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
              />
              <Input
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author"
                required
              />
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                required
              />
              <Input
                name="pdfUrl"
                value={formData.pdfUrl}
                onChange={handleChange}
                placeholder="PDF URL"
                required
              />

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-600">
                  <FileText className="w-5 h-5" /> Additional Fields
                </h3>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Input
                    type="text"
                    placeholder="Field Name"
                    value={newField.key}
                    onChange={(e) =>
                      setNewField({ ...newField, key: e.target.value })
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Field Value"
                    value={newField.value}
                    onChange={(e) =>
                      setNewField({ ...newField, value: e.target.value })
                    }
                  />
                  <Button type="button" onClick={handleAddExtraField}>
                    <PlusCircle className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>

                {extraFields.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {extraFields.map(({ key, value }, i) => (
                      <div key={i} className="text-sm text-gray-600">
                        <strong>{key}</strong>: {value}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <Button
                  type="submit"
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                >
                  <BookPlus className="w-4 h-4 mr-2" /> Create Book
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
      </div>
    </motion.div>
  );
}
