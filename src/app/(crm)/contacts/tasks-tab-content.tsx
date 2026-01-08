"use client";

import {
  Search,
  ChevronDown,
  Calendar,
  User,
  Clock,
  MoreHorizontal,
  Plus,
  CheckSquare
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClientGet } from "@/infra/http/client";
import { ContactTask } from "@/features/shared/models/contact-crud-models";

export function TasksTabContent({ contactId }: { contactId?: string | null }) {
  const [displayOption, setDisplayOption] = useState<"all" | "active" | "completed">("all");
  const [sortOption, setSortOption] = useState<"default" | "newest" | "oldest" | "dueDate">("default");

  const {
    data: tasks,
    status,
    error,
  } = useQuery({
    queryKey: ["contact-tasks", contactId],
    enabled: !!contactId,
    queryFn: async () => {
      // Use the existing apiClientGet to call our Next.js API route which acts as a proxy
      // This allows the server-side to handle authentication without exposing tokens to the client
      const data = await apiClientGet<ContactTask[] | { result: string; error: string; code?: string; error_description?: string }>(
        `/api/tasks`,
        {
          query: {
            resource_type: 'task',
            contact_id: contactId,
          }
        }
      );

      // Check if the response indicates no resources
      if (
        typeof data === 'object' &&
        data !== null &&
        'result' in data &&
        data.result === "error" &&
        ('error' in data) &&
        (data.error === "no_resource" || ('code' in data && data.code === "3"))
      ) {
        throw new Error(JSON.stringify(data));
      }

      return data as ContactTask[];
    },
  });

  if (!contactId) return null;

  if (status === "pending") {
    return (
      <div className="flex animate-pulse flex-col gap-2">
        <div className="h-24 rounded-lg border border-gray-200 bg-gray-100"></div>
        <div className="h-24 rounded-lg border border-gray-200 bg-gray-100"></div>
      </div>
    );
  }

  if (status === "error") {
    // Check if the error is a no_resource error by parsing the error message
    const errorMessage = (error as Error)?.message || "";
    try {
      const errorObj = JSON.parse(errorMessage);
      if (
        errorObj?.result === "error" &&
        (errorObj?.error === "no_resource" ||
          errorObj?.code === "3" ||
          errorObj?.error_description === "There is no such resource")
      ) {
        return (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 py-12 text-gray-400">
            <CheckSquare className="mb-2 size-10 opacity-10" />
            <p className="text-sm font-medium">No tasks for this contact</p>
            <p className="text-xs">
              There are currently no tasks associated with this contact.
            </p>
          </div>
        );
      }
    } catch (e) {
      // If parsing fails, continue with regular error handling
    }
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 py-12 text-gray-400">
        <CheckSquare className="mb-2 size-10 opacity-10" />
        <p className="text-sm font-medium">No tasks found</p>
        <p className="text-xs">
          There are no tasks associated with this contact.
        </p>
      </div>
    );
  }

  // Filter tasks based on display option
  let filteredTasks = [...tasks];
  if (displayOption === "active") {
    // Assuming active tasks are those without a completed status
    filteredTasks = tasks.filter(
      (task) =>
        !(task.dueDate?.includes("ago")) ||
        (task.note && task.note.toLowerCase().includes("completed")) === false,
    );
  } else if (displayOption === "completed") {
    // Assuming completed tasks are those marked as completed
    filteredTasks = tasks.filter(
      (task) =>
        task.dueDate?.includes("ago") ||
        (task.note && task.note.toLowerCase().includes("completed")),
    );
  }

  // Sort tasks based on sort option
  filteredTasks.sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      case "dueDate":
        // Sort by due date, handling different date formats
        return (a.dueDate || "").localeCompare(b.dueDate || "");
      case "default":
      default:
        // Default sorting - could be by ID or as received
        return a.id - b.id;
    }
  });

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
            <span className="font-medium">Display: </span>
            <select
              value={displayOption}
              onChange={(e) => setDisplayOption(e.target.value as "all" | "active" | "completed")}
              className="bg-transparent border-none text-xs text-blue-600 font-medium cursor-pointer focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-600 cursor-pointer">
            <span className="font-medium">Sorting: </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as "default" | "newest" | "oldest" | "dueDate")}
              className="bg-transparent border-none text-xs text-blue-600 font-medium cursor-pointer focus:outline-none"
            >
              <option value="default">Default</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 group">
            <div className="pt-1">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">{task.ttname}</h4>
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
                  <span>Note: <span className="text-blue-600">{task.note || "No note"}</span></span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                  <Clock className="size-3" />
                  <span>Last edit: {task.dueDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
