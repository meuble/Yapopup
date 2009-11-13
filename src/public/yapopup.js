var Yapopup = Class.create({
		initialize: function() {
			var defaults = {
				container: document.getRootElement(),
				opacity: 0.5,
				overlay: true,
				overlayId: 'yapopup_overlay',
				containerId: 'yapopup_container',
				contentContainerId: 'yapopup_content',
				content: '',
				contentId: 'yapopup_body',
				title: '',
				titleId: 'title_container_id',
				titleHtml: '<h2 class="dialog_title" id="title_container_id"></h2>',
				buttonContainerId: "yapopup_button_container",
				okCallback: function() { return true; },
				cancelCallback: function() { return true; },
				okButton: true,
				okButtonHtml: '<input id="yapopup_ok_button" class="inputsubmit" type="button" name="ok" value="OK" />',
				okButtonId: 'yapopup_ok_button',
				cancelButton: true,
				cancelButtonHtml: '<input id="yapopup_cancel_button" class="inputsubmit inputaux" type="button" name="cancel" value="Annuler" />',
				cancelButtonId: 'yapopup_cancel_button',
				html: '<div id="yapopup_container" class="pop_container_advanced" style="display:none;opacity:0;">\
					<div class="pop_content" id="yapopup_content">\
						<div class="dialog_content">\
							<div id="yapopup_body" class="dialog_body">\
							</div>\
							<div class="dialog_buttons" id="yapopup_button_container">\
							</div>\
						</div>\
					</div>\
				</div>'
				
			};
			this.options = extend_instance(defaults, arguments[0] || { });
			this.inited = false;

			this.init();
		},
		
		init: function() {
			if (this.inited) {
				return true;
			} else {
				this.inited = true;
			}
			
			this.showOverlay();
			
			var container = document.createElement('div');
			container.setInnerXHTML(this.options.html);
			document.getRootElement().insertBefore(container, document.getRootElement().getFirstChild());
			
			this.container = $(this.options.containerId);
			this.container.setStyle({zIndex: '101', position: 'absolute'});
			
			this.buildTitle();
			this.buildButtons();
			this.setContent(this.options.content);
			
			this.show();
		},
		
		buildButtons: function() {
			if (this.options.cancelButton) {
				var container = document.createElement('span');
				container.setInnerXHTML('<span>' + this.options.cancelButtonHtml + '</span>');
				$(this.options.buttonContainerId).insertBefore(container, $(this.options.buttonContainerId).getFirstChild());

				Event.observe($(this.options.cancelButtonId), 'click', this.cancel.bind(this));
			}
			
			if (this.options.okButton) {
				var container = document.createElement('span');
				container.setInnerXHTML('<span>' + this.options.okButtonHtml + '</span>');
				$(this.options.buttonContainerId).insertBefore(container, $(this.options.buttonContainerId).getFirstChild());

				Event.observe($(this.options.okButtonId), 'click', this.ok.bind(this));
			}
		},
					
		ok: function() {
			this.close(this.options.okCallback);
		},
		
		cancel: function() {
			this.close(this.options.cancelCallback);
		},
		
		setContent: function(content) {
			if (isString(content)) {
				$(this.options.contentId).setInnerXHTML('<div>' + content + '</div>');
			} else {
				var elem = content.cloneNode(true);
				$(this.options.contentId).appendChild(elem);
			}
		},
		
		buildTitle: function() {
			if (!this.options.title) return;
			var container = document.createElement('div');
			container.setInnerXHTML(this.options.titleHtml);
			$(this.options.contentContainerId).insertBefore(container, $(this.options.contentContainerId).getFirstChild());			
			this.setTitle(this.options.title);
		},
		
		setTitle: function(title) {
			$(this.options.titleId).setInnerXHTML('<span>' + title + '</span>');
		},
		
		close: function(callback) {
			if (callback(this)) {
				Animation(this.container).duration(200).to('opacity', 0).hide().go();
	
				this.hideOverlay();
				this.container.remove
			}
		},
		
		show: function() {
			var top = Position.cumulativeOffset(document.getRootElement())[1] + document.getRootElement().getScrollTop();
			
			Animation(this.container).duration(0).to('opacity', 0).show().go();
			
			var left = (document.getRootElement().getOffsetWidth()) / 2 - (this.container.getOffsetWidth() / 2);
							
			this.container.setStyle({
				'top':	Math.floor(top) + 'px',
				'left':	Math.floor(left) + 'px'
			}).show();
			
			Animation(this.container).duration(200).to('opacity', 1).show().go();			
			this.padRootElement();
		},
		
		padRootElement: function() {
			if (document.getRootElement().getClientHeight() < this.container.getClientHeight() ) {
				var container = document.createElement('div');
				container.setInnerXHTML('<span></span>');
				var dist = this.container.getClientHeight() - document.getRootElement().getClientHeight();
				container.setStyle({height: dist + this.container.getAbsoluteTop() + 'px', display: 'block'});
				document.getRootElement().appendChild(container);
			}
		},
		
		skipOverlay: function() {
			return this.options.overlay == false || this.options.opacity === null
		},
		
		showOverlay: function() {
			if (this.skipOverlay()) return;
			if ($(this.options.overlayId) == null) {
				var overlay = document.createElement('div');
				overlay.setId(this.options.overlayId);
				document.getRootElement().insertBefore(overlay, document.getRootElement().getFirstChild());
			}
			$(this.options.overlayId).setStyle({position: 'fixed', 
				top: '0px',
			  left: '0px',
			  height: '100%',
			  width: '100%',
				backgroundColor: '#000',
				zIndex: '100',
				opacity: 0
			});
			Animation($(this.options.overlayId)).duration(200).to('opacity', this.options.opacity).show().go();
			return false;
		},
	  
		hideOverlay: function() {
			if (this.skipOverlay()) return;
			
			Animation($(this.options.overlayId)).duration(200).to('opacity', 0).hide().go();

			return false;
		}
});