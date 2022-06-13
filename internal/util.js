module.exports = {
    validated_parameter: (array, data) => {
        let status = true;
        let err = [];
        array.forEach(element => {
            if (data[element] == null != data.element == undefined || data[element] == "") {
                err.push(element)
            }
        });
        if (err.length != 0) {
            return [false, err.join(",")];
        }
        return [true, null]
    }
}