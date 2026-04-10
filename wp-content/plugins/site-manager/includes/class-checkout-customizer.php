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
        
        // Abilita checkout con totale zero (per coupon 100%)
        add_filter('woocommerce_cart_needs_payment', array($this, 'maybe_skip_payment'), 10, 2);
        
        // Stripe / WooPayments appearance — font-size 14px dentro l'iframe
        add_filter('wcpay_upe_appearance', array($this, 'customize_stripe_appearance'));
        add_filter('wc_stripe_upe_appearance', array($this, 'customize_stripe_appearance'));
        
        // Inline script per sovrascrivere le opzioni Stripe Elements (nel footer)
        add_action('wp_footer', array($this, 'stripe_font_override'));
        
        // Script PRIMA di Stripe.js per intercettare la creazione
        add_action('wp_enqueue_scripts', array($this, 'enqueue_stripe_override'), 1);
        
        // Permetti pagamento su ordini pending (fix "cannot be paid for")
        add_filter('woocommerce_valid_order_statuses_for_payment', array($this, 'allow_pending_payment'), 10, 2);
        
        // Traduci label tabella ordine in italiano
        add_filter('woocommerce_order_item_get_formatted_meta_data', array($this, 'hide_item_meta'), 10, 2);
        
        // Nascondi 'via {method}' nella riga spedizione
        add_filter('woocommerce_order_shipping_to_display', array($this, 'clean_shipping_display'), 10, 2);
        
        // Privacy policy in inglese
        add_filter('woocommerce_get_privacy_policy_text', array($this, 'english_privacy_text'), 10, 2);
        
        // Traduci label del footer tabella
        add_action('wp_head', array($this, 'translate_table_labels'));
    }

    /**
     * Consenti pagamento su ordini con stato pending
     */
    public function allow_pending_payment($statuses, $order) {
        $statuses[] = 'pending';
        $statuses[] = 'failed';
        return array_unique($statuses);
    }

    /**
     * Nascondi meta inutili dagli item dell'ordine
     */
    public function hide_item_meta($formatted_meta, $item) {
        return $formatted_meta;
    }

    /**
     * Rimuovi 'via {method_title}' dalla riga spedizione
     */
    public function clean_shipping_display($shipping, $order) {
        // Rimuovi tutto dopo il prezzo (il "via Spedizione")
        $shipping = preg_replace('/<small.*<\/small>/s', '', $shipping);
        return $shipping;
    }

    /**
     * Privacy policy in inglese
     */
    public function english_privacy_text($text, $type) {
        if ($type === 'pay') {
            return 'Your personal data will be used to process your order, support your experience on this website, and for other purposes described in our <a href="/privacy-policy/" class="woocommerce-privacy-policy-link" target="_blank">privacy policy</a>.';
        }
        return $text;
    }

    /**
     * Traduci le label della tabella ordine tramite JS (più affidabile)
     */
    public function translate_table_labels() {
        if (!is_checkout_pay_page()) {
            return;
        }
        ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Rimuovi "(ex. VAT)" e "(incl. VAT)"
            var allCells = document.querySelectorAll('.shop_table td, .shop_table th');
            allCells.forEach(function(cell) {
                cell.innerHTML = cell.innerHTML.replace(/\s*\(ex\.\s*VAT\)/g, '');
                cell.innerHTML = cell.innerHTML.replace(/\s*\(incl\.\s*VAT\)/g, '');
            });

            // Rimuovi "via Spedizione" o simili dal testo spedizione
            var shippingRows = document.querySelectorAll('.shipping td');
            shippingRows.forEach(function(td) {
                var smalls = td.querySelectorAll('small');
                smalls.forEach(function(s) { s.remove(); });
                // Also remove any remaining "via ..." text
                td.innerHTML = td.innerHTML.replace(/\s*via\s+[^<]*/g, '');
            });
        });
        </script>
        <?php
    }

    /**
     * Personalizza l'aspetto di Stripe Elements (dentro l'iframe)
     */
    public function customize_stripe_appearance($appearance) {
        $appearance['rules'] = array(
            '.Input' => array(
                'fontSize' => '14px',
                'fontFamily' => 'Helvetica Neue, Helvetica, Arial, sans-serif',
                'color' => '#222222',
            ),
            '.Input::placeholder' => array(
                'fontSize' => '14px',
                'color' => '#bbbbbb',
            ),
            '.Label' => array(
                'fontSize' => '14px',
                'fontFamily' => 'Helvetica Neue, Helvetica, Arial, sans-serif',
                'color' => '#222222',
                'fontWeight' => '500',
            ),
            '.Tab' => array(
                'fontSize' => '14px',
                'fontFamily' => 'Helvetica Neue, Helvetica, Arial, sans-serif',
            ),
            '.TabLabel' => array(
                'fontSize' => '14px',
            ),
            '.Block' => array(
                'fontSize' => '14px',
            ),
            '.Text' => array(
                'fontSize' => '14px',
            ),
            '.p-FieldLabel' => array(
                'fontSize' => '14px',
            ),
        );
        $appearance['variables'] = array(
            'fontFamily' => 'Helvetica Neue, Helvetica, Arial, sans-serif',
            'fontSizeBase' => '14px',
            'fontSizeSm' => '14px',
            'fontSizeLg' => '14px',
            'fontSizeXl' => '14px',
            'fontWeightNormal' => '400',
            'colorText' => '#222222',
            'colorTextSecondary' => '#666666',
            'colorTextPlaceholder' => '#bbbbbb',
            'spacingUnit' => '4px',
        );
        
        if (!isset($appearance['theme'])) {
            $appearance['theme'] = 'stripe';
        }
        
        return $appearance;
    }

    /**
     * Script inline per sovrascrivere font-size nell'iframe Stripe e Klarna
     */
    public function stripe_font_override() {
        if (!is_checkout_pay_page()) {
            return;
        }
        ?>
        <script>
        (function() {
            // 1. Override Stripe() constructor to force font-size in Elements
            var _origStripe = window.Stripe;
            if (_origStripe) {
                window.Stripe = function() {
                    var stripe = _origStripe.apply(this, arguments);
                    var _origElements = stripe.elements.bind(stripe);
                    stripe.elements = function(opts) {
                        opts = opts || {};
                        // Force appearance with 14px font
                        opts.appearance = opts.appearance || {};
                        opts.appearance.variables = opts.appearance.variables || {};
                        opts.appearance.variables.fontSizeBase = '14px';
                        opts.appearance.variables.fontSizeSm = '14px';
                        opts.appearance.variables.fontSizeLg = '14px';
                        opts.appearance.variables.fontFamily = 'Helvetica Neue, Helvetica, Arial, sans-serif';
                        opts.appearance.rules = opts.appearance.rules || {};
                        opts.appearance.rules['.Input'] = Object.assign(opts.appearance.rules['.Input'] || {}, {
                            fontSize: '14px',
                            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
                        });
                        opts.appearance.rules['.Label'] = Object.assign(opts.appearance.rules['.Label'] || {}, {
                            fontSize: '14px',
                            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
                        });
                        opts.appearance.rules['.Tab'] = Object.assign(opts.appearance.rules['.Tab'] || {}, {
                            fontSize: '14px'
                        });
                        opts.appearance.rules['.TabLabel'] = Object.assign(opts.appearance.rules['.TabLabel'] || {}, {
                            fontSize: '14px'
                        });
                        opts.appearance.rules['.Block'] = Object.assign(opts.appearance.rules['.Block'] || {}, {
                            fontSize: '14px'
                        });
                        opts.appearance.rules['.Input::placeholder'] = Object.assign(opts.appearance.rules['.Input::placeholder'] || {}, {
                            fontSize: '14px'
                        });
                        return _origElements(opts);
                    };
                    return stripe;
                };
                // Preserve static methods
                for (var prop in _origStripe) {
                    if (_origStripe.hasOwnProperty(prop)) {
                        window.Stripe[prop] = _origStripe[prop];
                    }
                }
                window.Stripe.version = _origStripe.version;
            }
            
            // 2. Override WooPayments localized appearance data
            if (typeof window.wcpayConfig !== 'undefined') {
                window.wcpayConfig.paymentMethodsConfig = window.wcpayConfig.paymentMethodsConfig || {};
            }
            
            // 3. MutationObserver for container sizing
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            var frames = document.querySelectorAll(
                                '.StripeElement, .__PrivateStripeElement, .wcpay-upe-element, #wcpay-upe-element, #wcpay-card-element, [data-elements-stable-field-name]'
                            );
                            frames.forEach(function(el) {
                                el.style.fontSize = '14px';
                                el.style.fontFamily = 'Helvetica Neue, Helvetica, Arial, sans-serif';
                                var iframes = el.querySelectorAll('iframe');
                                iframes.forEach(function(iframe) {
                                    iframe.style.minHeight = '44px';
                                });
                            });
                        }
                    });
                });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            
            // 4. Delayed fallback
            setTimeout(function() {
                var frames = document.querySelectorAll(
                    '.StripeElement, .__PrivateStripeElement, .wcpay-upe-element, #wcpay-upe-element, #wcpay-card-element, [data-elements-stable-field-name]'
                );
                frames.forEach(function(el) {
                    el.style.fontSize = '14px';
                    el.style.fontFamily = 'Helvetica Neue, Helvetica, Arial, sans-serif';
                });
            }, 2000);
        })();
        </script>
        <?php
    }

    /**
     * Permetti ordini con totale zero (coupon 100%) senza pagamento
     */
    public function maybe_skip_payment($needs_payment, $cart) {
        if ($cart->get_total('edit') == 0) {
            return false;
        }
        return $needs_payment;
    }

    /**
     * Carica script override PRIMA di Stripe.js per intercettare la creazione degli Elements
     */
    public function enqueue_stripe_override() {
        if (!is_checkout_pay_page()) {
            return;
        }
        
        // Aggiungi inline script che sovrascrive wcpayConfig dopo che viene localizzato
        add_action('wp_print_footer_scripts', function() {
            ?>
            <script>
            // Override WooPayments appearance config if it exists
            (function() {
                function overrideAppearance() {
                    // WooPayments stores config in wcpay_upe_config or wcpayConfig
                    var configs = ['wcpay_upe_config', 'wcpayConfig', 'wc_stripe_upe_params'];
                    configs.forEach(function(configName) {
                        if (typeof window[configName] !== 'undefined' && window[configName]) {
                            var config = window[configName];
                            if (config.paymentMethodsConfig) {
                                Object.keys(config.paymentMethodsConfig).forEach(function(method) {
                                    if (config.paymentMethodsConfig[method].upeAppearance) {
                                        config.paymentMethodsConfig[method].upeAppearance.variables = config.paymentMethodsConfig[method].upeAppearance.variables || {};
                                        config.paymentMethodsConfig[method].upeAppearance.variables.fontSizeBase = '14px';
                                        config.paymentMethodsConfig[method].upeAppearance.variables.fontSizeSm = '14px';
                                    }
                                });
                            }
                            if (config.appearance) {
                                config.appearance.variables = config.appearance.variables || {};
                                config.appearance.variables.fontSizeBase = '14px';
                                config.appearance.variables.fontSizeSm = '14px';
                            }
                        }
                    });
                }
                
                overrideAppearance();
                // Run again after short delay in case scripts load late
                setTimeout(overrideAppearance, 100);
                setTimeout(overrideAppearance, 500);
            })();
            </script>
            <?php
        }, 1);
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

        // Inietta URL del logo nel CSS
        $logo_url = HPM_PLUGIN_URL . 'assets/img/logo.svg';
        $inline_css = 'body.woocommerce-order-pay .woocommerce::before { background-image: url(' . esc_url($logo_url) . '); }';
        wp_add_inline_style('hpm-payment-page', $inline_css);
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
                <span>Hai un codice sconto?</span>
            </div>
            <div class="hpm-coupon-form" id="hpm-coupon-form">
                <div class="hpm-coupon-input-wrap">
                    <input type="text" id="hpm-coupon-code" placeholder="Inserisci il codice sconto" />
                    <button type="button" id="hpm-apply-coupon">Applica</button>
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
            wp_send_json_error(array('message' => 'Inserisci un codice sconto.'));
            return;
        }

        $order = wc_get_order($order_id);
        if (!$order) {
            wp_send_json_error(array('message' => 'Ordine non trovato.'));
            return;
        }

        // Verifica che il coupon esista e sia valido
        $coupon = new WC_Coupon($coupon_code);
        if (!$coupon->get_id()) {
            wp_send_json_error(array('message' => 'Codice sconto non valido.'));
            return;
        }

        // Controlla se il coupon è già applicato
        $applied_coupons = $order->get_coupon_codes();
        if (in_array(strtolower($coupon_code), array_map('strtolower', $applied_coupons))) {
            wp_send_json_error(array('message' => 'Questo codice sconto è già stato applicato.'));
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
            'message' => 'Codice sconto applicato!',
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
