<?php
/**
 * Classe principale Homepage Manager
 */

if (!defined('ABSPATH')) {
    exit;
}

class Homepage_Manager {
    
    private $admin_menu;
    private $rest_api;
    private $lookbook_cpt;
    
    public function __construct() {
        $this->admin_menu = new HPM_Admin_Menu();
        $this->rest_api = new HPM_REST_API();
        $this->lookbook_cpt = new HPM_Lookbook_CPT();
    }
    
    public function init() {
        // Inizializza admin menu
        add_action('admin_menu', array($this->admin_menu, 'register_menu'));
        add_action('admin_init', array($this->admin_menu, 'register_settings'));
        
        // Inizializza REST API
        add_action('rest_api_init', array($this->rest_api, 'register_routes'));
        
        // Carica stili e script admin
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        
        // Abilita CORS per Next.js
        add_action('rest_api_init', array($this, 'add_cors_headers'));
    }
    
    public function enqueue_admin_assets($hook) {
        // Carica solo nella pagina del plugin
        if ('toplevel_page_homepage-manager' !== $hook) {
            return;
        }
        
        wp_enqueue_media();
        wp_enqueue_style('hpm-admin-css', HPM_PLUGIN_URL . 'assets/css/admin.css', array(), HPM_VERSION);
        wp_enqueue_script('hpm-admin-js', HPM_PLUGIN_URL . 'assets/js/admin.js', array('jquery'), HPM_VERSION, true);
        
        wp_localize_script('hpm-admin-js', 'hpmAdmin', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('hpm_admin_nonce')
        ));
    }
    
    public function add_cors_headers() {
        // Permetti richieste da Next.js (modifica con il tuo dominio)
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        add_filter('rest_pre_serve_request', function($value) {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
            return $value;
        });
    }
}
