$(document).ready(function () {
    // =========================================================
    // =========    Menu Customizer [ HTML ] code   ============
    // =========================================================
    $("#mobile-collapse").click();
    $('#update_contents').click(function () {
        let good_morning = $("#good_morning").val();
        let check_date = $("#check_date").val();
        let dangky = $("#dangky").val();
        let dadangky = $("#dadangky").val();
        // 
        
        let tieude_nhacquahan = $("#tieude_nhacquahan").val();
        let tieude_nhacthanhtoan = $("#tieude_nhacthanhtoan").val();
        let nhacthanhtoan = $("#nhacthanhtoan").val().replace(/\n/g, '|');;
        let nhacquahan = $("#nhacquahan").val().replace(/\n/g, '|');;
        var settings = {
            "url": "/contents",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "chaobuoisang": good_morning,
                "kiemtradate": check_date,
                "dangky": dangky,
                "dadangky": dadangky,
                "tieude_nhacquahan": tieude_nhacquahan,
                "tieude_nhacthanhtoan": tieude_nhacthanhtoan,
                "nhacquahan": nhacquahan,
                "nhacthanhtoan": nhacthanhtoan,
              }),
        };
        $.ajax(settings).done(function (response) {
            try {
                response = JSON.parse(response)
            } catch (error) {

            }
            if (response.code == 200) {
                Swal.fire(
                    'Cập nhật nội dung',
                    'Thành công',
                    'success'
                )
            } else {
                Swal.fire(
                    'Cập nhật nội dung',
                    response.msg,
                    'question'
                )
            }
            console.log(response);
        }).fail(function (response) {
            Swal.fire(
                'Cập nhật nội dung',
                response.toString(),
                'error'
            )
            console.log(response);
        });
    });
    $('#force').click(function () {
        var settings = {
            "url": "/force",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            }
        };
        $.ajax(settings).done(function (response) {
            try {
                response = JSON.parse(response)
            } catch (error) {

            }
            Swal.fire(
                'Kiểm tra nhanh',
                'Thành công',
                'success'
            )
            console.log(response);
        }).fail(function (response) {
            Swal.fire(
                'Gia hạn',
                response.toString(),
                'error'
            )
            console.log(response);
        });
    });
    $('button[name=extend]').click(function () {
        try {
            let username = $(this)[0].getAttribute("target_name");
            let due_input = $(`input[name='due_date'][target_name='${username}']`)[0].value;
            let extend_input = $(`input[name='extend_date'][target_name='${username}']`)[0].value;
            let userid = $(`input[name='userid'][target_name='${username}']`)[0].value;
            var settings = {
                "url": "/update",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "due_date": due_input,
                    "extend_date": extend_input,
                    "userid": userid,
                    "username": username
                }),
            };
            $.ajax(settings).done(function (response) {
                try {
                    response = JSON.parse(response)
                } catch (error) {

                }
                if (response.code == 200) {
                    Swal.fire(
                        'Gia hạn',
                        'Thành công',
                        'success'
                    )
                } else {
                    Swal.fire(
                        'Gia hạn',
                        response.msg,
                        'question'
                    )
                }
                console.log(response);
            }).fail(function (response) {
                Swal.fire(
                    'Gia hạn',
                    response.toString(),
                    'error'
                )
                console.log(response);
            });

        } catch (error) {

        }
    });

    $('input[name=extend_date]').change(function () {
        try {
            let username = $(this)[0].getAttribute("target_name");
            let due_input = $(`input[name='due_date'][target_name='${username}']`)[0];
            let current_data = due_input.getAttribute("current_data");
            let dt = new Date(current_data);
            dt.setDate(dt.getDate() + 30);
            // 
            var new_date = `${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}`
            due_input.value = new_date;
        } catch (error) {

        }
    });
});