<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Employee extends Authenticatable
{
    protected $connection = 'payment_connection';

    protected $table = 'payments';

     /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $fillable = [
        'joidnum',
        'password',
    ];

    protected $hidden = [
        'password',
    ];
}
