$content = @'
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    /*
     * You can enable CORS for 1 or multiple paths.
     */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    /*
     * Matches the request method. `[*]` allows all methods.
     */
    'allowed_methods' => ['*'],

    /*
     * Matches the request origin. `[*]` allows all origins. Wildcards can't be used.
     */
    'allowed_origins' => ['http://localhost:8100', 'http://localhost:4200'],

    /*
     * Matches the request headers. `[*]` allows all headers.
     */
    'allowed_headers' => ['*'],

    /*
     * Exposes headers to the browser. `[*]` allows all headers.
     */
    'exposed_headers' => [],

    /*
     * Set CORS request lifetime in seconds. `0` means use default from Laravel.
     */
    'max_age' => 0,

    /*
     * Set to true to allow cookies and authentication headers.
     */
    'supports_credentials' => true,

];
'@

Set-Content -Path "c:\AEU\Year4 AEU2025\semester 2\4_IOS App Development\backend\config\cors.php" -Value $content
Write-Host "CORS configuration created successfully!"
