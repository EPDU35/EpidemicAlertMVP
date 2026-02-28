function roleMiddleware(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non authentifie.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acces refuse. Role insuffisant.' });
        }

        next();
    };
}

module.exports = roleMiddleware;
