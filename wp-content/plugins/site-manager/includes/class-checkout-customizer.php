<?php
/**
 * Customizzazione pagina pagamento WooCommerce
 * Stile coerente con wastedtalent.it + campo coupon
 */

if (!defined('ABSPATH')) {
    exit;
}

class HPM_Checkout_Customizer {

    public function __construct() {
        // CSS custom per pagina pagamento
        add_action('wp_enqueue_scripts', array($this, 'enqueue_payment_styles'));
        
        // Aggiungi campo coupon nella pagina order-pay
        add_action('before_woocommerce_pay', array($this, 'add_coupon_form'));
        
        // Gestisci applicazione coupon via AJAX
        add_action('wp_ajax_apply_coupon_order_pay', array($this, 'apply_coupon_to_order'));
        add_action('wp_ajax_nopriv_apply_coupon_order_pay', array($this, 'apply_coupon_to_order'));
        
        // Nascondi header/footer WordPress nella pagina di pagamento
        add_action('wp_head', array($this, 'hide_wp_chrome'));
        
        // Redirect dopo pagamento al frontend
        add_action('template_redirect', array($this, 'redirect_after_payment'));
    }

    /**
     * CSS per rendere la pagina di pagamento coerente con il frontend
     */
    public function enqueue_payment_styles() {
        if (!is_checkout_pay_page()) {
            return;
        }

        wp_enqueue_style(
            'hpm-payment-page',
            HPM_PLUGIN_URL . 'assets/css/payment-page.css',
            array(),
            HPM_VERSION
        );

        wp_enqueue_script(
            'hpm-payment-page',
            HPM_PLUGIN_URL . 'assets/js/payment-page.js',
            array('jquery'),
            HPM_VERSION,
            true
        );

        wp_localize_script('hpm-payment-page', 'hpmPayment', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('hpm_coupon_nonce'),
        ));
    }

    /**
     * Nascondi header/footer di WordPress nella pagina di pagamento
     */
    public function hide_wp_chrome() {
        if (!is_checkout_pay_page()) {
            return;
        }
        ?>
        <style>
            header, .site-header, #masthead,
            footer, .site-footer, #colophon,
            .wp-site-blocks > header,
            .wp-site-blocks > footer,
            nav.wp-block-navigation,
            .woocommerce-breadcrumb {
                display: none !important;
            }
        </style>
        <?php
    }

    /**
     * Aggiungi form coupon prima del form di pagamento
     */
    public function add_coupon_form() {
        ?>
        <div class="hpm-coupon-section">
            <div class="hpm-coupon-toggle">
                <span class="hpm-coupon-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.5 7.5V2.5C14.5 1.95 14.05 1.5 13.5 1.5H8.5L1.5 8.5L6.5 13.5L13.5 6.5" stroke="#222222" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="11" cy="4.5" r="1" fill="#222222"/>
                    </svg>
                </span>
                <span>Do you have a coupon code?</span>
            </div>
            <div class="hpm-coupon-form" id="hpm-coupon-form">
                <div class="hpm-coupon-input-wrap">
                    <input type="text" id="hpm-coupon-code" placeholder="Enter coupon code" />
                    <button type="button" id="hpm-apply-coupon">Apply</button>
                </div>
                <div id="hpm-coupon-message" class="hpm-coupon-message" style="display:none;"></div>
            </div>
        </div>
        <?php
    }

    /**
     * AJAX: Applica coupon all'ordine
     */
    public function apply_coupon_to_order() {
        check_ajax_referer('hpm_coupon_nonce', 'nonce');

        $coupon_code = isset($_POST['coupon_code']) ? sanitize_text_field($_POST['coupon_code']) : '';
        $order_id = isset($_POST['order_id']) ? absint($_POST['order_id']) : 0;

        if (empty($coupon_code) || empty($order_id)) {
            wp_send_json_error(array('message' => 'Please enter a coupon code.'));
            return;
        }

        $order = wc_get_order($order_id);
        if (!$order) {
            wp_send_json_error(array('message' => 'Order not found.'));
            return;
        }

        // Verifica che il coupon esista e sia valido
        $coupon = new WC_Coupon($coupon_code);
        if (!$coupon->get_id()) {
            wp_send_json_error(array('message' => 'Invalid coupon code.'));
            return;
        }

        // Controlla se il coupon è già applicato
        $applied_coupons = $order->get_coupon_codes();
        if (in_array(strtolower($coupon_code), array_map('strtolower', $applied_coupons))) {
            wp_send_json_error(array('message' => 'This coupon has already been applied.'));
            return;
        }

        // Prova ad applicare il coupon
        $result = $order->apply_coupon($coupon_code);
        
        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()));
            return;
        }

        $order->calculate_totals();
        $order->save();

        wp_send_json_success(array(
            'message' => 'Coupon applied successfully!',
            'new_total' => $order->get_formatted_order_total(),
            'discount' => wc_price($order->get_total_discount()),
        ));
    }

    /**
     * Redirect alla pagina di conferma del frontend dopo il pagamento
     */
    public function redirect_after_payment() {
        if (is_wc_endpoint_url('order-received')) {
            $order_id = absint(get_query_var('order-received'));
            $order = wc_get_order($order_id);
            if ($order) {
                $frontend_url = defined('HPM_FRONTEND_URL') 
                    ? HPM_FRONTEND_URL 
                    : 'https://www.wastedtalent.it';
                $redirect_url = $frontend_url . '/order-confirmation?id=' . $order_id . '&key=' . $order->get_order_key();
                wp_redirect($redirect_url);
                exit;
            }
        }
    }
}
