<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $connection = 'mysql';

    protected $table = 'attendance';

    public $timestamps = false;

    protected $guarded = [];
}
