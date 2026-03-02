<?php
/**
 * Gestione menu admin
 */

if (!defined('ABSPATH')) {
    exit;
}

class HPM_Admin_Menu {
    
    public function __construct() {
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
    }
    
    public function enqueue_scripts($hook) {
        if ('toplevel_page_site-manager' !== $hook) {
            return;
        }
        
        // Enqueue media uploader
        wp_enqueue_media();
        
        // Enqueue editor
        wp_enqueue_editor();
        
        // Enqueue jQuery UI sortable for drag & drop
        wp_enqueue_script('jquery-ui-sortable');
    }
    
    public function register_menu() {
        add_menu_page(
            'Site Manager',
            'Site Manager',
            'manage_options',
            'site-manager',
            array($this, 'render_admin_page'),
            'dashicons-admin-site',
            30
        );
    }
    
    public function register_settings() {
        register_setting('hpm_site_settings_group', 'hpm_site_settings', array(
            'sanitize_callback' => array($this, 'sanitize_settings')
        ));
    }
    
    public function sanitize_settings($input) {
        // Sanitizza i dati in input
        $sanitized = array();
        
        // Header
        if (isset($input['header'])) {
            $sanitized['header'] = array(
                'left_menu_id' => absint($input['header']['left_menu_id'] ?? 0),
                'right_menu_id' => absint($input['header']['right_menu_id'] ?? 0)
            );
        }
        
        // Hero - Slides
        if (isset($input['hero']['slides']) && is_array($input['hero']['slides'])) {
            $sanitized['hero']['slides'] = array();
            
            foreach ($input['hero']['slides'] as $index => $slide) {
                $sanitized['hero']['slides'][$index] = array(
                    'title' => wp_kses_post($slide['title'] ?? ''),
                    'subtitle' => sanitize_text_field($slide['subtitle'] ?? ''),
                    'cta_text' => sanitize_text_field($slide['cta_text'] ?? ''),
                    'cta_link' => esc_url_raw($slide['cta_link'] ?? ''),
                    'background_image' => esc_url_raw($slide['background_image'] ?? '')
                );
            }
        }
        
        // Featured Products
        if (isset($input['featured_products'])) {
            $sanitized['featured_products'] = array(
                'title' => sanitize_text_field($input['featured_products']['title'] ?? ''),
                'product_ids' => array_map('absint', (array)($input['featured_products']['product_ids'] ?? []))
            );
        }
        
        // Footer (per ora vuoto)
        if (isset($input['footer'])) {
            $sanitized['footer'] = array();
        }
        
        // About Us
        if (isset($input['about'])) {
            $sanitized['about'] = array(
                'manifesto_text' => wp_kses_post($input['about']['manifesto_text'] ?? ''),
                'manifesto_images' => array_map('esc_url_raw', (array)($input['about']['manifesto_images'] ?? [])),
                'manifesto_gallery' => array_map('esc_url_raw', (array)($input['about']['manifesto_gallery'] ?? [])),
                'manifesto_product_ids' => array_map('absint', (array)($input['about']['manifesto_product_ids'] ?? [])),
                'visione_text' => wp_kses_post($input['about']['visione_text'] ?? ''),
                'visione_images' => array_map('esc_url_raw', (array)($input['about']['visione_images'] ?? [])),
                'visione_gallery' => array_map('esc_url_raw', (array)($input['about']['visione_gallery'] ?? [])),
                'visione_product_ids' => array_map('absint', (array)($input['about']['visione_product_ids'] ?? [])),
            );
        }
        
        // Contacts
        if (isset($input['contacts'])) {
            $sanitized['contacts'] = array(
                'cf7_shortcode' => stripslashes($input['contacts']['cf7_shortcode'] ?? ''),
                'address' => sanitize_textarea_field($input['contacts']['address'] ?? ''),
                'email' => sanitize_email($input['contacts']['email'] ?? ''),
                'phone' => sanitize_text_field($input['contacts']['phone'] ?? ''),
                'social_instagram' => esc_url_raw($input['contacts']['social_instagram'] ?? ''),
                'social_facebook' => esc_url_raw($input['contacts']['social_facebook'] ?? ''),
                'social_spotify' => esc_url_raw($input['contacts']['social_spotify'] ?? ''),
            );
        }

        // Lookbook
        if (isset($input['lookbook'])) {
            $sanitized['lookbook'] = array(
                'lookbook_ids' => array_map('absint', (array)($input['lookbook']['lookbook_ids'] ?? [])),
            );
        }
        
        return $sanitized;
    }
    
    public function render_admin_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        // Salva le impostazioni
        if (isset($_POST['hpm_save_settings'])) {
            check_admin_referer('hpm_settings_nonce');
            $sanitized = $this->sanitize_settings($_POST['hpm_site_settings']);
            update_option('hpm_site_settings', $sanitized);
            echo '<div class="notice notice-success"><p>Impostazioni del sito salvate con successo!</p></div>';
        }
        
        $settings = get_option('hpm_site_settings', array());
        
        include HPM_PLUGIN_DIR . 'includes/admin/views/settings-page.php';
    }
}
