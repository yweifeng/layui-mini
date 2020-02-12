/**
 * 系统参数管理
 */

$(function() {
    layui.use(['form', 'table'], function () {
        var $ = layui.jquery,
            form = layui.form,
            table = layui.table,
            util = layui.util,
            layuimini = layui.layuimini;

        table.render({
            elem: '#currentTableId',
            url: '/api/table.json',
            toolbar: '#toolbarDemo',
            parseData: function(res){ //res 即为原始返回的数据
                return {
                    "code": res.result?0:-1, //解析接口状态
                    "msg": '', //解析提示文本
                    "count": res.data.page.totalItems, //解析数据长度
                    "data": res.data.content //解析数据列表
                };
            },
            defaultToolbar: ['filter', 'exports'],
            cols: [[
                {type: "checkbox", fixed: "left"},
                {field: 'unid', title: 'ID', sort: true},
                {field: 'globalName', title: '参数名'},
                {field: 'globalValue', title: '参数值', sort: true},
                {
                    field: 'createTime', sort: true, templet: function (d) {
                        return util.toDateString(d.createTime);
                    }, title: '创建时间'
                },
                {title: '操作', templet: '#currentTableBar', fixed: "right", align: "center"}
            ]],
            limits: [10, 15, 20, 25, 50, 100],
            limit: 15,
            page: true
        });

        // 监听搜索操作
        form.on('submit(data-search-btn)', function (data) {
            var result = JSON.stringify(data.field);
            layer.alert(result, {
                title: '最终的搜索信息'
            });

            //执行搜索重载
            table.reload('currentTableId', {
                page: {
                    curr: 1
                }
                , where: {
                    searchParams: result
                }
            }, 'data');

            return false;
        });

        // 监听添加操作
        $(".data-add-btn").on("click", function () {

            var index = layer.open({
                title: '添加',
                type: 2,
                shade: 0.2,
                maxmin:true,
                shadeClose: true,
                area: ['100%', '100%'],
                content: '/page/cfgParam/form',
            });
            $(window).on("resize", function () {
                layer.full(index);
            });

            return false;
        });

        // 监听删除操作
        $(".data-delete-btn").on("click", function () {
            var checkStatus = table.checkStatus('currentTableId')
                , data = checkStatus.data;
            layer.alert(JSON.stringify(data));
        });

        //监听表格复选框选择
        table.on('checkbox(currentTableFilter)', function (obj) {
            console.log(obj)
        });

        table.on('tool(currentTableFilter)', function (obj) {
            var data = obj.data;
            if (obj.event === 'edit') {

                var index = layer.open({
                    title: '编辑用户',
                    type: 2,
                    shade: 0.2,
                    maxmin:true,
                    shadeClose: true,
                    area: ['100%', '100%'],
                    content: '/page/table/edit.html',
                });
                $(window).on("resize", function () {
                    layer.full(index);
                });
                return false;
            } else if (obj.event === 'delete') {
                layer.confirm('真的删除行么', function (index) {
                    obj.del();
                    layer.close(index);
                });
            }
        });
    });
});
