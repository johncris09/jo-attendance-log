import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type AttendanceRow = {
    day: number;
    bracket_1: string;
    bracket_2: string;
    bracket_3: string;
    bracket_4: string;
    bracket_5: string;
    bracket_6: string;
};

type AttendanceResponse = {
    month: number;
    year: number;
    joidnum: string;
    data: AttendanceRow[];
};

const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

function AttendanceTableSkeleton() {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-230 border-collapse text-sm">
                <thead>
                    <tr className="border-b text-center">
                        <th className="px-3 py-2 font-medium">Day</th>
                        <th className="px-3 py-2 font-medium">00:00 - 07:29</th>
                        <th className="px-3 py-2 font-medium">07:30 - 09:59</th>
                        <th className="px-3 py-2 font-medium">10:00 - 12:29</th>
                        <th className="px-3 py-2 font-medium">12:30 - 14:59</th>
                        <th className="px-3 py-2 font-medium">15:00 - 17:29</th>
                        <th className="px-3 py-2 font-medium">17:30 - 23:59</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 15 }, (_, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b text-center last:border-0"
                        >
                            <td className="px-3 py-2">
                                <Skeleton className="mx-auto h-4 w-8" />
                            </td>
                            {Array.from({ length: 6 }, (_, colIndex) => (
                                <td key={colIndex} className="px-3 py-2">
                                    <Skeleton className="mx-auto h-4 w-24" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function Dashboard() {
    const { auth } = usePage().props;
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState<number>(
        today.getMonth() + 1,
    );
    const [selectedYear, setSelectedYear] = useState<number>(
        today.getFullYear(),
    );
    const [attendance, setAttendance] = useState<AttendanceResponse | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const yearOptions = Array.from(
        { length: 6 },
        (_, index) => today.getFullYear() - 2 + index,
    );

    useEffect(() => {
        const controller = new AbortController();

        const loadAttendance = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/attendance/logs?month=${selectedMonth}&year=${selectedYear}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error('Failed to load attendance logs.');
                }

                const payload = (await response.json()) as AttendanceResponse;
                setAttendance(payload);
            } catch (fetchError) {
                if (
                    fetchError instanceof DOMException &&
                    fetchError.name === 'AbortError'
                ) {
                    return;
                }

                setError('Unable to load attendance logs right now.');
            } finally {
                setIsLoading(false);
            }
        };

        void loadAttendance();

        return () => {
            controller.abort();
        };
    }, [selectedMonth, selectedYear]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-lg bg-linear-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
                    <h1 className="mb-2 text-3xl font-bold">Welcome back {auth?.user?.FirstName}!</h1>
                    <p className="text-blue-100">
                        Here's an overview of your attendance records.
                    </p>
                </div>

                <div className="rounded-lg border bg-background p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">
                            Attendance Log
                        </h2>

                        <div className="flex items-center gap-2">
                            <Select
                                value={String(selectedMonth)}
                                onValueChange={(value) =>
                                    setSelectedMonth(Number(value))
                                }
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthOptions.map((month) => (
                                        <SelectItem
                                            key={month.value}
                                            value={String(month.value)}
                                        >
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={String(selectedYear)}
                                onValueChange={(value) =>
                                    setSelectedYear(Number(value))
                                }
                            >
                                <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={String(year)}
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading && <AttendanceTableSkeleton />}

                    {!isLoading && error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    {!isLoading && !error && attendance && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-230 border-collapse text-sm">
                                <thead>
                                    <tr className="border-b text-center">
                                        <th className="px-3 py-2 font-medium">
                                            Day
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            00:00 - 07:29
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            07:30 - 09:59
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            10:00 - 12:29
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            12:30 - 14:59
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            15:00 - 17:29
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            17:30 - 23:59
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.data.map((row) => (
                                        <tr
                                            key={row.day}
                                            className="border-b text-center last:border-0"
                                        >
                                            <td className="px-3 py-2">
                                                {row.day}
                                            </td>
                                            <td className="px-3 py-2">
                                                {row.bracket_1 || ''}
                                            </td>
                                            <td className="px-3 py-2">
                                                {row.bracket_2 || ''}
                                            </td>
                                            <td className="px-3 py-2">
                                                {row.bracket_3 || ''}
                                            </td>
                                            <td className="px-3 py-2">
                                                {row.bracket_4 || ''}
                                            </td>
                                            <td className="px-3 py-2">
                                                {row.bracket_5 || ''}
                                            </td>
                                            <td className="px-3 py-2">
                                                {row.bracket_6 || ''}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
