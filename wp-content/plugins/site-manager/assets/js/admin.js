jQuery(document).ready(function ($) {
  // Gestione navigazione sidebar
  $(".hpm-nav-item").on("click", function (e) {
    e.preventDefault();

    var target = $(this).attr("href");

    // Rimuovi active da tutti
    $(".hpm-nav-item").removeClass("active");
    $(".hpm-tab-content").removeClass("active");

    // Aggiungi active al selezionato
    $(this).addClass("active");
    $(target).addClass("active");
  });

  // Upload immagini
  $(".hpm-upload-image").on("click", function (e) {
    e.preventDefault();

    var button = $(this);
    var targetInput = $("#" + button.data("target"));

    var mediaUploader = wp.media({
      title: "Seleziona Immagine",
      button: {
        text: "Usa questa immagine",
      },
      multiple: false,
    });

    mediaUploader.on("select", function () {
      var attachment = mediaUploader.state().get("selection").first().toJSON();
      targetInput.val(attachment.url);

      // Mostra preview
      var preview = targetInput.siblings(".hpm-image-preview");
      if (preview.length === 0) {
        targetInput.after(
          '<div class="hpm-image-preview"><img src="' +
            attachment.url +
            '" style="max-width: 200px;"></div>'
        );
      } else {
        preview.find("img").attr("src", attachment.url);
      }
    });

    mediaUploader.open();
  });

  // Aggiorna menu items quando cambia il numero
  $("#left_menu_count").on("change", function () {
    updateMenuItems("left", $(this).val());
  });

  $("#right_menu_count").on("change", function () {
    updateMenuItems("right", $(this).val());
  });

  function updateMenuItems(side, count) {
    var container = $("#" + side + "-menu-items");
    container.empty();

    for (var i = 1; i <= count; i++) {
      var html =
        '<table class="form-table">' +
        "<tr>" +
        '<th scope="row"><label>Voce ' +
        i +
        " - Testo</label></th>" +
        '<td><input type="text" name="hpm_site_settings[header][' +
        side +
        "_menu][" +
        i +
        '][text]" class="regular-text"></td>' +
        "</tr>" +
        "<tr>" +
        '<th scope="row"><label>Voce ' +
        i +
        " - Link</label></th>" +
        '<td><input type="text" name="hpm_site_settings[header][' +
        side +
        "_menu][" +
        i +
        '][url]" class="regular-text"></td>' +
        "</tr>" +
        "</table>";
      container.append(html);
    }
  }
});
