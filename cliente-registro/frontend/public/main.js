var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var form = document.querySelector("form");
var fName = document.querySelector("input[name='firstname']");
var lName = document.querySelector("input[name='lastname']");
var tel = document.querySelector("input[name='tel']");
var tel2 = document.querySelector("input[name='tel2']");
var direction = document.querySelector("input[name='direction']");
var organization = document.querySelector("input[name='organization']");
var winPlan = document.querySelector("input[name='winplan']");
var limit = document.querySelector("input[name='limit']");
var enviarDatos = function (formData) { return __awaiter(_this, void 0, void 0, function () {
    var respuesta, resultado, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch('http://localhost:3001/registro', {
                        method: 'POST',
                        body: formData
                    })];
            case 1:
                respuesta = _a.sent();
                return [4 /*yield*/, respuesta.json()];
            case 2:
                resultado = _a.sent();
                if (respuesta.ok) {
                    console.log("Respuesta del servidor:", resultado.mensaje);
                    alert("¡Registro exitoso!");
                    form.reset();
                }
                else {
                    console.error("Error del servidor:", resultado.mensaje);
                    alert("Error: " + resultado.mensaje);
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error de conexión:", error_1);
                alert("No se pudo conectar con el servidor");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
form.addEventListener("submit", function (event) {
    var _a, _b, _c;
    event.preventDefault();
    var datos = new FormData();
    datos.append("Nombre", fName.value);
    datos.append("Apellido", lName.value);
    datos.append("Telefono", tel.value);
    datos.append("Telefono2", tel2.value);
    datos.append("Direccion", direction.value);
    datos.append("Organizacion", organization.value);
    datos.append("Plan_De_Premio", winPlan.value);
    datos.append("Limite_De_Ventas", limit.value);
    var internetVal = ((_a = document.querySelector('input[name="internet"]:checked')) === null || _a === void 0 ? void 0 : _a.value) || "No especificado";
    var serviceVal = ((_b = document.querySelector('input[name="service"]:checked')) === null || _b === void 0 ? void 0 : _b.value) || "No especificado";
    datos.append("Internet", internetVal);
    datos.append("Servicios_Y_Recargas", serviceVal);
    var fotoInput = document.querySelector('#photo');
    if ((_c = fotoInput === null || fotoInput === void 0 ? void 0 : fotoInput.files) === null || _c === void 0 ? void 0 : _c[0]) {
        datos.append("foto", fotoInput.files[0]);
    }
    enviarDatos(datos);
});
