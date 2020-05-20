<template>
	<nav>
        <ul class="pagination" v-if="pagination.last_page > 0" :class="sizeClass">
            <li v-if="showPrevious()" class="page-item" :class="{ 'disabled' : pagination.current_page <= 1 }">
                <a href="#" class="page-link" v-if="pagination.current_page <= 1 " :aria-label="config.ariaPrevioius" @click.prevent="changePage(pagination.current_page - 1)">
	                <span aria-hidden="true">{{ config.previousText }}</span>
	            </a>
                <a href="#" class="page-link" v-if="pagination.current_page > 1 " :aria-label="config.ariaPrevioius" @click.prevent="changePage(pagination.current_page - 1)">
                    <span aria-hidden="true">{{ config.previousText }}</span>
                </a>
            </li>

            <li v-for="num in array" class="page-item" :class="{ 'active': num === pagination.current_page }" >
                <a href="#" class="page-link" style="z-index:0" @click.prevent="changePage(num)">{{ num }}</a>
            </li>

            <li v-if="showNext()" class="page-item" :class="{ 'disabled' : pagination.current_page === pagination.last_page || pagination.last_page === 0 }">
                
                
                <a href="#" class="page-link" v-if="pagination.current_page < pagination.last_page" :aria-label="config.ariaNext" @click.prevent="changePage(pagination.current_page + 1)">
                    <span aria-hidden="true">{{ config.nextText }}</span>
                </a>
                <a href="#" class="page-link" v-if="pagination.current_page >= pagination.last_page" :aria-label="config.ariaNext" @click.prevent="changePage(pagination.current_page + 1)">
                    <span aria-hidden="true">{{ config.nextText }}</span>
                </a>
            </li>
        </ul>
    </nav>

</template>

<script>
	module.exports = {
		props: ["pagination", "callback", "options", "size"],

	    computed: {
	        array: function () {
	            if (this.pagination.last_page <= 0) {
	                return [];
	            }

	            // let from = this.pagination.current_page - this.config.offset;
	            let from = this.pagination.current_page - 1
	            if (from < 1) {
	                from = 1;
	            }

	            // let to = from + (this.config.offset * 2);
	            let to = from + 3;
	            if (to >= this.pagination.last_page) {
	                to = this.pagination.last_page;
	            }

	            let arr = [];
	            while (from <=to) {
	                arr.push(from);
	                from++;
	            }

	            return arr;
	        },
	        config: function () {
	            return Object.assign({
	                offset: 3,
	                ariaPrevious: 'Previous',
	                ariaNext: 'Next',
	                previousText: '«',
	                nextText: '»',
	                alwaysShowPrevNext: false
	            }, this.options);
	        },
	        sizeClass: function () {
	            if (this.size === 'large') {
	                return 'pagination-lg';
	            } else if(this.size === 'small') {
	                return 'pagination-sm';
	            } else {
	                return '';
	            }
	        }
	    },

	    watch: {
	        'pagination.per_page' (newVal, oldVal) {
	            if (+newVal !== +oldVal) {
	                this.callback();
	            }
	        }
	    },

	    methods: {
	        showPrevious: function () {
	            return this.config.alwaysShowPrevNext || this.pagination.current_page > 1;
	        },
	        showNext: function () {
	            return this.config.alwaysShowPrevNext || this.pagination.current_page < this.pagination.last_page;
	        },
	        changePage: function (page) {
	            if (this.pagination.current_page === page) {
	                return;
	            }
	            this.$set(this.pagination, 'current_page', page);
	            this.callback();
	        }
	    }
	}

</script>