'use client';

import React, { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'red' | 'blue' | 'green' | 'orange';
  day: number;
}

const calendarEvents: CalendarEvent[] = [
  { id: '1', title: 'User Acceptance Test', type: 'orange', day: 9 },
  { id: '2', title: 'Deployment', type: 'blue', day: 9 },
  { id: '3', title: 'Transition Planning', type: 'blue', day: 9 },
  { id: '4', title: 'Deployment Planning', type: 'orange', day: 23 },
  { id: '5', title: 'Unit Test', type: 'blue', day: 23 },
  { id: '6', title: 'Documentation', type: 'green', day: 23 },
  { id: '7', title: 'Regression Test', type: 'blue', day: 17 },
  { id: '8', title: 'Set up Monitoring and Controlling processes', type: 'green', day: 17 },
  { id: '9', title: 'Design homepage layout', type: 'orange', day: 12 },
  { id: '10', title: 'Training Planning', type: 'blue', day: 12 },
  { id: '11', title: 'Requirements Analysis Completed', type: 'green', day: 12 },
  { id: '12', title: 'Technical Specification', type: 'green', day: 26 },
  { id: '13', title: 'Build/Devlop', type: 'blue', day: 6 },
];

const users = [
  { id: '1', name: 'Jerome Bell', checked: true },
  { id: '2', name: 'Jacob Jones', checked: true },
  { id: '3', name: 'Ralph Edwards', checked: true },
  { id: '4', name: 'Devon Lane', checked: false },
  { id: '5', name: 'Kathryn Murphy', checked: true },
];

const tasksWithoutDue = [
  { id: '1', title: 'Confirmation of property tax payment made up to date', type: 'orange' },
  { id: '2', title: 'Confirmation of property tax payment made up to date', type: 'orange' },
  { id: '3', title: 'MLS Listing of the subject property', type: 'orange' },
];

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 22)); // October 22, 2024
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedUsers, setSelectedUsers] = useState<string[]>(users.filter(u => u.checked).map(u => u.id));
  const [showPending, setShowPending] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCalendarEvents, setShowCalendarEvents] = useState(true);

  const getEventsForDay = (day: number) => {
    return calendarEvents.filter(event => event.day === day);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'red': return 'bg-red-50 border-red-100';
      case 'blue': return 'bg-blue-50 border-blue-100';
      case 'green': return 'bg-emerald-50 border-emerald-100';
      case 'orange': return 'bg-orange-50 border-orange-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const getEventBarColor = (type: string) => {
    switch (type) {
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-600';
      case 'green': return 'bg-green-500';
      case 'orange': return 'bg-orange-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-[1152px] h-[824px] relative bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-neutral-200 overflow-hidden">
      {/* Vertical separator */}
      <div className="w-[817px] h-0 left-[874px] top-0 absolute origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-neutral-200"></div>

      {/* Header Controls */}
      <div className="w-[875px] left-0 top-[16px] absolute inline-flex flex-col justify-start items-start gap-4">
        <div className="self-stretch px-4 flex flex-col justify-start items-start gap-3">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-2">
              <button className="w-12 px-2 py-1 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2 hover:bg-gray-50">
                <div className="flex-1 h-6 flex justify-center items-center gap-2">
                  <div className="flex-1 self-stretch text-center justify-center text-zinc-700 text-xs font-medium leading-4">Today</div>
                </div>
              </button>

              {/* Navigation arrows */}
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="justify-start text-zinc-700 text-sm font-medium leading-6">
                22 October 2024
              </div>
            </div>

            <div className="flex justify-start items-center gap-2">
              {/* View toggle */}
              <div className="flex">
                <button className="w-14 px-1 py-0.5 bg-neutral-50 rounded-l-md flex justify-center items-center shadow-sm">
                  <div className="text-center justify-start text-zinc-500 text-xs font-normal leading-4">Week</div>
                </button>
                <button className="w-14 px-1 py-0.5 bg-white rounded-r-md flex justify-center items-center shadow-sm outline outline-1 outline-offset-[-1px] outline-neutral-100">
                  <div className="text-center justify-start text-zinc-700 text-xs font-medium leading-4">Month</div>
                </button>
              </div>

              {/* Filters */}
              <button className="w-20 px-2 py-1.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2 hover:bg-gray-50">
                <div className="flex-1 self-stretch flex justify-center items-center gap-2">
                  <div className="flex-1 self-stretch justify-center text-zinc-700 text-xs font-medium leading-4">Task</div>
                </div>
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button className="w-28 px-2 py-1.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2 hover:bg-gray-50">
                <div className="flex-1 self-stretch flex justify-center items-center gap-2">
                  <div className="flex-1 self-stretch justify-center text-zinc-700 text-xs font-medium leading-4">All tasks</div>
                </div>
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button className="px-3.5 py-2 bg-sky-100 rounded-md flex justify-center items-center gap-2 hover:bg-sky-200">
                <div className="justify-center text-blue-600 text-xs font-medium leading-4">Show completed</div>
              </button>
            </div>
          </div>

          {/* Separator */}
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-neutral-200"></div>

          {/* Search and Filters */}
          <div className="self-stretch inline-flex justify-between items-center">
            <button className="w-52 px-2 py-1 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-2 hover:bg-gray-50">
              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="flex-1 opacity-0 justify-center text-zinc-400 text-xs font-medium leading-4">Search</div>
            </button>

            <div className="flex justify-start items-center gap-4">
              {/* Status toggles */}
              <div className="flex justify-start items-center gap-2">
                <div className="justify-start text-neutral-500 text-xs font-normal leading-4">Pending</div>
                <button
                  onClick={() => setShowPending(!showPending)}
                  className={`w-9 h-4 relative rounded-[54px] overflow-hidden transition-colors ${
                    showPending ? 'bg-blue-700' : 'bg-zinc-400'
                  }`}
                >
                  <div className={`w-3 h-3 left-[2px] top-[2px] absolute bg-white rounded-[54px] shadow-md transition-transform ${
                    showPending ? 'translate-x-5' : ''
                  }`} />
                </button>
              </div>

              <div className="flex justify-start items-center gap-2">
                <div className="justify-start text-neutral-500 text-xs font-normal leading-4">Completed</div>
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className={`w-9 h-4 relative rounded-[54px] overflow-hidden transition-colors ${
                    showCompleted ? 'bg-blue-700' : 'bg-zinc-400'
                  }`}
                >
                  <div className={`w-3 h-3 left-[2px] top-[2px] absolute bg-white rounded-[54px] shadow-md transition-transform ${
                    showCompleted ? 'translate-x-5' : ''
                  }`} />
                </button>
              </div>

              <div className="flex justify-start items-center gap-2">
                <div className="justify-start text-neutral-500 text-xs font-normal leading-4">Calendar event</div>
                <button
                  onClick={() => setShowCalendarEvents(!showCalendarEvents)}
                  className={`w-9 h-4 relative rounded-[54px] overflow-hidden transition-colors ${
                    showCalendarEvents ? 'bg-blue-700' : 'bg-zinc-400'
                  }`}
                >
                  <div className={`w-3 h-3 left-[2px] top-[2px] absolute bg-white rounded-[54px] shadow-md transition-transform ${
                    showCalendarEvents ? 'translate-x-5' : ''
                  }`} />
                  <svg className={`w-4 h-4 left-[18px] top-0 absolute overflow-hidden ${
                    showCalendarEvents ? 'opacity-100' : 'opacity-0'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="self-stretch inline-flex justify-start items-center">
          {/* Days of the week */}
          {weekDays.map((day, index) => (
            <div key={day} className="w-32 inline-flex flex-col justify-start items-start">
              <div className="self-stretch h-7 bg-neutral-50 border-r border-t border-neutral-200 inline-flex justify-between items-center">
                <div className="text-center justify-center text-zinc-700 text-xs font-medium leading-4">{day}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="self-stretch inline-flex justify-start items-center">
          {weekDays.map((day, weekIndex) => (
            <div key={day} className="w-32 inline-flex flex-col justify-start items-start">
              {Array.from({ length: 5 }, (_, rowIndex) => {
                const dayNumber = days[weekIndex + rowIndex * 7];
                const dayEvents = dayNumber ? getEventsForDay(dayNumber) : [];
                const isCurrentMonth = dayNumber !== null;
                const isToday = dayNumber === 12; // Highlight day 12 as today

                return (
                  <div
                    key={rowIndex}
                    className={`self-stretch h-32 relative border-r border-t border-neutral-200 ${
                      isToday ? 'bg-slate-50' : 'bg-white'
                    } ${!isCurrentMonth ? 'bg-gray-50' : ''}`}
                  >
                    {dayNumber && (
                      <>
                        <div className={`left-[8px] top-[8px] absolute justify-center text-zinc-700 text-xs font-medium leading-4 ${
                          isToday ? 'text-blue-700' : ''
                        } ${!isCurrentMonth ? 'text-zinc-500' : ''}`}>
                          {dayNumber}
                        </div>

                        {isToday && (
                          <div className="w-5 h-5 left-[4px] top-[6px] absolute bg-blue-50 rounded-[3px]" />
                        )}

                        {/* Events */}
                        <div className="w-32 left-[2px] top-[30px] absolute inline-flex flex-col justify-start items-start gap-0.5">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div key={event.id} className={`self-stretch h-6 ${getEventColor(event.type)} rounded inline-flex justify-start items-start overflow-hidden`}>
                              <div className={`w-1 self-stretch ${getEventBarColor(event.type)} shadow-[inset_0px_-2px_2px_0px_rgba(0,0,0,0.15)] shadow-[inset_0px_2px_2px_0px_rgba(255,255,255,0.15)]`} />
                              <div className={`flex-1 self-stretch px-1 py-2 rounded-tr rounded-br border-r border-t border-b ${event.type === 'red' ? 'border-red-100' : event.type === 'blue' ? 'border-blue-100' : event.type === 'green' ? 'border-emerald-100' : 'border-orange-100'} inline-flex flex-col justify-between items-start`}>
                                <div className="w-28 justify-start text-zinc-700 text-xs font-normal leading-4 line-clamp-1">{event.title}</div>
                              </div>
                            </div>
                          ))}

                          {dayEvents.length > 3 && (
                            <div className="left-[6px] top-[112px] absolute justify-center text-blue-700 text-xs font-medium leading-4">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar - User Selection */}
      <div className="w-72 left-[875px] top-[16px] absolute inline-flex flex-col justify-start items-center gap-4">
        <div className="w-64 flex flex-col justify-start items-start gap-4">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex-1 flex justify-start items-center gap-1.5">
              <button
                onClick={() => setSelectedUsers(selectedUsers.length === users.length ? [] : users.map(u => u.id))}
                className="w-4 h-4 relative bg-white rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-blue-700 overflow-hidden"
              >
                <div className="w-3 h-3 left-[2px] top-[2px] absolute bg-blue-700 rounded-sm" />
              </button>
              <div className="justify-start text-black text-sm font-medium leading-6">All Users</div>
            </div>
            <div className="flex justify-start items-center gap-4">
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-neutral-200"></div>

          <div className="flex flex-col justify-start items-start gap-3">
            {users.map((user) => (
              <div key={user.id} className="self-stretch inline-flex justify-start items-center gap-2">
                <button
                  onClick={() => toggleUser(user.id)}
                  className={`w-5 h-5 relative rounded outline outline-1 outline-offset-[-1px] overflow-hidden ${
                    selectedUsers.includes(user.id)
                      ? 'bg-blue-700 outline-blue-700'
                      : 'bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-zinc-400'
                  }`}
                >
                  {selectedUsers.includes(user.id) && (
                    <svg className="w-4 h-4 left-[2px] top-[2px] absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" className="text-white" />
                    </svg>
                  )}
                </button>
                <div className="justify-start text-zinc-700 text-xs font-medium leading-4">{user.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks without due dates */}
      <div className="w-64 left-[888.50px] top-[566px] absolute inline-flex flex-col justify-start items-start gap-4">
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="flex-1 flex justify-start items-center gap-2">
            <div className="justify-start text-black text-base font-medium font-['Geist'] leading-6">Tasks with no due</div>
          </div>
          <div className="w-12 flex justify-between items-center">
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-neutral-200"></div>

        <div className="flex flex-col justify-start items-start gap-2">
          {tasksWithoutDue.map((task) => (
            <div key={task.id} className={`w-64 h-6 ${getEventColor(task.type)} rounded inline-flex justify-start items-start overflow-hidden`}>
              <div className={`w-1 self-stretch ${getEventBarColor(task.type)} shadow-[inset_0px_-2px_2px_0px_rgba(0,0,0,0.15)] shadow-[inset_0px_2px_2px_0px_rgba(255,255,255,0.15)]`} />
              <div className={`flex-1 self-stretch px-1 py-2 rounded-tr rounded-br border-r border-t border-b ${task.type === 'red' ? 'border-red-100' : 'border-orange-100'} inline-flex flex-col justify-between items-start`}>
                <div className="w-60 justify-start text-zinc-700 text-xs font-normal font-['Geist'] leading-4 line-clamp-1">{task.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Separator line */}
      <div className="w-72 h-[5px] left-[875px] top-[544px] absolute bg-neutral-50" />
    </div>
  );
};
