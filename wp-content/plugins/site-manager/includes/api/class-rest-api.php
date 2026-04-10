<?php
/**
 * REST API Endpoints
 */

if (!defined('ABSPATH')) {
    exit;
}

class HPM_REST_API {
    
    private $namespace = 'site-manager/v1';
    
    public function register_routes() {
        // Endpoint per ottenere tutte le impostazioni sito
        register_rest_route($this->namespace, '/settings', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_site_settings'),
            'permission_callback' => '__return_true'
        ));
        
        // Endpoint per header
        register_rest_route($this->namespace, '/header', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_header'),
            'permission_callback' => '__return_true'
        ));
        
        // Endpoint per footer
        register_rest_route($this->namespace, '/footer', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_footer'),
            'permission_callback' => '__return_true'
        ));
        
        // Endpoint per ottenere solo hero section
        register_rest_route($this->namespace, '/hero', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_hero_section'),
            'permission_callback' => '__return_true'
        ));
        
        // Endpoint per ottenere prodotti in evidenza
        register_rest_route($this->namespace, '/featured-products', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_featured_products'),
            'permission_callback' => '__return_true'
        ));
        
        // Endpoint per ottenere tutti i prodotti
        register_rest_route($this->namespace, '/products', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_all_products'),
            'permission_callback' => '__return_true'
        ));
        
        // Endpoint per About Us
        register_rest_route($this->namespace, '/about', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_about'),
            'permission_callback' => '__return_true'
        ));
        
        // Endpoint per ottenere un singolo prodotto per slug
        register_rest_route($this->namespace, '/products/(?P<slug>[a-zA-Z0-9-]+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_product_by_slug'),
            'permission_callback' => '__return_true'
        ));
        
        // Endpoint per ottenere i lookbook (lista)
        register_rest_route($this->namespace, '/lookbooks', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_lookbooks'),
            'permission_callback' => '__return_true'
        ));
        
        // Endpoint per ottenere un singolo lookbook per slug
        register_rest_route($this->namespace, '/lookbooks/(?P<slug>[a-zA-Z0-9-]+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_lookbook_by_slug'),
            'permission_callback' => '__return_true'
        ));
        
        // Endpoint per contatti (shortcode CF7 + info)
        register_rest_route($this->namespace, '/contacts', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_contacts'),
            'permission_callback' => '__return_true'
        ));

        // Endpoint per info contatto (usato dal footer e altre pagine)
        register_rest_route($this->namespace, '/contact-info', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_contact_info'),
            'permission_callback' => '__return_true'
        ));
        
        // Endpoint proxy per invio CF7
        register_rest_route($this->namespace, '/contact-submit', array(
            'methods' => 'POST',
            'callback' => array($this, 'submit_contact_form'),
            'permission_callback' => '__return_true'
        ));

        // Endpoint per info spedizione (soglia free shipping da WooCommerce)
        register_rest_route($this->namespace, '/shipping-info', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_shipping_info'),
            'permission_callback' => '__return_true'
        ));

        // Auth endpoints
        register_rest_route($this->namespace, '/auth/register', array(
            'methods' => 'POST',
            'callback' => array($this, 'register_user'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($this->namespace, '/auth/login', array(
            'methods' => 'POST',
            'callback' => array($this, 'login_user'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($this->namespace, '/auth/forgot-password', array(
            'methods' => 'POST',
            'callback' => array($this, 'forgot_password'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($this->namespace, '/auth/me', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_current_user'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($this->namespace, '/auth/update-profile', array(
            'methods' => 'POST',
            'callback' => array($this, 'update_profile'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($this->namespace, '/auth/change-password', array(
            'methods' => 'POST',
            'callback' => array($this, 'change_password'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($this->namespace, '/auth/get-address', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_address'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($this->namespace, '/auth/update-address', array(
            'methods' => 'POST',
            'callback' => array($this, 'update_address'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route($this->namespace, '/auth/orders', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_user_orders'),
            'permission_callback' => '__return_true'
        ));
    }
    
    public function get_site_settings($request) {
        $settings = get_option('hpm_site_settings', array());
        
        // Aggiungi i prodotti completi se WooCommerce è attivo
        if (class_exists('WooCommerce') && !empty($settings['featured_products']['product_ids'])) {
            $settings['featured_products']['products'] = $this->get_products_data($settings['featured_products']['product_ids']);
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $settings
        ));
    }
    
    public function get_header($request) {
        $settings = get_option('hpm_site_settings', array());
        
        // Recupera i menu WordPress
        $left_menu_items = array();
        $right_menu_items = array();
        
        if (!empty($settings['header']['left_menu_id'])) {
            $left_menu_items = $this->get_menu_items($settings['header']['left_menu_id']);
        }
        
        if (!empty($settings['header']['right_menu_id'])) {
            $right_menu_items = $this->get_menu_items($settings['header']['right_menu_id']);
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'left_menu' => $left_menu_items,
                'right_menu' => $right_menu_items
            )
        ));
    }
    
    private function get_menu_items($menu_id) {
        $menu_items = wp_get_nav_menu_items($menu_id);
        $items = array();
        
        if ($menu_items) {
            foreach ($menu_items as $item) {
                $items[] = array(
                    'id' => $item->ID,
                    'title' => $item->title,
                    'url' => $item->url,
                    'target' => $item->target,
                    'classes' => implode(' ', $item->classes)
                );
            }
        }
        
        return $items;
    }
    
    public function get_footer($request) {
        $settings = get_option('hpm_site_settings', array());
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $settings['footer'] ?? array()
        ));
    }
    
    public function get_hero_section($request) {
        $settings = get_option('hpm_site_settings', array());
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $settings['hero'] ?? array()
        ));
    }
    
    public function get_featured_products($request) {
        $settings = get_option('hpm_site_settings', array());
        $product_ids = $settings['featured_products']['product_ids'] ?? array();
        
        $products = array();
        if (class_exists('WooCommerce') && !empty($product_ids)) {
            $products = $this->get_products_data($product_ids);
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'title' => $settings['featured_products']['title'] ?? '',
                'products' => $products
            )
        ));
    }
    
    private function get_products_data($product_ids) {
        $products_data = array();
        
        foreach ($product_ids as $product_id) {
            $product = wc_get_product($product_id);
            
            if ($product) {
                $image_id = $product->get_image_id();
                $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'large') : '';
                
                $products_data[] = array(
                    'id' => $product->get_id(),
                    'name' => $product->get_name(),
                    'slug' => $product->get_slug(),
                    'price' => $product->get_price(),
                    'regular_price' => $product->get_regular_price(),
                    'sale_price' => $product->get_sale_price(),
                    'description' => $product->get_short_description(),
                    'image' => $image_url,
                    'permalink' => get_permalink($product->get_id()),
                    'in_stock' => $product->is_in_stock()
                );
            }
        }
        
        return $products_data;
    }
    
    public function get_about($request) {
        $settings = get_option('hpm_site_settings', array());
        $about = $settings['about'] ?? array();
        
        // Build manifesto products data
        $manifesto_products = array();
        if (class_exists('WooCommerce') && !empty($about['manifesto_product_ids'])) {
            $manifesto_products = $this->get_products_data($about['manifesto_product_ids']);
        }
        
        // Build visione products data
        $visione_products = array();
        if (class_exists('WooCommerce') && !empty($about['visione_product_ids'])) {
            $visione_products = $this->get_products_data($about['visione_product_ids']);
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'manifesto' => array(
                    'text' => $about['manifesto_text'] ?? '',
                    'images' => $about['manifesto_images'] ?? array(),
                    'gallery' => array_values(array_filter($about['manifesto_gallery'] ?? array())),
                    'products' => $manifesto_products,
                ),
                'visione' => array(
                    'text' => $about['visione_text'] ?? '',
                    'images' => $about['visione_images'] ?? array(),
                    'gallery' => array_values(array_filter($about['visione_gallery'] ?? array())),
                    'products' => $visione_products,
                ),
            )
        ));
    }
    
    public function get_all_products($request) {
        if (!class_exists('WooCommerce')) {
            return rest_ensure_response(array(
                'success' => false,
                'message' => 'WooCommerce not active',
                'data' => array()
            ));
        }
        
        $args = array(
            'post_type' => 'product',
            'posts_per_page' => -1,
            'post_status' => 'publish'
        );
        
        $products_query = new WP_Query($args);
        $products_data = array();
        
        if ($products_query->have_posts()) {
            while ($products_query->have_posts()) {
                $products_query->the_post();
                $product = wc_get_product(get_the_ID());
                
                if ($product) {
                    $image_id = $product->get_image_id();
                    $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'large') : '';
                    
                    // Get all product images
                    $images = array();
                    if ($image_id) {
                        $images[] = array(
                            'id' => $image_id,
                            'src' => $image_url,
                            'name' => get_the_title($image_id),
                            'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true)
                        );
                    }
                    
                    // Get gallery images
                    $gallery_ids = $product->get_gallery_image_ids();
                    foreach ($gallery_ids as $gallery_id) {
                        $gallery_url = wp_get_attachment_image_url($gallery_id, 'large');
                        if ($gallery_url) {
                            $images[] = array(
                                'id' => $gallery_id,
                                'src' => $gallery_url,
                                'name' => get_the_title($gallery_id),
                                'alt' => get_post_meta($gallery_id, '_wp_attachment_image_alt', true)
                            );
                        }
                    }
                    
                    // Get categories
                    $categories = array();
                    $terms = get_the_terms(get_the_ID(), 'product_cat');
                    if ($terms && !is_wp_error($terms)) {
                        foreach ($terms as $term) {
                            $categories[] = array(
                                'id' => $term->term_id,
                                'name' => $term->name,
                                'slug' => $term->slug
                            );
                        }
                    }

                    // Get attributes with term names (not just IDs)
                    $attributes_data = array();
                    foreach ($product->get_attributes() as $attr) {
                        $options = array();
                        if ($attr->is_taxonomy()) {
                            // Taxonomy attribute — resolve term IDs to names
                            $attr_terms = $attr->get_terms();
                            if ($attr_terms && !is_wp_error($attr_terms)) {
                                foreach ($attr_terms as $attr_term) {
                                    $options[] = $attr_term->name;
                                }
                            }
                        } else {
                            // Custom attribute — options are already strings
                            $options = $attr->get_options();
                        }
                        $attributes_data[] = array(
                            'id' => $attr->get_id(),
                            'name' => wc_attribute_label($attr->get_name()),
                            'options' => $options,
                            'variation' => $attr->get_variation(),
                        );
                    }

                    // Get variations with stock info for variable products
                    $variations_data = array();
                    if ($product->get_type() === 'variable') {
                        $variations = $product->get_available_variations();
                        foreach ($variations as $variation) {
                            $var_product = wc_get_product($variation['variation_id']);
                            if ($var_product) {
                                $variations_data[] = array(
                                    'id' => $variation['variation_id'],
                                    'price' => $var_product->get_price(),
                                    'stock_status' => $var_product->get_stock_status(),
                                    'stock_quantity' => $var_product->get_stock_quantity(),
                                    'attributes' => $variation['attributes'],
                                );
                            }
                        }
                    }

                    $products_data[] = array(
                        'id' => $product->get_id(),
                        'name' => $product->get_name(),
                        'slug' => $product->get_slug(),
                        'type' => $product->get_type(),
                        'price' => $product->get_price(),
                        'regular_price' => $product->get_regular_price(),
                        'sale_price' => $product->get_sale_price(),
                        'price_html' => $product->get_price_html(),
                        'description' => $product->get_short_description(),
                        'images' => $images,
                        'categories' => $categories,
                        'permalink' => get_permalink($product->get_id()),
                        'in_stock' => $product->is_in_stock(),
                        'stock_status' => $product->get_stock_status(),
                        'attributes' => $attributes_data,
                        'variations' => $variations_data,
                    );
                }
            }
            wp_reset_postdata();
        }
        
        return rest_ensure_response($products_data);
    }
    
    public function get_product_by_slug($request) {
        if (!class_exists('WooCommerce')) {
            return rest_ensure_response(array(
                'success' => false,
                'message' => 'WooCommerce not active'
            ));
        }
        
        $slug = $request['slug'];
        
        $args = array(
            'post_type' => 'product',
            'name' => $slug,
            'posts_per_page' => 1,
            'post_status' => 'publish'
        );
        
        $products_query = new WP_Query($args);
        
        if ($products_query->have_posts()) {
            $products_query->the_post();
            $product = wc_get_product(get_the_ID());
            
            if ($product) {
                $image_id = $product->get_image_id();
                
                // Get all product images
                $images = array();
                if ($image_id) {
                    $image_url = wp_get_attachment_image_url($image_id, 'large');
                    $images[] = array(
                        'id' => $image_id,
                        'src' => $image_url,
                        'name' => get_the_title($image_id),
                        'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true)
                    );
                }
                
                // Get gallery images
                $gallery_ids = $product->get_gallery_image_ids();
                foreach ($gallery_ids as $gallery_id) {
                    $gallery_url = wp_get_attachment_image_url($gallery_id, 'large');
                    if ($gallery_url) {
                        $images[] = array(
                            'id' => $gallery_id,
                            'src' => $gallery_url,
                            'name' => get_the_title($gallery_id),
                            'alt' => get_post_meta($gallery_id, '_wp_attachment_image_alt', true)
                        );
                    }
                }
                
                // Get categories
                $categories = array();
                $terms = get_the_terms(get_the_ID(), 'product_cat');
                if ($terms && !is_wp_error($terms)) {
                    foreach ($terms as $term) {
                        $categories[] = array(
                            'id' => $term->term_id,
                            'name' => $term->name,
                            'slug' => $term->slug
                        );
                    }
                }
                
                $product_data = array(
                    'id' => $product->get_id(),
                    'name' => $product->get_name(),
                    'slug' => $product->get_slug(),
                    'type' => $product->get_type(),
                    'price' => $product->get_price(),
                    'regular_price' => $product->get_regular_price(),
                    'sale_price' => $product->get_sale_price(),
                    'price_html' => $product->get_price_html(),
                    'description' => $product->get_description(),
                    'short_description' => $product->get_short_description(),
                    'images' => $images,
                    'categories' => $categories,
                    'permalink' => get_permalink($product->get_id()),
                    'in_stock' => $product->is_in_stock(),
                    'stock_status' => $product->get_stock_status()
                );

                // Add attributes with term names (not just IDs)
                $attributes_data = array();
                foreach ($product->get_attributes() as $attr) {
                    $options = array();
                    if ($attr->is_taxonomy()) {
                        $attr_terms = $attr->get_terms();
                        if ($attr_terms && !is_wp_error($attr_terms)) {
                            foreach ($attr_terms as $attr_term) {
                                $options[] = $attr_term->name;
                            }
                        }
                    } else {
                        $options = $attr->get_options();
                    }
                    $attributes_data[] = array(
                        'id' => $attr->get_id(),
                        'name' => wc_attribute_label($attr->get_name()),
                        'options' => $options,
                        'variation' => $attr->get_variation(),
                    );
                }
                $product_data['attributes'] = $attributes_data;

                // Add variations with stock info for variable products
                $variations_data = array();
                if ($product->get_type() === 'variable') {
                    $variations = $product->get_available_variations();
                    foreach ($variations as $variation) {
                        $var_product = wc_get_product($variation['variation_id']);
                        if ($var_product) {
                            $variations_data[] = array(
                                'id' => $variation['variation_id'],
                                'price' => $var_product->get_price(),
                                'stock_status' => $var_product->get_stock_status(),
                                'stock_quantity' => $var_product->get_stock_quantity(),
                                'attributes' => $variation['attributes'],
                            );
                        }
                    }
                }
                $product_data['variations'] = $variations_data;
                
                wp_reset_postdata();
                return rest_ensure_response($product_data);
            }
        }
        
        wp_reset_postdata();
        return new WP_Error('product_not_found', 'Product not found', array('status' => 404));
    }
    
    /**
     * Get lookbooks list (selected in Site Manager)
     */
    public function get_lookbooks($request) {
        $settings = get_option('hpm_site_settings', array());
        $lookbook_ids = $settings['lookbook']['lookbook_ids'] ?? array();
        
        $lookbooks = array();
        
        if (!empty($lookbook_ids)) {
            // Get lookbooks in the order they were selected
            foreach ($lookbook_ids as $lb_id) {
                $post = get_post($lb_id);
                if ($post && $post->post_status === 'publish') {
                    $cover_image = get_post_meta($lb_id, '_lookbook_cover_image', true);
                    $year = get_post_meta($lb_id, '_lookbook_year', true);
                    
                    $lookbooks[] = array(
                        'id' => $post->ID,
                        'title' => $post->post_title,
                        'slug' => $post->post_name,
                        'year' => $year ?: '',
                        'cover_image' => $cover_image ?: '',
                    );
                }
            }
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => $lookbooks
        ));
    }
    
    /**
     * Get single lookbook by slug
     */
    public function get_lookbook_by_slug($request) {
        $slug = $request['slug'];
        
        $args = array(
            'post_type' => 'lookbook',
            'name' => $slug,
            'posts_per_page' => 1,
            'post_status' => 'publish'
        );
        
        $query = new WP_Query($args);
        
        if ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            
            $cover_image = get_post_meta($post_id, '_lookbook_cover_image', true);
            $year = get_post_meta($post_id, '_lookbook_year', true);
            $gallery = get_post_meta($post_id, '_lookbook_gallery', true);
            
            if (!is_array($gallery)) {
                $gallery = array();
            }
            
            $lookbook_data = array(
                'id' => $post_id,
                'title' => get_the_title(),
                'slug' => $slug,
                'year' => $year ?: '',
                'cover_image' => $cover_image ?: '',
                'gallery' => $gallery,
            );
            
            wp_reset_postdata();
            return rest_ensure_response(array(
                'success' => true,
                'data' => $lookbook_data
            ));
        }
        
        wp_reset_postdata();
        return new WP_Error('lookbook_not_found', 'Lookbook not found', array('status' => 404));
    }

    /**
     * Get contact page data
     */
    public function get_contacts($request) {
        $settings = get_option('hpm_site_settings', array());
        $contacts = $settings['contacts'] ?? array();
        $cf7_shortcode = $contacts['cf7_shortcode'] ?? '';
        
        // Render the shortcode to get the HTML form
        $form_html = '';
        if (!empty($cf7_shortcode)) {
            $form_html = do_shortcode($cf7_shortcode);
        }
        
        // Extract the real numeric form ID from rendered HTML (data-wpcf7-id attribute)
        $form_id = 0;
        if (preg_match('/data-wpcf7-id=["\'](\d+)["\']/', $form_html, $matches)) {
            $form_id = intval($matches[1]);
        } elseif (preg_match('/name=["\']_wpcf7["\'].*?value=["\'](\d+)["\']/', $form_html, $matches)) {
            $form_id = intval($matches[1]);
        }
        
        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'cf7_shortcode' => $cf7_shortcode,
                'cf7_form_id' => $form_id,
                'form_html' => $form_html,
                'address' => $contacts['address'] ?? '',
                'email' => $contacts['email'] ?? '',
                'phone' => $contacts['phone'] ?? '',
                'social_instagram' => $contacts['social_instagram'] ?? '',
                'social_facebook' => $contacts['social_facebook'] ?? '',
                'social_spotify' => $contacts['social_spotify'] ?? '',
            )
        ));
    }

    /**
     * Get contact info (address, email, phone, socials) — used site-wide (footer, etc.)
     */
    public function get_contact_info($request) {
        $settings = get_option('hpm_site_settings', array());
        $contacts = $settings['contacts'] ?? array();

        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'address' => $contacts['address'] ?? '',
                'email' => $contacts['email'] ?? '',
                'phone' => $contacts['phone'] ?? '',
                'social_instagram' => $contacts['social_instagram'] ?? '',
                'social_facebook' => $contacts['social_facebook'] ?? '',
                'social_spotify' => $contacts['social_spotify'] ?? '',
            )
        ));
    }

    /**
     * Submit contact form via CF7 REST API proxy
     */
    public function submit_contact_form($request) {
        $params = $request->get_json_params();
        $form_id = intval($params['formId'] ?? 0);
        
        if (!$form_id) {
            return new WP_Error('no_form_id', 'Form ID is required', array('status' => 400));
        }
        
        // Forward to CF7 REST API
        $cf7_url = rest_url("contact-form-7/v1/contact-forms/{$form_id}/feedback");
        
        $body = array();
        foreach ($params as $key => $value) {
            if ($key !== 'formId') {
                $body[$key] = sanitize_text_field($value);
            }
        }
        
        $response = wp_remote_post($cf7_url, array(
            'body' => $body,
            'timeout' => 30,
        ));
        
        if (is_wp_error($response)) {
            return new WP_Error('cf7_error', $response->get_error_message(), array('status' => 500));
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        return rest_ensure_response($body);
    }

    /**
     * Get shipping info — reads free shipping threshold from WooCommerce shipping zones
     */
    public function get_shipping_info($request) {
        $free_shipping_threshold = 0;
        $free_shipping_enabled = false;

        if (class_exists('WooCommerce')) {
            // Get all shipping zones (including zone 0 = Rest of the World)
            $zones = \WC_Shipping_Zones::get_zones();
            $zones[] = array('zone_id' => 0); // Add "Rest of the World" zone

            foreach ($zones as $zone_data) {
                $zone = new \WC_Shipping_Zone($zone_data['zone_id']);
                $methods = $zone->get_shipping_methods(true); // only enabled methods

                foreach ($methods as $method) {
                    if ($method->id === 'free_shipping') {
                        $free_shipping_enabled = true;
                        $min_amount = $method->get_option('min_amount', 0);
                        if ($min_amount > 0) {
                            // If multiple zones have free shipping, take the highest threshold
                            $free_shipping_threshold = max($free_shipping_threshold, floatval($min_amount));
                        }
                        break 2; // Found it, stop searching
                    }
                }
            }
        }

        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'free_shipping_enabled' => $free_shipping_enabled,
                'free_shipping_threshold' => $free_shipping_threshold,
                'currency' => get_woocommerce_currency_symbol(),
            )
        ));
    }

    /**
     * Register a new customer account
     */
    public function register_user($request) {
        $params = $request->get_json_params();

        $first_name = sanitize_text_field($params['firstName'] ?? '');
        $last_name = sanitize_text_field($params['lastName'] ?? '');
        $email = sanitize_email($params['email'] ?? '');
        $password = $params['password'] ?? '';

        // Validation
        if (empty($first_name) || empty($last_name) || empty($email) || empty($password)) {
            return new WP_Error('missing_fields', 'All fields are required', array('status' => 400));
        }

        if (!is_email($email)) {
            return new WP_Error('invalid_email', 'Please enter a valid e-mail address', array('status' => 400));
        }

        if (email_exists($email)) {
            return new WP_Error('email_exists', 'An account with this e-mail already exists', array('status' => 400));
        }

        if (strlen($password) < 8) {
            return new WP_Error('weak_password', 'Password must be at least 8 characters', array('status' => 400));
        }

        // Create WP user with customer role
        $user_id = wp_create_user($email, $password, $email);

        if (is_wp_error($user_id)) {
            return new WP_Error('registration_failed', $user_id->get_error_message(), array('status' => 500));
        }

        // Set user meta
        wp_update_user(array(
            'ID' => $user_id,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'display_name' => $first_name . ' ' . $last_name,
            'role' => 'customer',
        ));

        // Auto-login after registration
        $token = $this->generate_auth_token($user_id);

        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'token' => $token,
                'user' => array(
                    'id' => $user_id,
                    'email' => $email,
                    'firstName' => $first_name,
                    'lastName' => $last_name,
                ),
            )
        ));
    }

    /**
     * Login user
     */
    public function login_user($request) {
        $params = $request->get_json_params();

        $email = sanitize_email($params['email'] ?? '');
        $password = $params['password'] ?? '';

        if (empty($email) || empty($password)) {
            return new WP_Error('missing_fields', 'E-mail and password are required', array('status' => 400));
        }

        $user = wp_authenticate($email, $password);

        if (is_wp_error($user)) {
            return new WP_Error('invalid_credentials', 'Invalid e-mail or password', array('status' => 401));
        }

        $token = $this->generate_auth_token($user->ID);

        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'token' => $token,
                'user' => array(
                    'id' => $user->ID,
                    'email' => $user->user_email,
                    'firstName' => $user->first_name,
                    'lastName' => $user->last_name,
                ),
            )
        ));
    }

    /**
     * Forgot password — send reset email
     */
    public function forgot_password($request) {
        $params = $request->get_json_params();
        $email = sanitize_email($params['email'] ?? '');

        if (empty($email) || !is_email($email)) {
            return new WP_Error('invalid_email', 'Please enter a valid e-mail address', array('status' => 400));
        }

        $user = get_user_by('email', $email);

        // Always return success to prevent email enumeration
        if ($user) {
            $reset_key = get_password_reset_key($user);

            if (!is_wp_error($reset_key)) {
                $reset_url = network_site_url("wp-login.php?action=rp&key={$reset_key}&login=" . rawurlencode($user->user_login), 'login');

                $message = "Hi " . $user->first_name . ",\n\n";
                $message .= "Someone has requested a password reset for your Wasted Talent United account.\n\n";
                $message .= "If this was you, click the link below to set a new password:\n";
                $message .= $reset_url . "\n\n";
                $message .= "If you didn't request this, you can safely ignore this email.\n\n";
                $message .= "— Wasted Talent United";

                wp_mail(
                    $email,
                    'Reset your password — Wasted Talent United',
                    $message
                );
            }
        }

        return rest_ensure_response(array(
            'success' => true,
            'message' => 'If an account exists for this email, you will receive a password reset link.'
        ));
    }

    /**
     * Get current authenticated user
     */
    public function get_current_user($request) {
        $token = $request->get_header('Authorization');

        if (empty($token)) {
            return new WP_Error('no_token', 'Authentication required', array('status' => 401));
        }

        $token = str_replace('Bearer ', '', $token);
        $user_id = $this->validate_auth_token($token);

        if (!$user_id) {
            return new WP_Error('invalid_token', 'Invalid or expired token', array('status' => 401));
        }

        $user = get_user_by('ID', $user_id);

        if (!$user) {
            return new WP_Error('user_not_found', 'User not found', array('status' => 404));
        }

        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'id' => $user->ID,
                'email' => $user->user_email,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
            )
        ));
    }

    /**
     * Update user profile (first name, last name, email)
     */
    public function update_profile($request) {
        $token = $request->get_header('Authorization');

        if (empty($token)) {
            return new WP_Error('no_token', 'Authentication required', array('status' => 401));
        }

        $token = str_replace('Bearer ', '', $token);
        $user_id = $this->validate_auth_token($token);

        if (!$user_id) {
            return new WP_Error('invalid_token', 'Invalid or expired token', array('status' => 401));
        }

        $params = $request->get_json_params();
        $first_name = sanitize_text_field($params['firstName'] ?? '');
        $last_name = sanitize_text_field($params['lastName'] ?? '');
        $email = sanitize_email($params['email'] ?? '');

        if (empty($first_name) || empty($last_name) || empty($email)) {
            return new WP_Error('missing_fields', 'All fields are required', array('status' => 400));
        }

        if (!is_email($email)) {
            return new WP_Error('invalid_email', 'Please enter a valid e-mail address', array('status' => 400));
        }

        // Check if email is already taken by another user
        $existing_user = get_user_by('email', $email);
        if ($existing_user && $existing_user->ID !== $user_id) {
            return new WP_Error('email_exists', 'This e-mail is already in use by another account', array('status' => 400));
        }

        wp_update_user(array(
            'ID' => $user_id,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'user_email' => $email,
            'display_name' => $first_name . ' ' . $last_name,
        ));

        return rest_ensure_response(array(
            'success' => true,
            'data' => array(
                'id' => $user_id,
                'email' => $email,
                'firstName' => $first_name,
                'lastName' => $last_name,
            )
        ));
    }

    /**
     * Change password — requires old password, validates complexity, checks last 5 passwords
     */
    public function change_password($request) {
        $token = $request->get_header('Authorization');

        if (empty($token)) {
            return new WP_Error('no_token', 'Authentication required', array('status' => 401));
        }

        $token = str_replace('Bearer ', '', $token);
        $user_id = $this->validate_auth_token($token);

        if (!$user_id) {
            return new WP_Error('invalid_token', 'Invalid or expired token', array('status' => 401));
        }

        $params = $request->get_json_params();
        $current_password = $params['currentPassword'] ?? '';
        $new_password = $params['newPassword'] ?? '';
        $confirm_password = $params['confirmPassword'] ?? '';

        if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
            return new WP_Error('missing_fields', 'All fields are required', array('status' => 400));
        }

        // Verify current password
        $user = get_user_by('ID', $user_id);
        if (!wp_check_password($current_password, $user->user_pass, $user_id)) {
            return new WP_Error('wrong_password', 'Current password is incorrect', array('status' => 400));
        }

        // Validate new password matches confirmation
        if ($new_password !== $confirm_password) {
            return new WP_Error('password_mismatch', 'New passwords do not match', array('status' => 400));
        }

        // Validate password complexity: 8-20 chars, at least 1 uppercase, at least 1 symbol
        if (strlen($new_password) < 8 || strlen($new_password) > 20) {
            return new WP_Error('password_length', 'Password must be between 8 and 20 characters', array('status' => 400));
        }

        if (!preg_match('/[A-Z]/', $new_password)) {
            return new WP_Error('password_uppercase', 'Password must contain at least one uppercase letter', array('status' => 400));
        }

        if (!preg_match('/[^a-zA-Z0-9]/', $new_password)) {
            return new WP_Error('password_symbol', 'Password must contain at least one symbol', array('status' => 400));
        }

        // Check against last 5 passwords
        $password_history = get_user_meta($user_id, '_password_history', true);
        if (!is_array($password_history)) {
            $password_history = array();
        }

        foreach ($password_history as $old_hash) {
            if (wp_check_password($new_password, $old_hash)) {
                return new WP_Error('password_reused', 'Password must not be the same as your last 5 passwords', array('status' => 400));
            }
        }

        // Also check against the current password
        if (wp_check_password($new_password, $user->user_pass, $user_id)) {
            return new WP_Error('password_reused', 'Password must not be the same as your last 5 passwords', array('status' => 400));
        }

        // Save current password hash to history before changing
        array_unshift($password_history, $user->user_pass);
        $password_history = array_slice($password_history, 0, 5); // Keep only last 5
        update_user_meta($user_id, '_password_history', $password_history);

        // Update password
        wp_set_password($new_password, $user_id);

        // Re-generate auth token since password change invalidates sessions
        $new_token = $this->generate_auth_token($user_id);

        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Password changed successfully',
            'data' => array(
                'token' => $new_token,
            )
        ));
    }

    /**
     * Get user shipping or billing address
     */
    public function get_address($request) {
        $token = $request->get_header('Authorization');

        if (empty($token)) {
            return new WP_Error('no_token', 'Authentication required', array('status' => 401));
        }

        $token = str_replace('Bearer ', '', $token);
        $user_id = $this->validate_auth_token($token);

        if (!$user_id) {
            return new WP_Error('invalid_token', 'Invalid or expired token', array('status' => 401));
        }

        $type = sanitize_text_field($request->get_param('type')); // 'shipping' or 'billing'

        if (!in_array($type, array('shipping', 'billing'))) {
            return new WP_Error('invalid_type', 'Type must be shipping or billing', array('status' => 400));
        }

        $address = array(
            'firstName'  => get_user_meta($user_id, $type . '_first_name', true),
            'lastName'   => get_user_meta($user_id, $type . '_last_name', true),
            'company'    => get_user_meta($user_id, $type . '_company', true),
            'address1'   => get_user_meta($user_id, $type . '_address_1', true),
            'address2'   => get_user_meta($user_id, $type . '_address_2', true),
            'city'       => get_user_meta($user_id, $type . '_city', true),
            'state'      => get_user_meta($user_id, $type . '_state', true),
            'postcode'   => get_user_meta($user_id, $type . '_postcode', true),
            'country'    => get_user_meta($user_id, $type . '_country', true),
            'phone'      => get_user_meta($user_id, $type . '_phone', true),
        );

        // Add email for billing only
        if ($type === 'billing') {
            $address['email'] = get_user_meta($user_id, 'billing_email', true);
        }

        // Get country name from code
        if (!empty($address['country']) && class_exists('WC_Countries')) {
            $wc_countries = new WC_Countries();
            $countries = $wc_countries->get_countries();
            $address['countryName'] = $countries[$address['country']] ?? $address['country'];
        } else {
            $address['countryName'] = $address['country'];
        }

        return rest_ensure_response(array(
            'success' => true,
            'data' => $address
        ));
    }

    /**
     * Update user shipping or billing address
     */
    public function update_address($request) {
        $token = $request->get_header('Authorization');

        if (empty($token)) {
            return new WP_Error('no_token', 'Authentication required', array('status' => 401));
        }

        $token = str_replace('Bearer ', '', $token);
        $user_id = $this->validate_auth_token($token);

        if (!$user_id) {
            return new WP_Error('invalid_token', 'Invalid or expired token', array('status' => 401));
        }

        $params = $request->get_json_params();
        $type = sanitize_text_field($params['type'] ?? '');

        if (!in_array($type, array('shipping', 'billing'))) {
            return new WP_Error('invalid_type', 'Type must be shipping or billing', array('status' => 400));
        }

        $fields = array(
            'firstName'  => $type . '_first_name',
            'lastName'   => $type . '_last_name',
            'company'    => $type . '_company',
            'address1'   => $type . '_address_1',
            'address2'   => $type . '_address_2',
            'city'       => $type . '_city',
            'state'      => $type . '_state',
            'postcode'   => $type . '_postcode',
            'country'    => $type . '_country',
            'phone'      => $type . '_phone',
        );

        if ($type === 'billing') {
            $fields['email'] = 'billing_email';
        }

        foreach ($fields as $param_key => $meta_key) {
            if (isset($params[$param_key])) {
                update_user_meta($user_id, $meta_key, sanitize_text_field($params[$param_key]));
            }
        }

        // Return updated address
        $address = array();
        foreach ($fields as $param_key => $meta_key) {
            $address[$param_key] = get_user_meta($user_id, $meta_key, true);
        }

        // Get country name from code
        if (!empty($address['country']) && class_exists('WC_Countries')) {
            $wc_countries = new WC_Countries();
            $countries = $wc_countries->get_countries();
            $address['countryName'] = $countries[$address['country']] ?? $address['country'];
        } else {
            $address['countryName'] = $address['country'] ?? '';
        }

        return rest_ensure_response(array(
            'success' => true,
            'data' => $address
        ));
    }

    /**
     * Get user orders from WooCommerce
     */
    public function get_user_orders($request) {
        $token = $request->get_header('Authorization');

        if (empty($token)) {
            return new WP_Error('no_token', 'Authentication required', array('status' => 401));
        }

        $token = str_replace('Bearer ', '', $token);
        $user_id = $this->validate_auth_token($token);

        if (!$user_id) {
            return new WP_Error('invalid_token', 'Invalid or expired token', array('status' => 401));
        }

        if (!class_exists('WooCommerce')) {
            return new WP_Error('woocommerce_not_active', 'WooCommerce is not active', array('status' => 500));
        }

        $orders = wc_get_orders(array(
            'customer_id' => $user_id,
            'limit' => 50,
            'orderby' => 'date',
            'order' => 'DESC',
        ));

        $orders_data = array();

        foreach ($orders as $order) {
            $items = array();
            foreach ($order->get_items() as $item) {
                $product = $item->get_product();
                $image_url = '';
                if ($product) {
                    $image_id = $product->get_image_id();
                    if ($image_id) {
                        $image_url = wp_get_attachment_image_url($image_id, 'thumbnail');
                    }
                }

                $items[] = array(
                    'name' => $item->get_name(),
                    'quantity' => $item->get_quantity(),
                    'total' => $item->get_total(),
                    'image' => $image_url ?: '',
                    'slug' => $product ? $product->get_slug() : '',
                );
            }

            $orders_data[] = array(
                'id' => $order->get_id(),
                'number' => $order->get_order_number(),
                'status' => $order->get_status(),
                'statusLabel' => wc_get_order_status_name($order->get_status()),
                'dateCreated' => $order->get_date_created() ? $order->get_date_created()->format('Y-m-d H:i:s') : '',
                'total' => $order->get_total(),
                'currency' => $order->get_currency(),
                'currencySymbol' => get_woocommerce_currency_symbol($order->get_currency()),
                'items' => $items,
                'itemCount' => $order->get_item_count(),
                'shippingTotal' => $order->get_shipping_total(),
                'paymentMethod' => $order->get_payment_method_title(),
            );
        }

        return rest_ensure_response(array(
            'success' => true,
            'data' => $orders_data
        ));
    }

    /**
     * Generate a simple auth token (stored in user meta)
     */
    private function generate_auth_token($user_id) {
        $token = bin2hex(random_bytes(32));
        $expiry = time() + (30 * DAY_IN_SECONDS); // 30 days

        update_user_meta($user_id, '_auth_token', $token);
        update_user_meta($user_id, '_auth_token_expiry', $expiry);

        return $token;
    }

    /**
     * Validate auth token
     */
    private function validate_auth_token($token) {
        global $wpdb;

        $user_id = $wpdb->get_var($wpdb->prepare(
            "SELECT user_id FROM {$wpdb->usermeta} WHERE meta_key = '_auth_token' AND meta_value = %s",
            $token
        ));

        if (!$user_id) {
            return false;
        }

        $expiry = get_user_meta($user_id, '_auth_token_expiry', true);

        if ($expiry < time()) {
            delete_user_meta($user_id, '_auth_token');
            delete_user_meta($user_id, '_auth_token_expiry');
            return false;
        }

        return intval($user_id);
    }
}
