/**
 * Payment Page — Coupon & Interactions
 */
(function ($) {
  "use strict";

  $(document).ready(function () {
    // Toggle coupon form
    $(".hpm-coupon-toggle").on("click", function () {
      $("#hpm-coupon-form").toggleClass("active");
      $("#hpm-coupon-code").focus();
    });

    // Apply coupon
    $("#hpm-apply-coupon").on("click", function () {
      applyCode();
    });

    // Apply coupon on Enter
    $("#hpm-coupon-code").on("keypress", function (e) {
      if (e.which === 13) {
        e.preventDefault();
        applyCode();
      }
    });

    function applyCode() {
      var code = $("#hpm-coupon-code").val().trim();
      var $msg = $("#hpm-coupon-message");
      var $btn = $("#hpm-apply-coupon");

      if (!code) {
        showMessage("Please enter a coupon code.", "error");
        return;
      }

      // Get order ID from URL
      var urlParts = window.location.pathname.split("/");
      var orderId = 0;
      for (var i = 0; i < urlParts.length; i++) {
        if (urlParts[i] === "order-pay" && urlParts[i + 1]) {
          orderId = parseInt(urlParts[i + 1]);
          break;
        }
      }

      if (!orderId) {
        showMessage("Could not identify order.", "error");
        return;
      }

      $btn.prop("disabled", true).text("Applying...");

      $.ajax({
        url: hpmPayment.ajaxurl,
        type: "POST",
        data: {
          action: "apply_coupon_order_pay",
          nonce: hpmPayment.nonce,
          coupon_code: code,
          order_id: orderId,
        },
        success: function (response) {
          if (response.success) {
            showMessage(
              response.data.message + " New total: " + response.data.new_total,
              "success",
            );
            // Reload page to reflect new total
            setTimeout(function () {
              window.location.reload();
            }, 1500);
          } else {
            showMessage(response.data.message, "error");
          }
        },
        error: function () {
          showMessage("Something went wrong. Please try again.", "error");
        },
        complete: function () {
          $btn.prop("disabled", false).text("Apply");
        },
      });
    }

    function showMessage(text, type) {
      var $msg = $("#hpm-coupon-message");
      $msg.text(text).removeClass("success error").addClass(type).fadeIn();
    }
  });
})(jQuery);
