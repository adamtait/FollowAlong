/* Author: Adam Tait
*/


function generator(){
   var last = 0;
   return function(){
      last += Math.floor( Math.random() * 10 ) % 3;
      return last;
   }
}

function play(){

   var fa = new FollowAlong( $('.followalong p:first').html(), generator(), $('.followalong p:first') );

   var audio = document.createElement('audio');
   audio.setAttribute('src', 'mu/mangotree.mp3');
   //audioElem.currentTime = 30;
   audio.play();

   audio.addEventListener('timeupdate', function(){
 
      // Whereabouts are we in the track
      var secs = audio.currentTime;

      if( secs >= fa.endTime() ){
         fa.next();
      }
 
   }, false);
   
}



function FollowAlong( words, generator, selector ){
   this.words = words;
   this.selector = selector;
   this.timing = loadTiming( words, generator, selector );

   this.reset = function(){ this.timing = loadTiming( words, generator ); };
   this.next = function(){
                  var current = this.timing.shift();
                  
                  if( this.timing.length > 0 ){
                     var next = this.timing[0];
                     var html = this.selector.html();

                     var indexCurrentStart = html.indexOf( '<span class="highlight">' );
                     var indexCurrentEnd = indexCurrentStart + current.chars.length + 31;
                     var indexNextStart = html.indexOf( next.chars, indexCurrentEnd );
                     var indexNextEnd = indexNextStart + next.chars.length;
                     //html.replace( '<span class="highlight">', '' ).replace( '</span>', '' );

                     var stringHead = html.substr( 0, indexCurrentStart );
                     var stringInBetween = html.substr( indexCurrentEnd, indexNextStart - indexCurrentEnd );
                     var stringTail = html.substr( indexNextEnd , html.length - indexNextEnd );

                     var result =   stringHead + 
                                    current.chars +
                                    stringInBetween +
                                    '<span class="highlight">' + next.chars + '</span>' + 
                                    stringTail;

                     this.selector.html( result );
                  }
                  else {
                     //
                     var html = this.selector.html();
                     this.selector.html( html.replace( '<span class="highlight">', '' ).replace( '</span>', '' ) );
                  }
                     
               };
   this.endTime = function(){ 
                     if( this.timing.length > 0 )  return this.timing[0].endTime;
                     else return 99999999999999999;
                     };

   function loadTiming( words, nextStopTime, context ){

      var wordList = words.split(" ");
      var objList = new Array();

      for( var i=0; i < wordList.length; i++ )
         objList.push( new Word( nextStopTime(), wordList[i], context ) );

      // highlight first word
      var html = context.html();
      var start = html.indexOf( wordList[0] )

      context.html(  html.substr( 0, start ) + 
                     '<span class="highlight">' + wordList[0] + '</span>' + 
                     html.substr( start + wordList[0].length, html.length )
                     );

      return objList;
   }

}

function Word( endTime, word, context ){
   this.endTime = endTime;
   this.chars = word;
   this.context = context;
   this.highlighted = false;

   this.toggle = function(){
      if( this.highlighted ){
         var word = this.chars;
         this.context.find('span').each( function(){
            if( $(this).html() === word ){
               $(this).after( word );
               $(this).remove();
            }
         });
      }
      else {
         // add span highlighting
      }
   };

}















