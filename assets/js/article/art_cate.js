$(function() {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 一开始 form-add 不存在，需要用 body 代理
    // 通过代理的形式，为 form-add 表单绑定 sumbit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            // type 属性是jQuery1.8以前的请求方式属性，现在都用 method
            method: 'GET',
            url: '/my/article/cates/' + id,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 使用 layui.form.val() 给表单赋值，需要给表单添加 lay-filter 属性
                form.val('form-edit', res.data)
            }
        })
    })

    // 表单是动态创建出来的，需要使用代理的形式来实现事件的绑定
    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function(e) {
        var id = $(this).attr('data-id')
        console.log(id);
        // 提示用户是否要删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类数据失败！')
                    }
                    layer.msg('删除分类数据成功！')
                    layer.close(index);
                    initArtCateList()
                }
            })
        })
    })
})