<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Employee extends Authenticatable
{
    protected $connection = 'payment_connection';

    protected $table = 'joc';

    protected $primaryKey = 'JOIDNUM';

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $fillable = [
        'JOIDNUM',
        'password',
    ];

    protected $hidden = [
        'password',
    ];
}
