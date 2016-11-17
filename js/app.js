PixelSelectable.generateGrid();
Grid.init();
$("#selectImageVisible").on("change",function(e){

      if($(this).val() == "0")
      {
          $("img").addClass("hidden");
      }else{
          $("img").removeClass("hidden");
      }

});
