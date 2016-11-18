var PixelSelectable = new function(){
       // Init Grid
       this.init = function(){

       };
       // Generate Grid"
       this.generateGrid = function(){
         $.ajax({
            url: "https://demo8747629.mockable.io/pixel",
            cache: false
          })
          .done(function( results ) {
            $.each(results.item , function(i,val){
                var img = $("<img />").attr('src', ''+val.url+'' ).attr("title","")
                .on('load', function() {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        alert('broken image!');
                    } else {
                        $(".box__container").append(img.css({"position":"absolute","left":(val.Xmin * 20 )+"px" ,"top":(val.Ymin * 20 )+"px" , "filter": "grayscale(1)" }));
                    }
                });
            });
            var html  = "";
            for(var i=1  ; i<=50 ; i++){
                html += '<div class="box__row" data-row="'+i+'">';
                for(var j=1 ; j<=50 ; j++){
                //  if( j > results.col_min && j < results.col_max && i > results.lin_min &&  i < results.lin_max ){
                //      html += '<span class="box__item js-item cancelSelect box__item_selected" data-column="'+j+'"></span>';
                //   }else {
                      html += '<span class="box__item js-item" data-column="'+j+'"></span>';
                //    }
                }
                html += "</div>";
            }
            $(".innerContainer").html(html).css({"background":"#d5d5d5"});
            $.each(results.item , function(i,val){
                for(var i = val.Ymin  + 1  ; i <= val.Ymax + 1  ; i++){
                  for(var j = val.Xmin + 1  ; j <= val.Xmax + 1  ; j++){
                      $(".box__row[data-row="+i+"] .box__item[data-column="+j+"]").addClass("cancelSelect").css({"background":"red"});
                  }
                }
            });
          });
       };
};
