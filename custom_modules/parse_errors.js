function parse_errors(errors) {
    if(errors.isEmpty()) {
        return;
    }

    let parsed_errors = [];
    errors.array().forEach((error) => {
        parsed_errors.push(error.msg);
    });

    return parsed_errors;
}

module.exports = parse_errors;