;(function() {
	'use strict';

	var toast = {
		tpl : [
			'<div id="toast-dialog">',
				'<div class="toast-layer"></div>',
				'<div class="toast-content"><p></p></div>',
			'</div>'
		],
		init: function(text, seconds) {
			toast.render();
			toast.show(text, seconds);
		},
		render: function() {
			if ($('#toast-dialog').length) {
				$('#toast-dialog').show();
				return;
			}
			$('body').append(toast.tpl.join(''));
		},
		show: function(text, seconds) {
			seconds = seconds || 2;
			$('#toast-dialog .toast-content	p').text(text);

			var timer = setTimeout(function() {
				$('#toast-dialog').hide();
				clearTimeout(timer);
			}, seconds * 1000);	
		}
	};

	window.Toast = toast.init;

})();
