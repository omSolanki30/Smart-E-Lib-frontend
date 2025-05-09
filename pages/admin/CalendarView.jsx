import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  getDay,
} from "date-fns";
import axios from "axios";
import Navbar from "@/components/Navbar";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, CalendarDays, ArrowLeft, ArrowRight } from "lucide-react";

const CalendarView = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalEvents, setModalEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}api/reports/issue-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handleDateClick = (date) => {
    const day = getDay(date);
    if (day === 6 || day === 0) return;

    const selectedDayEvents = events.filter(
      (event) =>
        isSameDay(new Date(event.issueDate), date) ||
        isSameDay(new Date(event.returnDate), date)
    );

    setSelectedDate(date);
    setModalEvents(selectedDayEvents);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Card className="p-6 shadow-lg bg-white dark:bg-gray-800 dark:text-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-indigo-600 dark:text-indigo-300 w-6 h-6" />
              <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                Issue & Return Calendar
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentDate(
                    (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
                  )
                }
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentDate(
                    (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
                  )
                }
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <h2 className="text-center text-lg font-medium text-indigo-800 dark:text-indigo-200 mb-4">
            {format(currentDate, "MMMM yyyy")}
          </h2>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day, i) => (
              <div
                key={i}
                onClick={() => handleDateClick(day)}
                className={`p-4 rounded-xl text-center text-sm font-medium cursor-pointer transition-all
                  ${
                    getDay(day) === 0 || getDay(day) === 6
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                      : isSameDay(day, today)
                      ? "bg-indigo-200 text-indigo-900 font-bold border-2 border-indigo-400 dark:bg-indigo-600 dark:text-white dark:border-indigo-300"
                      : "bg-white hover:bg-indigo-100 dark:bg-gray-800 dark:hover:bg-indigo-900 dark:text-gray-100"
                  }`}
              >
                <p>{format(day, "d")}</p>
                <p className="text-xs text-gray-400 dark:text-gray-300">
                  {format(day, "EEE")}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] dark:bg-gray-900 dark:text-gray-100">
            <DialogHeader className="flex justify-between items-center">
              <DialogDescription>
                This table shows all book issues and returns for the selected
                date.
              </DialogDescription>
              <DialogTitle className="text-indigo-700 dark:text-indigo-300 text-lg font-semibold">
                Events for {selectedDate && format(selectedDate, "PPP")}
              </DialogTitle>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              </Button>
            </DialogHeader>

            {modalEvents.length > 0 ? (
              <table className="w-full text-sm border mt-4 dark:border-gray-700">
                <thead>
                  <tr className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    <th className="p-2 border dark:border-gray-700">Student ID</th>
                    <th className="p-2 border dark:border-gray-700">Book</th>
                    <th className="p-2 border dark:border-gray-700">Issue</th>
                    <th className="p-2 border dark:border-gray-700">Return</th>
                    <th className="p-2 border dark:border-gray-700">Grace</th>
                    <th className="p-2 border dark:border-gray-700">Returned</th>
                    <th className="p-2 border dark:border-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {modalEvents.map((e, i) => {
                    const issueDate = new Date(e.issueDate);
                    const returnDate = new Date(e.returnDate);
                    const graceDate = new Date(e.graceEndDate);
                    const actualReturn = e.actualReturnDate
                      ? new Date(e.actualReturnDate)
                      : null;
                    const now = new Date();
                    const isReturned = e.returned;
                    let status = "",
                      color = "";
                    if (isReturned && actualReturn <= returnDate) {
                      status = "Returned on Time";
                      color = "text-green-600";
                    } else if (isReturned && actualReturn > graceDate) {
                      const daysLate = Math.floor(
                        (actualReturn - graceDate) / (1000 * 60 * 60 * 24)
                      );
                      status = `Overdue ${daysLate} days — ₹${daysLate * 50}`;
                      color = "text-red-600";
                    } else if (!isReturned && now > graceDate) {
                      const daysOver = Math.floor(
                        (now - graceDate) / (1000 * 60 * 60 * 24)
                      );
                      status = `Overdue ${daysOver} days — ₹${daysOver * 50}`;
                      color = "text-red-600";
                    } else if (!isReturned && now > returnDate) {
                      status = "In Grace Period";
                      color = "text-yellow-600";
                    } else {
                      status = "On Track";
                      color = "text-indigo-600";
                    }

                    return (
                      <tr key={i} className="text-center">
                        <td className="p-2 border dark:border-gray-700">{e.studentId}</td>
                        <td className="p-2 border dark:border-gray-700">{e.bookTitle}</td>
                        <td className="p-2 border dark:border-gray-700">
                          {format(issueDate, "PPP")}
                        </td>
                        <td className="p-2 border dark:border-gray-700">
                          {format(returnDate, "PPP")}
                        </td>
                        <td className="p-2 border dark:border-gray-700">
                          {e.graceEndDate ? format(graceDate, "PPP") : "—"}
                        </td>
                        <td className="p-2 border dark:border-gray-700">
                          {e.returned
                            ? format(actualReturn, "PPP")
                            : "Not Returned"}
                        </td>
                        <td className={`p-2 border dark:border-gray-700 font-medium ${color}`}>
                          {status}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No events on this day.</p>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CalendarView;
