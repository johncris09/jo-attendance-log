<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $sharedUser = null;

        if ($user) {
            $firstName = $user->firstname ?? $user->FirstName ?? null;
            $middleName = $user->middlename ?? $user->MiddleName ?? null;
            $lastName = $user->lastname ?? $user->LastName ?? null;

            $fullName = trim(implode(' ', array_filter([
                $firstName,
                $middleName,
                $lastName,
            ])));

            $sharedUser = [
                ...$user->toArray(),
                'id' => $user->getAuthIdentifier(),
                'name' => $user->name ?? $user->Name ?? ($fullName !== '' ? $fullName : null) ?? $user->JOIDNUM ?? $user->joidnum,
                'email' => $user->email ?? '',
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $sharedUser,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
