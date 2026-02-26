<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $joidnum = str_replace('-', '', (string) $user->getAuthIdentifier());


        $connection = DB::connection('mysql');
        $table = 'attendance';

        // return response()->json([
        //     'message' => 'This endpoint is under development.',
        // ], 503);

        $tableExists = ! empty(
            $connection->select(
                'SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ? LIMIT 1',
                [$table]
            )
        );

        if (! $tableExists) {
            return response()->json([
                'message' => 'Attendance table not found on mysql connection.',
            ], 404);
        }

        $columns = collect($connection->select("SHOW COLUMNS FROM `{$table}`"))
            ->map(fn(object $column) => $column->Field ?? null)
            ->filter(fn(?string $columnName) => is_string($columnName) && $columnName !== '')
            ->values()
            ->all();

        $joidnumColumn = collect(['id_number', 'JOIDNUM', 'joidnum', 'employee_id', 'EmployeeID'])->first(
            fn(string $column) => in_array($column, $columns, true)
        );


        $bioDateColumn = collect(['bio_date', 'BIO_DATE', 'BioDate', 'date'])->first(
            fn(string $column) => in_array($column, $columns, true)
        );

        $bioTimeColumn = collect(['bio_time', 'BIO_TIME', 'BioTime', 'time'])->first(
            fn(string $column) => in_array($column, $columns, true)
        );

        if (! $joidnumColumn || ! $bioDateColumn || ! $bioTimeColumn) {
            return response()->json([
                'message' => 'Unable to detect attendance JOIDNUM, bio_date, or bio_time columns.',
                'detected_columns' => $columns,
            ], 422);
        }

        $start = Carbon::create($year, $month, 1)->startOfDay();
        $end = (clone $start)->endOfMonth()->endOfDay();
        $daysInMonth = $start->daysInMonth;

        $wrappedBioDateColumn = '`' . str_replace('`', '``', $bioDateColumn) . '`';
        $wrappedBioTimeColumn = '`' . str_replace('`', '``', $bioTimeColumn) . '`';



        $rows = $connection->table($table)
            ->selectRaw("DAY({$wrappedBioDateColumn}) as day")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedBioTimeColumn}) BETWEEN '00:00:00' AND '07:29:59' THEN TIME_FORMAT(TIME({$wrappedBioTimeColumn}), '%H:%i:%s') END ORDER BY {$wrappedBioTimeColumn} SEPARATOR ', ') as bracket_1")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedBioTimeColumn}) BETWEEN '07:30:00' AND '09:59:59' THEN TIME_FORMAT(TIME({$wrappedBioTimeColumn}), '%H:%i:%s') END ORDER BY {$wrappedBioTimeColumn} SEPARATOR ', ') as bracket_2")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedBioTimeColumn}) BETWEEN '10:00:00' AND '12:29:59' THEN TIME_FORMAT(TIME({$wrappedBioTimeColumn}), '%H:%i:%s') END ORDER BY {$wrappedBioTimeColumn} SEPARATOR ', ') as bracket_3")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedBioTimeColumn}) BETWEEN '12:30:00' AND '14:59:59' THEN TIME_FORMAT(TIME({$wrappedBioTimeColumn}), '%H:%i:%s') END ORDER BY {$wrappedBioTimeColumn} SEPARATOR ', ') as bracket_4")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedBioTimeColumn}) BETWEEN '15:00:00' AND '17:29:59' THEN TIME_FORMAT(TIME({$wrappedBioTimeColumn}), '%H:%i:%s') END ORDER BY {$wrappedBioTimeColumn} SEPARATOR ', ') as bracket_5")
            ->selectRaw("GROUP_CONCAT(CASE WHEN TIME({$wrappedBioTimeColumn}) BETWEEN '17:30:00' AND '23:59:59' THEN TIME_FORMAT(TIME({$wrappedBioTimeColumn}), '%H:%i:%s') END ORDER BY {$wrappedBioTimeColumn} SEPARATOR ', ') as bracket_6")
            ->where($joidnumColumn, $joidnum)
            ->whereBetween($bioDateColumn, [$start->toDateString(), $end->toDateString()])
            ->groupByRaw("DAY({$wrappedBioDateColumn})")
            ->orderByRaw("DAY({$wrappedBioDateColumn})")
            ->get()
            ->keyBy('day');

        $data = [];

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $row = $rows->get($day);

            $data[] = [
                'day' => $day,
                'day_name' => Carbon::create($year, $month, $day)->format('l'),
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
