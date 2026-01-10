<?php
/**
 * Template Name: Homepage Next.js
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        #nextjs-iframe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            border: none;
        }
    </style>
</head>
<body <?php body_class(); ?>>
    <iframe id="nextjs-iframe" src="http://localhost:3000"></iframe>
    <?php wp_footer(); ?>
</body>
</html>
