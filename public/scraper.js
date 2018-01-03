$(function() {

  $('.modal').modal();


  $(".save").on("click", function(event) {

    var info = {
      title: $(this).parent().attr("data-title"),
      img: $(this).parent().parent().children("img").attr("src"),
      link: $(this).attr("data-link")
    }

    $.post("/save", {info});

    $(this).parent().parent().remove();

  });


  $(".delete").on("click", function(event) {

    var info = {
      title: $(this).attr("data-title")
    }

    $.post("/delete", {info}, function(done) {

      location.reload();
    })

  });



  $(".note").on("click", function(event) {

    var ids = $(this).attr("data-id");
    $("#submitButton").attr("data-id",ids)
    console.log(ids)

    $.get("/articles/" + ids, function(data) {

      if (data.note === undefined) {
        $('#comment-body').val("");
      } 
      else {
        $('#comment-body').val(data.note.body);
      }

    });

  });


  $("#submitButton").on("click", function(event) {

    var ids = $(this).attr("data-id");
    var body = $('#comment-body').val().trim();
    var info = {
      id: ids,
      body: body
    }

    $.post("/save/" + ids, { info }, function(done) {

      Materialize.toast('Note Saved!', 4000);

    });
  });



  $(".delClick").on("click", function(event) {

    var ids = $(this).attr("data-id");

    $.post("/del/" + ids, function(done) {

      location.reload();

    });

  });


  $(".scrape").on("click", function(event) {

    $.get("/scrape", function(done) {

      location.assign("/");

    });

  });


});


   






