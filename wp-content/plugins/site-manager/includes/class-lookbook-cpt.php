<?php
/**
 * Lookbook Custom Post Type
 */

if (!defined('ABSPATH')) {
    exit;
}

class HPM_Lookbook_CPT {

    public function __construct() {
        add_action('init', array($this, 'register_post_type'));
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post_lookbook', array($this, 'save_meta'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
    }

    /**
     * Register the Lookbook custom post type
     */
    public function register_post_type() {
        $labels = array(
            'name'               => 'Lookbook',
            'singular_name'      => 'Lookbook',
            'add_new'            => 'Aggiungi Nuovo',
            'add_new_item'       => 'Aggiungi Nuovo Lookbook',
            'edit_item'          => 'Modifica Lookbook',
            'new_item'           => 'Nuovo Lookbook',
            'view_item'          => 'Visualizza Lookbook',
            'search_items'       => 'Cerca Lookbook',
            'not_found'          => 'Nessun Lookbook trovato',
            'not_found_in_trash' => 'Nessun Lookbook nel cestino',
            'all_items'          => 'Tutti i Lookbook',
            'menu_name'          => 'Lookbook',
        );

        $args = array(
            'labels'              => $labels,
            'public'              => true,
            'has_archive'         => false,
            'publicly_queryable'  => true,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 31,
            'menu_icon'           => 'dashicons-images-alt2',
            'supports'            => array('title', 'thumbnail'),
            'rewrite'             => array('slug' => 'lookbook'),
            'show_in_rest'        => true,
        );

        register_post_type('lookbook', $args);
    }

    /**
     * Add meta boxes for lookbook fields
     */
    public function add_meta_boxes() {
        add_meta_box(
            'lookbook_details',
            'Dettagli Lookbook',
            array($this, 'render_details_meta_box'),
            'lookbook',
            'normal',
            'high'
        );

        add_meta_box(
            'lookbook_gallery',
            'Gallery Immagini',
            array($this, 'render_gallery_meta_box'),
            'lookbook',
            'normal',
            'high'
        );
    }

    /**
     * Render details meta box (year, cover image)
     */
    public function render_details_meta_box($post) {
        wp_nonce_field('lookbook_meta_nonce', 'lookbook_nonce');
        
        $year = get_post_meta($post->ID, '_lookbook_year', true);
        $cover_image = get_post_meta($post->ID, '_lookbook_cover_image', true);
        ?>
        <table class="form-table">
            <tr>
                <th scope="row"><label for="lookbook_year">Anno</label></th>
                <td>
                    <input type="text" 
                           id="lookbook_year" 
                           name="lookbook_year" 
                           value="<?php echo esc_attr($year); ?>" 
                           class="regular-text"
                           placeholder="es. 2025">
                </td>
            </tr>
            <tr>
                <th scope="row"><label>Immagine di Copertina</label></th>
                <td>
                    <input type="hidden" id="lookbook_cover_image" name="lookbook_cover_image" value="<?php echo esc_url($cover_image); ?>">
                    <div id="lookbook-cover-preview" style="margin-bottom: 10px;">
                        <?php if ($cover_image): ?>
                            <img src="<?php echo esc_url($cover_image); ?>" style="max-width: 300px; max-height: 300px; object-fit: cover;">
                        <?php endif; ?>
                    </div>
                    <button type="button" class="button" id="lookbook-upload-cover">
                        <?php echo $cover_image ? 'Cambia Immagine' : 'Carica Immagine'; ?>
                    </button>
                    <?php if ($cover_image): ?>
                        <button type="button" class="button" id="lookbook-remove-cover" style="color: red;">Rimuovi</button>
                    <?php endif; ?>
                    <p class="description">Questa immagine verrà usata come anteprima nella pagina generale dei Lookbook</p>
                </td>
            </tr>
        </table>
        <?php
    }

    /**
     * Render gallery meta box
     */
    public function render_gallery_meta_box($post) {
        $gallery = get_post_meta($post->ID, '_lookbook_gallery', true);
        if (!is_array($gallery)) {
            $gallery = array();
        }
        ?>
        <p class="description">Carica le immagini che verranno mostrate nella pagina singola del Lookbook. Trascina per riordinare.</p>
        
        <div id="lookbook-gallery-container" style="display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0;">
            <?php foreach ($gallery as $i => $img_url): ?>
                <div class="lookbook-gallery-item" style="position: relative; width: 150px; height: 150px; border: 1px solid #ddd; cursor: move;">
                    <img src="<?php echo esc_url($img_url); ?>" style="width: 100%; height: 100%; object-fit: cover;">
                    <input type="hidden" name="lookbook_gallery[]" value="<?php echo esc_url($img_url); ?>">
                    <button type="button" class="lookbook-remove-gallery-image" style="position: absolute; top: 2px; right: 2px; background: red; color: white; border: none; cursor: pointer; padding: 2px 6px; font-size: 11px; line-height: 1;">✕</button>
                </div>
            <?php endforeach; ?>
        </div>
        
        <button type="button" class="button" id="lookbook-add-gallery-images">
            + Aggiungi Immagini
        </button>
        <?php
    }

    /**
     * Save meta data
     */
    public function save_meta($post_id) {
        if (!isset($_POST['lookbook_nonce']) || !wp_verify_nonce($_POST['lookbook_nonce'], 'lookbook_meta_nonce')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // Save year
        if (isset($_POST['lookbook_year'])) {
            update_post_meta($post_id, '_lookbook_year', sanitize_text_field($_POST['lookbook_year']));
        }

        // Save cover image
        if (isset($_POST['lookbook_cover_image'])) {
            update_post_meta($post_id, '_lookbook_cover_image', esc_url_raw($_POST['lookbook_cover_image']));
        }

        // Save gallery
        if (isset($_POST['lookbook_gallery'])) {
            $gallery = array_map('esc_url_raw', $_POST['lookbook_gallery']);
            update_post_meta($post_id, '_lookbook_gallery', $gallery);
        } else {
            update_post_meta($post_id, '_lookbook_gallery', array());
        }
    }

    /**
     * Enqueue scripts for lookbook admin
     */
    public function enqueue_scripts($hook) {
        global $post_type;
        
        if ($post_type !== 'lookbook') {
            return;
        }

        if (!in_array($hook, array('post.php', 'post-new.php'))) {
            return;
        }

        wp_enqueue_media();
        
        wp_add_inline_script('jquery-core', "
            jQuery(document).ready(function($) {
                // Cover image upload
                $('#lookbook-upload-cover').on('click', function(e) {
                    e.preventDefault();
                    var uploader = wp.media({
                        title: 'Seleziona Immagine di Copertina',
                        button: { text: 'Usa come copertina' },
                        multiple: false
                    });
                    uploader.on('select', function() {
                        var attachment = uploader.state().get('selection').first().toJSON();
                        $('#lookbook_cover_image').val(attachment.url);
                        $('#lookbook-cover-preview').html('<img src=\"' + attachment.url + '\" style=\"max-width:300px; max-height:300px; object-fit:cover;\">');
                        $('#lookbook-upload-cover').text('Cambia Immagine');
                        if (!$('#lookbook-remove-cover').length) {
                            $('#lookbook-upload-cover').after(' <button type=\"button\" class=\"button\" id=\"lookbook-remove-cover\" style=\"color:red;\">Rimuovi</button>');
                        }
                    });
                    uploader.open();
                });

                // Remove cover image
                $(document).on('click', '#lookbook-remove-cover', function(e) {
                    e.preventDefault();
                    $('#lookbook_cover_image').val('');
                    $('#lookbook-cover-preview').html('');
                    $('#lookbook-upload-cover').text('Carica Immagine');
                    $(this).remove();
                });

                // Gallery: add images (multiple selection)
                var galleryFrame;
                $('#lookbook-add-gallery-images').on('click', function(e) {
                    e.preventDefault();

                    if (galleryFrame) {
                        galleryFrame.open();
                        return;
                    }

                    galleryFrame = wp.media({
                        title: 'Seleziona Immagini Gallery',
                        button: { text: 'Aggiungi alla Gallery' },
                        multiple: 'add',
                        library: { type: 'image' }
                    });

                    galleryFrame.on('select', function() {
                        var attachments = galleryFrame.state().get('selection').toJSON();
                        attachments.forEach(function(attachment) {
                            var url = attachment.sizes && attachment.sizes.full ? attachment.sizes.full.url : attachment.url;
                            var html = '<div class=\"lookbook-gallery-item\" style=\"position:relative; width:150px; height:150px; border:1px solid #ddd; cursor:move;\">';
                            html += '<img src=\"' + url + '\" style=\"width:100%; height:100%; object-fit:cover;\">';
                            html += '<input type=\"hidden\" name=\"lookbook_gallery[]\" value=\"' + url + '\">';
                            html += '<button type=\"button\" class=\"lookbook-remove-gallery-image\" style=\"position:absolute; top:2px; right:2px; background:red; color:white; border:none; cursor:pointer; padding:2px 6px; font-size:11px; line-height:1;\">✕</button>';
                            html += '</div>';
                            $('#lookbook-gallery-container').append(html);
                        });
                    });

                    galleryFrame.open();
                });

                // Gallery: remove image
                $(document).on('click', '.lookbook-remove-gallery-image', function(e) {
                    e.preventDefault();
                    $(this).closest('.lookbook-gallery-item').remove();
                });

                // Gallery: sortable
                if ($.fn.sortable) {
                    $('#lookbook-gallery-container').sortable({
                        items: '.lookbook-gallery-item',
                        cursor: 'move',
                        opacity: 0.7
                    });
                }
            });
        ");
    }
}
