<?php

namespace FUTApi;

//Custom Providers
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;

class Pin
{

    use Config;

    public function __construct($sid = '', $nucleus_id = 0, $persona_id = '', $dob = false, $platform = false)
    {
        //account
        $this->sid = $sid;
        $this->nucleus_id = $nucleus_id;
        $this->persona_id = $persona_id;
        $this->dob = $dob;
        $this->platform = $platform;

        //pinvars
        $response = (new Client)->get("https://www.easports.com/fifa/ultimate-team/web-app/js/compiled_1.js")->getBody();

        $this->taxv = $m[preg_match('/taxv:"(.+?)"/', $response, $m)];
        $this->tidt = $m[preg_match('/tidt:"(.+?)"/', $response, $m)];

        $this->sku = $m[preg_match('/enums.SKU.FUT="(.+?)"/', $response, $m)];
        $this->rel = 'prod'; //REWRITE?
        $this->gid = $m[preg_match('/gid:([0-9]+?)/', $response, $m)];
        $this->plat = 'web'; //REWRITE?
        $this->et = $m[preg_match('/et:"(.+?)"/', $response, $m)];
        $this->pidt = $m[preg_match('/pidt:"(.+?)"/', $response, $m)];
        $this->v = $m[preg_match('/APP_VERSION="(.+?)"/', $response, $m)];

        //headers
        $this->headers = [
            'Origin' => 'https://www.easports.com',
            'Referer' => 'https://www.easports.com/fifa/ultimate-team/web-app/',
            'x-ea-game-id' => $this->sku,
            'x-ea-game-id-type' => $this->tidt,
            'x-ea-taxv' => $this->taxv
        ];
        $this->custom = [
            'networkAccess' => 'G',
            'service_plat' => substr($platform, 0, 3)
        ];
        $this->s = 2;
    }

    private function __ts()
    {
        return date('Y-m-dTH:i:s') . '.' . date('v') . 'Z';
    }

    public function event($en, $pgid = false, $status = false, $source = false, $end_reason = false)
    {
        $data = [
            'core' => [
                's' => $this->s,
                'pidt' => $this->pidt,
                'pid' => $this->persona_id,
                'pidm' => [
                    'nucleus' => $this->nucleus_id
                ],
                'didm' => [
                    'uuid' => '0'
                ],
                'ts_event' => $this->__ts(),
                'en' => $en
            ]
        ];
        if (isset($this->dob)) {
            $data['core']['dob'] = $this->dob;
        }
        if ($pgid) {
            $data['pgid'] = $pgid;
        }
        if ($status) {
            $data['status'] = $status;
        }
        if ($source) {
            $data['source'] = $source;
        }
        if ($end_reason) {
            $data['end_reason'] = $end_reason;
        }
        if ($en == 'login') {
            $data['type'] = "utas";
            $data['userid'] = $this->persona_id;
        } elseif ($en == 'page_view') {
            $data['type'] = "menu";
        } elseif ($en == 'error') {
            $data['server_type'] = 'utas';
            $data['errid'] = 'server_error';
            $data['type'] = 'disconnect';
            $data['sid'] = $this->sid;
        }
        $this->s += 1;
        return $data;
    }

    public function send($events)
    {
        $response = (new Client)->request('POST', $this->pin_url, [
            'body' => json_encode([
                'taxv' => $this->taxv,
                'tidt' => $this->tidt,
                'tid' => $this->sku,
                'rel' => $this->rel,
                'v' => $this->v,
                'ts_post' => $this->__ts(),
                'sid' => $this->sid,
                'gid' => $this->gid,
                'plat' => $this->plat,
                'et' => $this->et,
                'loc' => 'en_US',
                'is_sess' => (isset($this->sid) ? true : false),
                'custom' => $this->custom,
                'events' => $events
            ]),
            'headers' => $this->headers,
            'http_errors' => false
        ]);
        $body = json_decode($response->getBody(true), true);
        if ($body['status'] !== 'ok') {
            throw new FutError("PinEvent is NOT OK, probably they changed something.", 0, null, [
                "reason" => "pin_event"
            ]);
        }
        return true;
    }

}
