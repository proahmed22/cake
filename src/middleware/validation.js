export const validation = (schema) => {
    
    return (req, res, next) => {
        const { error } = schema.validate({ ...req.body, ...req.params, ...req.query })
        let errors = []

        if (error) {
            error.details.forEach((err) => {
                errors.push({ massage: err.massage, field: err.path[0] })
            })
            res.json(errors)
        } else {
            next()
        }
    }
}