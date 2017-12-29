

var noteflag = false;



$(document).ready(function() {

  $(".notesHere").hide();
  $(".delNote").hide();
  $(".bodyHere").hide();

});

$(document).on("click", ".save", function() {

  var title = $(this).attr("data-title");
  var sum = $(this).attr("data-sum");
  var link = $(this).attr("data-link");

  var info = {

    title: title,
    sum: sum,
    link: link
  }

  $.post("/save", {
    info
  }, function(done) {

    console.log(done);

    if (done === "") {

      Materialize.toast('Article Saved!', 4000);

    } else {

      Materialize.toast('ERROR: Article Already Saved in db!', 4000);
      Materialize.toast('Try Another Article!', 4000);

    }
  })

});


$(document).on("click", ".delete", function() {

  var title = $(this).attr("data-title");

  var info = {

    title: title
  }

  $.post("/delete", {
    info
  }, function(done) {

    location.reload();
  })

});


$(document).on("click", ".note", function() {

  var ids = $(this).attr("data-id");


  console.log(ids);

  noteflag = !noteflag

  if (noteflag === false) {


    $("#" + ids).hide();
    return false;

  }


  $.get("/articles/" + ids, function(done) {

    // console.log(done.note.body);
    console.log(done._id);


    if (done.note === undefined || done.note === null) {

      $("#del" + ids).hide();
      $("#print" + ids).hide();
      $("#" + ids).show();
      return false;
    }



    if (noteflag === true) {

      $(".delNote").show();
      $("#" + ids).show();
      $("#del" + ids).show();
      $("#print" + ids).show();
      $("#print" + done._id).empty();
      $("#print" + done._id).prepend(done.note.body)

    }



  });

});


$(".saveNote").on("click", function(event) {


  var ids = $(this).attr("data-id");
  var body = $("#note" + ids).val().trim();

  console.log(ids);
  console.log(body);

  var info = {

    id: ids,
    body: body
  }


  $.post("/save/" + ids, {
    info
  }, function(done) {
    Materialize.toast('Note Saved!', 4000);

    console.log(done.note);
    console.log(done._id);

    $(".delNote").show();
    $(".bodyHere").show();
    $("#print" + done._id).empty();
    $("#print" + done._id).prepend(done.note.body);
    $("#del" + done._id).attr("data-id", done.note._id);
    $(".delNote").show();
    $("#del" + ids).show();


  });
});



$(".delClick").on("click", function(event) {


  var ids = $(this).attr("data-id");



  $.post("/del/" + ids, function(done) {

    location.reload();


  });

});