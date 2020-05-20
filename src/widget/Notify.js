var UUID = require("../common/Uuid.js");
	
module.exports = {
    /**
	 * 显示消息
	 * @param {title} 标题
	 * @param {content} 内容
	 * @param {autoClose} 是否自动关闭
	 * author: 杨志杰
	 * version: 1.0
	 */
    info : function(title, content, autoClose){
        return this.createModal(title, content, 'primary', autoClose);
    },


    /**
	 * 显示成功信息
	 * @param {title} 标题
	 * @param {content} 内容
	 * @param {autoClose} 是否自动关闭
	 * author: 杨志杰
	 * version: 1.0
	 */
    success : function(title, content, autoClose){
        return this.createModal(title, content, 'success', autoClose);
    },
    
    /**
	 * 显示错误信息
	 * @param {title} 标题
	 * @param {content} 内容
	 * @param {autoClose} 是否自动关闭
	 * author: 杨志杰
	 * version: 1.0
	 */
    error : function(title, content, autoClose){
        return this.createModal(title, content, 'danger', autoClose);
    },
    
   	/**
   	 * 创建模态框
   	 * @param {Object} title 标题
   	 * @param {Object} content 内容
   	 * @param {Object} className 颜色类
   	 * @param {Object} uuid 唯一的id
   	 * @param {Object} autoClose 自动关闭
   	 */
    createModal: function(title, content, className, autoClose){
    	var uuid = UUID.createUUID();
		// 动态创建一个div
		var html = this.createHtml(title, content, className, uuid);
		
		// 获取原先的焦点元素Id
		var activeElementId = undefined;		
		if(document.activeElement){
			activeElementId = document.activeElement.id;
		}
		
		$('#mainDiv').append(html);

		// 记录原先的焦点元素Id
		if(activeElementId){
			$('#' + uuid).data('activeElementId', activeElementId);
		}
		
		// 调用modal组件
		$('#' + uuid).modal({
			keyboard: true,
			backdrop: false,
		});
		
		
		// $('#' + uuid).modal('show');
		
		
		
		$('#' + uuid).on('hidden.bs.modal', function (event) {		
			// 获取原先的焦点元素Id	
			var lastActiveElementId = $('#' + uuid).data("activeElementId");
				
			$(this).remove();
			
			// 恢复原先的焦点元素Id	
			if(lastActiveElementId){
				$("#" + lastActiveElementId)[0].focus();
			}
		});
		
		if(autoClose){
			setTimeout(function(){				
				$('#' + uuid).modal('hide');
			}, 5000);
		}
		
		return uuid;
    },
    
    /**
     * 创建模态框HTML
     * @param {Object} title 标题
   	 * @param {Object} className 颜色类
     * @param {Object} content 内容
     * @param {Object} uuid 唯一的id
     */
    createHtml: function(title, content, className, uuid){
    	var html = '<div class="modal fade" id="' + uuid + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-animation="false">';
    	html += '<div class="modal-dialog" role="document">';
    	html += '<div class="modal-content">';
		html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
		html += '<span aria-hidden="true">&times;</span>';
        html += '<span class="sr-only">Close</span>';
        html += '</button>';
        html += '<h4 class="modal-title" id="myModalLabel">' + title + '</h4>';
		html += '</div>';
		html += '<div class="modal-body">';
		html += content;
		html += '</div>';
		html += '<div class="modal-footer">';
		html += '<button type="button" class="btn btn-' + className + '" data-dismiss="modal">关闭</button>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		return html;
    }
}