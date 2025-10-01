// Importar Librerias
const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Inicializar la aplicación
const app = express();
app.use(express.json());

// Configuración del middleware de Auth0 que valida que el token JWT
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: `https://authparcial.us.auth0.com/.well-known/jwks.json`
    }),
    audience: "https://parcial-api",
    issuer: "https://authparcial.us.auth0.com/",
    algorithms: ["RS256"]
});

// Middleware para verificar scope
const checkScopes = (requiredScope) => {
    return (req, res, next) => {
        const scopes = req.auth?.scope?.split(" ") || [];
        if (scopes.includes(requiredScope)) {
            next();
        } else {
            res.status(403).json({ error: "Insufficient scope" });
        }
    };
};

//Endpoints
// Endpoint de prueba público (sin token)
app.get("/ping", (req, res) => {
    res.json({ msg: "API funcionando (Endpoint público)" });
});

// Endpoint de prueba protegido (Con token)
app.get("/secure", checkJwt, (req, res) => {
    res.json({ msg: "API funcionando (Endpoint protegido)" });
});

// Endpoints de microservicios
app.get("/service", checkJwt, checkScopes("service.read"), (req, res) => {
    res.json({ msg: "Accediste con service.read" });
});

app.post("/service", checkJwt, checkScopes("service.write"), (req, res) => {
    res.json({ msg: "Accediste con service.write" });
});

// Endpoints de usuarios
app.get("/user", checkJwt, checkScopes("user.read"), (req, res) => {
    res.json({ msg: "Accediste con user.read" });
});

app.post("/user", checkJwt, checkScopes("user.write"), (req, res) => {
    res.json({ msg: "Accediste con user.write" });
});

// Para levantar servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`API protegida escuchando en http://localhost:${PORT}`);
});
