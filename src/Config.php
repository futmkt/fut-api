<?php

namespace FUTApi;

trait Config {

    public $headers = [
        'ios' => [],
        'and' => [],
        'web' => [
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding' => 'gzip,deflate,sdch, br',
            'Accept-Language' => 'en-US,en;q=0.8',
            'DNT' => '1'
        ]
    ];

    public $fut_host = [
        'pc' => 'utas.external.s2.fut.ea.com:443',
        'ps3' => 'utas.external.s2.fut.ea.com:443',
        'ps4' => 'utas.external.s2.fut.ea.com:443',
        'xbox' => 'utas.external.s3.fut.ea.com:443'
    ];

    public $auth_url = 'utas.mob.v4.fut.ea.com:443';

    public $pin_url = 'https://pin-river.data.ea.com/pinEvents';

    public $client_id = 'FIFA-20-WEBCLIENT';

    public $fun_captcha_public_key = '20C1B296-B15C-4F72-AF0F-882F187EC2C9';

    public $v = '20.0.0';

}

?>