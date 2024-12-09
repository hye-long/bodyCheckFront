'use client';

import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isSameDay
} from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CustomCalendarProps {
    selectedDate: Date | string | number;
    onDateChange: (date: Date) => void; // 부모 컴포넌트로 변경된 날짜 전달
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
                                                           selectedDate,
                                                           onDateChange
                                                       }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const handlePrevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth}>
                    <FiChevronLeft className="text-gray-700" size={24} />
                </button>
                <h2 className="text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
                <button onClick={handleNextMonth}>
                    <FiChevronRight className="text-gray-700" size={24} />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 text-center text-sm text-gray-500">
                {days.map((day, index) => (
                    <div key={index} className="py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;

                // @ts-ignore
                days.push(
                    <div
                        key={day.toString()}
                        className={`p-2 text-center cursor-pointer ${
                            !isSameMonth(day, monthStart)
                                ? 'text-gray-300'
                                : isSameDay(day, selectedDate)
                                    ? 'bg-black text-white rounded-full'
                                    : 'text-gray-700'
                        } hover:bg-gray-200 rounded-full`}
                        onClick={() => onDateChange(cloneDay)} // 날짜 변경 시 부모로 전달
                    >
                        {formattedDate}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    return (
        <div className="max-w-sm mx-auto bg-white p-4 rounded-lg shadow">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

export default CustomCalendar;
