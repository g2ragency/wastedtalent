<?php
/**
 * Plugin Name: Site Manager
 * Plugin URI: 
 * Description: Plugin per gestire tutti i contenuti del sito Next.js tramite pannello admin WordPress
 * Version: 1.0.0
 * Author: Veronika Udod
 * Author URI: 
 * Text Domain: site-manager
 * Domain Path: /languages
 */

// Previeni accesso diretto
if (!defined('ABSPATH')) {
    exit;
}

// Definisci costanti
define('HPM_VERSION', '1.0.0');
define('HPM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('HPM_PLUGIN_URL', plugin_dir_url(__FILE__));
define('HPM_FRONTEND_URL', 'https://www.wastedtalent.it');

// Includi i file principali
require_once HPM_PLUGIN_DIR . 'includes/class-homepage-manager.php';
require_once HPM_PLUGIN_DIR . 'includes/admin/class-admin-menu.php';
require_once HPM_PLUGIN_DIR . 'includes/api/class-rest-api.php';
require_once HPM_PLUGIN_DIR . 'includes/class-lookbook-cpt.php';
require_once HPM_PLUGIN_DIR . 'includes/class-checkout-customizer.php';

// Inizializza il plugin
function hpm_init() {
    $homepage_manager = new Homepage_Manager();
    $homepage_manager->init();
    
    // Inizializza checkout customizer
    new HPM_Checkout_Customizer();
}
add_action('plugins_loaded', 'hpm_init');

// Attivazione plugin
register_activation_hook(__FILE__, 'hpm_activate');
function hpm_activate() {
    // Crea le opzioni di default
    $default_settings = array(
        'hero' => array(
            'title' => 'Benvenuto nel nostro negozio',
            'subtitle' => 'Scopri i nostri prodotti',
            'cta_text' => 'Scopri di più',
            'cta_link' => '#',
            'background_image' => ''
        ),
        'featured_products' => array(
            'title' => 'Prodotti in evidenza',
            'product_ids' => array()
        ),
        'about_section' => array(
            'title' => 'Chi siamo',
            'description' => '',
            'image' => ''
        ),
        'testimonials' => array(
            'enabled' => true,
            'items' => array()
        )
    );
    
    add_option('hpm_site_settings', $default_settings);
    
    // Flush rewrite rules
    flush_rewrite_rules();
}

// Disattivazione plugin
register_deactivation_hook(__FILE__, 'hpm_deactivate');
function hpm_deactivate() {
    flush_rewrite_rules();
}
