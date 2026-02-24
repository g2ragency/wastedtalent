<?php
/**
 * Pagina impostazioni admin
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap hpm-admin-wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <div class="hpm-settings-container" style="display: flex; gap: 20px;">
        
        <!-- Sidebar -->
        <div class="hpm-sidebar" style="width: 200px; flex-shrink: 0;">
            <nav class="hpm-nav">
                <a href="#header" class="hpm-nav-item active" data-tab="header">
                    <span class="dashicons dashicons-menu"></span> Header
                </a>
                <a href="#homepage" class="hpm-nav-item" data-tab="homepage">
                    <span class="dashicons dashicons-admin-home"></span> Homepage
                </a>
                <a href="#about" class="hpm-nav-item" data-tab="about">
                    <span class="dashicons dashicons-groups"></span> About Us
                </a>
                <a href="#footer" class="hpm-nav-item" data-tab="footer">
                    <span class="dashicons dashicons-layout"></span> Footer
                </a>
            </nav>
        </div>

        <!-- Content Area -->
        <div class="hpm-content" style="flex: 1;">
            <form method="post" action="">
                <?php wp_nonce_field('hpm_settings_nonce'); ?>
                
                <!-- Header Section -->
                <div id="header" class="hpm-tab-content active">
                    <h2>Impostazioni Header</h2>
                    
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label>Menu Sinistra</label></th>
                            <td>
                                <?php
                                $menus = wp_get_nav_menus();
                                $selected_left = $settings['header']['left_menu_id'] ?? '';
                                ?>
                                <select name="hpm_site_settings[header][left_menu_id]" class="regular-text">
                                    <option value="">-- Seleziona Menu --</option>
                                    <?php foreach ($menus as $menu): ?>
                                        <option value="<?php echo $menu->term_id; ?>" <?php selected($selected_left, $menu->term_id); ?>>
                                            <?php echo esc_html($menu->name); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="description">
                                    <a href="<?php echo admin_url('nav-menus.php'); ?>" target="_blank">Gestisci i menu</a>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label>Menu Destra</label></th>
                            <td>
                                <?php
                                $selected_right = $settings['header']['right_menu_id'] ?? '';
                                ?>
                                <select name="hpm_site_settings[header][right_menu_id]" class="regular-text">
                                    <option value="">-- Seleziona Menu --</option>
                                    <?php foreach ($menus as $menu): ?>
                                        <option value="<?php echo $menu->term_id; ?>" <?php selected($selected_right, $menu->term_id); ?>>
                                            <?php echo esc_html($menu->name); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="description">
                                    <a href="<?php echo admin_url('nav-menus.php'); ?>" target="_blank">Gestisci i menu</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <!-- Homepage Section -->
                <div id="homepage" class="hpm-tab-content">
                    <h2>Hero Slider</h2>
                    
                    <!-- Slider Tabs -->
                    <div class="hpm-slider-tabs" style="margin-bottom: 20px; border-bottom: 1px solid #ccc;">
                        <button type="button" class="hpm-slider-tab active" data-slide="0" style="padding: 10px 20px; border: none; background: none; cursor: pointer; border-bottom: 2px solid #2271b1; font-weight: 600;">
                            Slide 1
                        </button>
                        <button type="button" class="hpm-slider-tab" data-slide="1" style="padding: 10px 20px; border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent;">
                            Slide 2
                        </button>
                        <button type="button" class="hpm-slider-tab" data-slide="2" style="padding: 10px 20px; border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent;">
                            Slide 3
                        </button>
                    </div>

                    <!-- Slide 1 -->
                    <div class="hpm-slide-content active" data-slide-content="0">
                        <h3>Slide 1</h3>
                        <table class="form-table">
                            <tr>
                                <th scope="row"><label>Titolo</label></th>
                                <td>
                                    <?php
                                    $slide1_title = $settings['hero']['slides'][0]['title'] ?? '';
                                    wp_editor(
                                        $slide1_title,
                                        'hero_slide1_title',
                                        array(
                                            'textarea_name' => 'hpm_site_settings[hero][slides][0][title]',
                                            'media_buttons' => false,
                                            'textarea_rows' => 5,
                                            'teeny' => false,
                                            'tinymce' => array(
                                                'toolbar1' => 'bold,italic,underline,strikethrough,bullist,numlist,link,unlink,undo,redo',
                                                'toolbar2' => ''
                                            ),
                                            'quicktags' => true
                                        )
                                    );
                                    ?>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Sottotitolo</label></th>
                                <td>
                                    <input type="text" 
                                           name="hpm_site_settings[hero][slides][0][subtitle]" 
                                           value="<?php echo esc_attr($settings['hero']['slides'][0]['subtitle'] ?? ''); ?>" 
                                           class="regular-text">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Testo CTA</label></th>
                                <td>
                                    <input type="text" 
                                           name="hpm_site_settings[hero][slides][0][cta_text]" 
                                           value="<?php echo esc_attr($settings['hero']['slides'][0]['cta_text'] ?? ''); ?>" 
                                           class="regular-text">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Link CTA</label></th>
                                <td>
                                    <input type="url" 
                                           name="hpm_site_settings[hero][slides][0][cta_link]" 
                                           value="<?php echo esc_url($settings['hero']['slides'][0]['cta_link'] ?? ''); ?>" 
                                           class="regular-text">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Immagine di sfondo</label></th>
                                <td>
                                    <input type="text" 
                                           name="hpm_site_settings[hero][slides][0][background_image]" 
                                           id="slide1_background_image" 
                                           value="<?php echo esc_url($settings['hero']['slides'][0]['background_image'] ?? ''); ?>" 
                                           class="regular-text">
                                    <button type="button" class="button hpm-upload-image" data-target="slide1_background_image">
                                        Carica Immagine
                                    </button>
                                    <?php if (!empty($settings['hero']['slides'][0]['background_image'])): ?>
                                        <div class="hpm-image-preview">
                                            <img src="<?php echo esc_url($settings['hero']['slides'][0]['background_image']); ?>" style="max-width: 200px;">
                                        </div>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- Slide 2 -->
                    <div class="hpm-slide-content" data-slide-content="1" style="display: none;">
                        <h3>Slide 2</h3>
                        <table class="form-table">
                            <tr>
                                <th scope="row"><label>Titolo</label></th>
                                <td>
                                    <?php
                                    $slide2_title = $settings['hero']['slides'][1]['title'] ?? '';
                                    wp_editor(
                                        $slide2_title,
                                        'hero_slide2_title',
                                        array(
                                            'textarea_name' => 'hpm_site_settings[hero][slides][1][title]',
                                            'media_buttons' => false,
                                            'textarea_rows' => 5,
                                            'teeny' => false,
                                            'tinymce' => array(
                                                'toolbar1' => 'bold,italic,underline,strikethrough,bullist,numlist,link,unlink,undo,redo',
                                                'toolbar2' => ''
                                            ),
                                            'quicktags' => true
                                        )
                                    );
                                    ?>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Sottotitolo</label></th>
                                <td>
                                    <input type="text" 
                                           name="hpm_site_settings[hero][slides][1][subtitle]" 
                                           value="<?php echo esc_attr($settings['hero']['slides'][1]['subtitle'] ?? ''); ?>" 
                                           class="regular-text">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Testo CTA</label></th>
                                <td>
                                    <input type="text" 
                                           name="hpm_site_settings[hero][slides][1][cta_text]" 
                                           value="<?php echo esc_attr($settings['hero']['slides'][1]['cta_text'] ?? ''); ?>" 
                                           class="regular-text">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Link CTA</label></th>
                                <td>
                                    <input type="url" 
                                           name="hpm_site_settings[hero][slides][1][cta_link]" 
                                           value="<?php echo esc_url($settings['hero']['slides'][1]['cta_link'] ?? ''); ?>" 
                                           class="regular-text">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Immagine di sfondo</label></th>
                                <td>
                                    <input type="text" 
                                           name="hpm_site_settings[hero][slides][1][background_image]" 
                                           id="slide2_background_image" 
                                           value="<?php echo esc_url($settings['hero']['slides'][1]['background_image'] ?? ''); ?>" 
                                           class="regular-text">
                                    <button type="button" class="button hpm-upload-image" data-target="slide2_background_image">
                                        Carica Immagine
                                    </button>
                                    <?php if (!empty($settings['hero']['slides'][1]['background_image'])): ?>
                                        <div class="hpm-image-preview">
                                            <img src="<?php echo esc_url($settings['hero']['slides'][1]['background_image']); ?>" style="max-width: 200px;">
                                        </div>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- Slide 3 -->
                    <div class="hpm-slide-content" data-slide-content="2" style="display: none;">
                        <h3>Slide 3</h3>
                        <table class="form-table">
                            <tr>
                                <th scope="row"><label>Titolo</label></th>
                                <td>
                                    <?php
                                    $slide3_title = $settings['hero']['slides'][2]['title'] ?? '';
                                    wp_editor(
                                        $slide3_title,
                                        'hero_slide3_title',
                                        array(
                                            'textarea_name' => 'hpm_site_settings[hero][slides][2][title]',
                                            'media_buttons' => false,
                                            'textarea_rows' => 5,
                                            'teeny' => false,
                                            'tinymce' => array(
                                                'toolbar1' => 'bold,italic,underline,strikethrough,bullist,numlist,link,unlink,undo,redo',
                                                'toolbar2' => ''
                                            ),
                                            'quicktags' => true
                                        )
                                    );
                                    ?>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Sottotitolo</label></th>
                                <td>
                                    <input type="text" 
                                           name="hpm_site_settings[hero][slides][2][subtitle]" 
                                           value="<?php echo esc_attr($settings['hero']['slides'][2]['subtitle'] ?? ''); ?>" 
                                           class="regular-text">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Testo CTA</label></th>
                                <td>
                                    <input type="text" 
                                           name="hpm_site_settings[hero][slides][2][cta_text]" 
                                           value="<?php echo esc_attr($settings['hero']['slides'][2]['cta_text'] ?? ''); ?>" 
                                           class="regular-text">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Link CTA</label></th>
                                <td>
                                    <input type="url" 
                                           name="hpm_site_settings[hero][slides][2][cta_link]" 
                                           value="<?php echo esc_url($settings['hero']['slides'][2]['cta_link'] ?? ''); ?>" 
                                           class="regular-text">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Immagine di sfondo</label></th>
                                <td>
                                    <input type="text" 
                                           name="hpm_site_settings[hero][slides][2][background_image]" 
                                           id="slide3_background_image" 
                                           value="<?php echo esc_url($settings['hero']['slides'][2]['background_image'] ?? ''); ?>" 
                                           class="regular-text">
                                    <button type="button" class="button hpm-upload-image" data-target="slide3_background_image">
                                        Carica Immagine
                                    </button>
                                    <?php if (!empty($settings['hero']['slides'][2]['background_image'])): ?>
                                        <div class="hpm-image-preview">
                                            <img src="<?php echo esc_url($settings['hero']['slides'][2]['background_image']); ?>" style="max-width: 200px;">
                                        </div>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    <h2 style="margin-top: 40px;">Prodotti in Evidenza</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label>Titolo Sezione</label></th>
                            <td>
                                <input type="text" 
                                       name="hpm_site_settings[featured_products][title]" 
                                       value="<?php echo esc_attr($settings['featured_products']['title'] ?? ''); ?>" 
                                       class="regular-text">
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label>Seleziona Prodotti</label></th>
                            <td>
                                <p class="description">Seleziona i prodotti da mostrare in homepage (richiede WooCommerce)</p>
                                <?php
                                if (class_exists('WooCommerce')) {
                                    $selected_ids = $settings['featured_products']['product_ids'] ?? array();
                                    $products = wc_get_products(array('limit' => -1));
                                    
                                    echo '<select name="hpm_site_settings[featured_products][product_ids][]" multiple class="hpm-product-select" style="width: 100%; height: 200px;">';
                                    foreach ($products as $product) {
                                        $selected = in_array($product->get_id(), $selected_ids) ? 'selected' : '';
                                        echo '<option value="' . $product->get_id() . '" ' . $selected . '>' . $product->get_name() . '</option>';
                                    }
                                    echo '</select>';
                                } else {
                                    echo '<p>WooCommerce non è installato o attivo</p>';
                                }
                                ?>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <!-- About Us Section -->
                <div id="about" class="hpm-tab-content">
                    <h2>Manifesto</h2>
                    
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label>Testo Manifesto</label></th>
                            <td>
                                <?php
                                $manifesto_text = $settings['about']['manifesto_text'] ?? '';
                                wp_editor(
                                    $manifesto_text,
                                    'about_manifesto_text',
                                    array(
                                        'textarea_name' => 'hpm_site_settings[about][manifesto_text]',
                                        'media_buttons' => false,
                                        'textarea_rows' => 8,
                                        'teeny' => false,
                                        'tinymce' => array(
                                            'toolbar1' => 'bold,italic,underline,strikethrough,bullist,numlist,link,unlink,undo,redo',
                                            'toolbar2' => ''
                                        ),
                                        'quicktags' => true
                                    )
                                );
                                ?>
                            </td>
                        </tr>
                    </table>

                    <h3>Immagini Manifesto</h3>
                    <p class="description">Carica le immagini per la sezione Manifesto (verranno mostrate in griglia sotto il testo)</p>
                    
                    <div class="hpm-about-images" id="manifesto-images-container">
                        <?php
                        $manifesto_images = $settings['about']['manifesto_images'] ?? array();
                        if (!empty($manifesto_images)):
                            foreach ($manifesto_images as $i => $img): ?>
                                <div class="hpm-about-image-item" style="display:inline-block; margin:10px; position:relative;">
                                    <img src="<?php echo esc_url($img); ?>" style="max-width:200px; max-height:200px; object-fit:cover;">
                                    <input type="hidden" name="hpm_site_settings[about][manifesto_images][]" value="<?php echo esc_url($img); ?>">
                                    <button type="button" class="button hpm-remove-about-image" style="position:absolute; top:0; right:0; background:red; color:white; border:none; cursor:pointer; padding:2px 8px;">✕</button>
                                </div>
                            <?php endforeach;
                        endif; ?>
                    </div>
                    <button type="button" class="button hpm-add-about-image" data-target="manifesto-images-container" data-field="manifesto_images">
                        + Aggiungi Immagine
                    </button>

                    <hr style="margin: 40px 0;">

                    

                    <h3>Gallery (3 immagini)</h3>
                    <p class="description">1ª immagine: full width — 2ª e 3ª immagine: affiancate</p>
                    <table class="form-table">
                        <?php for ($g = 0; $g < 3; $g++): 
                            $gallery_val = $settings['about']['manifesto_gallery'][$g] ?? '';
                        ?>
                        <tr>
                            <th scope="row"><label>Immagine <?php echo $g + 1; ?></label></th>
                            <td>
                                <input type="text" 
                                       name="hpm_site_settings[about][manifesto_gallery][<?php echo $g; ?>]"
                                       id="manifesto_gallery_<?php echo $g; ?>" 
                                       value="<?php echo esc_url($gallery_val); ?>"
                                       class="regular-text">
                                <button type="button" class="button hpm-upload-image" data-target="manifesto_gallery_<?php echo $g; ?>">
                                    Carica Immagine
                                </button>
                                <?php if (!empty($gallery_val)): ?>
                                    <div class="hpm-image-preview">
                                        <img src="<?php echo esc_url($gallery_val); ?>" style="max-width: 200px;">
                                    </div>
                                <?php endif; ?>
                            </td>
                        </tr>
                        <?php endfor; ?>
                    </table>
                    <p class="description">Seleziona i prodotti da mostrare nella sezione Manifesto (con preview, nome e prezzo)</p>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label>Prodotti Manifesto</label></th>
                            <td>
                                <?php
                                if (class_exists('WooCommerce')) {
                                    $selected_manifesto_ids = $settings['about']['manifesto_product_ids'] ?? array();
                                    $all_products = wc_get_products(array('limit' => -1));
                                    
                                    echo '<div class="hpm-product-selector">';
                                    echo '<select name="hpm_site_settings[about][manifesto_product_ids][]" multiple class="hpm-product-select" style="width:100%; min-height:150px;">';
                                    foreach ($all_products as $product) {
                                        $thumb = $product->get_image_id() ? wp_get_attachment_image_url($product->get_image_id(), 'thumbnail') : '';
                                        $selected = in_array($product->get_id(), $selected_manifesto_ids) ? 'selected' : '';
                                        echo '<option value="' . $product->get_id() . '" ' . $selected . ' data-thumb="' . esc_url($thumb) . '">' . esc_html($product->get_name()) . ' — €' . $product->get_price() . '</option>';
                                    }
                                    echo '</select>';
                                    echo '</div>';
                                    
                                    // Preview prodotti selezionati
                                    if (!empty($selected_manifesto_ids)) {
                                        echo '<div class="hpm-selected-products-preview" style="margin-top:15px; display:flex; gap:15px; flex-wrap:wrap;">';
                                        foreach ($selected_manifesto_ids as $pid) {
                                            $p = wc_get_product($pid);
                                            if ($p) {
                                                $img = $p->get_image_id() ? wp_get_attachment_image_url($p->get_image_id(), 'thumbnail') : '';
                                                echo '<div style="border:1px solid #ddd; padding:10px; text-align:center; width:120px;">';
                                                if ($img) echo '<img src="' . esc_url($img) . '" style="width:80px; height:80px; object-fit:cover;">';
                                                echo '<p style="margin:5px 0 0; font-size:12px;">' . esc_html($p->get_name()) . '</p>';
                                                echo '<p style="margin:0; font-size:11px; color:#666;">€' . $p->get_price() . '</p>';
                                                echo '</div>';
                                            }
                                        }
                                        echo '</div>';
                                    }
                                } else {
                                    echo '<p>WooCommerce non è installato o attivo</p>';
                                }
                                ?>
                            </td>
                        </tr>
                    </table>

                    <hr style="margin: 40px 0;">

                    <h2>Visione</h2>
                    
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label>Testo Visione</label></th>
                            <td>
                                <?php
                                $visione_text = $settings['about']['visione_text'] ?? '';
                                wp_editor(
                                    $visione_text,
                                    'about_visione_text',
                                    array(
                                        'textarea_name' => 'hpm_site_settings[about][visione_text]',
                                        'media_buttons' => false,
                                        'textarea_rows' => 8,
                                        'teeny' => false,
                                        'tinymce' => array(
                                            'toolbar1' => 'bold,italic,underline,strikethrough,bullist,numlist,link,unlink,undo,redo',
                                            'toolbar2' => ''
                                        ),
                                        'quicktags' => true
                                    )
                                );
                                ?>
                            </td>
                        </tr>
                    </table>

                    <h3>Immagini Visione</h3>
                    <p class="description">Carica le immagini per la sezione Visione</p>
                    
                    <div class="hpm-about-images" id="visione-images-container">
                        <?php
                        $visione_images = $settings['about']['visione_images'] ?? array();
                        if (!empty($visione_images)):
                            foreach ($visione_images as $i => $img): ?>
                                <div class="hpm-about-image-item" style="display:inline-block; margin:10px; position:relative;">
                                    <img src="<?php echo esc_url($img); ?>" style="max-width:200px; max-height:200px; object-fit:cover;">
                                    <input type="hidden" name="hpm_site_settings[about][visione_images][]" value="<?php echo esc_url($img); ?>">
                                    <button type="button" class="button hpm-remove-about-image" style="position:absolute; top:0; right:0; background:red; color:white; border:none; cursor:pointer; padding:2px 8px;">✕</button>
                                </div>
                            <?php endforeach;
                        endif; ?>
                    </div>
                    <button type="button" class="button hpm-add-about-image" data-target="visione-images-container" data-field="visione_images">
                        + Aggiungi Immagine
                    </button>

                    <hr style="margin: 40px 0;">

                    

                    <h3>Gallery (3 immagini)</h3>
                    <p class="description">1ª immagine: full width — 2ª e 3ª immagine: affiancate</p>
                    <table class="form-table">
                        <?php for ($g = 0; $g < 3; $g++): 
                            $gallery_val = $settings['about']['visione_gallery'][$g] ?? '';
                        ?>
                        <tr>
                            <th scope="row"><label>Immagine <?php echo $g + 1; ?></label></th>
                            <td>
                                <input type="text" 
                                       name="hpm_site_settings[about][visione_gallery][<?php echo $g; ?>]"
                                       id="visione_gallery_<?php echo $g; ?>" 
                                       value="<?php echo esc_url($gallery_val); ?>"
                                       class="regular-text">
                                <button type="button" class="button hpm-upload-image" data-target="visione_gallery_<?php echo $g; ?>">
                                    Carica Immagine
                                </button>
                                <?php if (!empty($gallery_val)): ?>
                                    <div class="hpm-image-preview">
                                        <img src="<?php echo esc_url($gallery_val); ?>" style="max-width: 200px;">
                                    </div>
                                <?php endif; ?>
                            </td>
                        </tr>
                        <?php endfor; ?>
                    </table>
                    <p class="description">Seleziona i prodotti da mostrare nella sezione Visione (con preview, nome e prezzo)</p>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label>Prodotti Visione</label></th>
                            <td>
                                <?php
                                if (class_exists('WooCommerce')) {
                                    $selected_visione_ids = $settings['about']['visione_product_ids'] ?? array();
                                    
                                    echo '<div class="hpm-product-selector">';
                                    echo '<select name="hpm_site_settings[about][visione_product_ids][]" multiple class="hpm-product-select" style="width:100%; min-height:150px;">';
                                    foreach ($all_products as $product) {
                                        $thumb = $product->get_image_id() ? wp_get_attachment_image_url($product->get_image_id(), 'thumbnail') : '';
                                        $selected = in_array($product->get_id(), $selected_visione_ids) ? 'selected' : '';
                                        echo '<option value="' . $product->get_id() . '" ' . $selected . ' data-thumb="' . esc_url($thumb) . '">' . esc_html($product->get_name()) . ' — €' . $product->get_price() . '</option>';
                                    }
                                    echo '</select>';
                                    echo '</div>';
                                    
                                    // Preview prodotti selezionati
                                    if (!empty($selected_visione_ids)) {
                                        echo '<div class="hpm-selected-products-preview" style="margin-top:15px; display:flex; gap:15px; flex-wrap:wrap;">';
                                        foreach ($selected_visione_ids as $pid) {
                                            $p = wc_get_product($pid);
                                            if ($p) {
                                                $img = $p->get_image_id() ? wp_get_attachment_image_url($p->get_image_id(), 'thumbnail') : '';
                                                echo '<div style="border:1px solid #ddd; padding:10px; text-align:center; width:120px;">';
                                                if ($img) echo '<img src="' . esc_url($img) . '" style="width:80px; height:80px; object-fit:cover;">';
                                                echo '<p style="margin:5px 0 0; font-size:12px;">' . esc_html($p->get_name()) . '</p>';
                                                echo '<p style="margin:0; font-size:11px; color:#666;">€' . $p->get_price() . '</p>';
                                                echo '</div>';
                                            }
                                        }
                                        echo '</div>';
                                    }
                                } else {
                                    echo '<p>WooCommerce non è installato o attivo</p>';
                                }
                                ?>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <!-- Footer Section -->
                <div id="footer" class="hpm-tab-content">
                    <h2>Impostazioni Footer</h2>
                    <p class="description">Le impostazioni del footer saranno disponibili prossimamente.</p>
                </div>
                
                <?php submit_button('Salva Impostazioni', 'primary', 'hpm_save_settings'); ?>
            </form>
        </div>
    </div>
</div>

<style>
.hpm-settings-container {
    margin-top: 20px;
}

.hpm-sidebar {
    background: #fff;
    border: 1px solid #ccd0d4;
    box-shadow: 0 1px 1px rgba(0,0,0,.04);
}

.hpm-nav {
    display: flex;
    flex-direction: column;
}

.hpm-nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    text-decoration: none;
    color: #2c3338;
    border-left: 4px solid transparent;
    transition: all 0.2s;
}

.hpm-nav-item:hover {
    background: #f6f7f7;
    color: #2271b1;
}

.hpm-nav-item.active {
    background: #f6f7f7;
    border-left-color: #2271b1;
    color: #2271b1;
    font-weight: 600;
}

.hpm-nav-item .dashicons {
    width: 20px;
    height: 20px;
    font-size: 20px;
}

.hpm-content {
    background: #fff;
    border: 1px solid #ccd0d4;
    box-shadow: 0 1px 1px rgba(0,0,0,.04);
    padding: 20px;
}

.hpm-tab-content {
    display: none;
}

.hpm-tab-content.active {
    display: block;
}

.hpm-image-preview {
    margin-top: 10px;
}

.hpm-product-select {
    font-family: monospace;
}

.hpm-slider-tab.active {
    font-weight: 600;
    border-bottom-color: #2271b1 !important;
}

.hpm-slider-tab:hover {
    color: #2271b1;
}
</style>

<script>
jQuery(document).ready(function($) {
    // Tab navigation
    $('.hpm-nav-item').on('click', function(e) {
        e.preventDefault();
        
        var tab = $(this).data('tab');
        
        // Update nav items
        $('.hpm-nav-item').removeClass('active');
        $(this).addClass('active');
        
        // Update content
        $('.hpm-tab-content').removeClass('active');
        $('#' + tab).addClass('active');
    });
    
    // Slider tabs navigation
    $('.hpm-slider-tab').on('click', function(e) {
        e.preventDefault();
        
        var slide = $(this).data('slide');
        
        // Update slider tabs
        $('.hpm-slider-tab').removeClass('active').css('border-bottom-color', 'transparent');
        $(this).addClass('active').css('border-bottom-color', '#2271b1');
        
        // Update slide content
        $('.hpm-slide-content').hide();
        $('[data-slide-content="' + slide + '"]').show();
    });
    
    // Media uploader
    $('.hpm-upload-image').on('click', function(e) {
        e.preventDefault();
        
        var button = $(this);
        var targetId = button.data('target');
        
        var mediaUploader = wp.media({
            title: 'Seleziona Immagine',
            button: {
                text: 'Usa questa immagine'
            },
            multiple: false
        });
        
        mediaUploader.on('select', function() {
            var attachment = mediaUploader.state().get('selection').first().toJSON();
            $('#' + targetId).val(attachment.url);
            
            // Update preview
            var preview = button.siblings('.hpm-image-preview');
            if (preview.length) {
                preview.find('img').attr('src', attachment.url);
            } else {
                button.after('<div class="hpm-image-preview"><img src="' + attachment.url + '" style="max-width: 200px;"></div>');
            }
        });
        
        mediaUploader.open();
    });
    
    // About Us - Add image
    $('.hpm-add-about-image').on('click', function(e) {
        e.preventDefault();
        
        var button = $(this);
        var containerId = button.data('target');
        var field = button.data('field');
        
        var mediaUploader = wp.media({
            title: 'Seleziona Immagine',
            button: { text: 'Aggiungi Immagine' },
            multiple: true
        });
        
        mediaUploader.on('select', function() {
            var attachments = mediaUploader.state().get('selection').toJSON();
            attachments.forEach(function(attachment) {
                var html = '<div class="hpm-about-image-item" style="display:inline-block; margin:10px; position:relative;">';
                html += '<img src="' + attachment.url + '" style="max-width:200px; max-height:200px; object-fit:cover;">';
                html += '<input type="hidden" name="hpm_site_settings[about][' + field + '][]" value="' + attachment.url + '">';
                html += '<button type="button" class="button hpm-remove-about-image" style="position:absolute; top:0; right:0; background:red; color:white; border:none; cursor:pointer; padding:2px 8px;">✕</button>';
                html += '</div>';
                $('#' + containerId).append(html);
            });
        });
        
        mediaUploader.open();
    });
    
    // About Us - Remove image
    $(document).on('click', '.hpm-remove-about-image', function(e) {
        e.preventDefault();
        $(this).closest('.hpm-about-image-item').remove();
    });
});
</script>
