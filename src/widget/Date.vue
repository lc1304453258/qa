<template>
	<date-picker :readonly="readonly" :date="starttime" :option="option" style="padding:0px;border:none"></date-picker>
</template>

<script>
var myDatepicker = require('./vue-datepicker.vue');

module.exports = {
	props:[
		"dateValue", "readonly"
	],

	data: function(){
		return{
			starttime: {
		        time: this.dateValue
		    },
		    endtime: {
        		time: ''
      		},		
  			testTime: '',
  			multiTime: '',
  			option: {
		        type: 'day',
		        week: ['一', '二', '三', '四', '五', '六', '日'],
		        month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		        format: 'YYYY-MM-DD',
		        placeholder: '请选择时间',
		        inputStyle: {
//					'display': 'block',
//		          	'width': '100%',
//					'height': '34px',
//					'padding': '6px 12px',
//					'font-size': '14px',
//					'line-height': '1.42857143',
//					'color': '#555',
//					'background-color': '#fff',
//					'background-image': 'none',
//					'border': '1px solid #ccc',
//					'border-radius': '4px',
//					'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075)',
//					'transition': 'border-color ease-in-out .15s,box-shadow ease-in-out .15s'
		        },
		        color: {
		            checked: '#F50057',
		            header: '#3f51b5',
		            headerText: '#fff'
		        },
		        buttons: {
		          ok: '确定',
		          cancel: '取消'
		        },
		        overlayOpacity: 0.5, // 0.5 as default
		        dismissible: true // as true as default
		    },
			timeoption: {
				type: 'min',
		        week: ['一', '二', '三', '四', '五', '六', '日'],
		        month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
				format: 'YYYY-MM-DD'
			},
			multiOption: {
				type: 'multi-day',
		        week: ['一', '二', '三', '四', '五', '六', '日'],
		        month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
				format:"YYYY-MM-DD"
			},
			limit: [
				{
					type: 'weekday',
					available: [1, 2, 3, 4, 5]
				},
				{
					type: 'fromto',
					from: '2016-02-01',
					to: '2016-02-20'
				}
			]
		}
	},

	components: {
	    'date-picker': myDatepicker
	},

	watch:{
		// 'value': function(val){
		// 	// 监听外部对props属性value的变更，并同步到组件内
		// 	starttime.time = val;
		// },

		'starttime.time' : function(val){
			// 组件内对starttime.time变更后向外部发送事件通知
			this.$emit("on-value-change", val);
			this.$emit("input", val);
			console.log('name has been changed:', val );
		},

		dateValue : function(val){
			this.starttime.time = val;
		}
	}
}
</script>