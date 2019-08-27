jQuery(document).ready(function($) {

		Frederick = Backbone.View.extend({		
			el: 'body',
			events: {
				//'click .portfolio-list div a.project-wrp' : 'renderPortfolio',
				'click .port-control a' 	  : 'renderPortfolio',
				'click a.ta-like-post' 	 	  : 'likePost',
			},
			likePost: function(event){
				event.preventDefault();
				var target = $(event.currentTarget);
	
				if(!target.hasClass('active')){
					$.ajax({
						url : fe_globals.ajaxURL,
						type : 'post',
						data : {
							action : 'ta_like_post',
							content: {
								id : target.attr('data-id')
							}
						},
						beforeSend : function(){
							target.addClass('active');
						},
						error : function(request){
	
						},
						success : function(response){
							if(response.success){
								target.find('span.count').text(response.count);
								createCookie('ta_like_'+target.attr('data-id'),1,365);
							} else {
								target.removeClass('active');
								target.find('span.count').text(response.count);
							}
						}
					});
				}
	
			},
			renderPortfolio: function(event){
				event.preventDefault();
				var target = $(event.currentTarget);
	
				if(target.attr('data-id') && ! target.hasClass('loading')){
					$.ajax({
						url : fe_globals.ajaxURL,
						type : 'post',
						data : {
							action : 'ta_load_portfolio',
							content: {
								id : target.attr('data-id')
							}
						},
						beforeSend : function(){
							target.addClass('loading');
							$('.mask-color-port').fadeIn('300');
						},
						error : function(request){
	
						},
						success : function(response){
							$('.mask-color-port').fadeOut('300');
							var container = $("#portfolio_content .port-content"),
								control   = $("#portfolio_content .port-control");
							target.removeClass('loading');
							if(response.success){
								
								if(!target.hasClass('next') &&  !target.hasClass('prev')){
									$("#portfolio_content").fadeIn('500', function() {
										$.scrollTo("#portfolio_content", 2500, {easing:'easeOutExpo',offset:-$(".sticky-wrapper").height()});
									});
								}
	
								control.find('a.prev').attr('data-id',response.prev_post);
								control.find('a.next').attr('data-id',response.next_post);
								container.html(response.html);
							} else {
								alert('Error');
							}
						}
					});
				}
			}
		});
		new Frederick();

});