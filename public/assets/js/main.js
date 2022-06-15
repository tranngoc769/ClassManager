$(document).ready(function() {
    console.log("ready");
    // $("#mobile-collapse").click();
    // User
    $('#add_user').click(function() {
        let is_lead = $("#is_lead").val();
        let tele_id = $("#tele_id").val();
        let tele_user = $("#tele_user").val();
        let address = $("#address").val();
        let social = $("#social").val();
        let phone = $("#phone").val();
        let thi_salary = $("#thi_salary").val();
        let day_salary = $("#day_salary").val();
        let dv_salary = $("#dv_salary").val();

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
                "thi_salary": thi_salary,
                "day_salary": day_salary,
                "dv_salary": dv_salary,
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
    $('#update_user').click(function() {
        let id = $("#id").val();
        let is_lead = $("#is_lead").val();
        let tele_id = $("#tele_id").val();
        let tele_user = $("#tele_user").val();
        let address = $("#address").val();
        let social = $("#social").val();
        let phone = $("#phone").val();
        let thi_salary = $("#thi_salary").val();
        let day_salary = $("#day_salary").val();
        let dv_salary = $("#dv_salary").val();
        let full_name = $("#full_name").val();
        var settings = {
            "url": "/users/update",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "is_lead": is_lead,
                "id": id,
                "thi_salary": thi_salary,
                "day_salary": day_salary,
                "dv_salary": dv_salary,
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
    // Class
    $('#add_class').click(function() {
        let class_code = $("#class_code").val();
        let class_name = $("#class_name").val();
        let address = $("#address").val();
        let min_price = $("#min_price").val();
        let term_price = $("#term_price").val();
        let debit = $("#debit").val();
        let other_price = $("#other_price").val();
        var settings = {
            "url": "/classes/add",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "class_code": class_code,
                "class_name": class_name,
                "address": address,
                "min_price": min_price,
                "term_price": term_price,
                "debit": debit,
                "other_price": other_price,
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
    $('#edit_class').click(function() {
        let id = $("#id").val();
        let class_code = $("#class_code").val();
        let class_name = $("#class_name").val();
        let address = $("#address").val();
        let min_price = $("#min_price").val();
        let term_price = $("#term_price").val();
        let debit = $("#debit").val();
        let other_price = $("#other_price").val();
        var settings = {
            "url": "/classes/update",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "class_code": class_code,
                "id": id,
                "class_name": class_name,
                "address": address,
                "min_price": min_price,
                "term_price": term_price,
                "debit": debit,
                "other_price": other_price,
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
    // Group
    $('#add_group').click(function() {
        let leader = $("#leader").val();
        let group_name = $("#group_name").val();
        let group_code = $("#group_code").val();
        var settings = {
            "url": "/groups/add",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "leader": leader,
                "group_code": group_code,
                "group_name": group_name
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
    $('#edit_group').click(function() {
        let id = $("#id").val();
        let leader = $("#leader").val();
        let group_name = $("#group_name").val();
        let group_code = $("#group_code").val();
        var settings = {
            "url": "/groups/update",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "id": id,
                "group_code": group_code,
                "group_name": group_name,
                "leader": leader
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

    // Group
    $('#add_member').click(function() {
        let id = $("#id").val();
        let members = $("#members").val()
        var settings = {
            "url": "/groups/add-members",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "id": id,
                "members": members
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
                setTimeout(function() {
                    window.location.reload();
                }, 3000)
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

    $('#filter_salary').click(function() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        let obj = Object.fromEntries(urlSearchParams.entries());
        obj.from = $("#from").val()
        obj.to = $("#to").val()
        window.location.replace(window.location.pathname + "?" + $.param(obj))
    });
    $(document).on('click', 'span[name=is_center_paid]', function() {
        try {
            var item = $(this);
            let hid = $(this)[0].getAttribute("h_id");
            let is_paid = $(this)[0].getAttribute("is_paid");
            console.log(hid)
            console.log(is_paid)
            if (is_paid * 1 == 1) {
                return;
            }
            Swal.fire({
                title: 'Bạn có chắc chứ?',
                text: "Xác nhận đã nhận thanh toán từ trung tâm!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận!'
            }).then((result) => {
                if (result.isConfirmed) {
                    var settings = {
                        "url": "/groups/paid",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                            "is_center_paid": 1,
                            'id': hid
                        }),
                    };
                    $.ajax(settings).done(function(response) {
                        try {
                            response = JSON.parse(response)
                        } catch (error) {

                        }
                        if (response.code == 200) {
                            item.parent().html('<span class="badge badge-pill badge-success">Đã thanh toán</span>')
                        } else {
                            Swal.fire(
                                'Thất bại',
                                response.msg,
                                'question'
                            )
                        }
                        console.log(response);
                    }).fail(function(response) {
                        Swal.fire(
                            'Lỗi',
                            response.toString(),
                            'error'
                        )
                        console.log(response);
                    });
                }
            })

        } catch (error) {

        }
    });
    $(document).on('click', 'span[name=is_user_paid]', function() {
        try {
            var item = $(this);
            let hid = $(this)[0].getAttribute("h_id");
            let is_paid = $(this)[0].getAttribute("is_paid");
            console.log(hid)
            console.log(is_paid)
            if (is_paid * 1 == 1) {
                return;
            }
            Swal.fire({
                title: 'Bạn có chắc chứ?',
                text: "Xác nhận đã nhận thanh toán từ trung tâm!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận!'
            }).then((result) => {
                if (result.isConfirmed) {
                    var settings = {
                        "url": "/groups/paid",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                            "is_user_paid": 1,
                            'id': hid
                        }),
                    };
                    $.ajax(settings).done(function(response) {
                        try {
                            response = JSON.parse(response)
                        } catch (error) {

                        }
                        if (response.code == 200) {
                            item.parent().html('<span class="badge badge-pill badge-success">Đã thanh toán</span>')
                        } else {
                            Swal.fire(
                                'Thất bại',
                                response.msg,
                                'question'
                            )
                        }
                        console.log(response);
                    }).fail(function(response) {
                        Swal.fire(
                            'Lỗi',
                            response.toString(),
                            'error'
                        )
                        console.log(response);
                    });
                }
            })

        } catch (error) {

        }
    });
});