<?php
session_start();
///// SETTINGS ////////////
$fileField = 'file';            // The name of the form field
$targetPath = "files/";         // The path where the file should be stored
$font = 'font.ttf';
$emailSettings = [
    'smtp' => 'aspmx.l.google.com',             // The SMTP server to use for sending emails
    'from' => 'atlasrise.mailer@gmail.com',     // The sender accont configured for the SMTP server
    'to' => 'contact@atlasrise.io',             // The target address where the emails should be sent
    'subject' => 'Form submission',             // The email subject to use
    'sender' => 'unknown@email',                // Default sender ( will be overwritten by the user submitted data)
];
///////////////////////////

class UploadedFile
{
    private $newName;
    public function __construct(private array $file = [], private string $basePath)
    {
        $fileInfo = pathinfo($this->file['name']);
        $this->newName = 'file-' . time() . '.' . $fileInfo['extension'];
    }
    public function store() : bool { return move_uploaded_file($this->file['tmp_name'], $this->getTargetPath()); }
    public function getTargetPath() : string { return implode('/', [trim($this->basePath, '/'), $this->newName]); }
    public function getOriginalName() : string { return $this->file['name']; }
}

function genCaptcha(string $font, bool $get = false) : string
{
    $captcha_code = '';
    $captcha_image_height = 64;
    $captcha_image_width = 256;
    $total_characters_on_image = 6;
    $possible_captcha_letters = 'bcdfghjkmnpqrstvwxyz23456789';
    $captcha_font = realpath($font);
    $random_captcha_dots = 50;
    $random_captcha_lines = 25;
    $captcha_text_color = '0x1d1d1d';
    $captcha_noise_color = '0x1d1d1d';

    $count = 0;
    while ($count < $total_characters_on_image)
    {
        $captcha_code .= substr( $possible_captcha_letters, mt_rand(0, strlen($possible_captcha_letters)-1), 1);
        $count++;
    }

    $captcha_font_size = $captcha_image_height * 0.65;
    $captcha_image = imagecreate( $captcha_image_width, $captcha_image_height);
    imagecolorallocate( $captcha_image, 192, 192, 192); // BG Color
    $array_text_color = hextorgb($captcha_text_color);
    $captcha_text_color = imagecolorallocate( $captcha_image, $array_text_color['red'], $array_text_color['green'], $array_text_color['blue']);
    $array_noise_color = hextorgb($captcha_noise_color);
    $image_noise_color = imagecolorallocate( $captcha_image, $array_noise_color['red'], $array_noise_color['green'], $array_noise_color['blue']);
    for( $count=0; $count<$random_captcha_dots; $count++ )
        imagefilledellipse( $captcha_image, mt_rand(0,$captcha_image_width), mt_rand(0,$captcha_image_height), 2, 3, $image_noise_color);

    for( $count=0; $count<$random_captcha_lines; $count++ )
        imageline( $captcha_image, mt_rand(0,$captcha_image_width), mt_rand(0,$captcha_image_height), mt_rand(0,$captcha_image_width), mt_rand(0,$captcha_image_height), $image_noise_color);

    $text_box = imagettfbbox( $captcha_font_size, 0, $captcha_font, $captcha_code);
    $x = ($captcha_image_width - $text_box[4]) / 2;
    $y = ($captcha_image_height - $text_box[5]) / 2;
    imagettftext( $captcha_image, $captcha_font_size, 0, $x, $y, $captcha_text_color, $captcha_font, $captcha_code);
    $contents = '';
    if (!$get)
        header('Content-Type: image/jpeg');
    else
        ob_start();
    imagejpeg($captcha_image);
    imagedestroy($captcha_image);
    $_SESSION['captcha'] = $captcha_code;
    if ($get) {
        $contents = 'data:image/jpeg;base64,' . base64_encode(ob_get_contents());
        ob_end_clean();
    }
    return $contents;
}

function hextorgb($hexstring) : array
{
    $integer = hexdec($hexstring);
    return [
        'red' => 0xFF & ($integer >> 0x10),
        'green' => 0xFF & ($integer >> 0x8),
        'blue' => 0xFF & $integer
    ];
}

function sendMail(array $settings, ?UploadedFile $file, array $formData = []) : bool
{
    ini_set("SMTP", $settings['smtp']);
    ini_set("sendmail_from", $settings['from']);
    if ($file) $file->store();
    return mail(
        $settings['to'],
        $settings['subject'],
        implode("\r\n", [
            'A new form was submitted.', '',
            'Submission date: ' . date('Y-m-d H:i:s'),
            'The given email was: ' . ($formData['email'] ?? $settings['sender']),
            $file ? 'The uploaded file is at: ' . $file?->getTargetPath() : '',
            $file ? 'The original file name was: ' . $file?->getOriginalName() : '',
            'The rest of the formdata as JSON: ' . json_encode(array_filter($formData, fn($key) => $key != 'email' && $key != 'c', ARRAY_FILTER_USE_KEY)),
        ]),
        "From: " . ($settings['from'] ?? '')
    );
}

function getSetSessionVar($name, $val = null)
{
    if (isset($_SESSION[$name])) return $_SESSION[$name];
    $_SESSION[$name] = $val;
    return $val;
}

function loadTemplate(string $file, array $variables = []) : string
{
    $template = file_get_contents($file);
    preg_match_all('/\{\{\s*(?P<tokens>[^\}]+)\s*\}\}/', $template, $matches);
    if (isset($matches['tokens']))
    {
        foreach ($matches['tokens'] as $index => $token)
        {
            $replaceStr = $matches[0][$index];
            $val = $variables[trim($token)] ?? '';
            $template = str_replace($replaceStr, $val, $template);
        }

    }
    return $template;
}
$hour = date('H');
/*
$primary = '#222222';
$background = 'black';
$backgroundReverse = '#AA98F2';
$text = '#AA98F2';
$textReverse = 'black';

if ($hour >= 4 && $hour < 9) {
    // Reggel
    $primary = '#DED6C7';
    $background = 'white';
    $backgroundReverse = 'black';
    $text = 'black';
    $textReverse = 'white';
} else if ($hour >= 9 && $hour < 13) {
    // Délelőtt
    $primary = '#97F3D3';
    $background = 'white';
    $backgroundReverse = 'black';
    $text = 'black';
    $textReverse = 'white';
} else if ($hour >= 13 && $hour < 19) {
    // Délután
    $primary = '#AA98F2';
    $background = 'white';
    $backgroundReverse = 'black';
    $text = 'black';
    $textReverse = 'white';
}

$templateVars = [
    'serverStyles' => "body{ --primary: $primary; --background: $background; --background-reverse: $backgroundReverse; --text-color: $text; --text-color-reverse: $textReverse;}",
];
*/
$templateVars = [];

# @TODO: Add 365d cache to webp files

$req = isset($_GET['q']) ? $_GET['q'] : ltrim($_SERVER['REQUEST_URI'], '/');
if (strstr($req, 'cimg') !== false) {
    genCaptcha($font);
    return;
} else if (strstr($req, 'submit') !== false) {
    $status = $_GET['status'] ?? null;
    $captchaStatus = function_exists('imagecreate') && file_exists(realpath($font));
    if (isset($_POST) && ($_SERVER['REQUEST_METHOD'] ?? 'GET') == 'POST')
    {
        if ( ($captchaStatus && isset($_POST['c']) && ($_POST['c']!="")) || !$captchaStatus )
            if($captchaStatus && strcasecmp($_SESSION['captcha'], $_POST['c']) != 0) $status = 'CAPTCHA';
            else
                $status = sendMail(
                    $emailSettings,
                    (isset($_FILES[$fileField])) ?  new UploadedFile($_FILES[$fileField], $targetPath) : null,
                    $_POST
                ) ? 'OK' : 'FAIL';
        header('Content-type: application/json');
        echo json_encode(['status' => $status]);
    }
    return;
} else if (file_exists($req) && $req != '') {
    header('Content-Type: ' . mime_content_type($req));
    header('Content-Length: ' . filesize($req));
    $fh = fopen($req, 'rb');
    fpassthru($fh);
    fclose($fh);
    return;
} else if ($req == '' || strstr($req, 'htm') !== false || strstr($req, '.') === false) {
    header("Content-Security-Policy: script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none'");
    $template = loadTemplate('./index.html', $templateVars);
    $pageFile = $req == '' ? './pages/main.html' : './pages/' . $req . '.html';
    if (file_exists($pageFile))
    {
        $site = loadTemplate($pageFile);
        $template = preg_replace('#<page\-router\s*(class="(.*)")*></page\-router>#i', '<page-router $1>' . $site . '</page-router>', $template);
    }
    $cimg = genCaptcha($font, true);
    $template = str_replace('</body>', '<script>window.cimg = new Image();window.cimg.src = "' . genCaptcha($font, true) . '";</script></body>', $template);

    echo $template;
    return;
} else {
    http_response_code(404);
    return;
}
