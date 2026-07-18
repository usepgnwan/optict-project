<?php

namespace App\Http\Middleware;

use App\Models\Affiliate;
use App\Models\AffiliateClick;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackAffiliate
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->has('track')) {
            $code = strtoupper($request->get('track'));
            \Illuminate\Support\Facades\Log::info('TrackAffiliate middleware triggered with code: ' . $code);
            
            // Check if affiliate exists and is active
            $affiliate = Affiliate::where('referral_code', $code)->where('status', 'active')->first();
            
            if ($affiliate) {
                \Illuminate\Support\Facades\Log::info('Affiliate found: ' . $affiliate->id);
                $ip = $request->ip();
                $ua = $request->userAgent();
                
                // Rate limit: check if this IP and User Agent has clicked this affiliate link in the last hour
                $recentClick = AffiliateClick::where('affiliate_id', $affiliate->id)
                    ->where('ip_address', $ip)
                    ->where('user_agent', $ua)
                    ->where('created_at', '>=', now()->subHour())
                    ->first();
                
                if (!$recentClick) {
                    \Illuminate\Support\Facades\Log::info('Recording new click for affiliate: ' . $affiliate->id);
                    AffiliateClick::create([
                        'affiliate_id' => $affiliate->id,
                        'ip_address' => $ip,
                        'user_agent' => $ua,
                        'landing_page' => $request->path(),
                    ]);
                } else {
                    \Illuminate\Support\Facades\Log::info('Click rate limited for affiliate: ' . $affiliate->id);
                }
                
                // Save to session and cookie (lasts for 30 days)
                session(['affiliate_track_code' => $code]);
                cookie()->queue('affiliate_track_code', $code, 60 * 24 * 30);
            } else {
                \Illuminate\Support\Facades\Log::info('Affiliate not found or inactive for code: ' . $code);
            }
        }

        return $next($request);
    }
}
