var Grid = new function(){

    // init Grid
    this.init = function(){
          Grid.initSelectable();
          Grid.initEvents();
          Grid.sentRequset();
    };
    // suggesed another zone
    this.suggOtherZone = function(){


            return {
                 "top" : top ,
                 "left" : left
            }
    };
    // init Selectable
    this.initSelectable = function(){
      $( function() {
          $( ".box__container" ).selectable({
              filter: "span",
              classes: {
                "ui-selected": "box__item--active",
                "ui-selectable-helper" : "box-helper",
              },
              cancel : ".cancelSelect,img"
          });
      });
    }
	// this destroy selectable
	this.destroySelectable = function(){
		$( ".box__container" ).selectable( "destroy" );
	};
    // bend Event
    this.initEvents = function(){
      $(document).ready( function() {
      $('.js-empty').on('click', function(e){
          $('.js-item').removeClass('box__item--active ui-selected');
      });
      var html = '';
      var $elements = [];
      $( ".box__container" ).on( "selectablestart", function( event, ui ) {
         html = '';
         $elements = [];
      });
      $( ".box__container" ).on( "selectableselected", function( event, ui ) {
        $elements.push( ui );
            if ( event.ctrlKey ) {
                $( ".box__container" ).selectable( "disable" );
                $(ui.selected).removeClass('box__item--active ui-selected');
            }
      });
      $( ".box__container" ).on( "selectablestop", function( event, ui ) {

        var $parents    = [];
        var parentIndex = [];
        var childIndex  = [];
        var j           = 0;
        var $parent     = $($elements[0].selected).parent();
        var $childs     = $parent.find('.box__item--active');
        var $lastParent = $( $elements[ $elements.length - 1 ].selected ).parent();
        var $lastChilds = $lastParent.find('.box__item--active');
        var h = null  , w = null ;

        $.each( $childs, function(i,val){
              childIndex.push($(val).index());
                w += $(val).width() + 2 ;
        });
        $.each( $elements, function(i, val) {
               if($.inArray($(val.selected).parent().index(), parentIndex) === -1) {
                //  console.log(" (Y) index : " + $(val.selected).parent().index());

                  parentIndex.push($(val.selected).parent().index());
                //  childIndex.push($childs.eq(0).index());
                  $parents.push($(val.selected).parent());
               }
              if($.inArray($childs.eq(0).index(), childIndex) === -1){
                  childIndex.push($childs.eq(0).index())
              }
        });

        /*
        <input type="hidden" name="xminValue" id="xminValue" />
        <input type="hidden" name="xmaxValue" id="xmaxValue" />
        <input type="hidden" name="yminValue" id="yminValue" />
        <input type="hidden" name="ymaxValue" id="ymaxValue" />
        */
        $(".Ymin").html(parentIndex[0]+1);
        $(".Ymax").html(parentIndex[parentIndex.length-1]+1);
        $(".Xmin").html(childIndex[0]+1);
        $(".Xmax").html(childIndex[childIndex.length-1]+1);
        /*****/
        $("#yminValue").val(parentIndex[0]+1);
        $("#ymaxValue").val(parentIndex[parentIndex.length-1]+1);
        $("#xminValue").val(childIndex[0]+1);
        $("#xmaxValue").val(childIndex[childIndex.length-1]+1);

        // html +=  ($parent.index() + 1) + ' , ' +  ($lastParent.index() + 1) + ' ### ';
        // html +=  ($childs.eq(0).index() + 1) + ' , ' + ($lastChilds.eq( $childs.length - 1 ).index() + 1);
        $.each( $parents, function(i,val){
                h += $(val).height();
        });

      /*  var debugHasCancelSelect = false ;
        var hasTime = 0 ;
        var top = 0 ;
        var left = 0 ;
        var firstY = true;
        var firtX  = true;
        var xTime = 0 ;
        var debugHasCancelSelectX = false;
    for(var i = parentIndex[0] +  1   ; i <= parentIndex[parentIndex.length-1] + 1  ; i++){
        debugHasCancelSelect = false ;
      for(var j = childIndex[0]+1  ; j <= childIndex[childIndex.length-1]+1 ; j++){
          if($(".box__row[data-row="+i+"] .box__item[data-column="+j+"]").hasClass("cancelSelect")){
              debugHasCancelSelect = true;
              hasTime++;
              if(firstY){
                    top  = i ;
                    firstY = false;
              }
          }
      }
    }
    for(var j = childIndex[0]+1  ; j <= childIndex[childIndex.length-1]+1 ; j++){
        debugHasCancelSelectX = false ;
        for(var i = parentIndex[0] +  1   ; i <= parentIndex[parentIndex.length-1] + 1  ; i++){
          if($(".box__row[data-row="+i+"] .box__item[data-column="+j+"]").hasClass("cancelSelect")){
              debugHasCancelSelectX = true;
          }
      }
        if(debugHasCancelSelectX == false){
              left =  j ;
              break;
        }
    }*/
    setTimeout(function(){
          $('.overlay').css({
            'left': $childs.eq(0).position().left,
            'top':$childs.eq(0).position().top,
            'width' : w,
            'height' : h
          });
		  Grid.destroySelectable();
			Grid.initSelectable();
 },
 500);


          $(".cols").html(w);
          $(".rows").html(h);
          $(".numberCols").html($parents.length);
          $(".numberRows").html($childs.length);
          $(".totlaPixels").html($parents.length * $childs.length);
          $(".price").html( ( $parents.length * $childs.length ) * 100  + " MAD");
          $('.js-response').html( html );
          if ( event.ctrlKey ) {
                $( ".box__container" ).selectable( "disable" );
                $(ui.selected).removeClass('box__item--active ui-selected');
          }  else {
              $( ".box__container" ).selectable( "enable" );
          }
      });
    });
    };

    this.sentRequset = function(){
        $(".bypixel").on("click" , function(e){
          e.preventDefault();
          var xminVal , xmaxVal , yminVal , ymaxVal ;

          yminVal = $("#yminValue").val();
          ymaxVal = $("#ymaxValue").val();
          xminVal = $("#xminValue").val();
          xmaxVal =$("#xmaxValue").val();
              e.preventDefault();
              $.ajax({
                   url : "/buyPixel" ,
                   cashe : false ,
                   datatype : "json" ,
                   type : "POST" ,
                   data : {
                      ymin : yminVal,
                      ymax : ymaxVal,
                      xmin : xminVal,
                      xmax : xmaxVal
                   }
              }).done(function(result){
                $("#dialog p").html("Status :" + result.status + " ");
                 $( "#dialog" ).dialog();
                  console.log(result);
              })
        });
    };


};
