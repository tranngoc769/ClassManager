$(document).ready(function() {
    console.log("ready");
    $("#mobile-collapse").click();
    $('#add_user').click(function() {
        let is_lead = $("#is_lead").val();
        let tele_id = $("#tele_id").val();
        let tele_user = $("#tele_user").val();
        let address = $("#address").val();
        let social = $("#social").val();
        let phone = $("#phone").val();
        let full_name = $("#full_name").val();
        var settings = {
            "url": "/users/add",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "is_lead": is_lead,
                "tele_id": tele_id,
                "address": address,
                "tele_user": tele_user,
                "social": social,
                "phone": phone,
                "full_name": full_name
            }),
        };
        $.ajax(settings).done(function(response) {
            try {
                response = JSON.parse(response)
            } catch (error) {

            }
            if (response.code == 200) {
                Swal.fire(
                    'Thành công',
                    'Thành công',
                    'success'
                )
            } else {
                Swal.fire(
                    'Không thành công',
                    response.msg,
                    'question'
                )
            }
            console.log(response);
        }).fail(function(response) {
            Swal.fire(
                'Không thành công',
                response.toString(),
                'error'
            )
            console.log(response);
        });
    });
    $('#force').click(function() {
        var settings = {
            "url": "/force",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            }
        };
        $.ajax(settings).done(function(response) {
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
        }).fail(function(response) {
            Swal.fire(
                'Gia hạn',
                response.toString(),
                'error'
            )
            console.log(response);
        });
    });
    $('button[name=extend]').click(function() {
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
            $.ajax(settings).done(function(response) {
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
            }).fail(function(response) {
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
    $('input[name=extend_date]').change(function() {
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