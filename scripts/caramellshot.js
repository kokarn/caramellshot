(function($){

	var CARAMELLDANSEN = "J_DV9b0x7v4",
		c;

	$( 'document' ).ready( function(){

		calculateTime();

		$( '#wrapper' ).center();

		$( '#go-button' ).on( 'click', function( event ){
			event.preventDefault();
			go();
		});

		$( '#settings-button' ).on( 'click', function( event ){
			event.preventDefault();
			$( '#settings' ).slideToggle( 'fast' );

		});

		$( 'input[type="number"]' ).on( 'change', function( event ){	
			calculateTime();
		});

		$( '#dafuq-button, #info-close-button' ).on( 'click', function( event ){
			event.preventDefault();
			toggleInfo();
		});

		window.onbeforeunload = function( event ) {
		    return 'You need to keep the window open to be able to run the script.';
		};

		$( window ).on( 'resize', function(){
			$( '#wrapper' ).center();
		});

	});

	function toggleInfo(){
		var infoSelector = '#info-wrapper',
			infoObject = $( infoSelector);

		if( infoObject.css( 'visibility' ) === 'hidden' ) {
			Avgrund.show( infoSelector );
		} else {
			Avgrund.hide( infoSelector);
		}
	}

	function calculateTime(){
		var interval = $( '#inInterval' ).val(),
			probability = $( '#inProbability').val(),
			approximateTime = 0,
			approximateObject = $( '#approximate-time' );

		approximateTime = interval / probability;

		approximateTime = Math.round( approximateTime );

		if( approximateTime === 1 ) {
			approximateTimeText = 'minute';
		} else {
			approximateTimeText = approximateTime + ' minutes';
		}

		approximateObject.text( approximateTimeText );
	}

	function go() {
	    c = new caramellshot();
	    c.init( $( "#inProbability" ).val(), $( "#inInterval" ).val(), "#player" );
	    c.start();
	}

	function caramellshot() {
		var timer,
			probability,
			interval,
			player,
			status = 'stopped';
	}


	caramellshot.prototype = {
		init : function( probability, interval, player ) {
			this.probability = probability;
			this.interval = interval * 60000;
			this.player = $(player);


			var t = this;
			this.player.jPlayer({
				ready: function () {
					$(this).jPlayer("setMedia", {
						//m4a: "/caramelldansen.m4a",
						mp3: "/caramelldansen.mp3"
					});
				},
				ended: function () {
					t.playerEnded();
				},
				swfPath: "/scripts",
				supplied: "mp3",
				preload: "auto"
			});

			/*
			this.player.tubeplayer({
				width: 600, // the width of the player
				height: 450, // the height of the player
				allowFullScreen: "true", // true by default, allow user to go full screen
				initialVideo: CARAMELLDANSEN, // the video that is loaded into the player
				preferredQuality: "hd720",// preferred quality: default, small, medium, large, hd720
				showControls: 0,
				modestbranding: false,
				onPlayerEnded: function() { 
					t.playerEnded(); 
				}
			});
			*/
		},

		start : function() {
			var t = this;
			this.timer = setInterval( function() { t.shot(); }
				, this.interval);
			this.status = 'Running';
			this.setStatus();
			$( '#caramelldansen-image-wrapper' ).hide();
			$( '#caramelldansen-content-wrapper' ).show();
		},

		stop : function() {
			clearInterval(this.timer);
		},

		shot : function() {
			var rand = Math.random();

			if (this.probability > rand) {
				this.takeShot();
			}
		},

		takeShot : function(){
			this.stop();
			this.status = 'Shot!';
			this.setStatus();
			//this.player.tubeplayer( 'play' );
			this.player.jPlayer("play");
			_gaq.push(['_trackEvent', 'Shots', 'Shot', 'Shot taken']);

			$( '#caramelldansen-content-wrapper' ).hide();
			$( '#caramelldansen-image-wrapper' ).show();
		},

		playerEnded : function() {
			this.start();
		},

		setStatus : function() {
			$( 'head title, h1' ).text( this.status );
		}
	}

})(jQuery)