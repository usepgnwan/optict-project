<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  string  ...$roles  Allowed role names (comma-separated within a single string, or multiple strings)
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !$user->role) {
            return redirect()->route('dashboard');
        }

        // Support comma-separated roles in a single argument: 'role:admin,super_admin'
        $allowedRoles = [];
        foreach ($roles as $roleGroup) {
            foreach (explode(',', $roleGroup) as $r) {
                $allowedRoles[] = trim($r);
            }
        }

        if (!in_array($user->role->name, $allowedRoles)) {
            // Always redirect to dashboard — user lands on their own page
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki izin untuk mengakses halaman tersebut.');
        }

        return $next($request);
    }
}
