exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name must be between 3 to 32 characters')
        .isLength({
            min: 3,
            max: 32
        })
        .notEmpty()
        .matches(/^[a-z0-9]+$/i)
        .withMessage('Name must be alpha Numeric')

    req.check('email', 'Email must be between 3 to 32 characters').notEmpty()
        .matches(/[a-zA-Z0-9]+.+\@.+\..+/)
        // .matches(/^(?=[^@][A-Za-z])([a-zA-Z0-9])(([a-zA-Z0-9])([._-])?([a-zA-Z0-9]))*@(([a-zA-Z0-9-])+(.))+([a-zA-Z]{2,4})+$/i)
        // .matches(/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}/)
        .withMessage('Invalid Email')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');
    const errors = req.validationErrors()  // grab all the errors through this method
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};