"use client";

import { 
  Search, 
  ChevronDown, 
  Calendar, 
  User, 
  Clock, 
  MoreHorizontal,
  Plus
} from "lucide-react";
import { useState } from "react";

// Mock data to match the image
const MOCK_TASKS = [
  {
    id: 1,
    title: "Phone call: Tiffin - was not willing to ta...",
    dueDate: "Next week (Jan 1 2025) 09:00 am",
    assignedTo: "Mike Puckett",
    lastEdit: "1 month ago (Oct 28 2024) 10:34 am Mike Puckett",
  },
  {
    id: 2,
    title: "Phone call: Tiffin - was not willing to ta...",
    dueDate: "Next week (Jan 1 2025) 09:00 am",
    assignedTo: "Mike Puckett",
    lastEdit: "1 month ago (Oct 28 2024) 10:34 am Mike Puckett",
  },
  {
    id: 3,
    title: "Phone call: Tiffin - was not willing to ta...",
    dueDate: "Next week (Jan 1 2025) 09:00 am",
    assignedTo: "Mike Puckett",
    lastEdit: "1 month ago (Oct 28 2024) 10:34 am Mike Puckett",
  },
  {
    id: 4,
    title: "Phone call: Tiffin - was not willing to ta...",
    dueDate: "Next week (Jan 1 2025) 09:00 am",
    assignedTo: "Mike Puckett",
    lastEdit: "1 month ago (Oct 28 2024) 10:34 am Mike Puckett",
  },
  {
    id: 5,
    title: "Phone call: Tiffin - was not willing to ta...",
    dueDate: "Next week (Jan 1 2025) 09:00 am",
    assignedTo: "Mike Puckett",
    lastEdit: "1 month ago (Oct 28 2024) 10:34 am Mike Puckett",
  },
];

export function TasksTabContent() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [showEmptyState, setShowEmptyState] = useState(false); // Toggle this to see empty state

  // For demo purposes, let's allow toggling empty state
  // In real app, this would depend on fetched data length

  if (tasks.length === 0 || showEmptyState) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <div className="flex flex-col gap-1">
          <h3 className="text-brand-gray-900 text-sm font-bold">
            No Tasks & Activities
          </h3>
          <p className="text-brand-gray-500 text-xs">
            You don't have any Tasks & Activities yet
          </p>
        </div>
        
        <button 
          onClick={() => setTasks(MOCK_TASKS)} // Reset for demo
          className="bg-brand-primary-500 hover:bg-brand-primary-600 text-white inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus className="size-4" />
          Create Task
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-600">
            <Search className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-blue-600 cursor-pointer">
            <span className="font-medium">Display: All</span>
            <ChevronDown className="size-3" />
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-600 cursor-pointer">
            <span className="font-medium">Sorting: Default</span>
            <ChevronDown className="size-3" />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 group">
            <div className="pt-1">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="size-4" />
                </button>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="size-3 text-blue-500" />
                  <span>{task.dueDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <User className="size-3 text-blue-500" />
                  <span>Assigned to: <span className="text-blue-600">{task.assignedTo}</span></span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                  <Clock className="size-3" />
                  <span>Last edit: {task.lastEdit}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Demo toggle for empty state */}
      <div className="mt-8 border-t pt-4 text-center">
        <button 
          onClick={() => setShowEmptyState(true)}
          className="text-xs text-gray-400 hover:text-gray-600 underline"
        >
          (Demo: View Empty State)
        </button>
      </div>
    </div>
  );
}
