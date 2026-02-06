const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

process.on('unhandledRejection', (reason, promise) => {
    console.error('Error no manejado en una Promesa:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Error crítico del sistema (Uncaught Exception):', err);
});

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

let db;

async function iniciarServidor() {
    try {
        db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });

        await db.exec(`CREATE TABLE IF NOT EXISTS registros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT, apellido TEXT, telefono TEXT, telefono2 TEXT,
            direccion TEXT, organizacion TEXT, plan_premio TEXT,
            limite_ventas TEXT, internet TEXT, servicios TEXT,
            foto_ruta TEXT, fecha DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log("Base de datos lista.");

        const PORT = 3001; 
        const server = app.listen(PORT, () => {
            console.log(`SERVIDOR ESCUCHANDO EN: http://localhost:${PORT}`);
        });

        server.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                console.error(`El puerto ${PORT} ya está ocupado. Intenta cerrar otros procesos.`);
            } else {
                console.error("Error al iniciar el servidor:", e);
            }
        });

    } catch (error) {
        console.error("Fallo fatal al iniciar base de datos:", error);
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'holamundo@gmail.com',
        pass: 'holamundo'
    }
});

const upload = multer({ 
    dest: 'uploads/', 
    fileFilter: (req, file, cb) => {
        file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Solo imágenes'), false);
    } 
});

app.post('/registro', (req, res) => {
    upload.single('foto')(req, res, async (err) => {
        if (err) return res.status(400).json({ mensaje: err.message });
        if (!req.file) return res.status(400).json({ mensaje: "Falta la foto" });

        try {
            const { 
                Nombre, Apellido, Telefono, Telefono2, 
                Direccion, Organizacion, Plan_De_Premio, 
                Limite_De_Ventas, Internet, Servicios_Y_Recargas 
            } = req.body;
            
            const fotoRuta = req.file.path;

            await db.run(
                `INSERT INTO registros (
                    nombre, apellido, telefono, telefono2, direccion, 
                    organizacion, plan_premio, limite_ventas, internet, servicios, foto_ruta
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [Nombre, Apellido, Telefono, Telefono2, Direccion, Organizacion, Plan_De_Premio, Limite_De_Ventas, Internet, Servicios_Y_Recargas, fotoRuta]
            );

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Ficha');
            worksheet.columns = [
                { header: 'Campo', key: 'c', width: 25 },
                { header: 'Dato', key: 'v', width: 40 }
            ];

            worksheet.addRows([
                { c: 'Nombre', v: Nombre },
                { c: 'Apellido', v: Apellido },
                { c: 'Teléfono 1', v: Telefono },
                { c: 'Teléfono 2', v: Telefono2 },
                { c: 'Dirección', v: Direccion },
                { c: 'Organización', v: Organizacion },
                { c: 'Plan', v: Plan_De_Premio },
                { c: 'Límite', v: Limite_De_Ventas },
                { c: 'Internet', v: Internet },
                { c: 'Servicios', v: Servicios_Y_Recargas },
                { c: 'Fecha', v: new Date().toLocaleString() }
            ]);

            const excelBuffer = await workbook.xlsx.writeBuffer();

            await transporter.sendMail({
                from: '"Registro Superbanca" <felixcordero0428@gmail.com>',
                to: 'holamundo@gmail.com',
                subject: `Nuevo Registro: ${Nombre} ${Apellido}`,
                text: `Datos de registro adjuntos.`,
                attachments: [
                    { filename: `Expediente_${Nombre}.xlsx`, content: excelBuffer },
                    { filename: `Foto_${Nombre}.jpg`, path: fotoRuta }
                ]
            });

            return res.status(200).json({ mensaje: "Enviado con éxito" });

        } catch (error) {
            console.error("Error procesando registro:", error);
            if (!res.headersSent) {
                return res.status(500).json({ mensaje: "Error interno" });
            }
        }
    });
});

app.get('/descargar-excel-total', async (req, res) => {
    try {
        const registros = await db.all('SELECT * FROM registros');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte');
        worksheet.columns = [
            { header: 'Nombre', key: 'nombre' },
            { header: 'Apellido', key: 'apellido' },
            { header: 'Tel 1', key: 'telefono' }
        ];
        worksheet.addRows(registros);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="reporte_total.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ mensaje: "Error" });
    }
});

iniciarServidor();