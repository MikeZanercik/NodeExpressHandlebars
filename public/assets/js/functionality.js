$(function () {
    $(".devour").on("click", function (event) {
        const id = $(this).data("id");

        //send delete request
        $.ajax("/api/burgers/" + id, {
            type: "DELETE"
        }).then(
            function () {
                console.log("delete id ", id);
                location.reload();
            }
        );
    });

    $(".create-form").on("submit", function (event) {
        event.preventDefault();
        const newBurger ={
           burger: $("#burgers").val().trim()
        } 
            
        // send post request
        $.ajax("/api/burgers", {
            type: "POST",
            data: newBurger
        }).then(
            function () {
                console.log("create new burger");
                location.reload();
            }
        );
    });

});