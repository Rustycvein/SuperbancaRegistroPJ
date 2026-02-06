const form = document.querySelector("form") as HTMLFormElement;
const fName = document.querySelector("input[name='firstname']") as HTMLInputElement;
const lName = document.querySelector("input[name='lastname']") as HTMLInputElement;
const tel = document.querySelector("input[name='tel']") as HTMLInputElement;
const tel2 = document.querySelector("input[name='tel2']") as HTMLInputElement;
const direction = document.querySelector("input[name='direction']") as HTMLInputElement;
const organization = document.querySelector("input[name='organization']") as HTMLInputElement;
const winPlan = document.querySelector("input[name='winplan']") as HTMLInputElement;
const limit = document.querySelector("input[name='limit']") as HTMLInputElement;

const enviarDatos = async (formData: FormData) => {
    try {
        const respuesta = await fetch('http://localhost:3001/registro', {
            method: 'POST',
            body: formData
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            console.log("Respuesta del servidor:", resultado.mensaje);
            alert("¡Registro exitoso!");
            form.reset();
        } else {
            console.error("Error del servidor:", resultado.mensaje);
            alert("Error: " + resultado.mensaje);
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor");
    }
};

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const datos = new FormData();
    datos.append("Nombre", fName.value);
    datos.append("Apellido", lName.value);
    datos.append("Telefono", tel.value);
    datos.append("Telefono2", tel2.value);
    datos.append("Direccion", direction.value);
    datos.append("Organizacion", organization.value);
    datos.append("Plan_De_Premio", winPlan.value);
    datos.append("Limite_De_Ventas", limit.value);
    
    const internetVal = (document.querySelector('input[name="internet"]:checked') as HTMLInputElement)?.value || "No especificado";
    const serviceVal = (document.querySelector('input[name="service"]:checked') as HTMLInputElement)?.value || "No especificado";
    
    datos.append("Internet", internetVal);
    datos.append("Servicios_Y_Recargas", serviceVal);

    const fotoInput = document.querySelector('#photo') as HTMLInputElement;
    if (fotoInput?.files?.[0]) {
        datos.append("foto", fotoInput.files[0]);
    }

    enviarDatos(datos);
});