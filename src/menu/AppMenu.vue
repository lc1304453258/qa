<template>
    <div class="container-fluid">
        <nav class="navbar navbar-fixed-top navbar-light bg-faded header">
            <a class="navbar-brand"
               href="#/login">
                <span data-v-495a4fd3="" class="fa fa-arrow-circle-o-left back-icon"></span>
                退出
            </a>
        </nav>

        <div class="row">
            <div v-for="(showMenu, index) in showMenus"
                 class="col-4 col-sm-3 col-md-3 col-lg-2 col-xl-2 menu-col">
                <div class="menu-item"
                     :class="getBg(index)"
                     @click="clickMenu(showMenu, index)">
                    <div class="menu-icon">
                        <span :class="showMenu.icon"></span>
                    </div>
                    <div class="menu-text">
                        {{showMenu.name}}
                    </div>
                </div>

            </div>
        </div>

        <hr>

        <div class="footer">
            <div class="small text-center"
                 style="color:gray">
                Copyright © 2011-2018 上海联物信息科技有限公司 www.leanwo.com All Rights Reserved
            </div>
            <span class="glyphicon glyphicon-ok"></span>
        </div>

    </div>
</template>
<script>
var Common = require("../common/Common.js");
var CustomerWindowResource = require("../common/CustomerWindowResource.js");

module.exports = {
    data: function () {
        return {
            showMenus: [],
            num: 0,
        }
    },

    components: {
        Common
    },

    methods: {
        logout: function () {
            window.localStorage.clear();
            document.cookie = "account = '';token = ''";
            history.back();
        },
        changeNum: function () {
            this.num++;
        },
        changeStatus: function () {
            this.flag = this.num % 2;
        },
        initMenu: function () {
            var _self = this;
            $.ajax({
                url: Common.getApiURL('roleAppMenuResource'),
                type: "get",
                dataType: "json",
                data: {
                    moduleId: "WMS"
                    // moduleId1 : 294797,
                },
                beforeSend: function (request) {
                    Common.addTokenToRequest(request);
                },
                success: function (data) {
                    if (data != undefined) {
                        var tempData = [];
                        data.forEach(function (item) {
                            if (item.no.substr(0, 2) == "06") {
                                tempData.push(item);
                            }
                        });
                        tempData.sort(function (a, b) {
                            return a.sortNo - b.sortNo;
                        })
                        _self.showMenus = tempData;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Common.processException(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },
        clickMenu: function (showMenu) {
            var _self = this;
            var nodeType = showMenu.menuNodeType;
            if (nodeType == undefined || nodeType == 'NONE' || nodeType == 'Branch') {
                return "#";
            } else if (nodeType == 'Customer') {
                CustomerWindowResource.uniqueByNo(showMenu.customerWindowNo).then(successData => {
                    if (successData != null) {
                        _self.$router.push({
                            path: successData.routeUrl
                        });
                    }
                }, errorData => {
                    Common.processException(errorData);
                });
            }
        },
        /**
         * 获取背景颜色
         * @param {Object} index
         */
        getBgImage: function (index) {
            var typeNum = index % 5;
            switch (typeNum) {
                case 0:
                    return "../../static-wms-app/image/primary.png";
                case 1:
                    return "../../static-wms-app/image/info.png";
                case 2:
                    return "../../static-wms-app/image/success.png";
                case 3:
                    return "../../static-wms-app/image/warning.png";
                case 4:
                    return "../../static-wms-app/image/danger.png";
                default:
                    return "../../static-wms-app/image/primary.png";
            }
        },

        getBg: function (index) {
            var typeNum = index % 5;
            switch (typeNum) {
                case 0:
                    return "bg-primary";
                case 1:
                    return "bg-info";
                case 2:
                    return "bg-success";
                case 3:
                    return "bg-warning";
                case 4:
                    return "bg-danger";
                default:
                    return "bg-primary";
            }
        }
    },

    mounted: function () {
        this.initMenu();
    },

    watch: {
        "num": {
            handler: function (to, from) {
                this.changeStatus();
            },
            deep: true
        },

    }
}


</script>

<style scoped>
.header {
    margin-left: -29px;
    margin-right: -29px;
    padding-left: 29px;
}

.header-img {
    width: 26px;
    height: 26px;
}

@media screen and (max-width: 576px) {
    .menu-col {
        padding: 0px;
    }
}

@media screen and (min-width: 576px) {
    .menu-col {
        padding: 5px;
    }
}

.menu-item {
    margin: 5px;
    border-radius: 10px;
}

.menu-icon {
    color: white;
    text-align: center;
    font-size: 2em;
    padding: 0.5em 0px 0px 0px;
}

.menu-text {
    color: white;
    text-align: center;
    font-size: 1em;
    padding: 0.5em 0em 0.5em 0em;
}

.container-fluid {
    overflow-x: hidden;
}
</style>