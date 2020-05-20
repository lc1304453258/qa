module.exports = {
    /**
     * 获取BootstrapDialog插件显示的模态框的数量
     */
    getBootstrapDialogCount: function(){
        return $("div[class*='modal'][class*='bootstrap-dialog']").length;
    },

    /**
     * 获取Modal.vue插件显示的数量
     */
    getActiveModalCount: function(){
        return $("div:visible").children("div.modal").length;
    },

    /**
     * 获取HTML界面模态框可见的总数
     */
    getActiveCount: function(){
        return this.getBootstrapDialogCount() + this.getActiveModalCount();
    },

    fix: function(){
        var activeModalCount = this.getActiveCount();
        if(activeModalCount == 0){
            // 界面已经没有活动的模态框
            document.body.className = document.body.className.replace(/\s?modal-open/, '');
        }else{
            if(document.body.className.indexOf('modal-open') < 0){
                document.body.className += ' modal-open';
            }
        }
    }
}