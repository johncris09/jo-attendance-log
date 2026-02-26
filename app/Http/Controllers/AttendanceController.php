<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AttendanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $month = (int) $request->integer('month', now()->month);
        $year = (int) $request->integer('year', now()->year);

        if ($month < 1 || $month > 12) {
            return response()->json([
                'message' => 'Invalid month value. Expected 1 to 12.',
            ], 422);
        }

        if ($year < 1900 || $year > 3000) {
            return response()->json([
                'message' => 'Invalid year value.',
            ], 422);
        }

        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $joidnum = (string) $user->getAuthIdentifier();

        $connection = DB::connection('mysql');
        $table = 'attendance';

        // return response()->json([
        //     'message' => 'This endpoint is under development.',
        // ], 503);

        if (! Schema::connection('mysql')->hasTable($table)) {
            return response()->json([
                'message' => 'Attendance table not found on mysql connection.',
            ], 404);
        }

        $columns = Schema::connection('mysql')->getColumnListing($table);

        $joidnumColumn = collect(['id_number','JOIDNUM', 'joidnum', 'employee_id', 'EmployeeID'])->first(
            fn(string $column) => in_array($column, $columns, true)
        );


        $dateTimeColumn = collect(['timestamp','log_datetime', 'datetime', 'date_time', 'logged_at', 'attendance_datetime', 'time_in', 'created_at'])->first(
            fn(string $column) => in_array($column, $columns, true)
        );

        if (! $joidnumColumn || ! $dateTimeColumn) {
            return response()->json([
                'message' => 'Unable to detect attendance JOIDNUM or datetime columns.',
                'detected_columns' => $columns,
            ], 422);
        }

        $start = Carbon::create($year, $month, 1)->startOfDay();
        $end = (clone $start)->endOfMonth()->endOfDay();
        $daysInMonth = $start->daysInMonth;

        $wrappedDateTimeColumn = '`' . str_replace('`', '``', $dateTimeColumn) . '`';

        $rows = $connection->table($table)
            ->selectRaw("DAY({$wrappedDateTimeColumn}) as day")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedDateTimeColumn}) BETWEEN '00:00:00' AND '07:29:59' THEN DATE_FORMAT({$wrappedDateTimeColumn}, '%H:%i:%s') END ORDER BY {$wrappedDateTimeColumn} SEPARATOR ', ') as bracket_1")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedDateTimeColumn}) BETWEEN '07:30:00' AND '09:59:59' THEN DATE_FORMAT({$wrappedDateTimeColumn}, '%H:%i:%s') END ORDER BY {$wrappedDateTimeColumn} SEPARATOR ', ') as bracket_2")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedDateTimeColumn}) BETWEEN '10:00:00' AND '12:29:59' THEN DATE_FORMAT({$wrappedDateTimeColumn}, '%H:%i:%s') END ORDER BY {$wrappedDateTimeColumn} SEPARATOR ', ') as bracket_3")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedDateTimeColumn}) BETWEEN '12:30:00' AND '14:59:59' THEN DATE_FORMAT({$wrappedDateTimeColumn}, '%H:%i:%s') END ORDER BY {$wrappedDateTimeColumn} SEPARATOR ', ') as bracket_4")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedDateTimeColumn}) BETWEEN '15:00:00' AND '17:29:59' THEN DATE_FORMAT({$wrappedDateTimeColumn}, '%H:%i:%s') END ORDER BY {$wrappedDateTimeColumn} SEPARATOR ', ') as bracket_5")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedDateTimeColumn}) BETWEEN '17:30:00' AND '23:59:59' THEN DATE_FORMAT({$wrappedDateTimeColumn}, '%H:%i:%s') END ORDER BY {$wrappedDateTimeColumn} SEPARATOR ', ') as bracket_6")
            ->where($joidnumColumn, $joidnum)
            ->whereBetween($dateTimeColumn, [$start->toDateTimeString(), $end->toDateTimeString()])
            ->groupByRaw("DAY({$wrappedDateTimeColumn})")
            ->orderByRaw("DAY({$wrappedDateTimeColumn})")
            ->get()
            ->keyBy('day');

        $data = [];

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $row = $rows->get($day);

            $data[] = [
                'day' => $day,
                'bracket_1' => (string) ($row->bracket_1 ?? ''),
                'bracket_2' => (string) ($row->bracket_2 ?? ''),
                'bracket_3' => (string) ($row->bracket_3 ?? ''),
                'bracket_4' => (string) ($row->bracket_4 ?? ''),
                'bracket_5' => (string) ($row->bracket_5 ?? ''),
                'bracket_6' => (string) ($row->bracket_6 ?? ''),
            ];
        }

        return response()->json([
            'month' => $month,
            'year' => $year,
            'joidnum' => $joidnum,
            'data' => $data,
        ]);
    }
}
