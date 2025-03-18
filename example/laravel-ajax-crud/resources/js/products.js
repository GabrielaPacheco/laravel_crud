$(document).ready(function () {
    $("#createProduct").click(function () {
        $("#productModal").removeClass("hidden");
        $("#modalTitle").text("Create Product");
        $("#productForm")[0].reset();
        $("#productId").val("");
    });

    $("#closeModal").click(function () {
        $("#productModal").addClass("hidden");
    });

    $("#saveProduct").click(function () {
        let formData = $("#productForm").serialize();
        let productId = $("#productId").val();
        let url = productId ? `/products/${productId}` : "/products";
        let type = productId ? "PUT" : "POST";

        $.ajax({
            url: url,
            type: type,
            data: formData,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
                "X-HTTP-Method-Override": type,
            },
            success: function (response) {
                $("#productModal").addClass("hidden");
                loadProducts();
                $("#productForm")[0].reset();
            },
            error: function (error) {
                console.error("Error:", error);
            },
        });
    });

    $(document).on("click", ".editProduct", function () {
        let productId = $(this).closest("tr").data("id");

        $.ajax({
            url: `/products/${productId}/edit`,
            type: "GET",
            success: function (response) {
                $("#productModal").removeClass("hidden");
                $("#modalTitle").text("Edit Product");
                $("#productId").val(response.id);
                $("#name").val(response.name);
                $("#description").val(response.description);
                $("#price").val(response.price);
            },
            error: function (error) {
                console.error("Error:", error);
            },
        });
    });

    $(document).on("click", ".deleteProduct", function () {
        if (confirm("Are you sure you want to delete this product?")) {
            let productId = $(this).closest("tr").data("id");

            $.ajax({
                url: `/products/${productId}`,
                type: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                    "X-HTTP-Method-Override": "DELETE",
                },
                success: function (response) {
                    loadProducts();
                },
                error: function (error) {
                    console.error("Error:", error);
                },
            });
        }
    });

    function loadProducts() {
        $.ajax({
            url: "/",
            type: "GET",
            success: function (response) {
                $("#productTableBody").html(
                    $(response).find("#productTableBody").html()
                );
            },
            error: function (error) {
                console.error("Error:", error);
            },
        });
    }
});
